'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SimpleSearchBar from '@/components/dashboard/SimpleSearchBar';
import PromotionBanner from '@/components/dashboard/PromotionBanner';
import ReportSection from '@/components/dashboard/ReportSection';
import KycStatusBanner from '@/components/dashboard/KycStatusBanner';
import Footer from '@/components/common/Footer';
import { safeFetchJson } from '@/lib/safe-fetch';

type BusinessRegistrationStatusResponse = {
  tossStatus?: string;
  sellerId?: string;
  businessType?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  message?: string;
  fromDB?: boolean;
};

type BusinessRegistrationDataResponse = {
  data?: {
    isCompleted?: boolean | null;
    tossStatus?: string | null;
  } | null;
  message?: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [checkingBusiness, setCheckingBusiness] = useState(true);
  const [tossStatus, setTossStatus] = useState<string | null>(null);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  // 토스 상태 수동 새로고침 (헤더/배너에서 호출)
  const refreshTossStatus = useCallback(async () => {
    setRefreshingStatus(true);
    const { ok, data } = await safeFetchJson<BusinessRegistrationStatusResponse>('/api/business-registration?action=check-status');
    if (ok && data?.tossStatus) {
      setTossStatus(data.tossStatus);
      console.log('🔄 [Dashboard] 토스 상태 갱신:', data.tossStatus);
    }
    setRefreshingStatus(false);
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      if (status === 'authenticated' && session?.user?.id) {
        console.log('🔍 [Dashboard] 회사정보 확인 중...');
        const { ok, data: result } = await safeFetchJson<BusinessRegistrationDataResponse>('/api/business-registration');

        if (!ok || !result?.data || !result.data.isCompleted) {
          console.log('⚠️ [Dashboard] 회사정보 없음 → step1으로 이동');
          router.push('/auth/business-registration/step1');
          return;
        }

        // 토스페이먼츠 셀러 상태 확인 — APPROVAL_REQUIRED면 대시보드 차단
        const dbTossStatus = result.data.tossStatus;
        if (dbTossStatus === 'APPROVAL_REQUIRED') {
          console.log('⚠️ [Dashboard] 토스 본인인증 미완료 → 가입완료 페이지로 이동');
          router.push('/auth/business-registration/complete');
          return;
        }

        // DB 상태를 먼저 세팅
        setTossStatus(dbTossStatus || null);

        // APPROVED가 아닌 경우 백그라운드로 토스 API 직접 조회하여 최신 상태 확인
        if (dbTossStatus && dbTossStatus !== 'APPROVED') {
          console.log('🔄 [Dashboard] 토스 최신 상태 백그라운드 확인 중...');
          safeFetchJson<BusinessRegistrationStatusResponse>('/api/business-registration?action=check-status')
            .then(({ ok, data }) => {
              if (ok && data?.tossStatus) {
                setTossStatus(data.tossStatus);
                console.log('✅ [Dashboard] 토스 최신 상태:', data.tossStatus);
                if (data.tossStatus === 'APPROVAL_REQUIRED') {
                  router.push('/auth/business-registration/complete');
                }
              }
            });
        }

        console.log('✅ [Dashboard] 회사정보 확인 완료, tossStatus:', dbTossStatus);
        setCheckingBusiness(false);
      }
    };

    checkAccess();
  }, [status, session, router]);

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

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 — tossStatus 전달 */}
      <DashboardHeader tossStatus={tossStatus} onRefreshStatus={refreshTossStatus} refreshing={refreshingStatus} />

      {/* KYC 상태 배너 — 지급불가 상태일 때만 표시 */}
      <KycStatusBanner tossStatus={tossStatus} onRefresh={refreshTossStatus} refreshing={refreshingStatus} />

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <SimpleSearchBar />
        <PromotionBanner />
        <ReportSection />
      </main>

      <Footer />
    </div>
  );
}

