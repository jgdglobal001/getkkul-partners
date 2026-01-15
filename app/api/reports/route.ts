import { db } from '@/db';
import { partnerLinks } from '@/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'edge';

// 커미션 비율 (15%)
const COMMISSION_RATE = 0.15;

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({
      req: request,
      secret: secret,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    if (!token?.sub) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const userId = token.sub;

    // 오늘 날짜 계산 (KST 기준)
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);
    
    // 오늘 시작 (KST 00:00:00)
    const todayStart = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
    todayStart.setTime(todayStart.getTime() - kstOffset); // UTC로 변환
    
    // 이번 달 시작 (KST 1일 00:00:00)
    const monthStart = new Date(kstNow.getFullYear(), kstNow.getMonth(), 1);
    monthStart.setTime(monthStart.getTime() - kstOffset); // UTC로 변환

    // 파트너의 모든 링크 조회 (전체 집계)
    const allLinks = await db
      .select({
        clickCount: sql<number>`COALESCE(SUM(${partnerLinks.clickCount}), 0)`,
        conversionCount: sql<number>`COALESCE(SUM(${partnerLinks.conversionCount}), 0)`,
        revenue: sql<number>`COALESCE(SUM(${partnerLinks.revenue}), 0)`,
      })
      .from(partnerLinks)
      .where(eq(partnerLinks.partnerId, userId));

    // 오늘 생성된 링크의 실적 (일별)
    const todayLinks = await db
      .select({
        clickCount: sql<number>`COALESCE(SUM(${partnerLinks.clickCount}), 0)`,
        conversionCount: sql<number>`COALESCE(SUM(${partnerLinks.conversionCount}), 0)`,
        revenue: sql<number>`COALESCE(SUM(${partnerLinks.revenue}), 0)`,
      })
      .from(partnerLinks)
      .where(
        and(
          eq(partnerLinks.partnerId, userId),
          gte(partnerLinks.updatedAt, todayStart)
        )
      );

    // 이번 달 링크의 실적 (월별)
    const monthlyLinks = await db
      .select({
        clickCount: sql<number>`COALESCE(SUM(${partnerLinks.clickCount}), 0)`,
        conversionCount: sql<number>`COALESCE(SUM(${partnerLinks.conversionCount}), 0)`,
        revenue: sql<number>`COALESCE(SUM(${partnerLinks.revenue}), 0)`,
      })
      .from(partnerLinks)
      .where(
        and(
          eq(partnerLinks.partnerId, userId),
          gte(partnerLinks.updatedAt, monthStart)
        )
      );

    // 결과 계산
    const totalClicks = Number(allLinks[0]?.clickCount || 0);
    const totalConversions = Number(allLinks[0]?.conversionCount || 0);
    const totalRevenue = Number(allLinks[0]?.revenue || 0);

    const dailyClicks = Number(todayLinks[0]?.clickCount || 0);
    const dailyConversions = Number(todayLinks[0]?.conversionCount || 0);
    const dailyRevenue = Number(todayLinks[0]?.revenue || 0);

    const monthlyClicks = Number(monthlyLinks[0]?.clickCount || 0);
    const monthlyConversions = Number(monthlyLinks[0]?.conversionCount || 0);
    const monthlyRevenue = Number(monthlyLinks[0]?.revenue || 0);

    // 전환율 계산 (클릭 대비 구매)
    const dailyConversionRate = dailyClicks > 0 ? (dailyConversions / dailyClicks) * 100 : 0;
    const monthlyConversionRate = monthlyClicks > 0 ? (monthlyConversions / monthlyClicks) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        daily: {
          clicks: dailyClicks,
          purchases: dailyConversions,
          revenue: Math.floor(dailyRevenue / COMMISSION_RATE), // 원래 상품 금액 (환산 금액)
          commission: dailyRevenue, // 커미션 (수익)
          conversionRate: dailyConversionRate,
        },
        monthly: {
          clicks: monthlyClicks,
          purchases: monthlyConversions,
          revenue: Math.floor(monthlyRevenue / COMMISSION_RATE), // 원래 상품 금액 (환산 금액)
          commission: monthlyRevenue, // 커미션 (수익)
          conversionRate: monthlyConversionRate,
        },
        total: {
          clicks: totalClicks,
          purchases: totalConversions,
          revenue: Math.floor(totalRevenue / COMMISSION_RATE),
          commission: totalRevenue,
          conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
        },
        lastUpdate: kstNow.toISOString(),
      },
    });
  } catch (error) {
    console.error('[Reports API] Error:', error);
    return NextResponse.json(
      { error: '리포트 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

