'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { safeFetchJson } from '@/lib/safe-fetch';

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
  const [errorModal, setErrorModal] = useState<{
    show: boolean;
    type: 'duplicate' | 'toss' | 'server' | 'unknown';
    userMessage: string;
    debugInfo?: string;
  } | null>(null);

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
    setErrorModal(null);
    if (!isNextButtonEnabled) {
      alert('플랫폼 또는 모바일 앱 URL을 최소 1개 추가하고, 최종 승인에 동의해주세요.');
      return;
    }

    try {
      // 세션 스토리지에서 모든 데이터 가져오기
      const businessType = sessionStorage.getItem('businessType');
      const agreements = JSON.parse(sessionStorage.getItem('agreements') || '{}');
      const step2Data = JSON.parse(sessionStorage.getItem('step2Data') || '{}');

      // 배열을 쉼표로 구분된 문자열로 변환
      const platformUrl = platformUrls.join(', ');
      const mobileAppUrl = mobileAppUrls.join(', ');

      const { businessType: jongMok, ...restStep2 } = step2Data;

      // API에 데이터 전송
      const { ok, data: responseData, status, error: fetchError, isHtmlResponse } = await safeFetchJson('/api/business-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: businessType, // Entity Type
          businessType2: jongMok, // Jong-mok
          ...restStep2,
          platformUrl,
          mobileAppUrl,
          agreements,
        }),
      });

      if (!ok) {
        console.error('API Error:', responseData);

        // 실패 시 사업자 확인 상태 초기화
        sessionStorage.removeItem('isBusinessVerified');

        if (isHtmlResponse) {
          setErrorModal({
            show: true,
            type: 'server',
            userMessage: '서버에서 예상치 못한 응답이 왔습니다.\n잠시 후 다시 시도해주세요.',
          });
        } else if (responseData?.errorType === 'DUPLICATE_REGISTRATION' || status === 409) {
          setErrorModal({
            show: true,
            type: 'duplicate',
            userMessage: '이미 가입된 계정입니다.\n기존 계정으로 로그인해주세요.',
          });
        } else if (responseData?.details) {
          // 토스 API 오류
          const debugInfo = `Toss Status: ${responseData.details.tossStatus}\nMessage: ${typeof responseData.details.tossMessage === 'object' ? JSON.stringify(responseData.details.tossMessage, null, 2) : responseData.details.tossMessage}${responseData.details.sentPayload ? `\n\nPayload:\n${JSON.stringify(responseData.details.sentPayload, null, 2)}` : ''}`;
          setErrorModal({
            show: true,
            type: 'toss',
            userMessage: '토스페이먼츠 연동 중 오류가 발생했습니다.\n입력하신 정보를 다시 확인해주세요.\n\n(은행명, 계좌번호, 예금주명이 정확한지 확인해보세요)',
            debugInfo,
          });
        } else if (status === 0) {
          // 네트워크 오류 (safeFetchJson에서 status=0)
          setErrorModal({
            show: true,
            type: 'unknown',
            userMessage: '네트워크 오류가 발생했습니다.\n인터넷 연결을 확인한 후 다시 시도해주세요.',
            debugInfo: fetchError || undefined,
          });
        } else {
          setErrorModal({
            show: true,
            type: 'server',
            userMessage: '서버 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
            debugInfo: responseData?.error || fetchError || '알 수 없는 오류',
          });
        }
        return;
      }

      // 사업자명을 sessionStorage에 저장 (완료 페이지에서 사용)
      if (step2Data.businessName) {
        sessionStorage.setItem('businessName', step2Data.businessName);
      }

      // 세션 스토리지 정리 (성공 시 모든 데이터 삭제)
      sessionStorage.removeItem('businessType');
      sessionStorage.removeItem('agreements');
      sessionStorage.removeItem('step2Data');
      sessionStorage.removeItem('isBusinessVerified');

      // 완료 페이지로 이동
      router.push('/auth/business-registration/complete');
    } catch (error: any) {
      console.error('Error:', error);

      // 실패 시 사업자 확인 상태 초기화
      sessionStorage.removeItem('isBusinessVerified');

      setErrorModal({
        show: true,
        type: 'unknown',
        userMessage: '네트워크 오류가 발생했습니다.\n인터넷 연결을 확인한 후 다시 시도해주세요.',
        debugInfo: error.message || String(error),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Image
              src="/getkkul-partners-logo.png"
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
                className={`flex-1 font-bold py-3 px-4 rounded-full transition ${isNextButtonEnabled
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

      {/* 에러 모달 */}
      {errorModal?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            {/* 아이콘 */}
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                errorModal.type === 'duplicate' ? 'bg-orange-100' : 'bg-red-100'
              }`}>
                {errorModal.type === 'duplicate' ? (
                  <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>

            {/* 제목 */}
            <h3 className="text-lg font-bold text-center mb-3">
              {errorModal.type === 'duplicate' && '이미 가입된 계정'}
              {errorModal.type === 'toss' && '정보 확인 필요'}
              {errorModal.type === 'server' && '서버 오류'}
              {errorModal.type === 'unknown' && '연결 오류'}
            </h3>

            {/* 사용자 메시지 */}
            <p className="text-sm text-gray-700 text-center whitespace-pre-line mb-5">
              {errorModal.userMessage}
            </p>

            {/* 개발 모드 디버그 정보 */}
            {process.env.NODE_ENV === 'development' && errorModal.debugInfo && (
              <details className="mb-4">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                  🔧 개발자 정보 (개발 모드에서만 표시)
                </summary>
                <textarea
                  readOnly
                  className="w-full h-32 p-2 mt-2 text-xs border border-gray-200 rounded bg-gray-50 text-gray-600 font-mono"
                  value={errorModal.debugInfo}
                />
              </details>
            )}

            {/* 버튼 */}
            <div className="flex flex-col gap-2">
              {errorModal.type === 'duplicate' ? (
                <>
                  <button
                    onClick={() => router.push('/auth/signin')}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full transition"
                  >
                    로그인 페이지로 이동
                  </button>
                  <button
                    onClick={() => setErrorModal(null)}
                    className="w-full text-gray-500 hover:text-gray-700 text-sm py-2"
                  >
                    닫기
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setErrorModal(null)}
                  className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 rounded-full transition"
                >
                  확인
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
