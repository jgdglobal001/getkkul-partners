import { neon } from '@neondatabase/serverless';
import * as jose from 'jose';

// === 설정 ===
const DATABASE_URL = process.env.DATABASE_URL;
const SECRET_KEY = process.env.TOSS_PAYMENTS_SECRET_KEY;
const SECURITY_KEY = process.env.TOSS_PAYMENTS_SECURITY_KEY;

if (!DATABASE_URL || !SECRET_KEY || !SECURITY_KEY) {
    console.error('❌ 필수 환경변수 누락 (DATABASE_URL, TOSS_PAYMENTS_SECRET_KEY, TOSS_PAYMENTS_SECURITY_KEY)');
    process.exit(1);
}

const sql = neon(DATABASE_URL);

// 은행 코드 (앱과 동일)
const BANK_CODES = {
    'KB국민은행': '004', 'SC제일은행': '023', '경남은행': '039', '광주은행': '034',
    '기업은행': '003', '농협은행': '011', '대구은행': '031', '부산은행': '032',
    '산업은행': '002', '수협은행': '007', '신한은행': '088', '신협': '048',
    '씨티은행': '027', '우리은행': '020', '우체국': '071', '저축은행중앙회': '050',
    '전북은행': '037', '제주은행': '035', '카카오뱅크': '090', '케이뱅크': '089',
    '토스뱅크': '092', '하나은행': '081', '새마을금고': '045',
};

async function run() {
    console.log('🚀 기존 파트너 일괄 등록 스크립트 시작...');

    // 1. 대상 조회 (sellerId가 없는 완료된 신청서)
    // business_registrations 테이블에서 sellerId가 없거나 비어있는 항목 조회
    // "step"이 3이거나 "isCompleted"가 true인 항목만 대상으로 함 (작성 중인 건 제외)
    const targets = await sql`
    SELECT * FROM "business_registrations" 
    WHERE ("sellerId" IS NULL OR "sellerId" = '')
    AND "isCompleted" = true
  `;

    console.log(`📋 대상 파트너 수: ${targets.length}명`);

    if (targets.length === 0) {
        console.log('등록할 대상이 없습니다.');
        return;
    }

    // JWE 암호화 준비
    const key = Buffer.from(SECURITY_KEY, 'hex');
    const basicAuth = Buffer.from(SECRET_KEY + ':').toString('base64');

    let successCount = 0;
    let failCount = 0;

    for (const partner of targets) {
        try {
            console.log(`\n[(ID: ${partner.userId})] 등록 시도...`);
            const {
                businessName, businessNumber, representativeName,
                bankName, accountNumber, accountHolder, userId
            } = partner;

            // 데이터 검증
            if (!businessNumber || !businessName || !accountNumber) {
                console.warn(`⚠️ 필수 정보 누락으로 스킵: ${businessName}`);
                failCount++;
                continue;
            }

            const bankCode = BANK_CODES[bankName];
            if (!bankCode) {
                console.warn(`⚠️ 알 수 없는 은행명(${bankName})으로 스킵`);
                failCount++;
                continue;
            }

            const bizNumClean = businessNumber.replace(/-/g, '');

            // Payload 생성
            const payload = {
                sellerId: userId,
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
            const encryptedBody = await new jose.CompactEncrypt(
                new TextEncoder().encode(JSON.stringify(payload))
            )
                .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
                .encrypt(key);

            // Toss API 호출
            const response = await fetch('https://api.tosspayments.com/v2/sellers', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ body: encryptedBody })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`❌ Toss API 실패: ${errText}`);

                // 이미 등록된 셀러라면(에러코드로 판단 어려우면 그냥 업데이트 시도 가능)
                // 일단 실패로 처리
                failCount++;
                continue;
            }

            console.log('✅ Toss 등록 성공!');

            // DB 업데이트
            await sql`
        UPDATE "business_registrations"
        SET "sellerId" = ${userId}, "tossStatus" = 'COMPLETED'
        WHERE "id" = ${partner.id}
      `;
            console.log('💾 DB 업데이트 완료');
            successCount++;

        } catch (e) {
            console.error(`💥 처리 중 오류 발생: ${e.message}`);
            failCount++;
        }
    }

    console.log('\n==========================================');
    console.log(`🎉 완료! 성공: ${successCount}건, 실패: ${failCount}건`);
    console.log('==========================================');
}

run();
