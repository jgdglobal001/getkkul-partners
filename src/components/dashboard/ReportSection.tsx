'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReportsData } from '@/actions/reports';

interface ReportData {
  clicks: number;
  purchases: number;
  revenue: number;
  commission: number;
  conversionRate: number;
}

export default function ReportSection() {
  const [dailyReport, setDailyReport] = useState<ReportData>({
    clicks: 0,
    purchases: 0,
    revenue: 0,
    commission: 0,
    conversionRate: 0,
  });

  const [monthlyReport, setMonthlyReport] = useState<ReportData>({
    clicks: 0,
    purchases: 0,
    revenue: 0,
    commission: 0,
    conversionRate: 0,
  });

  const [lastUpdate, setLastUpdate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        const result = await getReportsData();

        if (!result.error && result.data) {
          setDailyReport(result.data.daily);
          setMonthlyReport(result.data.monthly);

          // 마지막 업데이트 시간 포맷팅
          const updateTime = new Date(result.data.lastUpdate);
          const formattedDate = `${updateTime.getFullYear()}.${String(updateTime.getMonth() + 1).padStart(2, '0')}.${String(updateTime.getDate()).padStart(2, '0')}`;
          setLastUpdate(formattedDate);
        } else {
          // 실패 시 기본 날짜 설정
          const now = new Date();
          const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
          setLastUpdate(formattedDate);
        }
      } catch (error) {
        console.error('리포트 데이터 로딩 실패:', error);
        // 에러 시 기본 날짜 설정
        const now = new Date();
        const formattedDate = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
        setLastUpdate(formattedDate);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">기간별 리포트</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 일별 실적 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-6">일별 실적</h3>

            {/* 지표 */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">클릭</div>
                <div className="text-xl font-bold">{dailyReport.clicks}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">구매 건수</div>
                <div className="text-xl font-bold">{dailyReport.purchases}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">환산 금액</div>
                <div className="text-xl font-bold">₩{dailyReport.revenue.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">수익</div>
                <div className="text-xl font-bold">₩{dailyReport.commission.toLocaleString()}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-1">전환율</div>
                <div className="text-xl font-bold">{dailyReport.conversionRate.toFixed(2)}%</div>
              </div>
            </div>

            {/* 차트 영역 */}
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
              {isLoading ? (
                <div className="text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  <div className="text-sm">데이터 로딩 중...</div>
                </div>
              ) : dailyReport.clicks > 0 || dailyReport.purchases > 0 ? (
                <div className="text-center text-green-600">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-sm font-medium">오늘 클릭 {dailyReport.clicks}회, 구매 {dailyReport.purchases}건</div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-sm mb-2">데이터가 없습니다</div>
                  <div className="text-xs">활동을 시작하면 차트가 표시됩니다</div>
                </div>
              )}
            </div>
          </div>

          {/* 이번 달 집계 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">이번 달 집계</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>ⓘ</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 mb-4">
              최근 업데이트: {lastUpdate}
            </div>

            {/* 지표 */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">클릭</span>
                <span className="text-lg font-bold">{monthlyReport.clicks}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">구매 건수</span>
                <span className="text-lg font-bold">{monthlyReport.purchases}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">환산 금액</span>
                <span className="text-lg font-bold">₩{monthlyReport.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">수익</span>
                <span className="text-lg font-bold">₩{monthlyReport.commission.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">전환율</span>
                <span className="text-lg font-bold">{monthlyReport.conversionRate.toFixed(2)}%</span>
              </div>
            </div>

            {/* 전체 보고서 보기 링크 */}
            <div className="mt-6 text-center">
              <Link href="/dashboard/reports" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                전체 보고서 보기 &gt;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

