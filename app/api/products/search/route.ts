import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products as productsTable } from '@/db/schema';
import { eq, or, ilike, sql } from 'drizzle-orm';

export const runtime = 'edge';

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
    const products = await db
      .select({
        id: productsTable.id,
        title: productsTable.title,
        description: productsTable.description,
        price: productsTable.price,
        discountPercentage: productsTable.discountPercentage,
        rating: productsTable.rating,
        stock: productsTable.stock,
        brand: productsTable.brand,
        category: productsTable.category,
        thumbnail: productsTable.thumbnail,
        images: productsTable.images,
        tags: productsTable.tags,
        sku: productsTable.sku,
        availabilityStatus: productsTable.availabilityStatus,
      })
      .from(productsTable)
      .where(
        sql`${productsTable.isActive} = true AND (
          ${productsTable.title} ILIKE ${`%${query}%`} OR
          ${productsTable.description} ILIKE ${`%${query}%`} OR
          ${productsTable.brand} ILIKE ${`%${query}%`} OR
          ${productsTable.category} ILIKE ${`%${query}%`} OR
          ${query} = ANY(${productsTable.tags})
        )`
      )
      .orderBy(sql`RANDOM()`)
      .limit(limit);

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

