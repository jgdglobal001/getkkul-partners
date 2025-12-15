import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { partnerLinks, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    // DB에서 링크 조회
    const links = await db
      .select()
      .from(partnerLinks)
      .where(eq(partnerLinks.shortCode, shortCode))
      .limit(1);

    const link = links[0];

    if (!link) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // 클릭 수 증가
    await db
      .update(partnerLinks)
      .set({ clickCount: sql`${partnerLinks.clickCount} + 1` })
      .where(eq(partnerLinks.shortCode, shortCode));

    // 쿠키에 파트너 ID 저장 (추적용, 30일 유효)
    const cookieStore = await cookies();
    cookieStore.set('partner_ref', link.partnerId, {
      maxAge: 60 * 60 * 24, // 24시간 (쿠팡과 동일한 기준 적용)
      httpOnly: true,
      sameSite: 'lax',
    });

    // 겟꿀 쇼핑 상품 페이지로 리다이렉트 (쿼리 파라미터로 파트너 정보 전달)
    const shoppingUrl = process.env.NEXT_PUBLIC_GETKKUL_SHOPPING_URL || 'http://localhost:3002';
    // 파트너스 도메인의 쿠키는 쇼핑 도메인에서 읽을 수 없으므로, URL 파라미터로 전달해야 합니다.
    const redirectUrl = `${shoppingUrl}/products/${link.productId}?partner_ref=${link.partnerId}&link_id=${link.id}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('리다이렉트 오류:', error);
    return NextResponse.redirect(new URL('/404', request.url));
  }
}

