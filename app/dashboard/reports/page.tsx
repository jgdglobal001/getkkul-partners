'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer'; // Assuming Footer exists since it was in DashboardPage

export default function ReportsPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [checkingBusiness, setCheckingBusiness] = useState(true);

    // Business check logic similar to DashboardPage
    useEffect(() => {
        const checkAccess = async () => {
            if (status === 'unauthenticated') {
                router.push('/auth/signin');
                return;
            }

            if (status === 'authenticated' && session?.user?.id) {
                // Should usually check business registration here too, but for a "Coming Soon" page, strictly enforcing it might be overkill or good practice. 
                // Let's keep it simple for now, assuming if they can get to dashboard, they can get here.
                // Actually, consistency is better.
                try {
                    const response = await fetch('/api/business-registration');
                    const result = await response.json();
                    if (!result.data || !result.data.isCompleted) {
                        router.push('/auth/business-registration/step1');
                        return;
                    }
                    setCheckingBusiness(false);
                } catch (error) {
                    router.push('/auth/business-registration/step1');
                }
            }
        };
        checkAccess();
    }, [status, session, router]);

    if (status === 'loading' || checkingBusiness) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <DashboardHeader />
            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">리포트</h1>

                    <div className="bg-white rounded-xl shadow-xs p-12 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">서비스 준비중입니다</h2>
                        <p className="text-gray-600">
                            더 나은 서비스를 위해 리포트 기능을 준비하고 있습니다.<br />
                            곧 상세한 수익 분석 리포트를 확인하실 수 있습니다.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
