import { NextRequest, NextResponse } from 'next/server';
import { getEdgeSession } from '@/lib/auth/edge-auth';
import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';

export const runtime = 'nodejs'; // 'jose' 암호화 처리를 위해 nodejs 런타임 권장

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
        const session = await getEdgeSession();
        if (!session || !session.user) {
            return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
        }

        // 1. 데이터 수신
        const body = await request.json();
        const {
            businessNumber,
            bankName,
            accountNumber,
            accountHolder,
            businessName,
            representativeName
        } = body;

        // 2. 키 확인
        const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
        const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY;

        if (!secretKey || !securityKey) {
            console.error('❌ API 키 누락: Secret Key 또는 Security Key가 없습니다.');
            return NextResponse.json({ error: '서버 설정 오류: 결제 키가 설정되지 않았습니다.' }, { status: 500 });
        }

        // 3. 데이터 가공
        const bizNum = businessNumber.replace(/-/g, '');
        const bankCode = BANK_CODES[bankName];
        if (!bankCode) {
            return NextResponse.json({ error: '지원하지 않는 은행입니다.' }, { status: 400 });
        }

        // '지급대행'용 Seller Payload 구성
        const payload = {
            sellerId: session.user.id, // 파트너 ID를 Seller ID로 사용
            businessNumber: bizNum,
            companyName: businessName,
            representativeName: representativeName,
            account: {
                bankCode: bankCode,
                accountNumber: accountNumber,
                holderName: accountHolder
            }
        };

        console.log('🔒 토스 셀러 등록 요청 (암호화 전):', { ...payload, account: '***' });

        // 4. JWE 암호화 (Payouts 필수)
        // Security Key는 Hex String이므로 Buffer로 변환
        const key = Buffer.from(securityKey, 'hex');

        // JWE 토큰 생성
        const encryptedBody = await new jose.CompactEncrypt(
            new TextEncoder().encode(JSON.stringify(payload))
        )
            .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
            .encrypt(key);

        console.log('🔐 암호화 완료, 토스 API 호출 중...');

        // 5. 토스 API 호출 (v2/sellers)
        const basicAuth = Buffer.from(secretKey + ':').toString('base64');

        const tossResponse = await fetch('https://api.tosspayments.com/v2/sellers', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body: encryptedBody }) // 암호화된 본문 전송
        });

        // 6. 응답 처리
        if (!tossResponse.ok) {
            const errorText = await tossResponse.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText };
            }

            console.error('❌ 토스 셀러 등록 실패:', errorData);
            return NextResponse.json({
                error: `토스 연동 실패: ${errorData.message || '알 수 없는 오류'}`
            }, { status: 400 });
        }

        const tossResult = await tossResponse.json();
        console.log('✅ 토스 셀러 등록 성공:', tossResult);

        // 7. DB 업데이트 (성공 시 처리)
        // TODO: businessRegistrations 테이블에 sellerId 저장 등 필요 시 추가

        return NextResponse.json({
            success: true,
            message: '지급대행 파트너(셀러) 등록 완료',
            tossResult
        });

    } catch (error) {
        console.error('셀러 등록 시스템 오류:', error);
        return NextResponse.json({ error: '셀러 등록 중 시스템 오류가 발생했습니다.' }, { status: 500 });
    }
}
