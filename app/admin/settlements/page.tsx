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
}

// 샘플 데이터
const SAMPLE_SETTLEMENTS: Settlement[] = [
  {
    id: '1',
    partnerName: '김철수',
    partnerEmail: 'kim@example.com',
    amount: 1250000,
    status: 'completed',
    settlementDate: '2025. 10. 31.',
  },
  {
    id: '2',
    partnerName: '이영희',
    partnerEmail: 'lee@example.com',
    amount: 850000,
    status: 'completed',
    settlementDate: '2025. 10. 31.',
  },
  {
    id: '3',
    partnerName: '박민수',
    partnerEmail: 'park@example.com',
    amount: 450000,
    status: 'pending',
    settlementDate: '2025. 11. 30.',
  },
];

export default function AdminSettlementsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [settlements, setSettlements] = useState<Settlement[]>(SAMPLE_SETTLEMENTS);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      alert('관리자 권한이 필요합니다.');
      router.push('/dashboard');
    }
  }, [status, session, router]);

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

  const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
  const completedAmount = settlements
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + s.amount, 0);
  const pendingAmount = settlements
    .filter(s => s.status === 'pending')
    .reduce((sum, s) => sum + s.amount, 0);

  if (status === 'loading') {
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">총 정산 금액</p>
              <p className="text-2xl font-bold text-gray-900">{formatAmount(totalAmount)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">완료된 정산</p>
              <p className="text-2xl font-bold text-green-600">{formatAmount(completedAmount)}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">대기 중인 정산</p>
              <p className="text-2xl font-bold text-yellow-600">{formatAmount(pendingAmount)}</p>
            </div>
          </div>

          {/* 정산 테이블 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    파트너명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    정산 금액
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    정산일
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

