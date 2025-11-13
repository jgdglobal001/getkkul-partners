'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Step3Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    platformUrl: '',
    mobileAppUrl: '',
    agreeTerms: false,
  });
  const [platformUrls, setPlatformUrls] = useState<string[]>([]);
  const [mobileAppUrls, setMobileAppUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddPlatformUrl = () => {
    if (formData.platformUrl.trim()) {
      setPlatformUrls(prev => [...prev, formData.platformUrl]);
      setFormData(prev => ({ ...prev, platformUrl: '' }));
    }
  };

  const handleAddMobileAppUrl = () => {
    if (formData.mobileAppUrl.trim()) {
      setMobileAppUrls(prev => [...prev, formData.mobileAppUrl]);
      setFormData(prev => ({ ...prev, mobileAppUrl: '' }));
    }
  };

  const handleRemovePlatformUrl = (index: number) => {
    setPlatformUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveMobileAppUrl = (index: number) => {
    setMobileAppUrls(prev => prev.filter((_, i) => i !== index));
  };

  // 다음 버튼 활성화 조건: URL 최소 1개 + 체크박스 체크
  const isNextButtonEnabled = (platformUrls.length + mobileAppUrls.length >= 1) && formData.agreeTerms;

  const handlePrev = () => {
    router.push('/auth/business-registration/step2');
  };

  const handleNext = async () => {
    if (!isNextButtonEnabled) {
      alert('플랫폼 또는 모바일 앱 URL을 최소 1개 추가하고, 최종 승인에 동의해주세요.');
      return;
    }

    try {
      // 세션 스토리지에서 모든 데이터 가져오기
      const businessType = sessionStorage.getItem('businessType');
      const agreements = JSON.parse(sessionStorage.getItem('agreements') || '{}');
      const step2Data = JSON.parse(sessionStorage.getItem('step2Data') || '{}');

      // API에 데이터 전송
      const response = await fetch('/api/business-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessType,
          ...step2Data,
          platformUrls,
          mobileAppUrls,
          agreements,
        }),
      });

      if (!response.ok) {
        throw new Error('사업자 등록 정보 저장 실패');
      }

      // 사업자명을 sessionStorage에 저장 (완료 페이지에서 사용)
      if (step2Data.businessName) {
        sessionStorage.setItem('businessName', step2Data.businessName);
      }

      // 세션 스토리지 정리
      sessionStorage.removeItem('businessType');
      sessionStorage.removeItem('agreements');
      sessionStorage.removeItem('step2Data');

      // 완료 페이지로 이동
      router.push('/auth/business-registration/complete');
    } catch (error) {
      console.error('Error:', error);
      alert('사업자 등록 정보 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/겟꿀파트너스 로고(직원).png"
              alt="겟꿀 파트너스"
              width={224}
              height={56}
              className="w-40 h-auto"
            />
          </Link>
          <span className="text-sm text-gray-600">{session?.user?.email}</span>
        </div>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* 제목 */}
          <h1 className="text-center text-3xl font-bold mb-8">겟꿀 파트너스 가입</h1>

          {/* 진행도 */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg">1</div>
            <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg">2</div>
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">3</div>
          </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4">겟꿀 파트너스 링크나 배너를 계시할 본인의 블로그나 웹 사이트 또는 모바일 앱 정보를 모두 입력하신 후 추가해 주세요.</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 space-y-2">
              <p className="text-sm text-blue-900">✓ 블로그 주소나 웹사이트 또는 모바일 앱 목록은 둘 중에 하나만 기입하셔도 됩니다.</p>
              <p className="text-sm text-blue-900">✓ 기입 가능한 웹사이트에는 SNS 페이지와 유튜브 채널 주소도 포함됩니다.</p>
            </div>
          </div>

          {/* 플랫폼 URL */}
          <div>
            <label className="block text-sm font-bold mb-2">플랫폼 URL *</label>
            <div className="flex gap-2">
              <input
                type="url"
                name="platformUrl"
                value={formData.platformUrl}
                onChange={handleInputChange}
                placeholder="https://"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddPlatformUrl}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                추가하기
              </button>
            </div>
            {platformUrls.length > 0 && (
              <div className="mt-3 space-y-2">
                {platformUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-700 truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePlatformUrl(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 모바일 앱 URL */}
          <div>
            <label className="block text-sm font-bold mb-2">모바일 앱 URL *</label>
            <div className="flex gap-2">
              <input
                type="url"
                name="mobileAppUrl"
                value={formData.mobileAppUrl}
                onChange={handleInputChange}
                placeholder="플레이 스토어 또는 앱 스토어에서 앱스토어의 앱 URL을 입력해주세요"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddMobileAppUrl}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                추가하기
              </button>
            </div>
            {mobileAppUrls.length > 0 && (
              <div className="mt-3 space-y-2">
                {mobileAppUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-700 truncate">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMobileAppUrl(index)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium ml-2"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 최종 승인 여부 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-700">
                최종 승인을 위하여 활동하시는 페이지에 게시된 파트너스 링크나 배너를 확인할 수<br />
                있도록 스크린 샷을 등록해주세요.
              </p>
              <p className="text-sm text-gray-700">
                스크린 샷은 가입 완료 후 마이페이지에서 등록하실 수 있습니다.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="w-4 h-4 mt-1"
              />
              <span className="text-sm">네, 확인했습니다.</span>
            </label>

            <a href="#" className="text-blue-500 text-sm hover:underline">예시보기 &gt;</a>
          </div>

          {/* 안내 문구 */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 space-y-3">
            <p className="text-xs text-gray-700">
              등록하지 않은 채널에서 광고 활동을 하면 부정행위로 간주될 수 있으며, 이로 인해 불이익을 받으시는 일이 없으시길 바랍니다. 가입 후에도 마이페이지 안에 계정관리에서 블로그 그 사이트 주소, 앱 목록을 추가할 수 있습니다.
            </p>
            <p className="text-xs text-gray-700">
              겟꿀 파트너스 활동에 따른 수입 지급의 최대 금액은 1개월 기준 3,000만원이며, 이를 초과하여 발생한 수입은 이월되거나 지급되지 않습니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handlePrev}
              className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-full hover:bg-gray-50 transition"
            >
              &lt; 이전
            </button>
            <button
              onClick={handleNext}
              disabled={!isNextButtonEnabled}
              className={`flex-1 font-bold py-3 px-4 rounded-full transition ${
                isNextButtonEnabled
                  ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              다음 &gt;
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

