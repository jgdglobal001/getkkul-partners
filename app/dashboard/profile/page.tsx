'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';

interface BusinessInfo {
  businessName: string;
  businessNumber: string;
  representativeName: string;
  businessCategory: string;
  businessType2: string;
  businessAddress: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  platformUrl?: string;
  mobileAppUrl?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessInfo = async () => {
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

          setBusinessInfo(result.data);
        } catch (error) {
          console.error('사업자 정보 조회 실패:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBusinessInfo();
  }, [status, session, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session || !businessInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">내 정보</h1>

          {/* 사용자 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">계정 정보</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">이름:</span>
                <span className="text-gray-900">{session.user.name}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">이메일:</span>
                <span className="text-gray-900">{session.user.email}</span>
              </div>
            </div>
          </div>

          {/* 사업자 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">사업자 정보</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">사업자명:</span>
                <span className="text-gray-900">{businessInfo.businessName}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">사업자번호:</span>
                <span className="text-gray-900">{businessInfo.businessNumber}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">대표자명:</span>
                <span className="text-gray-900">{businessInfo.representativeName}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">업종:</span>
                <span className="text-gray-900">{businessInfo.businessCategory}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">업태:</span>
                <span className="text-gray-900">{businessInfo.businessType2}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">사업장 주소:</span>
                <span className="text-gray-900">{businessInfo.businessAddress}</span>
              </div>
            </div>
          </div>

          {/* 담당자 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">담당자 정보</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">담당자명:</span>
                <span className="text-gray-900">{businessInfo.contactName}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">연락처:</span>
                <span className="text-gray-900">{businessInfo.contactPhone}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">이메일:</span>
                <span className="text-gray-900">{businessInfo.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* 정산 계좌 정보 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">정산 계좌 정보</h2>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">은행명:</span>
                <span className="text-gray-900">{businessInfo.bankName}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">계좌번호:</span>
                <span className="text-gray-900">{businessInfo.accountNumber}</span>
              </div>
              <div className="flex">
                <span className="w-32 text-gray-600 font-medium">예금주:</span>
                <span className="text-gray-900">{businessInfo.accountHolder}</span>
              </div>
            </div>
          </div>

          {/* 플랫폼 정보 */}
          {(businessInfo.platformUrl || businessInfo.mobileAppUrl) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">플랫폼 정보</h2>
              <div className="space-y-3">
                {businessInfo.platformUrl && (
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">플랫폼 URL:</span>
                    <a
                      href={businessInfo.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {businessInfo.platformUrl}
                    </a>
                  </div>
                )}
                {businessInfo.mobileAppUrl && (
                  <div className="flex">
                    <span className="w-32 text-gray-600 font-medium">모바일 앱 URL:</span>
                    <a
                      href={businessInfo.mobileAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {businessInfo.mobileAppUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

