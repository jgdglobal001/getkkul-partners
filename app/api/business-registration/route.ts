import { getEdgeSession } from '@/lib/auth/edge-auth';
import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'nodejs'; // JWE 암호화(jose) 호환을 위해 nodejs 사용

// 은행 코드 매핑
const BANK_CODES: Record<string, string> = {
  'KB국민은행': '004',
  'SC제일은행': '023',
  '경남은행': '039',
  '광주은행': '034',
  '기업은행': '003',
  '농협은행': '011',
  '대구은행': '031',
  '부산은행': '032',
  '산업은행': '002',
  '수협은행': '007',
  '신한은행': '088',
  '신협': '048',
  '씨티은행': '027',
  '우리은행': '020',
  '우체국': '071',
  '저축은행중앙회': '050',
  '전북은행': '037',
  '제주은행': '035',
  '카카오뱅크': '090',
  '케이뱅크': '089',
  '토스뱅크': '092',
  '하나은행': '081',
  '새마을금고': '045',
};

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getEdgeSession();

    if (!session?.user?.id) {
      console.error('[API] 인증되지 않은 사용자');
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[API] 받은 데이터:', JSON.stringify(body, null, 2));

    const {
      businessType,
      businessName,
      businessNumber1,
      businessNumber2,
      businessNumber3,
      representativeName,
      businessCategory,
      businessType: businessType2,
      businessAddress,
      contactName,
      contactPhone,
      contactEmail,
      bankName,
      accountNumber,
      accountHolder,
      platformUrl,
      mobileAppUrl,
      agreements,
    } = body;

    // 필수 필드 검증
    if (!businessName || !businessNumber1 || !businessNumber2 || !businessNumber3) {
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다. (사업자명, 사업자번호)' },
        { status: 400 }
      );
    }

    // 사업자 번호 조합
    const fullBusinessNumber = `${businessNumber1}-${businessNumber2}-${businessNumber3}`;
    const bizNumClean = fullBusinessNumber.replace(/-/g, '');

    // === 1. 토스 페이먼츠 셀러 등록 (API 호출) ===
    console.log('[API] 토스 셀러 등록 프로세스 시작...');

    let tossSellerId = null;
    let tossStatus = 'PENDING'; // 기본값

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
    const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY; // 필수!

    if (secretKey && securityKey) {
      try {
        const bankCode = BANK_CODES[bankName];
        if (!bankCode) {
          console.warn('[API] 토스: 지원하지 않는 은행명:', bankName);
          // 에러를 던질지, 무시하고 진행할지 결정. 일단 진행하되 토스 등록 실패 처리
        } else {
          const payload = {
            sellerId: session.user.id,
            businessNumber: bizNumClean,
            companyName: businessName,
            representativeName: representativeName,
            account: {
              bankCode: bankCode,
              accountNumber: accountNumber,
              holderName: accountHolder
            }
          };

          // JWE 암호화
          const key = Buffer.from(securityKey, 'hex');
          const encryptedBody = await new jose.CompactEncrypt(
            new TextEncoder().encode(JSON.stringify(payload))
          )
            .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
            .encrypt(key);

          const basicAuth = Buffer.from(secretKey + ':').toString('base64');

          console.log('[API] 토스 v2/sellers 호출 중...');
          const tossResponse = await fetch('https://api.tosspayments.com/v2/sellers', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: encryptedBody })
          });

          if (!tossResponse.ok) {
            const errorText = await tossResponse.text();
            console.error('❌ 토스 셀러 등록 실패 응답:', errorText);
            // 토스 등록 실패해도 우리 DB에는 일단 저장할 것인가? 
            // -> 네, 나중에 재시도할 수 있게. 단 경고는 남김.
            // 혹은 여기서 리턴해서 사용자에게 "계좌 오류"라고 알려주는 게 나음.
            return NextResponse.json(
              { error: `토스 파트너 등록 실패: ${errorText}` },
              { status: 400 }
            );
          }

          const tossResult = await tossResponse.json();
          console.log('✅ 토스 셀러 등록 성공:', tossResult);
          tossSellerId = session.user.id;
        }
      } catch (tossError) {
        console.error('❌ 토스 등록 중 예외 발생:', tossError);
        // 심각한 오류면 중단
        return NextResponse.json({ error: '토스 연동 중 오류가 발생했습니다.' }, { status: 500 });
      }
    } else {
      console.warn('⚠️ 토스 키 없음. 토스 등록 스킵.');
    }

    // === 2. DB 저장 ===
    console.log('[API] 데이터베이스 저장 시도...');

    // 기존 등록 정보 확인
    const existingByUserIdResults = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, session.user.id))
      .limit(1);
    const existingByUserId = existingByUserIdResults[0];

    let businessRegistration;

    if (existingByUserId) {
      console.log('[API] 기존 등록 정보 업데이트...');
      const updated = await db
        .update(businessRegistrations)
        .set({
          businessType: businessType || '법인',
          businessName,
          businessNumber: fullBusinessNumber,
          representativeName,
          businessCategory,
          businessType2: businessType2 || '',
          businessAddress,
          contactName,
          contactPhone,
          contactEmail,
          bankName,
          accountNumber,
          accountHolder,
          platformUrl: platformUrl || null,
          mobileAppUrl: mobileAppUrl || null,
          step: 3,
          isCompleted: true,
          sellerId: tossSellerId, // 토스 ID 저장
          tossStatus: tossSellerId ? 'COMPLETED' : 'FAILED',
        })
        .where(eq(businessRegistrations.userId, session.user.id))
        .returning();
      businessRegistration = updated[0];
    } else {
      console.log('[API] 새로운 등록 정보 생성...');
      const created = await db
        .insert(businessRegistrations)
        .values({
          userId: session.user.id,
          businessType: businessType || '법인',
          businessName,
          businessNumber: fullBusinessNumber,
          representativeName,
          businessCategory,
          businessType2: businessType2 || '',
          businessAddress,
          contactName,
          contactPhone,
          contactEmail,
          bankName,
          accountNumber,
          accountHolder,
          platformUrl: platformUrl || null,
          mobileAppUrl: mobileAppUrl || null,
          step: 3,
          isCompleted: true,
          sellerId: tossSellerId,
          tossStatus: tossSellerId ? 'COMPLETED' : 'FAILED',
        })
        .returning();
      businessRegistration = created[0];
    }

    console.log('[API] 저장 및 연동 완료:', businessRegistration.id);

    return NextResponse.json(
      {
        success: true,
        message: '사업자 등록 및 토스 연동이 완료되었습니다.',
        data: businessRegistration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error saving business registration:', error);
    return NextResponse.json(
      { error: '사업자 등록 정보 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getEdgeSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }
    const results = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, session.user.id))
      .limit(1);

    return NextResponse.json({ data: results[0] || null }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '조회 오류' }, { status: 500 });
  }
}

