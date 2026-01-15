import { db } from '@/db';
import { partnerLinks, users, businessRegistrations } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export const runtime = 'edge';

interface SettlementData {
  id: string;
  partnerName: string;
  partnerEmail: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  settlementDate: string;
  conversionCount: number;
}

export async function GET(request: NextRequest) {
  try {
    // 인증 확인 (관리자만 접근 가능)
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    const token = await getToken({
      req: request,
      secret: secret,
      secureCookie: process.env.NODE_ENV === 'production'
    });

    if (!token?.sub) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    // 관리자 권한 확인
    if (token.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    // 파트너별 정산 데이터 조회 (partner_links 집계)
    const partnerSettlements = await db
      .select({
        partnerId: partnerLinks.partnerId,
        totalRevenue: sql<number>`COALESCE(SUM(${partnerLinks.revenue}), 0)`,
        totalConversions: sql<number>`COALESCE(SUM(${partnerLinks.conversionCount}), 0)`,
      })
      .from(partnerLinks)
      .groupBy(partnerLinks.partnerId);

    // 파트너 정보 조회
    const settlements: SettlementData[] = [];

    for (const ps of partnerSettlements) {
      // 사용자 정보 조회
      const userInfo = await db
        .select({
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.id, ps.partnerId))
        .limit(1);

      // 사업자 등록 정보 조회 (토스 지급대행 상태)
      const bizInfo = await db
        .select({
          tossStatus: businessRegistrations.tossStatus,
        })
        .from(businessRegistrations)
        .where(eq(businessRegistrations.userId, ps.partnerId))
        .limit(1);

      const user = userInfo[0];
      const biz = bizInfo[0];

      if (user && Number(ps.totalRevenue) > 0) {
        // 정산 상태 결정
        // - tossStatus가 COMPLETED면 지급대행 가능 → pending
        // - 아직 지급대행 API 연동 전이므로 모두 pending
        let status: 'pending' | 'completed' | 'failed' = 'pending';

        // 이번 달 마지막 날을 정산 예정일로
        const now = new Date();
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const settlementDate = `${lastDayOfMonth.getFullYear()}. ${lastDayOfMonth.getMonth() + 1}. ${lastDayOfMonth.getDate()}.`;

        settlements.push({
          id: ps.partnerId,
          partnerName: user.name || '이름 없음',
          partnerEmail: user.email,
          amount: Math.floor(Number(ps.totalRevenue)),
          status: status,
          settlementDate: settlementDate,
          conversionCount: Number(ps.totalConversions),
        });
      }
    }

    // 금액 높은 순으로 정렬
    settlements.sort((a, b) => b.amount - a.amount);

    // 통계 계산
    const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
    const completedAmount = settlements
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.amount, 0);
    const pendingAmount = settlements
      .filter(s => s.status === 'pending')
      .reduce((sum, s) => sum + s.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        settlements,
        stats: {
          totalAmount,
          completedAmount,
          pendingAmount,
          partnerCount: settlements.length,
        },
      },
    });
  } catch (error) {
    console.error('[Settlements API] Error:', error);
    return NextResponse.json(
      { error: '정산 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

