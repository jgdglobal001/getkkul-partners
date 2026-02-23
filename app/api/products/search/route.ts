import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products as productsTable } from '@/db/schema';
import { eq, or, ilike, sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const perPage = Math.min(60, parseInt(searchParams.get('perPage') || '60'));
    const maxItems = 600; // 최대 600개 (10페이지)

    if ((!query || query.trim() === '') && !category) {
      return NextResponse.json(
        { success: false, error: '검색어를 입력하거나 카테고리를 선택해주세요.' },
        { status: 400 }
      );
    }

    // 검색 조건 구성
    const searchFilter = query && query.trim() !== ''
      ? sql`(
          ${productsTable.title} ILIKE ${`%${query}%`} OR
          ${productsTable.description} ILIKE ${`%${query}%`} OR
          ${productsTable.brand} ILIKE ${`%${query}%`} OR
          ${productsTable.category} ILIKE ${`%${query}%`} OR
          ${query} = ANY(${productsTable.tags})
        )`
      : sql`true`;

    // 카테고리 필터 조건 구성
    const categoryFilter = category
      ? sql`${productsTable.category} = ${category}`
      : sql`true`;

    const whereClause = sql`${productsTable.isActive} = true AND ${searchFilter} AND ${categoryFilter}`;

    // 총 개수 조회
    const countResult = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(productsTable)
      .where(whereClause);

    const totalCount = Math.min(Number(countResult[0].count), maxItems);
    const totalPages = Math.min(Math.ceil(totalCount / perPage), 10);
    const currentPage = Math.min(page, totalPages || 1);
    const offset = (currentPage - 1) * perPage;

    // 데이터베이스에서 상품 검색 (랜덤 정렬 + 페이지네이션)
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
      .where(whereClause)
      .orderBy(sql`RANDOM()`)
      .limit(perPage)
      .offset(offset);

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
        total: totalCount,
        page: currentPage,
        perPage,
        totalPages,
        query: query || '',
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

