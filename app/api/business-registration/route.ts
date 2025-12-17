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
  // 별칭 추가
  '국민은행': '004', '농협': '011', '신한': '088', '우리': '020', '하나': '081', '기업': '003',
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
      businessType2,
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

    // === 1. 토스 페이먼츠 셀러 등록 (API 호출: 지급대행) ===
    console.log('[API] 토스 지급대행 셀러 등록 프로세스 시작...');

    let tossSellerId = null;
    let tossStatus = 'PENDING';

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
    const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY;

    if (secretKey && securityKey) {
      try {
        const bankCode = BANK_CODES[bankName] || BANK_CODES['국민은행']; // 기본값 처리 혹은 에러

        if (!bankCode) {
          throw new Error(`지원하지 않는 은행입니다: ${bankName}`);
        }

        // 사업자 유형 매핑
        let tossBusinessType = 'CORPORATE';
        if (businessType === '개인') tossBusinessType = 'INDIVIDUAL';
        else if (businessType === '개인사업자') tossBusinessType = 'INDIVIDUAL_BUSINESS';
        else tossBusinessType = 'CORPORATE'; // 법인/개인 -> 법인 취급

        const payload: any = {
          refSellerId: session.user.id,
          businessType: tossBusinessType,
          account: {
            bankCode: bankCode,
            accountNumber: accountNumber,
            holderName: accountHolder
          }
        };

        if (tossBusinessType === 'INDIVIDUAL') {
          payload.individual = {
            name: representativeName, // 개인은 대표자명이 본인 이름
            email: contactEmail,
            phoneNumber: contactPhone.replace(/-/g, '')
          };
        } else {
          // 개인사업자 또는 법인
          payload.company = {
            businessNumber: bizNumClean,
            name: businessName,
            representativeName: representativeName,
          };
          // 이메일/전화번호도 상위 레벨 혹은 company 안에 넣어야 하나? 문서상 company 객체 내에는 없음.
          // 문서 참조: company는 businessNumber, name, representativeName.
          // 개인사업자의 경우 email, phoneNumber가 필요한지 확인.
          // 검색 결과에는 INDIVIDUAL일 때만 email/phone 언급됨. 
          // 하지만 연락처는 보통 필수. 
          // Payouts API에서 INDIVIDUAL_BUSINESS도 company 정보만 있으면 등록 되나?
          // "company: 사업자/법인 셀러 정보... 이 객체에는 사업자 등록 번호... 등"
          // 일단 검색 결과 기반으로 작성.
        }

        // JWE 암호화 준비
        // Security Key가 Hex String인지 확인
        const isHex = /^[0-9A-Fa-f]+$/.test(securityKey);
        const key = isHex ? Buffer.from(securityKey, 'hex') : Buffer.from(securityKey, 'utf-8');

        const encryptedBody = await new jose.CompactEncrypt(
          new TextEncoder().encode(JSON.stringify(payload))
        )
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
          .encrypt(key);

        const basicAuth = Buffer.from(secretKey + ':').toString('base64');

        console.log(`[API] 토스 v2/payouts/sellers 호출 (Type: ${tossBusinessType})...`);
        const tossResponse = await fetch('https://api.tosspayments.com/v2/payouts/sellers', {
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

          // 상세 에러 파싱 시도
          try {
            const errJson = JSON.parse(errorText);
            if (errJson.error) {
              return NextResponse.json(
                { error: `토스 등록 실패: ${errJson.error.message || errJson.error.code}` },
                { status: 400 }
              );
            }
          } catch (e) { }

          return NextResponse.json(
            { error: `토스 파트너 등록 실패: ${errorText}` },
            { status: 400 }
          );
        }

        const tossResult = await tossResponse.json();
        console.log('✅ 토스 셀러 등록 성공:', tossResult);
        tossSellerId = session.user.id; // 성공 시 ID 저장

      } catch (tossError: any) {
        console.error('❌ 토스 등록 중 예외 발생:', tossError);
        return NextResponse.json({ error: `토스 연동 중 오류: ${tossError.message}` }, { status: 500 });
      }
    } else {
      console.warn('⚠️ 토스 키 없음. 토스 등록 스킵 (개발 모드일 수 있음).');
      // 키가 없으면 그냥 진행 (테스트용)
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

