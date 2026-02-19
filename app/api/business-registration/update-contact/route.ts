import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { getToken } from 'next-auth/jwt';

export const runtime = 'edge';

/**
 * 토스페이먼츠 셀러 연락처(전화번호/이메일) 수정 API
 * POST /api/business-registration/update-contact
 * 
 * 토스 API: POST /v2/sellers/{sellerId} (ENCRYPTION 보안 모드)
 * - 잘못된 전화번호 입력 시 수정하여 본인인증 재시도 가능
 */
export async function POST(request: NextRequest) {
  console.log('[API] Update Contact - Request Received');

  try {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({
      req: request,
      secret: secret,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    if (!token?.sub) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const userId = token.sub;
    const body = await request.json();
    const { contactPhone, contactEmail } = body;

    if (!contactPhone && !contactEmail) {
      return NextResponse.json({ error: '수정할 연락처 정보가 없습니다.' }, { status: 400 });
    }

    // DB에서 현재 사용자의 사업자 등록 정보 조회
    const existing = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, userId))
      .limit(1);

    if (!existing[0]) {
      return NextResponse.json({ error: '등록된 사업자 정보가 없습니다.' }, { status: 404 });
    }

    const registration = existing[0];

    if (!registration.sellerId) {
      return NextResponse.json({ error: '토스페이먼츠 셀러 ID가 없습니다.' }, { status: 400 });
    }

    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
    const securityKey = process.env.TOSS_PAYMENTS_SECURITY_KEY?.trim();

    if (!secretKey || !securityKey) {
      return NextResponse.json({ error: '토스 API 키가 설정되지 않았습니다.' }, { status: 500 });
    }

    // 토스 수정 페이로드 구성
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

    // JWE 암호화
    const key = new Uint8Array(
      securityKey.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const kstDate = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const iat = `${kstDate.getUTCFullYear()}-${pad(kstDate.getUTCMonth() + 1)}-${pad(kstDate.getUTCDate())}T${pad(kstDate.getUTCHours())}:${pad(kstDate.getUTCMinutes())}:${pad(kstDate.getUTCSeconds())}+09:00`;
    const nonce = crypto.randomUUID();

    const encryptedBody = await new jose.CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(payload))
    )
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', iat, nonce })
      .encrypt(key);

    const basicAuth = btoa(secretKey + ':');

    console.log(`[API] Updating Toss seller: ${registration.sellerId}`);
    console.log('[API] Update payload:', JSON.stringify(payload));

    // 토스 셀러 수정 API 호출
    const tossResponse = await fetch(
      `https://api.tosspayments.com/v2/sellers/${registration.sellerId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'text/plain',
          'TossPayments-api-security-mode': 'ENCRYPTION',
        },
        body: encryptedBody,
      }
    );

    const encryptedResponseText = await tossResponse.text();
    let decryptedResponse;

    try {
      if (encryptedResponseText.startsWith('ey')) {
        const { plaintext } = await jose.compactDecrypt(encryptedResponseText, key);
        decryptedResponse = JSON.parse(new TextDecoder().decode(plaintext));
      } else {
        decryptedResponse = JSON.parse(encryptedResponseText);
      }
    } catch {
      decryptedResponse = { error: '복호화 실패', raw: encryptedResponseText };
    }

    console.log('[API] Toss update response:', JSON.stringify(decryptedResponse));

    if (!tossResponse.ok) {
      const errMsg = decryptedResponse?.entityBody?.message
        || decryptedResponse?.message
        || '연락처 수정 실패';
      return NextResponse.json({ error: errMsg, details: decryptedResponse }, { status: tossResponse.status });
    }

    // DB 업데이트
    const dbUpdate: any = { updatedAt: new Date() };
    if (contactPhone) dbUpdate.contactPhone = contactPhone;
    if (contactEmail) dbUpdate.contactEmail = contactEmail;

    // 토스 응답에서 최신 상태도 업데이트
    const latestStatus = decryptedResponse?.entityBody?.status;
    if (latestStatus) dbUpdate.tossStatus = latestStatus;

    await db
      .update(businessRegistrations)
      .set(dbUpdate)
      .where(eq(businessRegistrations.userId, userId));

    return NextResponse.json({
      success: true,
      tossStatus: latestStatus || registration.tossStatus,
      message: '연락처가 수정되었습니다. 토스페이먼츠에서 새 번호로 인증을 다시 진행합니다.',
    });

  } catch (error: any) {
    console.error('[API] Update contact error:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }
}

