import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { BANK_CODES } from '@/lib/constants';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    console.log('[API] verify-account 시작');
    try {
        const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
        const token = await getToken({
            req: request,
            secret: secret,
            secureCookie: process.env.NODE_ENV === 'production'
        });

        if (!token?.sub) {
            console.log('[API] 인증 실패');
            return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
        }

        const body = await request.json();
        const { bankName, accountNumber } = body;
        console.log(`[API] 요청 데이터: 은행=${bankName}, 계좌=${accountNumber}`);

        const bankCode = BANK_CODES[bankName];
        if (!bankCode) {
            console.log(`[API] 지원되지 않는 은행: ${bankName}`);
            return NextResponse.json({ error: '지원되지 않는 은행입니다.' }, { status: 400 });
        }

        const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
        if (!secretKey) {
            console.error('[API] TOSS_PAYMENTS_SECRET_KEY가 없습니다.');
            return NextResponse.json({ error: '서버 설정 오류 (API Key missing)' }, { status: 500 });
        }

        const basicAuth = btoa(`${secretKey}:`);

        // 계좌번호로 예금주명 조회 API (v2 POST) - 토스페이먼츠 부가 API
        const url = `https://api.tosspayments.com/v2/bank-accounts/lookup-holder-name`;

        console.log(`[API] 토스 호출: POST ${url}, bankCode=${bankCode}`);

        const tossResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bankCode: bankCode,
                accountNumber: accountNumber,
            }),
        });

        const text = await tossResponse.text();
        console.log(`[API] 토스 응답 (${tossResponse.status}): ${text}`);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error('[API] JSON 파싱 실패:', text);
            return NextResponse.json({ error: '토스 서버에서 올바르지 않은 응답이 왔습니다.', raw: text }, { status: 502 });
        }

        if (!tossResponse.ok) {
            return NextResponse.json({
                error: data.message || '계좌 정보를 확인할 수 없습니다.',
                code: data.code
            }, { status: tossResponse.status });
        }

        // v2 응답은 entityBody.holderName 에 예금주명이 들어옵니다.
        const holderName = data.entityBody?.holderName;
        return NextResponse.json({
            success: true,
            holderName: holderName
        });

    } catch (error: any) {
        console.error('[API] 예외 발생:', error);
        return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
    }
}
