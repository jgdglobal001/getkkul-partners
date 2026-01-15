'use server';

import { db } from '@/db';
import { partnerLinks, users, businessRegistrations } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { auth } from '@/auth';

interface SettlementData {
  id: string;
  partnerName: string;
  partnerEmail: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  settlementDate: string;
  conversionCount: number;
}

export async function getSettlementsData() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: '인증이 필요합니다.', data: null };
  }

  if (session.user.role !== 'admin') {
    return { error: '관리자 권한이 필요합니다.', data: null };
  }

  try {
    const partnerSettlements = await db
      .select({
        partnerId: partnerLinks.partnerId,
        totalRevenue: sql<number>`COALESCE(SUM(${partnerLinks.revenue}), 0)`,
        totalConversions: sql<number>`COALESCE(SUM(${partnerLinks.conversionCount}), 0)`,
      })
      .from(partnerLinks)
      .groupBy(partnerLinks.partnerId);

    const settlements: SettlementData[] = [];

    for (const ps of partnerSettlements) {
      const [userInfo, bizInfo] = await Promise.all([
        db.select({ name: users.name, email: users.email })
          .from(users).where(eq(users.id, ps.partnerId)).limit(1),
        db.select({ tossStatus: businessRegistrations.tossStatus })
          .from(businessRegistrations).where(eq(businessRegistrations.userId, ps.partnerId)).limit(1),
      ]);

      const user = userInfo[0];
      if (user && Number(ps.totalRevenue) > 0) {
        const now = new Date();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const settlementDate = `${lastDayOfMonth.getFullYear()}. ${lastDayOfMonth.getMonth() + 1}. ${lastDayOfMonth.getDate()}.`;

        settlements.push({
          id: ps.partnerId,
          partnerName: user.name || '이름 없음',
          partnerEmail: user.email,
          amount: Math.floor(Number(ps.totalRevenue)),
          status: 'pending',
          settlementDate,
          conversionCount: Number(ps.totalConversions),
        });
      }
    }

    settlements.sort((a, b) => b.amount - a.amount);

    const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
    const completedAmount = settlements.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0);
    const pendingAmount = settlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + s.amount, 0);

    return {
      error: null,
      data: {
        settlements,
        stats: { totalAmount, completedAmount, pendingAmount, partnerCount: settlements.length },
      },
    };
  } catch (error) {
    console.error('[Settlements Action] Error:', error);
    return { error: '정산 데이터를 가져오는 중 오류가 발생했습니다.', data: null };
  }
}

