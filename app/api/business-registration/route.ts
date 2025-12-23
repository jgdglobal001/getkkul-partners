import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { getToken } from 'next-auth/jwt';

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
  '국민은행': '004', '농협': '011', '신한': '088', '우리': '020', '하나': '081', '기업': '003',
};

export async function POST(request: NextRequest) {
  console.log('[API] Business Registration POST Request Received (JWT MODE)');

  try {
    // 1. JWT 토큰을 직접 검증 (가벼운 방식, Edge 호환)
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error('[API] CRITICAL: AUTH_SECRET/NEXTAUTH_SECRET is missing in environment variables!');
    } else {
      console.log('[API] AUTH_SECRET is present (length: ' + secret.length + ')');
    }

    // Inspect Cookies explicitly
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = cookieHeader.split(';').map(c => c.trim().split('=')[0]);
    console.log('[API] Cookies in Request:', cookies);

    // Call getToken with secureCookie explicit setting if needed. 
    // Usually strict secure cookies are used in prod.
    const token = await getToken({
      req: request,
      secret: secret,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    console.log('[API] getToken result:', token ? 'Token Found' : 'Token is NULL');

    if (!token?.sub) {
      console.log('[API] Token verification failed or no token found.');
      console.log('[API] Full Headers:', JSON.stringify(Object.fromEntries(request.headers.entries())));
      return NextResponse.json({ error: '인증되지 않은 사용자입니다. (No Token)' }, { status: 401 });
    }

    const userId = token.sub;
    console.log('[API] Authenticated User:', userId);

    const body = await request.json();
    console.log('[API] Body parsed successfully');

    // 2. 기존 로직 복구
    const {
      businessType, businessName, businessNumber1, businessNumber2, businessNumber3,
      representativeName, businessCategory, businessType2, businessAddress,
      contactName, contactPhone, contactEmail, bankName, accountNumber,
      accountHolder, platformUrl, mobileAppUrl
    } = body;

    if (!businessName || !businessNumber1 || !businessNumber2 || !businessNumber3) {
      return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 });
    }

    const fullBusinessNumber = `${businessNumber1}-${businessNumber2}-${businessNumber3}`;
    const bizNumClean = fullBusinessNumber.replace(/-/g, '');

    // === Toss API ===
    let tossSellerId = null;
    let tossStatus = 'PENDING';

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
    const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY?.trim();

    if (secretKey && securityKey) {
      const bankCode = BANK_CODES[bankName];
      if (!bankCode) return NextResponse.json({ error: `은행 코드를 찾을 수 없습니다: ${bankName}` }, { status: 400 });

      let tossBusinessType = 'CORPORATE';
      if (businessType === '개인') tossBusinessType = 'INDIVIDUAL';
      else if (businessType === '개인사업자') tossBusinessType = 'INDIVIDUAL_BUSINESS';
      else tossBusinessType = 'CORPORATE';

      // refSellerId는 1~20자 제한이 있음
      // userId(cuid)는 25자이므로 앞 20자만 사용
      const refSellerId = userId.slice(0, 20);

      const payload: any = {
        refSellerId: refSellerId,
        businessType: tossBusinessType,
        account: { bankCode, accountNumber, holderName: accountHolder }
      };

      if (tossBusinessType === 'INDIVIDUAL') {
        payload.individual = {
          name: representativeName,
          email: contactEmail,
          phone: contactPhone?.replace(/-/g, '')
        };
      } else {
        payload.company = {
          businessRegistrationNumber: bizNumClean,
          name: businessName,
          representativeName: representativeName,
          email: contactEmail,
          phone: contactPhone?.replace(/-/g, '')
        };
      }

      // Encrypt with jose/TextEncoder (Edge Safe)
      console.log('[API] Encrypting payload...');
      const keyStr = securityKey as string;

      // 가이드: "보안 키는 64자의 Hexadecimal 문자열입니다. 보안 키를 바이트로 전환해야 됩니다."
      const key = new Uint8Array(
        keyStr.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
      );

      // iat: yyyy-MM-dd'T'HH:mm:ss±hh:mm ISO 8601 형식
      // Toss 공식 가이드 규격 준수: 밀리초(.SSS)를 포함하지 않아야 함
      // 예: 2024-01-24T14:40:10+09:00
      //
      // 올바른 방법: 현재 시간을 KST 포맷으로 직접 생성
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');

      // KST는 UTC+9이므로, 한국 시간으로 변환
      const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
      const year = kstDate.getUTCFullYear();
      const month = pad(kstDate.getUTCMonth() + 1);
      const day = pad(kstDate.getUTCDate());
      const hours = pad(kstDate.getUTCHours());
      const minutes = pad(kstDate.getUTCMinutes());
      const seconds = pad(kstDate.getUTCSeconds());

      const iat = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+09:00`;
      console.log('[API Debug] Generated iat:', iat);

      // nonce: UUID와 같이 충분히 무작위적인 고유 값 (하이픈 유지)
      const nonce = crypto.randomUUID();

      const encryptedBody = await new jose.CompactEncrypt(
        new TextEncoder().encode(JSON.stringify(payload))
      )
        .setProtectedHeader({
          alg: 'dir',
          enc: 'A256GCM',
          iat: iat,
          nonce: nonce
        })
        .encrypt(key);

      const basicAuth = btoa(secretKey + ':');

      // Log Payload (Masked)
      const debugPayload = { ...payload };
      if (debugPayload.account) {
        debugPayload.account.accountNumber = '********';
      }
      console.log('[API Debug] Payload to Toss:', JSON.stringify(debugPayload, null, 2));
      console.log('[API Debug] JWE Protected Header:', { alg: 'dir', enc: 'A256GCM', iat, nonce });

      console.log('[API] Calling Toss...');
      // 가이드 URL: https://api.tosspayments.com/v2/sellers (셀러 등록)
      // 주의: /v2/payouts/sellers가 아닌 /v2/sellers 사용!
      const tossResponse = await fetch('https://api.tosspayments.com/v2/sellers', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'text/plain', // 가이드: ENCRYPTION 모드일 때 필수
          'TossPayments-api-security-mode': 'ENCRYPTION' // 가이드와 동일한 대소문자
        },
        body: encryptedBody // 가이드: JWE 문자열 그 자체를 본문으로 전송
      });

      // 응답 복호화 로직 추가
      const encryptedResponseText = await tossResponse.text();
      console.log('[API] Toss raw response received');

      let decryptedResponse;
      try {
        // 성공 응답이든 에러 응답이든 암호화되어 오므로 복호화 시도
        if (encryptedResponseText.startsWith('ey')) { // JWE 형태인 경우
          const { plaintext } = await jose.compactDecrypt(encryptedResponseText, key);
          decryptedResponse = JSON.parse(new TextDecoder().decode(plaintext));
          console.log('[API] Decrypted Response:', JSON.stringify(decryptedResponse, null, 2));
        } else {
          decryptedResponse = JSON.parse(encryptedResponseText);
        }
      } catch (decryptError) {
        console.error('[API] Decryption failed or response is not JWE:', decryptError);
        decryptedResponse = { error: '복호화 실패', raw: encryptedResponseText };
      }

      if (!tossResponse.ok) {
        console.error('❌ Toss Error (Decrypted):', decryptedResponse);

        const errDetail = decryptedResponse.error?.message || JSON.stringify(decryptedResponse);

        return NextResponse.json({
          error: `Toss API Error: ${errDetail}`,
          details: {
            tossStatus: tossResponse.status,
            tossMessage: decryptedResponse,
            sentPayload: debugPayload
          }
        }, { status: 400 });
      }

      console.log('✅ Toss Success:', decryptedResponse);
      // Toss에서 반환하는 실제 sellerId 또는 refSellerId 저장
      tossSellerId = decryptedResponse.entityBody?.id || decryptedResponse.entityBody?.refSellerId || refSellerId;
      if (decryptedResponse.entityBody?.status) {
        tossStatus = decryptedResponse.entityBody.status;
      } else if (decryptedResponse.status) {
        tossStatus = decryptedResponse.status;
      } else {
        tossStatus = 'COMPLETED';
      }
    } else {
      console.warn('⚠️ No Toss Keys found. Skipping Toss API.');
    }

    // === DB Update ===
    console.log('[API] Updating DB...');
    const existing = await db.select().from(businessRegistrations).where(eq(businessRegistrations.userId, userId)).limit(1);

    if (existing[0]) {
      await db.update(businessRegistrations).set({
        businessType: businessType || '법인',
        businessName, businessNumber: fullBusinessNumber, representativeName,
        businessCategory, businessType2: businessType2 || '', businessAddress,
        contactName, contactPhone, contactEmail, bankName, accountNumber, accountHolder,
        platformUrl, mobileAppUrl, step: 3, isCompleted: true,
        sellerId: tossSellerId, tossStatus: tossStatus,
        updatedAt: new Date()
      }).where(eq(businessRegistrations.userId, userId));
    } else {
      await db.insert(businessRegistrations).values({
        userId, businessType: businessType || '법인',
        businessName, businessNumber: fullBusinessNumber, representativeName,
        businessCategory, businessType2: businessType2 || '', businessAddress,
        contactName, contactPhone, contactEmail, bankName, accountNumber, accountHolder,
        platformUrl, mobileAppUrl, step: 3, isCompleted: true,
        sellerId: tossSellerId, tossStatus: tossStatus
      });
    }

    console.log('[API] Success! Returning 200 OK.');
    return NextResponse.json({ success: true, sellerId: tossSellerId, status: tossStatus });

  } catch (error: any) {
    console.error('[API] Critical Error:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }

}

export async function GET(request: NextRequest) {
  console.log('[API] Business Registration GET Request Received');

  try {
    // JWT 토큰 검증
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({
      req: request,
      secret: secret,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    if (!token?.sub) {
      console.log('[API] GET - Token verification failed');
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const userId = token.sub;
    console.log('[API] GET - Authenticated User:', userId);

    // DB에서 사용자의 비즈니스 등록 정보 조회
    const existing = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, userId))
      .limit(1);

    if (existing[0]) {
      console.log('[API] GET - Found business registration for user');
      return NextResponse.json(existing[0], { status: 200 });
    } else {
      console.log('[API] GET - No business registration found');
      return NextResponse.json({ message: 'No registration found' }, { status: 404 });
    }

  } catch (error: any) {
    console.error('[API] GET Error:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }
}
