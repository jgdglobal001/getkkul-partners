import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params;

    // DB에서 링크 조회
    const link = await prisma.partner_links.findUnique({
      where: { shortCode },
      include: { products: true },
    });

    if (!link) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // 클릭 수 증가
    await prisma.partner_links.update({
      where: { shortCode },
      data: { clickCount: { increment: 1 } },
    });

    // 쿠키에 파트너 ID 저장 (추적용, 30일 유효)
    const cookieStore = cookies();
    cookieStore.set('partner_ref', link.partnerId, {
      maxAge: 60 * 60 * 24 * 30, // 30일
      httpOnly: true,
      sameSite: 'lax',
    });

    // 겟꿀 쇼핑 상품 페이지로 리다이렉트
    const shoppingUrl = process.env.NEXT_PUBLIC_GETKKUL_SHOPPING_URL || 'http://localhost:3002';
    const redirectUrl = `${shoppingUrl}/products/${link.productId}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('리다이렉트 오류:', error);
    return NextResponse.redirect(new URL('/404', request.url));
  }
}

