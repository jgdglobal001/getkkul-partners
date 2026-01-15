import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * 토스페이먼츠 셀러 상태 변경 웹훅 수신 API
 * 
 * 이벤트 타입: seller.changed
 * 
 * 웹훅 본문 예시:
 * {
 *   "eventType": "seller.changed",
 *   "createdAt": "2024-01-15T14:40:10+09:00",
 *   "version": "2022-11-16",
 *   "eventId": "{eventId}",
 *   "entityType": "seller",
 *   "entityBody": {
 *     "id": "seller-1",
 *     "refSellerId": "my-seller-1",
 *     "businessType": "INDIVIDUAL_BUSINESS",
 *     "status": "KYC_REQUIRED",
 *     ...
 *   }
 * }
 * 
 * 셀러 상태값:
 * - APPROVAL_REQUIRED: 심사 대기 (셀러 등록 직후)
 * - KYC_REQUIRED: KYC 인증 필요
 * - KYC_SUBMITTED: KYC 제출됨
 * - KYC_REVIEW: KYC 심사 중
 * - KYC_REJECTED: KYC 거부됨
 * - COMPLETED: 심사 완료 (지급 가능!)
 * - SUSPENDED: 정지됨
 */

// 토스 웹훅 이벤트 타입 정의
interface TossWebhookEvent {
  eventType: string;
  createdAt: string;
  version: string;
  eventId: string;
  entityType: string;
  entityBody: {
    id: string;           // 토스 sellerId (예: seller_a01kf00v74svnb15jjen2c8n838)
    refSellerId: string;  // 우리 시스템의 userId
    businessType: string;
    status: string;       // 상태값
    [key: string]: unknown;
  };
}

export async function POST(request: NextRequest) {
  console.log('[Webhook] 토스 셀러 상태 변경 웹훅 수신');
  
  try {
    // 요청 본문 파싱
    const body: TossWebhookEvent = await request.json();
    console.log('[Webhook] 이벤트 타입:', body.eventType);
    console.log('[Webhook] 이벤트 본문:', JSON.stringify(body, null, 2));
    
    // seller.changed 이벤트만 처리
    if (body.eventType !== 'seller.changed') {
      console.log('[Webhook] 지원하지 않는 이벤트 타입:', body.eventType);
      return NextResponse.json({ success: true, message: 'Event type not supported' });
    }
    
    const { id: tossSellerId, refSellerId, status } = body.entityBody;
    
    if (!refSellerId || !status) {
      console.error('[Webhook] 필수 필드 누락:', { refSellerId, status });
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    console.log('[Webhook] 셀러 정보:', {
      tossSellerId,
      refSellerId,  // 우리 시스템의 userId
      status
    });
    
    // DB에서 해당 사용자의 사업자등록 정보 조회
    const existingRegistration = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, refSellerId))
      .limit(1);
    
    if (existingRegistration.length === 0) {
      console.error('[Webhook] 사업자등록 정보를 찾을 수 없음:', refSellerId);
      return NextResponse.json(
        { success: false, error: 'Business registration not found' },
        { status: 404 }
      );
    }
    
    const previousStatus = existingRegistration[0].tossStatus;
    
    // 상태 업데이트
    await db
      .update(businessRegistrations)
      .set({
        tossStatus: status,
        sellerId: tossSellerId,  // 토스 sellerId도 저장
        updatedAt: new Date()
      })
      .where(eq(businessRegistrations.userId, refSellerId));
    
    console.log('[Webhook] ✅ DB 업데이트 성공:', {
      userId: refSellerId,
      previousStatus,
      newStatus: status
    });
    
    // 상태별 추가 로깅
    if (status === 'COMPLETED') {
      console.log('[Webhook] 🎉 셀러 심사 완료! 지급대행 가능 상태입니다.');
    } else if (status === 'KYC_REJECTED') {
      console.log('[Webhook] ⚠️ KYC 심사 거부됨. 사용자에게 안내 필요.');
    } else if (status === 'SUSPENDED') {
      console.log('[Webhook] ❌ 셀러 정지됨. 관리자 확인 필요.');
    }
    
    // 토스에 200 응답 (10초 이내)
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      data: {
        userId: refSellerId,
        previousStatus,
        newStatus: status
      }
    });
    
  } catch (error) {
    console.error('[Webhook] 웹훅 처리 실패:', error);
    
    // 에러가 발생해도 200 응답을 보내면 재전송이 안 됨
    // 500 응답을 보내서 토스가 재전송하도록 함
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET 요청은 상태 확인용 (헬스체크)
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'Toss Seller Webhook',
    supportedEvents: ['seller.changed']
  });
}

