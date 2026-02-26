import { NextRequest, NextResponse } from 'next/server';
import { getEdgeSession } from '@/lib/auth/edge-auth';
import { db } from '@/db';
import { products, partnerLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getEdgeSession(request);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: '상품 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 상품 존재 확인
    const productResults = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);
    const product = productResults[0];

    if (!product) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 짧은 코드 생성 (6자리)
    const shortCode = nanoid(6);

    // DB에 파트너 링크 저장
    const partnerLinkResults = await db
      .insert(partnerLinks)
      .values({
        shortCode,
        partnerId: session.user.id,
        productId,
      })
      .returning();
    const partnerLink = partnerLinkResults[0];

    // 단축 URL 생성
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';
    const shortUrl = `${baseUrl}/p/${shortCode}`;

    // HTML 코드 생성 (2가지 버전)
    // 일반태그 (iframe) - 보더라인 체크 시 (기본값)
    const iframeCode = `<iframe src="${baseUrl}/embed/${shortCode}" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url"></iframe>`;

    // 일반태그 (iframe) - 보더라인 해제 시
    const iframeCodeNoBorder = `<iframe src="${baseUrl}/embed/${shortCode}?border=0" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url"></iframe>`;

    // 블로그용 태그 (img) - 보더라인 체크 시 (테두리 없음)
    const imgCode = `<a href="${shortUrl}" target="_blank" referrerpolicy="unsafe-url"><img src="${product.thumbnail}" alt="${product.title}" width="120" height="240"></a>`;

    // 블로그용 태그 (img) - 보더라인 해제 시 (테두리 있음)
    const imgCodeWithBorder = `<a href="${shortUrl}" target="_blank" referrerpolicy="unsafe-url"><img src="${product.thumbnail}" alt="${product.title}" width="120" height="240" style="border: 1px solid #ddd;"></a>`;

    return NextResponse.json({
      success: true,
      data: {
        id: partnerLink.id,
        shortCode: partnerLink.shortCode,
        shortUrl,
        iframeCode,
        iframeCodeNoBorder,
        imgCode,
        imgCodeWithBorder,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
        },
      },
    });
  } catch (error) {
    console.error('링크 생성 오류:', error);
    return NextResponse.json(
      { error: '링크 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

