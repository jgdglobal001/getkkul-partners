import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const session = await getServerSession(authConfig);
    
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
    const product = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 짧은 코드 생성 (6자리)
    const shortCode = nanoid(6);

    // DB에 파트너 링크 저장
    const partnerLink = await prisma.partner_links.create({
      data: {
        shortCode,
        partnerId: session.user.id,
        productId,
      },
    });

    // 단축 URL 생성
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3003';
    const shortUrl = `${baseUrl}/p/${shortCode}`;

    // HTML 코드 생성
    const iframeCode = `<iframe src="${baseUrl}/embed/${shortCode}" width="120" height="240" frameborder="0" scrolling="no" referrerpolicy="unsafe-url"></iframe>`;
    
    const imgCode = `<a href="${shortUrl}" target="_blank" referrerpolicy="unsafe-url"><img src="${product.thumbnail}" alt="${product.title}" width="120" height="240"></a>`;

    return NextResponse.json({
      success: true,
      data: {
        id: partnerLink.id,
        shortCode: partnerLink.shortCode,
        shortUrl,
        iframeCode,
        imgCode,
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

