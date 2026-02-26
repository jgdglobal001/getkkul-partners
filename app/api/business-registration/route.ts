import { db } from '@/db';
import { businessRegistrations, users, accounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { CompactEncrypt, compactDecrypt } from 'jose';
import { getToken } from 'next-auth/jwt';

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
    let bizNumClean = null;

    if (businessType !== '개인') {
      fullBusinessNumber = `${businessNumber1}-${businessNumber2}-${businessNumber3}`;
      bizNumClean = fullBusinessNumber.replace(/-/g, '');
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
          provider: 'oauth',
          image: (token.picture as string) || '',
          emailVerified: new Date(),
        });
        console.log('[API] User created successfully:', userId);
      } catch (userCreateError: any) {
        console.error('[API] Failed to create user:', userCreateError.message);
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
        account: { bankCode, accountNumber: accountNumber.replace(/[^0-9]/g, ''), holderName: accountHolder }
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

      const encryptedBody = await new CompactEncrypt(
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
          const { plaintext } = await compactDecrypt(encryptedResponseText, key);
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

        // 토스 API 실패 시 DB에 실패 상태 기록 (임시 저장된 레코드 유지)
        await db.update(businessRegistrations).set({
          tossStatus: 'FAILED',
          updatedAt: new Date(),
        }).where(eq(businessRegistrations.userId, userId));

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
    const phoneClean = contactPhone.replace(/-/g, '');
    const phoneFormatted = phoneClean.length === 11
      ? `${phoneClean.slice(0, 3)}-${phoneClean.slice(3, 7)}-${phoneClean.slice(7)}`
      : contactPhone;

    const selectFields = {
      id: businessRegistrations.id,
      userId: businessRegistrations.userId,
      isCompleted: businessRegistrations.isCompleted,
      step: businessRegistrations.step,
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
      const rawEmail = result.user?.email || '';
      let maskedEmail = '';
      if (rawEmail) {
        const [id, domain] = rawEmail.split('@');
        maskedEmail = id.substring(0, 1) + '*'.repeat(Math.max(id.length - 1, 1)) + '@' + domain;
      }
      const providerMap: Record<string, string> = { 'google': '구글', 'naver': '네이버', 'kakao': '카카오' };
      const providerName = providerMap[result.account?.provider || ''] || result.account?.provider || '소셜';
      return NextResponse.json({
        success: false, isAlreadyRegistered: true,
        message: '이미 가입된 정보입니다. 기존 계정으로 로그인해주세요.',
        existingAccount: { provider: result.account?.provider, providerName, maskedEmail }
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
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req: request, secret, secureCookie: process.env.NODE_ENV === 'production' });
    if (!token?.sub) return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    const userId = token.sub;

    const existing = await db.select().from(businessRegistrations).where(eq(businessRegistrations.userId, userId)).limit(1);
    if (!existing[0]) return NextResponse.json({ error: '등록된 사업자 정보가 없습니다.' }, { status: 404 });
    const registration = existing[0];

    if (!registration.sellerId) {
      return NextResponse.json({ tossStatus: registration.tossStatus || 'PENDING', message: '토스페이먼츠 셀러 ID가 없습니다.', fromDB: true });
    }

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
    if (!secretKey) {
      return NextResponse.json({ tossStatus: registration.tossStatus || 'PENDING', message: '토스 API 키가 설정되지 않았습니다.', fromDB: true });
    }

    const basicAuth = btoa(`${secretKey}:`);
    const tossResponse = await fetch(`https://api.tosspayments.com/v2/sellers/${registration.sellerId}`, {
      method: 'GET', headers: { 'Authorization': `Basic ${basicAuth}` },
    });

    const responseText = await tossResponse.text();
    let tossData;
    try { tossData = JSON.parse(responseText); } catch {
      return NextResponse.json({ tossStatus: registration.tossStatus || 'PENDING', message: '토스 응답 파싱 실패', fromDB: true });
    }

    if (!tossResponse.ok) {
      return NextResponse.json({ tossStatus: registration.tossStatus || 'PENDING', message: tossData.message || '토스 상태 조회 실패', fromDB: true });
    }

    const latestStatus = tossData.entityBody?.status || tossData.status;
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
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({ req: request, secret, secureCookie: process.env.NODE_ENV === 'production' });
    if (!token?.sub) return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    const userId = token.sub;

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

    const key = new Uint8Array(securityKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const iat = `${kstDate.getUTCFullYear()}-${pad(kstDate.getUTCMonth() + 1)}-${pad(kstDate.getUTCDate())}T${pad(kstDate.getUTCHours())}:${pad(kstDate.getUTCMinutes())}:${pad(kstDate.getUTCSeconds())}+09:00`;
    const nonce = crypto.randomUUID();

    const encryptedBody = await new CompactEncrypt(new TextEncoder().encode(JSON.stringify(payload)))
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', iat, nonce }).encrypt(key);

    const basicAuth = btoa(secretKey + ':');
    const tossResponse = await fetch(`https://api.tosspayments.com/v2/sellers/${registration.sellerId}`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basicAuth}`, 'Content-Type': 'text/plain', 'TossPayments-api-security-mode': 'ENCRYPTION' },
      body: encryptedBody,
    });

    const encryptedResponseText = await tossResponse.text();
    let decryptedResponse;
    try {
      if (encryptedResponseText.startsWith('ey')) {
        const { plaintext } = await compactDecrypt(encryptedResponseText, key);
        decryptedResponse = JSON.parse(new TextDecoder().decode(plaintext));
      } else {
        decryptedResponse = JSON.parse(encryptedResponseText);
      }
    } catch { decryptedResponse = { error: '복호화 실패', raw: encryptedResponseText }; }

    if (!tossResponse.ok) {
      const errMsg = decryptedResponse?.entityBody?.message || decryptedResponse?.message || '연락처 수정 실패';
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