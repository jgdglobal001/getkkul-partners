import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products as productsTable } from '@/db/schema';
import { asc, sql } from 'drizzle-orm';

export const runtime = 'edge';

// action=categories: 카테고리 목록 조회
async function handleCategories() {
  const distinctCategories = await db
    .selectDistinct({ category: productsTable.category })
    .from(productsTable)
    .where(sql`${productsTable.isActive} = true AND ${productsTable.category} IS NOT NULL AND ${productsTable.category} != ''`)
    .orderBy(asc(productsTable.category));

  const formattedCategories = distinctCategories.map((item, index) => ({
    id: `cat-${index}`,
    name: item.category,
    slug: item.category.toLowerCase().replace(/\s+/g, '-'),
    parentId: null,
  }));

  return NextResponse.json(
    { success: true, data: formattedCategories, total: formattedCategories.length },
    { status: 200 }
  );
}

// action=by-category: 카테고리별 상품 조회
async function handleByCategory(request: NextRequest) {
  const perCategory = parseInt(request.nextUrl.searchParams.get('perCategory') || '6');

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
    return NextResponse.json({ success: true, data: [], total: 0 }, { status: 200 });
  }

  const categoryNames = categoryStats.map((c) => c.category);

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

  const filtered = allProducts.filter((p) => p.rowNum <= perCategory);

  const result = categoryStats.map((stat) => ({
    category: stat.category,
    totalCount: stat.count,
    products: filtered
      .filter((p) => p.category === stat.category)
      .map(({ rowNum, ...product }) => product),
  }));

  return NextResponse.json(
    { success: true, data: result, total: result.length },
    { status: 200 }
  );
}

// 기본: 상품 검색
async function handleSearch(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const category = searchParams.get('category');
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = Math.min(60, parseInt(searchParams.get('perPage') || '60'));
  const maxItems = 600;

  if ((!query || query.trim() === '') && !category) {
    return NextResponse.json(
      { success: false, error: '검색어를 입력하거나 카테고리를 선택해주세요.' },
      { status: 400 }
    );
  }

  const searchFilter = query && query.trim() !== ''
    ? sql`(
        ${productsTable.title} ILIKE ${`%${query}%`} OR
        ${productsTable.description} ILIKE ${`%${query}%`} OR
        ${productsTable.brand} ILIKE ${`%${query}%`} OR
        ${productsTable.category} ILIKE ${`%${query}%`} OR
        ${query} = ANY(${productsTable.tags})
      )`
    : sql`true`;

  const categoryFilter = category
    ? sql`${productsTable.category} = ${category}`
    : sql`true`;

  const whereClause = sql`${productsTable.isActive} = true AND ${searchFilter} AND ${categoryFilter}`;

  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(productsTable)
    .where(whereClause);

  const totalCount = Math.min(Number(countResult[0].count), maxItems);
  const totalPages = Math.min(Math.ceil(totalCount / perPage), 10);
  const currentPage = Math.min(page, totalPages || 1);
  const offset = (currentPage - 1) * perPage;

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

  return NextResponse.json(
    {
      success: true,
      data: products,
      total: totalCount,
      page: currentPage,
      perPage,
      totalPages,
      query: query || '',
    },
    { status: 200 }
  );
}

export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'categories') {
      return await handleCategories();
    }
    if (action === 'by-category') {
      return await handleByCategory(request);
    }
    return await handleSearch(request);
  } catch (error) {
    console.error('상품 API 오류:', error);
    return NextResponse.json(
      { success: false, error: '상품 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

