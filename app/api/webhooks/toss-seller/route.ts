import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// 토스페이먼츠 실제 웹훅 이벤트 타입: seller.changed
// 상태값: APPROVAL_REQUIRED | PARTIALLY_APPROVED | KYC_REQUIRED | APPROVED
interface TossSellerWebhook {
  eventType: string;
  data: {
    sellerId: string;
    status: string;
    [key: string]: unknown;
  };
  createdAt?: string;
}

export async function POST(request: NextRequest) {
  try {
    // 토스 웹훅 시크릿 검증 (선택사항 - 토스에서 제공하는 경우)
    const webhookSecret = request.headers.get('x-toss-webhook-secret');
    if (process.env.TOSS_WEBHOOK_SECRET && webhookSecret !== process.env.TOSS_WEBHOOK_SECRET) {
      console.error('[Toss Webhook] Invalid webhook secret');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: TossSellerWebhook = await request.json();
    console.log('[Toss Webhook] Received:', JSON.stringify(body));

    // 이벤트 타입 확인 — 토스 실제 이벤트: seller.changed
    if (body.eventType !== 'seller.changed') {
      console.log('[Toss Webhook] Ignoring event type:', body.eventType);
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    const sellerId = body.data?.sellerId;
    const newStatus = body.data?.status;

    if (!sellerId || !newStatus) {
      console.warn('[Toss Webhook] Missing sellerId or status in payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // DB 업데이트 — 토스 상태값을 그대로 저장
    const updated = await db
      .update(businessRegistrations)
      .set({
        tossStatus: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(businessRegistrations.sellerId, sellerId))
      .returning({ id: businessRegistrations.id });

    if (updated.length === 0) {
      console.warn('[Toss Webhook] Seller not found:', sellerId);
      return NextResponse.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }

    console.log('[Toss Webhook] Updated seller status:', sellerId, '->', newStatus);

    return NextResponse.json({
      success: true,
      message: 'Status updated',
      sellerId,
      newStatus,
    });
  } catch (error) {
    console.error('[Toss Webhook] Error:', error);
    return NextResponse.json(
      { error: '웹훅 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 토스에서 웹훅 URL 검증용 GET 요청
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Toss seller webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}

