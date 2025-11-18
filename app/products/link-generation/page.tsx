'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';

function LinkGenerationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

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
        <div className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 제목 */}
            <h1 className="text-3xl font-bold text-center mb-4">링크 생성</h1>
          
          {/* 단계 안내 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-4">
              {/* 1단계 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg mb-2">
                  ✓
                </div>
                <p className="text-sm font-medium text-gray-700">상품 탐색</p>
              </div>

              {/* 화살표 */}
              <div className="text-gray-400 text-2xl">→</div>

              {/* 2단계 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-lg mb-2">
                  ✓
                </div>
                <p className="text-sm font-medium text-gray-700">마음에 드는 상품 선택</p>
              </div>

              {/* 화살표 */}
              <div className="text-gray-400 text-2xl">→</div>

              {/* 3단계 */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg mb-2">
                  3
                </div>
                <p className="text-sm font-medium text-blue-600">URL 혹은 배너 만들기</p>
              </div>
            </div>
          </div>

          {/* 링크 생성 폼 (나중에 구현) */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🔗</div>
            <p className="text-xl font-semibold text-gray-700 mb-2">링크 생성 페이지</p>
            <p className="text-gray-500">곧 구현될 예정입니다!</p>
          </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}

export default function LinkGenerationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <LinkGenerationContent />
    </Suspense>
  );
}

