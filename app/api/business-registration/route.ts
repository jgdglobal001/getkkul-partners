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
    console.log('[API] Toss API Process Start...');
    let tossSellerId = null;
    let tossStatus = 'PENDING';

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
    const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY;

    if (secretKey && securityKey) {
      const bankCode = BANK_CODES[bankName];
      if (!bankCode) return NextResponse.json({ error: `은행 코드를 찾을 수 없습니다: ${bankName}` }, { status: 400 });

      let tossBusinessType = 'CORPORATE';
      if (businessType === '개인') tossBusinessType = 'INDIVIDUAL';
      else if (businessType === '개인사업자') tossBusinessType = 'INDIVIDUAL_BUSINESS';
      else tossBusinessType = 'CORPORATE';

      const payload: any = {
        refSellerId: userId,
        businessType: tossBusinessType,
        account: { bankCode, accountNumber, holderName: accountHolder }
      };

      if (tossBusinessType === 'INDIVIDUAL') {
        payload.individual = {
          name: representativeName,
          email: contactEmail,
          phoneNumber: contactPhone?.replace(/-/g, '')
        };
      } else {
        payload.company = {
          businessNumber: bizNumClean,
          name: businessName,
          representativeName: representativeName,
        };
      }

      // Encrypt with btoa/TextEncoder (Edge Safe)
      console.log('[API] Encrypting payload...');
      const keyStr = securityKey as string;
      const isHex = /^[0-9A-Fa-f]+$/.test(keyStr);
      const key = isHex ? Buffer.from(keyStr, 'hex') : Buffer.from(keyStr, 'utf-8');

      const encryptedBody = await new jose.CompactEncrypt(
        new TextEncoder().encode(JSON.stringify(payload))
      )
        .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
        .encrypt(key);

      const basicAuth = btoa(secretKey + ':');

      // Log Payload (Masked)
      const debugPayload = { ...payload };
      if (debugPayload.account) {
        // Ensure explicit string conversion for critical fields
        debugPayload.account.accountNumber = String(body.accountNumber);
        debugPayload.account.bankCode = String(BANK_CODES[bankName]);
      }
      // Sanitized check
      if (debugPayload.individual) {
        debugPayload.individual.phoneNumber = String(contactPhone).replace(/-/g, '');
      }

      console.log('[API Debug] Payload to Toss:', JSON.stringify(debugPayload, null, 2));

      console.log('[API] Calling Toss...');
      const tossResponse = await fetch('https://api.tosspayments.com/v2/payouts/sellers', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${basicAuth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: encryptedBody })
      });

      if (!tossResponse.ok) {
        const errorText = await tossResponse.text();
        console.error('❌ Toss Error:', errorText);

        let errDetail = errorText;
        try {
          const json = JSON.parse(errorText);
          errDetail = json.error?.message || errorText;
        } catch (e) { }

        // RETURN DEBUG INFO TO FRONTEND directly
        return NextResponse.json({
          error: `Toss 500 Error: ${errDetail}`,
          details: {
            tossStatus: tossResponse.status,
            tossMessage: errorText,
            sentPayload: debugPayload // User can see this in Browser Console!
          }
        }, { status: 400 });
      }

      const tossResult = await tossResponse.json();
      console.log('✅ Toss Success:', tossResult);
      tossSellerId = userId;
      tossStatus = 'COMPLETED';
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
        sellerId: tossSellerId, tossStatus: tossStatus
      }).where(eq(businessRegistrations.userId, userId));
    } else {
      await db.insert(businessRegistrations).values({
        userId, businessType: businessType || '법인',
        businessName, businessNumber: fullBusinessNumber, representativeName,
        businessCategory, businessType2: businessType2 || '', businessAddress,
        contactName, contactPhone, contactEmail, bankName, accountNumber, accountHolder,
        platformUrl, mobileAppUrl, step: 3, isCompleted: true,
        sellerId: tossSellerId, tossStatus: 'PENDING' // or tossStatus logic
      });
    }

    console.log('[API] Success! Returning 200 OK.');
    return NextResponse.json({ success: true, sellerId: tossSellerId });

  } catch (error: any) {
    console.error('[API] Critical Error:', error);

    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Business Registration API is active' }, { status: 200 });
}
