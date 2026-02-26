'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';

interface ReportData {
  clicks: number;
  purchases: number;
  revenue: number;
  commission: number;
  conversionRate: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checkingBusiness, setCheckingBusiness] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyReport, setDailyReport] = useState<ReportData | null>(null);
  const [monthlyReport, setMonthlyReport] = useState<ReportData | null>(null);
  const [totalReport, setTotalReport] = useState<ReportData | null>(null);
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch('/api/business-registration');
          const result = await response.json();
          if (!result.data || !result.data.isCompleted) {
            router.push('/auth/business-registration/step1');
            return;
          }
          setCheckingBusiness(false);
          fetchReportData();
        } catch {
          router.push('/auth/business-registration/step1');
        }
      }
    };
    checkAccess();
  }, [status, session, router]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/reports');
      const result = await response.json();

      if (result.success && result.data) {
        setDailyReport(result.data.daily);
        setMonthlyReport(result.data.monthly);
        setTotalReport(result.data.total);
        const updateTime = new Date(result.data.lastUpdate);
        setLastUpdate(`${updateTime.getFullYear()}.${String(updateTime.getMonth() + 1).padStart(2, '0')}.${String(updateTime.getDate()).padStart(2, '0')} ${String(updateTime.getHours()).padStart(2, '0')}:${String(updateTime.getMinutes()).padStart(2, '0')}`);
      }
    } catch (error) {
      console.error('리포트 데이터 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || checkingBusiness) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const ReportCard = ({ title, data }: { title: string; data: ReportData | null }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : data ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">클릭</span>
            <span className="text-xl font-bold">{data.clicks.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">구매 건수</span>
            <span className="text-xl font-bold">{data.purchases.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">환산 금액</span>
            <span className="text-xl font-bold">₩{data.revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">수익 (커미션 15%)</span>
            <span className="text-xl font-bold text-green-600">₩{data.commission.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">전환율</span>
            <span className="text-xl font-bold">{data.conversionRate.toFixed(2)}%</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">데이터가 없습니다</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">리포트</h1>
            <div className="text-sm text-gray-500">
              마지막 업데이트: {lastUpdate || '-'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportCard title="📅 오늘 실적" data={dailyReport} />
            <ReportCard title="📆 이번 달 실적" data={monthlyReport} />
            <ReportCard title="📊 전체 실적" data={totalReport} />
          </div>

          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">💡 수익 안내</h3>
            <p className="text-blue-800">
              파트너 커미션은 상품 판매가의 <strong>15%</strong>입니다.<br />
              환산 금액은 고객이 구매한 상품의 총 금액이며, 수익은 실제로 받게 되는 커미션입니다.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
