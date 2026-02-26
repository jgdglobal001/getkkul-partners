import { db } from '@/db';
import { partnerLinks } from '@/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'edge';

const COMMISSION_RATE = 0.15;

export async function GET(request: NextRequest) {
  try {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({
      req: request,
      secret: secret,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    if (!token?.sub) {
      return NextResponse.json({ success: false, error: '인증이 필요합니다.' }, { status: 401 });
    }

    const userId = token.sub;

    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstNow = new Date(now.getTime() + kstOffset);

    const todayStart = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
    todayStart.setTime(todayStart.getTime() - kstOffset);

    const monthStart = new Date(kstNow.getFullYear(), kstNow.getMonth(), 1);
    monthStart.setTime(monthStart.getTime() - kstOffset);

    const [allLinks, todayLinks, monthlyLinks] = await Promise.all([
      db.select({
        clickCount: sql<number>`COALESCE(SUM(${partnerLinks.clickCount}), 0)`,
        conversionCount: sql<number>`COALESCE(SUM(${partnerLinks.conversionCount}), 0)`,
        revenue: sql<number>`COALESCE(SUM(${partnerLinks.revenue}), 0)`,
      }).from(partnerLinks).where(eq(partnerLinks.partnerId, userId)),

      db.select({
        clickCount: sql<number>`COALESCE(SUM(${partnerLinks.clickCount}), 0)`,
        conversionCount: sql<number>`COALESCE(SUM(${partnerLinks.conversionCount}), 0)`,
        revenue: sql<number>`COALESCE(SUM(${partnerLinks.revenue}), 0)`,
      }).from(partnerLinks).where(and(eq(partnerLinks.partnerId, userId), gte(partnerLinks.updatedAt, todayStart))),

      db.select({
        clickCount: sql<number>`COALESCE(SUM(${partnerLinks.clickCount}), 0)`,
        conversionCount: sql<number>`COALESCE(SUM(${partnerLinks.conversionCount}), 0)`,
        revenue: sql<number>`COALESCE(SUM(${partnerLinks.revenue}), 0)`,
      }).from(partnerLinks).where(and(eq(partnerLinks.partnerId, userId), gte(partnerLinks.updatedAt, monthStart))),
    ]);

    const totalClicks = Number(allLinks[0]?.clickCount || 0);
    const totalConversions = Number(allLinks[0]?.conversionCount || 0);
    const totalRevenue = Number(allLinks[0]?.revenue || 0);
    const dailyClicks = Number(todayLinks[0]?.clickCount || 0);
    const dailyConversions = Number(todayLinks[0]?.conversionCount || 0);
    const dailyRevenue = Number(todayLinks[0]?.revenue || 0);
    const monthlyClicks = Number(monthlyLinks[0]?.clickCount || 0);
    const monthlyConversions = Number(monthlyLinks[0]?.conversionCount || 0);
    const monthlyRevenue = Number(monthlyLinks[0]?.revenue || 0);

    return NextResponse.json({
      success: true,
      data: {
        daily: {
          clicks: dailyClicks,
          purchases: dailyConversions,
          revenue: Math.floor(dailyRevenue / COMMISSION_RATE),
          commission: dailyRevenue,
          conversionRate: dailyClicks > 0 ? (dailyConversions / dailyClicks) * 100 : 0,
        },
        monthly: {
          clicks: monthlyClicks,
          purchases: monthlyConversions,
          revenue: Math.floor(monthlyRevenue / COMMISSION_RATE),
          commission: monthlyRevenue,
          conversionRate: monthlyClicks > 0 ? (monthlyConversions / monthlyClicks) * 100 : 0,
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
    console.error('[API Reports] Error:', error);
    return NextResponse.json(
      { success: false, error: '리포트 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

