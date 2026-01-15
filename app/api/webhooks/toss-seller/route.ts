import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Toss Webhook] Received:', JSON.stringify(body));
    
    const { eventType, sellerId, status, refSellerId } = body;
    
    if (eventType !== 'seller.changed') {
      return NextResponse.json({ success: true, message: 'Ignored event type' });
    }
    
    const targetId = refSellerId || sellerId;
    
    if (!targetId || !status) {
      return NextResponse.json({ success: false, error: 'Missing sellerId or status' }, { status: 400 });
    }
    
    await db.update(businessRegistrations)
      .set({ tossStatus: status, updatedAt: new Date() })
      .where(eq(businessRegistrations.userId, targetId));
    
    console.log('[Toss Webhook] Updated seller', targetId, 'status to', status);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Toss Webhook] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Toss seller webhook endpoint' });
}
