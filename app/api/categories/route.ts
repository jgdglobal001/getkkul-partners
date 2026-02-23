import { NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { asc, sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
  try {
    // products 테이블에서 고유 카테고리 추출 (활성 상품 기준)
    const distinctCategories = await db
      .selectDistinct({ category: products.category })
      .from(products)
      .where(sql`${products.isActive} = true AND ${products.category} IS NOT NULL AND ${products.category} != ''`)
      .orderBy(asc(products.category));

    const formattedCategories = distinctCategories.map((item, index) => ({
      id: `cat-${index}`,
      name: item.category,
      slug: item.category.toLowerCase().replace(/\s+/g, '-'),
      parentId: null,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedCategories,
        total: formattedCategories.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('카테고리 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '카테고리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

