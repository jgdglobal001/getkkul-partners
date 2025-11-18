'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SimpleSearchBar from '@/components/dashboard/SimpleSearchBar';
import PromotionBanner from '@/components/dashboard/PromotionBanner';
import ReportSection from '@/components/dashboard/ReportSection';
import Footer from '@/components/common/Footer';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checkingBusiness, setCheckingBusiness] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      // 로그인된 경우 회사정보 확인
      if (status === 'authenticated' && session?.user?.id) {
        try {
          console.log('🔍 [Dashboard] 회사정보 확인 중...');
          const response = await fetch('/api/business-registration');
          const result = await response.json();

          console.log('📥 [Dashboard] API 응답:', result);

          if (!result.data || !result.data.isCompleted) {
            // 회사정보 없음 → step1으로 이동
            console.log('⚠️ [Dashboard] 회사정보 없음 → step1으로 이동');
            router.push('/auth/business-registration/step1');
            return;
          }

          console.log('✅ [Dashboard] 회사정보 확인 완료');
          setCheckingBusiness(false);
        } catch (error) {
          console.error('❌ [Dashboard] 회사정보 확인 오류:', error);
          router.push('/auth/business-registration/step1');
        }
      }
    };

    checkAccess();
  }, [status, session, router]);

  // 로딩 중 또는 회사정보 확인 중
  if (status === 'loading' || checkingBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {status === 'loading' ? '로딩 중...' : '회사정보 확인 중...'}
          </p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <DashboardHeader />

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        {/* 상품검색 섹션 */}
        <SimpleSearchBar />

        {/* 프로모션 배너 */}
        <PromotionBanner />

        {/* 리포트 섹션 */}
        <ReportSection />
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}

