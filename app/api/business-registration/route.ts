import { db } from '@/db';
import { businessRegistrations, users, accounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getEdgeSession } from '@/lib/auth/edge-auth';
import {
  formatPhoneForDuplicateSearch,
  getBusinessTypeLabel,
  getSocialProviderDisplayName,
  maskBusinessName,
  maskEmail,
} from '@/lib/business-registration/format';
import {
  buildTossSellerPayload,
  encryptTossPayload,
  getMaskedTossPayloadForLog,
  getTossBasicAuthHeader,
  getTossSellerId,
  getTossSellerStatus,
  parseTossEncryptedResponse,
} from '@/lib/toss/seller';

export const runtime = 'edge';

import { BANK_CODES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'check-duplicate') return handleCheckDuplicate(request);
  if (action === 'update-contact') return handleUpdateContact(request);

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

    if (businessType !== '개인' && (!businessName || !businessNumber1 || !businessNumber2 || !businessNumber3)) {
      return NextResponse.json({ error: '필수 항목 누락' }, { status: 400 });
    }

    let fullBusinessNumber = null;

    if (businessType !== '개인') {
      fullBusinessNumber = `${businessNumber1}-${businessNumber2}-${businessNumber3}`;
    }

    // === 1단계: DB에 먼저 임시 저장 (토스 API 호출 전) ===
    console.log('[API] Step 1: DB에 임시 저장 시작...');

    // 사용자가 users 테이블에 존재하는지 확인 (signIn 콜백 실패 시 누락될 수 있음)
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!existingUser[0]) {
      console.log('[API] User not found in DB. Creating user from JWT token...');
      try {
        await db.insert(users).values({
          id: userId,
          name: token.name || representativeName || '',
          email: (token.email as string) || contactEmail || `unknown_${userId}@oauth.local`,
          provider: (token.provider as string) || 'oauth',
          image: (token.picture as string) || '',
          updatedAt: new Date(),
          emailVerified: new Date(),
        });
        console.log('[API] User created successfully:', userId);
      } catch (userCreateError: any) {
        console.error('[API] Failed to create user:', userCreateError.message);
        console.error('[API] Error code:', userCreateError?.code, 'Detail:', userCreateError?.detail, 'Constraint:', userCreateError?.constraint);
        return NextResponse.json({
          error: '사용자 계정 동기화에 실패했습니다. 로그아웃 후 다시 로그인해주세요.',
          errorType: 'USER_SYNC_FAILED'
        }, { status: 500 });
      }
    }

    // 개인 사용자의 경우 빈 문자열을 null로 변환
    const dbData = {
      businessType: businessType || '법인',
      businessName: businessName || representativeName,
      businessNumber: fullBusinessNumber,
      representativeName,
      businessCategory: businessCategory || null,
      businessType2: businessType2 || null,
      businessAddress: businessAddress || null,
      contactName, contactPhone, contactEmail,
      bankName, accountNumber, accountHolder,
      platformUrl: platformUrl || null,
      mobileAppUrl: mobileAppUrl || null,
      step: 3,
      isCompleted: false,  // 토스 API 성공 전까지 미완료
      sellerId: null,      // 토스 API 성공 후 업데이트
      tossStatus: 'PENDING',
    };

    // 중복 등록 체크 + DB 임시 저장
    const existing = await db.select().from(businessRegistrations).where(eq(businessRegistrations.userId, userId)).limit(1);

    if (existing[0]) {
      if (existing[0].isCompleted && existing[0].step === 3) {
        return NextResponse.json({
          error: '이미 등록된 계정입니다. 기존 계정으로 로그인해주세요.',
          errorType: 'DUPLICATE_REGISTRATION'
        }, { status: 409 });
      }
      // 미완료 등록이면 업데이트
      await db.update(businessRegistrations).set({
        ...dbData,
        updatedAt: new Date(),
      }).where(eq(businessRegistrations.userId, userId));
      console.log('[API] DB 임시 업데이트 완료 (기존 레코드)');
    } else {
      await db.insert(businessRegistrations).values({
        userId,
        ...dbData,
      });
      console.log('[API] DB 임시 INSERT 완료 (신규 레코드)');
    }

    // === 2단계: 토스 API 호출 (DB 저장 성공 후에만 실행) ===
    let tossSellerId = null;
    let tossStatus = 'PENDING';

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
    const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY?.trim();

    if (secretKey && securityKey) {
      const bankCode = BANK_CODES[bankName];
      if (!bankCode) return NextResponse.json({ error: `은행 코드를 찾을 수 없습니다: ${bankName}` }, { status: 400 });

      if (businessType === '개인' && fullBusinessNumber) {
        console.log('[API] SAFEGUARD: businessNumber exists but businessType is "개인". Correcting to INDIVIDUAL_BUSINESS');
      }

      const payload = buildTossSellerPayload({
        userId,
        bankCode,
        accountNumber,
        accountHolder,
        businessType,
        businessNumber: fullBusinessNumber,
        businessName,
        representativeName,
        contactEmail,
        contactPhone,
      });

      console.log('[API] Encrypting payload...');
      const { encryptedBody, key, iat, nonce } = await encryptTossPayload(payload, securityKey);
      const basicAuth = getTossBasicAuthHeader(secretKey);

      // Log Payload (Masked)
      const debugPayload = getMaskedTossPayloadForLog(payload);
      console.log('[API Debug] Payload to Toss:', JSON.stringify(debugPayload, null, 2));
      console.log('[API Debug] JWE Protected Header:', { alg: 'dir', enc: 'A256GCM', iat, nonce });

      console.log('[API] Calling Toss...');
      // 가이드 URL: https://api.tosspayments.com/v2/sellers (셀러 등록)
      // 주의: /v2/payouts/sellers가 아닌 /v2/sellers 사용!
      const tossResponse = await fetch('https://api.tosspayments.com/v2/sellers', {
        method: 'POST',
        headers: {
          'Authorization': basicAuth,
          'Content-Type': 'text/plain', // 가이드: ENCRYPTION 모드일 때 필수
          'TossPayments-api-security-mode': 'ENCRYPTION' // 가이드와 동일한 대소문자
        },
        body: encryptedBody // 가이드: JWE 문자열 그 자체를 본문으로 전송
      });

      const encryptedResponseText = await tossResponse.text();
      console.log('[API] Toss raw response received');

      const decryptedResponse = await parseTossEncryptedResponse(encryptedResponseText, key);
      console.log('[API] Decrypted Response:', JSON.stringify(decryptedResponse, null, 2));

      if (!tossResponse.ok) {
        console.error('❌ Toss Error (Decrypted):', decryptedResponse);

        // 토스 API 실패 시 DB에 실패 상태 기록 (임시 저장된 레코드 유지)
        await db.update(businessRegistrations).set({
          tossStatus: 'FAILED',
          updatedAt: new Date(),
        }).where(eq(businessRegistrations.userId, userId));

        const errDetail = decryptedResponse.error?.message || decryptedResponse.message || JSON.stringify(decryptedResponse);

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
      tossSellerId = getTossSellerId(decryptedResponse, payload.refSellerId);
      tossStatus = getTossSellerStatus(decryptedResponse);
    } else {
      console.warn('⚠️ No Toss Keys found. Skipping Toss API.');
    }

    // === 3단계: 토스 API 결과를 DB에 반영 ===
    console.log('[API] Step 3: DB에 토스 결과 반영...');
    await db.update(businessRegistrations).set({
      sellerId: tossSellerId,
      tossStatus: tossStatus,
      isCompleted: true,
      updatedAt: new Date(),
    }).where(eq(businessRegistrations.userId, userId));

    console.log('[API] Success! Returning 200 OK.');
    return NextResponse.json({ success: true, sellerId: tossSellerId, status: tossStatus });

  } catch (error: any) {
    console.error('[API] Critical Error:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }

}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'check-status') return handleCheckStatus(request);

  console.log('[API] Business Registration GET Request Received');

  try {
    const session = await getEdgeSession(request);
    if (!session?.user?.id) {
      console.log('[API] GET - Token verification failed');
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log('[API] GET - Authenticated User:', userId);

    // DB에서 사용자의 비즈니스 등록 정보 조회
    const existing = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, userId))
      .limit(1);

    if (existing[0]) {
      console.log('[API] GET - Found business registration for user');
      // 프론트엔드에서 result.data로 접근하므로 { data: ... } 형식으로 반환
      return NextResponse.json({ data: existing[0] }, { status: 200 });
    } else {
      console.log('[API] GET - No business registration found');
      return NextResponse.json({ data: null, message: 'No registration found' }, { status: 200 });
    }

  } catch (error: any) {
    console.error('[API] GET Error:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }
}


// ─── check-duplicate 핸들러 ───
async function handleCheckDuplicate(request: NextRequest) {
  console.log('[API] Check Duplicate - Request Received');
  try {
    let body;
    try { body = await request.json(); } catch {
      return NextResponse.json({ success: false, message: 'JSON 파싱 오류' }, { status: 400 });
    }
    const { representativeName, contactPhone } = body;
    if (!representativeName || !contactPhone) {
      return NextResponse.json({ success: false, message: '이름과 휴대폰 번호를 모두 입력해주세요.' }, { status: 400 });
    }
    const phoneFormatted = formatPhoneForDuplicateSearch(contactPhone);

    const selectFields = {
      id: businessRegistrations.id,
      userId: businessRegistrations.userId,
      isCompleted: businessRegistrations.isCompleted,
      step: businessRegistrations.step,
      businessType: businessRegistrations.businessType,
      businessName: businessRegistrations.businessName,
      user: { email: users.email },
      account: { provider: accounts.provider },
    };

    let result = (await db.select(selectFields).from(businessRegistrations)
      .leftJoin(users, eq(businessRegistrations.userId, users.id))
      .leftJoin(accounts, eq(businessRegistrations.userId, accounts.userId))
      .where(and(eq(businessRegistrations.representativeName, representativeName), eq(businessRegistrations.contactPhone, phoneFormatted)))
      .limit(1))[0];

    if (!result && phoneFormatted !== contactPhone) {
      result = (await db.select(selectFields).from(businessRegistrations)
        .leftJoin(users, eq(businessRegistrations.userId, users.id))
        .leftJoin(accounts, eq(businessRegistrations.userId, accounts.userId))
        .where(and(eq(businessRegistrations.representativeName, representativeName), eq(businessRegistrations.contactPhone, contactPhone)))
        .limit(1))[0];
    }

    if (result && result.isCompleted && result.step === 3) {
      const maskedEmail = maskEmail(result.user?.email);
      const providerName = getSocialProviderDisplayName(result.account?.provider);
      const maskedBusinessName = result.businessType === '개인'
        ? ''
        : maskBusinessName(result.businessName);
      const businessTypeLabel = getBusinessTypeLabel(result.businessType);

      return NextResponse.json({
        success: false, isAlreadyRegistered: true,
        message: '이미 가입된 정보입니다. 기존 계정으로 로그인해주세요.',
        existingAccount: { provider: result.account?.provider, providerName, maskedEmail, businessType: businessTypeLabel, maskedBusinessName }
      }, { status: 409 });
    }

    return NextResponse.json({ success: true, message: '가입 가능합니다.' });
  } catch (error: any) {
    console.error('[API] Check Duplicate - 오류:', error);
    return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// ─── check-status 핸들러 ───
async function handleCheckStatus(request: NextRequest) {
  console.log('[API] Check Toss Seller Status - Request Received');
  try {
    const session = await getEdgeSession(request);
    if (!session?.user?.id) return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    const userId = session.user.id;

    const existing = await db.select().from(businessRegistrations).where(eq(businessRegistrations.userId, userId)).limit(1);
    if (!existing[0]) return NextResponse.json({ error: '등록된 사업자 정보가 없습니다.' }, { status: 404 });
    const registration = existing[0];

    if (!registration.sellerId) {
      // sellerId가 없는 레거시 사용자 → 기존 DB 데이터로 재등록 시도
      console.log('[API] No sellerId found. Attempting re-registration with existing DB data...');
      const reRegResult = await reRegisterSeller(registration, userId);
      return NextResponse.json(reRegResult);
    }

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
    if (!secretKey) {
      return NextResponse.json({ tossStatus: registration.tossStatus || 'PENDING', message: '토스 API 키가 설정되지 않았습니다.', fromDB: true });
    }

    const basicAuth = getTossBasicAuthHeader(secretKey);
    const tossResponse = await fetch(`https://api.tosspayments.com/v2/sellers/${registration.sellerId}`, {
      method: 'GET', headers: { 'Authorization': basicAuth },
    });

    const responseText = await tossResponse.text();
    let tossData;
    try { tossData = JSON.parse(responseText); } catch {
      return NextResponse.json({ tossStatus: registration.tossStatus || 'PENDING', message: '토스 응답 파싱 실패', fromDB: true });
    }

    if (!tossResponse.ok) {
      // === 404인 경우: 이전 MID에서 등록된 셀러 → 현재 MID로 재등록 ===
      if (tossResponse.status === 404) {
        console.log('[API] Seller not found in TossPayments (404). Re-registering with existing DB data...');
        const reRegResult = await reRegisterSeller(registration, userId);
        return NextResponse.json(reRegResult);
      }
      return NextResponse.json({ tossStatus: registration.tossStatus || 'PENDING', message: tossData.message || '토스 상태 조회 실패', fromDB: true });
    }

    const latestStatus = getTossSellerStatus(tossData, registration.tossStatus || 'PENDING');
    if (latestStatus && latestStatus !== registration.tossStatus) {
      await db.update(businessRegistrations).set({ tossStatus: latestStatus, updatedAt: new Date() }).where(eq(businessRegistrations.userId, userId));
    }

    return NextResponse.json({
      tossStatus: latestStatus || registration.tossStatus || 'PENDING',
      sellerId: registration.sellerId, businessType: registration.businessType,
      contactPhone: registration.contactPhone, contactEmail: registration.contactEmail, fromDB: false,
    });
  } catch (error: any) {
    console.error('[API] Check status error:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }
}

// ─── update-contact 핸들러 ───
async function handleUpdateContact(request: NextRequest) {
  console.log('[API] Update Contact - Request Received');
  try {
    const session = await getEdgeSession(request);
    if (!session?.user?.id) return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    const userId = session.user.id;

    const body = await request.json();
    const { contactPhone, contactEmail } = body;
    if (!contactPhone && !contactEmail) return NextResponse.json({ error: '수정할 연락처 정보가 없습니다.' }, { status: 400 });

    const existing = await db.select().from(businessRegistrations).where(eq(businessRegistrations.userId, userId)).limit(1);
    if (!existing[0]) return NextResponse.json({ error: '등록된 사업자 정보가 없습니다.' }, { status: 404 });
    const registration = existing[0];
    if (!registration.sellerId) return NextResponse.json({ error: '토스페이먼츠 셀러 ID가 없습니다.' }, { status: 400 });

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
    const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY?.trim();
    if (!secretKey || !securityKey) return NextResponse.json({ error: '토스 API 키가 설정되지 않았습니다.' }, { status: 500 });

    const isIndividual = registration.businessType === '개인';
    const payload: any = {};
    if (isIndividual) {
      payload.individual = {};
      if (contactPhone) payload.individual.phone = contactPhone.replace(/-/g, '');
      if (contactEmail) payload.individual.email = contactEmail;
    } else {
      payload.company = {};
      if (contactPhone) payload.company.phone = contactPhone.replace(/-/g, '');
      if (contactEmail) payload.company.email = contactEmail;
    }

    const { encryptedBody, key } = await encryptTossPayload(payload, securityKey);
    const basicAuth = getTossBasicAuthHeader(secretKey);
    const tossResponse = await fetch(`https://api.tosspayments.com/v2/sellers/${registration.sellerId}`, {
      method: 'POST',
      headers: { 'Authorization': basicAuth, 'Content-Type': 'text/plain', 'TossPayments-api-security-mode': 'ENCRYPTION' },
      body: encryptedBody,
    });

    const encryptedResponseText = await tossResponse.text();
    const decryptedResponse = await parseTossEncryptedResponse(encryptedResponseText, key);

    if (!tossResponse.ok) {
      const errMsg = decryptedResponse?.entityBody?.message || decryptedResponse?.error?.message || decryptedResponse?.message || '연락처 수정 실패';
      return NextResponse.json({ error: errMsg, details: decryptedResponse }, { status: tossResponse.status });
    }

    const dbUpdate: any = { updatedAt: new Date() };
    if (contactPhone) dbUpdate.contactPhone = contactPhone;
    if (contactEmail) dbUpdate.contactEmail = contactEmail;
    const latestStatus = decryptedResponse?.entityBody?.status;
    if (latestStatus) dbUpdate.tossStatus = latestStatus;

    await db.update(businessRegistrations).set(dbUpdate).where(eq(businessRegistrations.userId, userId));

    return NextResponse.json({
      success: true, tossStatus: latestStatus || registration.tossStatus,
      message: '연락처가 수정되었습니다. 토스페이먼츠에서 새 번호로 인증을 다시 진행합니다.',
    });
  } catch (error: any) {
    console.error('[API] Update contact error:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }
}

// ─── 기존 DB 데이터로 TossPayments 셀러 재등록 ───
async function reRegisterSeller(registration: any, userId: string) {
  const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
  const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY?.trim();

  if (!secretKey || !securityKey) {
    return { tossStatus: 'PENDING', message: '토스 API 키가 설정되지 않았습니다.', reRegistered: false };
  }

  const bankCode = BANK_CODES[registration.bankName];
  if (!bankCode) {
    return { tossStatus: 'PENDING', message: `은행 코드를 찾을 수 없습니다: ${registration.bankName}`, reRegistered: false };
  }

  if (registration.businessType === '개인' && registration.businessNumber) {
    console.log('[API] SAFEGUARD (reRegister): businessNumber exists but businessType is "개인". Correcting to INDIVIDUAL_BUSINESS');
  }

  const payload = buildTossSellerPayload({
    userId,
    bankCode,
    accountNumber: registration.accountNumber,
    accountHolder: registration.accountHolder,
    businessType: registration.businessType,
    businessNumber: registration.businessNumber,
    businessName: registration.businessName,
    representativeName: registration.representativeName,
    contactEmail: registration.contactEmail,
    contactPhone: registration.contactPhone,
  });

  const { encryptedBody, key } = await encryptTossPayload(payload, securityKey);
  const basicAuth = getTossBasicAuthHeader(secretKey);

  console.log('[API] Re-registering seller with TossPayments...');
  console.log('[API] Payload businessType:', payload.businessType, 'refSellerId:', payload.refSellerId);

  const tossResponse = await fetch('https://api.tosspayments.com/v2/sellers', {
    method: 'POST',
    headers: {
      'Authorization': basicAuth,
      'Content-Type': 'text/plain',
      'TossPayments-api-security-mode': 'ENCRYPTION',
    },
    body: encryptedBody,
  });

  const encryptedResponseText = await tossResponse.text();
  const decryptedResponse = await parseTossEncryptedResponse(encryptedResponseText, key);

  if (!tossResponse.ok) {
    console.error('[API] Re-registration failed:', decryptedResponse);
    const errMsg = decryptedResponse?.error?.message || decryptedResponse?.entityBody?.message || decryptedResponse?.message || JSON.stringify(decryptedResponse);
    return { tossStatus: 'FAILED', message: `재등록 실패: ${errMsg}`, reRegistered: false, details: decryptedResponse };
  }

  console.log('[API] Re-registration success:', decryptedResponse);

  const newSellerId = getTossSellerId(decryptedResponse, payload.refSellerId);
  const newStatus = getTossSellerStatus(decryptedResponse);

  // DB 업데이트: 새 sellerId와 tossStatus 저장
  await db.update(businessRegistrations).set({
    sellerId: newSellerId,
    tossStatus: newStatus,
    updatedAt: new Date(),
  }).where(eq(businessRegistrations.userId, userId));

  console.log('[API] DB updated with new sellerId:', newSellerId, 'tossStatus:', newStatus);

  return {
    tossStatus: newStatus,
    sellerId: newSellerId,
    businessType: registration.businessType,
    contactPhone: registration.contactPhone,
    contactEmail: registration.contactEmail,
    reRegistered: true,
    message: '토스페이먼츠에 재등록되었습니다. 카카오톡 인증을 확인해주세요.',
  };
}