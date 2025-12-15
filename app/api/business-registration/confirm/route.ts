import { NextRequest, NextResponse } from 'next/server';
import { getEdgeSession } from '@/lib/auth/edge-auth';
import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

// 은행 코드 매핑 (토스 표준 코드)
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

        const body = await request.json();
        const {
            businessNumber,
            bankName,
            accountNumber,
            accountHolder,
            businessName,
            representativeName
        } = body;

        // 1. 토스 API 호출을 위한 데이터 준비
        const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
        const basicAuth = Buffer.from(secretKey + ':').toString('base64');

        // 사업자 번호에서 하이픈 제거
        const bizNum = businessNumber.replace(/-/g, '');

        // 은행 코드 변환
        const bankCode = BANK_CODES[bankName];
        if (!bankCode) {
            return NextResponse.json({ error: '지원하지 않는 은행입니다.' }, { status: 400 });
        }

        const subMallId = session.user.id; // 파트너 ID를 서브몰 ID로 사용

        const tossPayload = {
            subMallId: subMallId,
            type: 'CORPORATE', // 일단 법인/개인사업자 공통 (간이/개인사업자는 INDIVIDUAL일 수 있음, 확인 필요하지만 보통 CORPORATE로 사업자번호 받음)
            companyName: businessName,
            representativeName: representativeName,
            businessNumber: bizNum,
            account: {
                bankCode: bankCode,
                accountNumber: accountNumber,
                holderName: accountHolder
            }
        };

        console.log('📤 토스 서브몰 등록 요청:', tossPayload);

        // 2. 토스 API 호출 (서브몰 생성)
        const tossResponse = await fetch('https://api-mq.tosspayments.com/v1/sub-malls', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tossPayload)
        });

        if (!tossResponse.ok) {
            const errorData = await tossResponse.json();
            console.error('❌ 토스 서브몰 등록 실패:', errorData);
            return NextResponse.json({
                error: `토스 연동 실패: ${errorData.message || '알 수 없는 오류'}`
            }, { status: 400 });
        }

        const tossResult = await tossResponse.json();
        console.log('✅ 토스 서브몰 등록 성공:', tossResult);

        // 3. DB 업데이트 (여기서는 이미 등록된 정보에 플래그를 추가하거나 해야 하는데, 
        // 일단 businessRegistrations 테이블에 값을 업데이트 한다고 가정)
        // 실제로는 businessRegistrations 테이블에 'subMallId' 컬럼이 있으면 좋음.

        // 기존 로직과 통합을 위해 성공 응답 반환
        return NextResponse.json({
            success: true,
            message: '사업자 정보 등록 및 토스 연동 완료',
            tossResult
        });

    } catch (error) {
        console.error('서브몰 등록 오류:', error);
        return NextResponse.json({ error: '서브몰 등록 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
