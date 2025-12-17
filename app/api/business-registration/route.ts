// import { getEdgeSession } from '@/lib/auth/edge-auth';
import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export const runtime = 'edge';

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
  console.log('[API] Business Registration POST Request Received (DB/JOSE RESTORED, AUTH MOCKED)');

  try {
    // 세션 확인 (MOCKED)
    // const session = await getEdgeSession();
    const session = { user: { id: 'mock-user-id-for-debugging' } };

    if (!session?.user?.id) {
      // Should not happen with mock
      return NextResponse.json({ error: 'Auth Error' }, { status: 401 });
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
        const bankCode = BANK_CODES[bankName];
        if (!bankCode) {
          // bankCode check logic
          console.log('Skipping Bank Code Check for test compatibility if input varies');
        }

        // 사업자 유형 매핑
        let tossBusinessType = 'CORPORATE';
        if (businessType === '개인') tossBusinessType = 'INDIVIDUAL';
        else if (businessType === '개인사업자') tossBusinessType = 'INDIVIDUAL_BUSINESS';
        else tossBusinessType = 'CORPORATE';

        const payload: any = {
          refSellerId: session.user.id,
          businessType: tossBusinessType,
          account: {
            bankCode: bankCode || '004', // Fallback for test
            accountNumber: accountNumber,
            holderName: accountHolder
          }
        };

        if (tossBusinessType === 'INDIVIDUAL') {
          payload.individual = {
            name: representativeName,
            email: contactEmail,
            phoneNumber: contactPhone?.replace(/-/g, '') || '01000000000'
          };
        } else {
          payload.company = {
            businessNumber: bizNumClean,
            name: businessName,
            representativeName: representativeName,
          };
        }

        // JWE 암호화 준비
        console.log('[API] JWE 암호화 시도...');
        const keyStr = securityKey as string;
        const isHex = /^[0-9A-Fa-f]+$/.test(keyStr);
        const key = isHex ? Buffer.from(keyStr, 'hex') : Buffer.from(keyStr, 'utf-8');

        const encryptedBody = await new jose.CompactEncrypt(
          new TextEncoder().encode(JSON.stringify(payload))
        )
          .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
          .encrypt(key);

        console.log('[API] JWE 암호화 성공');

        // Basic Auth
        const basicAuth = btoa(secretKey + ':');

        // [DEBUG] 페이로드 로깅
        const debugPayload = { ...payload };
        console.log(`[API Debug] Payload to Toss:`, JSON.stringify(debugPayload, null, 2));

        console.log(`[API] 토스 호출 Skipped to test DB access first...`);
        // Actual Call skipped to focus on Import Crash. 
        // We just want to see if 'jose' works.

      } catch (tossError: any) {
        console.error('❌ 토스 로직 중 에러:', tossError);
      }
    }

    // === 2. DB 저장 Test ===
    console.log('[API] 데이터베이스 접속 테스트...');
    const result = await db.select().from(businessRegistrations).limit(1);
    console.log('[API] DB Select Result:', result);

    return NextResponse.json({ message: "Partial Restore Test OK (DB + Jose works)" });

  } catch (error: any) {
    console.error('[API] Global Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
