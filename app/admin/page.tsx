'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminHeader from '@/components/admin/AdminHeader';
import Footer from '@/components/common/Footer';
import Link from 'next/link';
import { FaBell, FaUsers, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // 로그인 체크
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    // 관리자 권한 체크
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      alert('관리자 권한이 필요합니다.');
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // 로딩 중
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

  // 권한 없음
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
            <p className="text-gray-600">겟꿀 파트너스 관리 시스템</p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* 전체 파트너 수 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">전체 파트너</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaUsers className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* 이번 달 정산 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">이번 달 정산</p>
                  <p className="text-2xl font-bold text-gray-900">₩12.5M</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaMoneyBillWave className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            {/* 이번 달 주문 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">이번 달 주문</p>
                  <p className="text-2xl font-bold text-gray-900">3,456</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaChartLine className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            {/* 미확인 공지 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">공지사항</p>
                  <p className="text-2xl font-bold text-gray-900">15</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaBell className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* 빠른 메뉴 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 공지사항 관리 */}
            <Link
              href="/admin/notices"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">공지사항 관리</h3>
              <p className="text-sm text-gray-600 mb-4">
                공지사항을 등록, 수정, 삭제할 수 있습니다.
              </p>
              <span className="text-blue-600 text-sm font-medium">바로가기 →</span>
            </Link>

            {/* 파트너 관리 */}
            <Link
              href="/admin/partners"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">파트너 관리</h3>
              <p className="text-sm text-gray-600 mb-4">
                파트너 목록을 조회하고 관리할 수 있습니다.
              </p>
              <span className="text-blue-600 text-sm font-medium">바로가기 →</span>
            </Link>

            {/* 정산 관리 */}
            <Link
              href="/admin/settlements"
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">정산 관리</h3>
              <p className="text-sm text-gray-600 mb-4">
                파트너 정산 내역을 확인하고 관리할 수 있습니다.
              </p>
              <span className="text-blue-600 text-sm font-medium">바로가기 →</span>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

