'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';
import { TermsOfService, OpenApiTerms, OperatingPolicy, PrivacyPolicy } from '@/components/policies/PolicyComponents';

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'openapi' | 'policy' | 'privacy'>('terms');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">약관 및 정책</h1>

          {/* 탭 메뉴 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('terms')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${activeTab === 'terms'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                이용약관
              </button>
              <button
                onClick={() => setActiveTab('openapi')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${activeTab === 'openapi'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                오픈 API 약관
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${activeTab === 'policy'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                운영정책
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${activeTab === 'privacy'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                개인정보 처리방침
              </button>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="p-8">
              {activeTab === 'terms' && <TermsOfService />}
              {activeTab === 'openapi' && <OpenApiTerms />}
              {activeTab === 'policy' && <OperatingPolicy />}
              {activeTab === 'privacy' && <PrivacyPolicy />}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
