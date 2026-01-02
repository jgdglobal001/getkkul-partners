import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businessRegistrations, users, accounts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
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
          const rawEmail = reg.user?.email || '';
          let maskedEmail = '';
          if (rawEmail) {
            const [id, domain] = rawEmail.split('@');
            maskedEmail = id.substring(0, 1) + '*'.repeat(id.length - 1) + '@' + domain;
          }

          const providerMap: Record<string, string> = {
            'google': '구글',
            'naver': '네이버',
            'kakao': '카카오'
          };
          const providerName = providerMap[reg.account?.provider || ''] || reg.account?.provider || '소셜';

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

