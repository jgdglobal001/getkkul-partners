'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminHeader from '@/components/admin/AdminHeader';
import Footer from '@/components/common/Footer';

interface Partner {
  id: string;
  name: string;
  email: string;
  businessName: string;
  businessNumber: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

// 샘플 데이터
const SAMPLE_PARTNERS: Partner[] = [
  {
    id: '1',
    name: '김철수',
    email: 'kim@example.com',
    businessName: '철수상사',
    businessNumber: '123-45-67890',
    status: 'active',
    createdAt: '2025. 01. 15.',
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee@example.com',
    businessName: '영희마켓',
    businessNumber: '234-56-78901',
    status: 'active',
    createdAt: '2025. 02. 20.',
  },
  {
    id: '3',
    name: '박민수',
    email: 'park@example.com',
    businessName: '민수쇼핑',
    businessNumber: '345-67-89012',
    status: 'suspended',
    createdAt: '2025. 03. 10.',
  },
];

export default function AdminPartnersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [partners, setPartners] = useState<Partner[]>(SAMPLE_PARTNERS);

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
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">활성</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">비활성</span>;
      case 'suspended':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">정지</span>;
      default:
        return null;
    }
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">파트너 관리</h1>
            <p className="text-gray-600">등록된 파트너 목록을 조회하고 관리할 수 있습니다.</p>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">전체 파트너</p>
              <p className="text-2xl font-bold text-gray-900">{partners.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">활성 파트너</p>
              <p className="text-2xl font-bold text-green-600">
                {partners.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-1">정지된 파트너</p>
              <p className="text-2xl font-bold text-red-600">
                {partners.filter(p => p.status === 'suspended').length}
              </p>
            </div>
          </div>

          {/* 파트너 테이블 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사업자명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    사업자번호
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가입일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {partner.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {partner.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {partner.businessName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {partner.businessNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(partner.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {partner.createdAt}
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

