'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/common/Footer';
import { TermsOfService, OpenApiTerms, OperatingPolicy, PrivacyPolicy } from '@/components/policies/PolicyComponents';

function PoliciesContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'service' | 'openapi' | 'operating' | 'privacy'>('service');

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'service' || tab === 'openapi' || tab === 'operating' || tab === 'privacy') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <main className="flex-1 py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-10 text-center">약관 및 정책</h1>

                    {/* 탭 메뉴 */}
                    <div className="flex flex-wrap border-b border-gray-200 mb-10">
                        <button
                            onClick={() => setActiveTab('service')}
                            className={`px-8 py-4 text-sm font-semibold transition-all ${activeTab === 'service'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            이용약관
                        </button>
                        <button
                            onClick={() => setActiveTab('openapi')}
                            className={`px-8 py-4 text-sm font-semibold transition-all ${activeTab === 'openapi'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            오픈 API 약관
                        </button>
                        <button
                            onClick={() => setActiveTab('operating')}
                            className={`px-8 py-4 text-sm font-semibold transition-all ${activeTab === 'operating'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            운영정책
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`px-8 py-4 text-sm font-semibold transition-all ${activeTab === 'privacy'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-800'
                                }`}
                        >
                            개인정보 처리방침
                        </button>
                    </div>

                    {/* 탭 콘텐츠 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-12 leading-relaxed">
                        {activeTab === 'service' && <TermsOfService />}
                        {activeTab === 'openapi' && <OpenApiTerms />}
                        {activeTab === 'operating' && <OperatingPolicy />}
                        {activeTab === 'privacy' && <PrivacyPolicy />}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function PoliciesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
            <PoliciesContent />
        </Suspense>
    );
}
