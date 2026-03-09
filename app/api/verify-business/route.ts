import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businessRegistrations, users, accounts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getEdgeSession } from '@/lib/auth/edge-auth';
import { getSocialProviderDisplayName, maskEmail } from '@/lib/business-registration/format';
import { BANK_CODES } from '@/lib/constants';
import { getTossBasicAuthHeader } from '@/lib/toss/seller';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'verify-account') return handleVerifyAccount(request);

  try {
    console.log('📨 API 요청 수신');
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ JSON 파싱 오류:', parseError);
      return NextResponse.json(
        { success: false, message: 'JSON 파싱 오류' },
        { status: 400 }
      );
    }
    const { businessNumber, businessName, representativeName, startDate } = body;
    console.log('📨 요청 본문:', { businessNumber, businessName, representativeName, startDate });

    // 입력값 검증
    if (!businessNumber || !businessName || !representativeName || !startDate) {
      return NextResponse.json(
        { success: false, message: '사업자번호, 사업자명, 대표자명, 개업일자를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사업자번호 형식 검증 (10자리 숫자)
    const businessNumberRegex = /^\d{10}$/;
    if (!businessNumberRegex.test(businessNumber)) {
      return NextResponse.json(
        { success: false, message: '사업자번호 형식이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // 개업일자 형식 검증 (YYYYMMDD)
    const startDateRegex = /^\d{8}$/;
    if (!startDateRegex.test(startDate)) {
      return NextResponse.json(
        { success: false, message: '개업일자 형식이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // 국세청 API 키 확인
    const ntsApiKey = process.env.NTS_BUSINESSMAN_API_KEY;

    console.log('🔍 사업자 정보 검증 시작');
    console.log('사업자명:', businessName);
    console.log('사업자번호:', businessNumber);
    console.log('대표자명:', representativeName);
    console.log('개업일자:', startDate);

    if (!ntsApiKey) {
      console.error('❌ 국세청 API 키가 설정되지 않았습니다.');
      return NextResponse.json(
        { success: false, message: '서버 설정 오류' },
        { status: 500 }
      );
    }

    console.log('📤 국세청 API 호출 중...');
    const requestBody = {
      businesses: [
        {
          b_no: businessNumber,
          b_nm: businessName,
          p_nm: representativeName,
          start_dt: startDate,
        },
      ],
    };
    console.log('📤 요청 본문:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(
      `https://api.odcloud.kr/api/nts-businessman/v1/validate?serviceKey=${ntsApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    console.log('📥 국세청 응답 상태:', response.status);

    let data;
    try {
      data = await response.json();
      console.log('📥 국세청 응답 데이터:', JSON.stringify(data, null, 2));
    } catch (jsonError) {
      console.error('❌ 국세청 응답 JSON 파싱 오류:', jsonError);
      return NextResponse.json(
        { success: false, message: '국세청 API 응답 처리 오류' },
        { status: 500 }
      );
    }

    // 국세청 API 응답 처리
    if (data.status_code === 'OK' && data.data && data.data.length > 0) {
      const result = data.data[0];

      // valid: "01" = 확인됨, "02" = 확인할 수 없음
      if (result.valid === '01') {
        console.log('✅ 사업자 정보 검증 성공 - 국세청 확인 완료');

        // 우리 DB에 이미 등록된 사업자번호인지 확인
        const formattedBusinessNumber = `${businessNumber.slice(0, 3)}-${businessNumber.slice(3, 5)}-${businessNumber.slice(5)}`;
        console.log('🔍 DB 중복 확인 중... 사업자번호:', formattedBusinessNumber);

        const existingRegistration = await db
          .select({
            id: businessRegistrations.id,
            userId: businessRegistrations.userId,
            user: {
              email: users.email,
            },
            account: {
              provider: accounts.provider,
            }
          })
          .from(businessRegistrations)
          .leftJoin(users, eq(businessRegistrations.userId, users.id))
          .leftJoin(accounts, eq(businessRegistrations.userId, accounts.userId))
          .where(eq(businessRegistrations.businessNumber, formattedBusinessNumber))
          .limit(1);

        if (existingRegistration[0]) {
          console.log('❌ 이미 등록된 사업자번호:', formattedBusinessNumber);

          const reg = existingRegistration[0];
          const maskedEmail = maskEmail(reg.user?.email);
          const providerName = getSocialProviderDisplayName(reg.account?.provider);

          return NextResponse.json(
            {
              success: false,
              isAlreadyRegistered: true,
              message: `기존에 등록된 사업자등록 정보입니다! 다시 확인하시어 로그인을 해주세요! \n\n기존 가입 계정: ${providerName} (${maskedEmail})`,
              existingAccount: {
                provider: reg.account?.provider,
                providerName: providerName,
                maskedEmail: maskedEmail
              }
            },
            { status: 400 }
          );
        }

        console.log('✅ DB 중복 없음 - 등록 가능');
        return NextResponse.json({
          success: true,
          message: '사업자 정보가 확인되었습니다.',
          data: {
            businessNumber,
            businessName: result.request_param.b_nm,
            representativeName: result.request_param.p_nm,
            status: result.status?.b_stt || '계속사업자',
          },
        });
      } else {
        console.log('❌ 사업자 정보 검증 실패 (valid:', result.valid, ')');
        return NextResponse.json(
          {
            success: false,
            message: result.valid_msg || '사업자 정보가 일치하지 않습니다.',
          },
          { status: 400 }
        );
      }
    } else {
      console.log('❌ 국세청 API 오류:', data.status_code);
      return NextResponse.json(
        {
          success: false,
          message: '사업자 정보를 확인할 수 없습니다.',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('사업자 정보 검증 오류:', error);
    return NextResponse.json(
      { success: false, message: '사업자 정보 검증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}



// ─── verify-account 핸들러 ───
async function handleVerifyAccount(request: NextRequest) {
  console.log('[API] verify-account 시작');
  try {
    const session = await getEdgeSession(request);
    if (!session?.user?.id) return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });

    const body = await request.json();
    const { bankName, accountNumber } = body;

    const bankCode = BANK_CODES[bankName];
    if (!bankCode) return NextResponse.json({ error: '지원되지 않는 은행입니다.' }, { status: 400 });

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
    if (!secretKey) return NextResponse.json({ error: '서버 설정 오류 (API Key missing)' }, { status: 500 });

    const basicAuth = getTossBasicAuthHeader(secretKey);
    const tossResponse = await fetch('https://api.tosspayments.com/v2/bank-accounts/lookup-holder-name', {
      method: 'POST',
      headers: { 'Authorization': basicAuth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ bankCode, accountNumber }),
    });

    const text = await tossResponse.text();
    let data;
    try { data = JSON.parse(text); } catch {
      return NextResponse.json({ error: '토스 서버에서 올바르지 않은 응답이 왔습니다.', raw: text }, { status: 502 });
    }

    if (!tossResponse.ok) {
      return NextResponse.json({ error: data.message || '계좌 정보를 확인할 수 없습니다.', code: data.code }, { status: tossResponse.status });
    }

    const holderName = data.entityBody?.holderName;

    // 계좌 인증 성공 후 → 이미 등록된 계좌인지 DB 확인
    const userId = session.user.id;
    const accountClean = accountNumber.replace(/[^0-9]/g, '');
    const existingAccount = await db
      .select({
        id: businessRegistrations.id,
        userId: businessRegistrations.userId,
        isCompleted: businessRegistrations.isCompleted,
        step: businessRegistrations.step,
        user: { email: users.email },
        account: { provider: accounts.provider },
      })
      .from(businessRegistrations)
      .leftJoin(users, eq(businessRegistrations.userId, users.id))
      .leftJoin(accounts, eq(businessRegistrations.userId, accounts.userId))
      .where(eq(businessRegistrations.accountNumber, accountNumber))
      .limit(1);

    // 하이픈 없는 버전으로도 검색
    let existingResult = existingAccount[0];
    if (!existingResult && accountClean !== accountNumber) {
      const existingAccount2 = await db
        .select({
          id: businessRegistrations.id,
          userId: businessRegistrations.userId,
          isCompleted: businessRegistrations.isCompleted,
          step: businessRegistrations.step,
          user: { email: users.email },
          account: { provider: accounts.provider },
        })
        .from(businessRegistrations)
        .leftJoin(users, eq(businessRegistrations.userId, users.id))
        .leftJoin(accounts, eq(businessRegistrations.userId, accounts.userId))
        .where(eq(businessRegistrations.accountNumber, accountClean))
        .limit(1);
      existingResult = existingAccount2[0];
    }

    if (existingResult && existingResult.isCompleted && existingResult.step === 3 && existingResult.userId !== userId) {
      const maskedEmail = maskEmail(existingResult.user?.email);
      const providerName = getSocialProviderDisplayName(existingResult.account?.provider);
      return NextResponse.json({
        success: true,
        holderName,
        isAccountAlreadyRegistered: true,
        message: '이 계좌는 이미 다른 파트너스 계정에 등록된 계좌입니다.',
        existingAccount: { providerName, maskedEmail }
      });
    }

    return NextResponse.json({ success: true, holderName });
  } catch (error: any) {
    console.error('[API] 예외 발생:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }
}