'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [settings, setSettings] = useState({
    emailNotification: true,
    smsNotification: false,
    marketingEmail: false,
    marketingSms: false,
  });
  const [saving, setSaving] = useState(false);

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

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // TODO: API 연동
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    alert('설정이 저장되었습니다.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />

      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">환경설정</h1>

          {/* 알림 설정 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">알림 설정</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">이메일 알림</p>
                  <p className="text-sm text-gray-500">정산, 공지사항 등 중요 알림을 이메일로 받습니다.</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotification')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotification ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.emailNotification ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS 알림</p>
                  <p className="text-sm text-gray-500">긴급 공지 및 정산 알림을 SMS로 받습니다.</p>
                </div>
                <button
                  onClick={() => handleToggle('smsNotification')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.smsNotification ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.smsNotification ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* 마케팅 수신 동의 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">마케팅 수신 동의</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">마케팅 이메일</p>
                  <p className="text-sm text-gray-500">프로모션, 이벤트 정보를 이메일로 받습니다.</p>
                </div>
                <button
                  onClick={() => handleToggle('marketingEmail')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.marketingEmail ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.marketingEmail ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">마케팅 SMS</p>
                  <p className="text-sm text-gray-500">프로모션, 이벤트 정보를 SMS로 받습니다.</p>
                </div>
                <button
                  onClick={() => handleToggle('marketingSms')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.marketingSms ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.marketingSms ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-gray-400"
          >
            {saving ? '저장 중...' : '설정 저장'}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

