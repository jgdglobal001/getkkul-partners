import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'edge';

/**
 * 토스페이먼츠 셀러 상태를 직접 조회하여 DB를 업데이트하는 API
 * GET /api/business-registration/check-status
 * 
 * 토스 API: GET /v2/sellers/{sellerId} (Basic Auth, ENCRYPTION 불필요)
 */
export async function GET(request: NextRequest) {
  console.log('[API] Check Toss Seller Status - Request Received');

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

    // DB에서 현재 사용자의 비즈니스 등록 정보 조회
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
      return NextResponse.json({
        tossStatus: registration.tossStatus || 'PENDING',
        message: '토스페이먼츠 셀러 ID가 없습니다.',
        fromDB: true
      });
    }

    // 토스 API로 셀러 상태 조회
    const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY?.trim();
    if (!secretKey) {
      // 토스 키가 없으면 DB의 현재 상태만 반환
      return NextResponse.json({
        tossStatus: registration.tossStatus || 'PENDING',
        message: '토스 API 키가 설정되지 않았습니다.',
        fromDB: true
      });
    }

    const basicAuth = btoa(`${secretKey}:`);

    console.log(`[API] Checking Toss seller status for: ${registration.sellerId}`);

    const tossResponse = await fetch(
      `https://api.tosspayments.com/v2/sellers/${registration.sellerId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
        },
      }
    );

    const responseText = await tossResponse.text();
    console.log(`[API] Toss seller status response (${tossResponse.status}):`, responseText.slice(0, 500));

    let tossData;
    try {
      tossData = JSON.parse(responseText);
    } catch {
      console.error('[API] Failed to parse Toss response:', responseText);
      // 파싱 실패 시 DB 상태 반환
      return NextResponse.json({
        tossStatus: registration.tossStatus || 'PENDING',
        message: '토스 응답 파싱 실패',
        fromDB: true
      });
    }

    if (!tossResponse.ok) {
      console.error('[API] Toss seller status check failed:', tossData);
      // API 실패 시 DB 상태 반환
      return NextResponse.json({
        tossStatus: registration.tossStatus || 'PENDING',
        message: tossData.message || '토스 상태 조회 실패',
        fromDB: true
      });
    }

    // 토스 응답에서 상태 추출 (entityBody.status 또는 status)
    const latestStatus = tossData.entityBody?.status || tossData.status;

    if (latestStatus && latestStatus !== registration.tossStatus) {
      // DB 상태 업데이트
      console.log(`[API] Updating tossStatus: ${registration.tossStatus} → ${latestStatus}`);
      await db
        .update(businessRegistrations)
        .set({
          tossStatus: latestStatus,
          updatedAt: new Date(),
        })
        .where(eq(businessRegistrations.userId, userId));
    }

    return NextResponse.json({
      tossStatus: latestStatus || registration.tossStatus || 'PENDING',
      sellerId: registration.sellerId,
      businessType: registration.businessType,
      contactPhone: registration.contactPhone,
      contactEmail: registration.contactEmail,
      fromDB: false,
    });

  } catch (error: any) {
    console.error('[API] Check status error:', error);
    return NextResponse.json({ error: `서버 내부 오류: ${error.message}` }, { status: 500 });
  }
}

