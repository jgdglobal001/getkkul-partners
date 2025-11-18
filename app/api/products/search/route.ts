import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '500'); // 랜덤 500개 제한

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { success: false, error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 데이터베이스에서 상품 검색 (랜덤 정렬)
    // title, description, brand, category, tags에서 검색
    // 검색 결과를 랜덤으로 정렬하여 500개 제한
    const products = await prisma.$queryRaw<any[]>`
      SELECT
        id, title, description, price, "discountPercentage", rating, stock,
        brand, category, thumbnail, images, tags, sku, "availabilityStatus"
      FROM products
      WHERE "isActive" = true
      AND (
        title ILIKE ${`%${query}%`} OR
        description ILIKE ${`%${query}%`} OR
        brand ILIKE ${`%${query}%`} OR
        category ILIKE ${`%${query}%`} OR
        ${query} = ANY(tags)
      )
      ORDER BY RANDOM()
      LIMIT ${limit}
    `;

    // 응답 데이터 포맷팅
    const formattedProducts = products.map((product) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand,
      category: product.category,
      thumbnail: product.thumbnail,
      images: product.images,
      tags: product.tags,
      sku: product.sku,
      availabilityStatus: product.availabilityStatus,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedProducts,
        total: formattedProducts.length,
        query: query,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('상품 검색 오류:', error);
    return NextResponse.json(
      { success: false, error: '상품 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

