'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const checkBusinessRegistration = async () => {
      if (status === 'loading') return;

      if (!session?.user?.id) {
        router.push('/auth');
        return;
      }

      try {
        // API에서 사업자 등록 정보 확인
        const response = await fetch('/api/business-registration');
        const result = await response.json();

        if (result.data && result.data.isCompleted) {
          // 사업자 등록 완료 → 대시보드로 이동
          router.push('/dashboard');
        } else {
          // 사업자 등록 정보가 없으면 1단계로 이동
          router.push('/auth/business-registration/step1');
        }
      } catch (error) {
        console.error('Error checking business registration:', error);
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

