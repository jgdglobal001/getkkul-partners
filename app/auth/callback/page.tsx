'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkBusinessRegistration = async () => {
      console.log('🔍 [Callback] 상태 확인:', { status, userId: session?.user?.id });

      if (status === 'loading') {
        console.log('⏳ [Callback] 세션 로딩 중...');
        return;
      }

      if (!session?.user?.id) {
        console.log('❌ [Callback] 세션 없음 → /auth로 이동');
        router.push('/auth');
        return;
      }

      try {
        console.log('📡 [Callback] API 호출: /api/business-registration');
        // API에서 사업자 등록 정보 확인
        const response = await fetch('/api/business-registration');
        const result = await response.json();

        console.log('📥 [Callback] API 응답:', result);

        if (result.data && result.data.isCompleted) {
          // 사업자 등록 완료 → 대시보드로 이동
          console.log('✅ [Callback] 사업자 등록 완료 → /dashboard로 이동');
          router.push('/dashboard');
        } else {
          // 사업자 등록 정보가 없으면 1단계로 이동
          console.log('⚠️ [Callback] 사업자 등록 정보 없음 → /auth/business-registration/step1로 이동');
          console.log('📊 [Callback] result.data:', result.data);
          router.push('/auth/business-registration/step1');
        }
      } catch (error) {
        console.error('❌ [Callback] Error checking business registration:', error);
        // 에러 발생 시 1단계로 이동
        router.push('/auth/business-registration/step1');
      }
    };

    checkBusinessRegistration();
  }, [session, status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">처리 중입니다...</p>
      </div>
    </div>
  );
}

