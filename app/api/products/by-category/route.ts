import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products as productsTable } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const perCategory = parseInt(searchParams.get('perCategory') || '6');

    // 1) 카테고리별 상품 수를 구해서 상품 많은 순으로 정렬 (빈 카테고리 자동 제외)
    const categoryStats = await db
      .select({
        category: productsTable.category,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(productsTable)
      .where(sql`${productsTable.isActive} = true AND ${productsTable.category} IS NOT NULL AND ${productsTable.category} != ''`)
      .groupBy(productsTable.category)
      .orderBy(sql`COUNT(*) DESC`);

    if (categoryStats.length === 0) {
      return NextResponse.json(
        { success: true, data: [], total: 0 },
        { status: 200 }
      );
    }

    // 2) 각 카테고리별로 상품을 perCategory개씩 가져오기
    const categoryNames = categoryStats.map((c) => c.category);

    // 모든 카테고리의 상품을 한 번에 가져온 뒤 그룹핑 (window function 사용)
    const allProducts = await db
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
        rowNum: sql<number>`ROW_NUMBER() OVER (PARTITION BY ${productsTable.category} ORDER BY RANDOM())`,
      })
      .from(productsTable)
      .where(sql`${productsTable.isActive} = true AND ${productsTable.category} IN (${sql.join(categoryNames.map(n => sql`${n}`), sql`, `)})`)

    // 필터링: rowNum <= perCategory
    const filtered = allProducts.filter((p) => p.rowNum <= perCategory);

    // 3) 카테고리 순서대로 그룹핑
    const result = categoryStats.map((stat) => ({
      category: stat.category,
      totalCount: stat.count,
      products: filtered
        .filter((p) => p.category === stat.category)
        .map(({ rowNum, ...product }) => product),
    }));

    return NextResponse.json(
      {
        success: true,
        data: result,
        total: result.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('카테고리별 상품 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '카테고리별 상품 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

