'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminHeader from '@/components/admin/AdminHeader';
import Footer from '@/components/common/Footer';

interface Settlement {
  id: string;
  partnerName: string;
  partnerEmail: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  settlementDate: string;
  conversionCount: number;
}

interface Stats {
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
  partnerCount: number;
}

export default function AdminSettlementsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    completedAmount: 0,
    pendingAmount: 0,
    partnerCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      alert('관리자 권한이 필요합니다.');
      router.push('/dashboard');
      return;
    }

    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchSettlements();
    }
  }, [status, session, router]);

  const fetchSettlements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settlements');
      const result = await response.json();

      if (result.success && result.data) {
        setSettlements(result.data.settlements);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('정산 데이터 로딩 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">완료</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">대기</span>;
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">실패</span>;
      default:
        return null;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">정산 관리</h1>
            <p className="text-gray-600">파트너 정산 내역을 확인하고 관리할 수 있습니다.</p>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">총 정산 금액</p>
              <p className="text-2xl font-bold text-gray-900">{formatAmount(stats.totalAmount)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">완료된 정산</p>
              <p className="text-2xl font-bold text-green-600">{formatAmount(stats.completedAmount)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">대기 중인 정산</p>
              <p className="text-2xl font-bold text-yellow-600">{formatAmount(stats.pendingAmount)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">파트너 수</p>
              <p className="text-2xl font-bold text-blue-600">{stats.partnerCount}명</p>
            </div>
          </div>

          {/* 정산 테이블 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {settlements.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-600">아직 정산할 데이터가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">파트너가 상품을 판매하면 여기에 표시됩니다.</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      파트너명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      구매 건수
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      정산 금액 (커미션 15%)
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      정산 예정일
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {settlements.map((settlement) => (
                    <tr key={settlement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {settlement.partnerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {settlement.partnerEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        {settlement.conversionCount}건
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {formatAmount(settlement.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(settlement.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {settlement.settlementDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* 안내 문구 */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 정산 금액은 파트너가 판매한 상품 가격의 <strong>15%</strong>입니다.
              토스페이먼츠 지급대행 연동 후 자동 정산이 진행됩니다.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

