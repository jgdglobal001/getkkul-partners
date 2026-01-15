import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// 토스 웹훅 요청 타입
interface TossSellerWebhook {
  eventType: 'SELLER_STATUS_CHANGED';
  sellerId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  statusMessage?: string;
  timestamp: string;
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

    // 이벤트 타입 확인
    if (body.eventType !== 'SELLER_STATUS_CHANGED') {
      console.log('[Toss Webhook] Ignoring event type:', body.eventType);
      return NextResponse.json({ success: true, message: 'Event ignored' });
    }

    // 상태 매핑
    const statusMap: Record<string, string> = {
      'PENDING': 'PENDING',
      'APPROVED': 'COMPLETED',
      'REJECTED': 'REJECTED',
      'SUSPENDED': 'SUSPENDED',
    };

    const newStatus = statusMap[body.status] || body.status;

    // DB 업데이트 - sellerId로 찾아서 상태 업데이트
    const updated = await db
      .update(businessRegistrations)
      .set({
        tossStatus: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(businessRegistrations.sellerId, body.sellerId))
      .returning({ id: businessRegistrations.id });

    if (updated.length === 0) {
      console.warn('[Toss Webhook] Seller not found:', body.sellerId);
      return NextResponse.json({ success: false, message: 'Seller not found' }, { status: 404 });
    }

    console.log('[Toss Webhook] Updated seller status:', body.sellerId, '->', newStatus);

    return NextResponse.json({
      success: true,
      message: 'Status updated',
      sellerId: body.sellerId,
      newStatus: newStatus,
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

