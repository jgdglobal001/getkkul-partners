'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Step1Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [businessType, setBusinessType] = useState('개인');
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    marketing: false,
    sms: false,
  });

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
    }
  }, [session, router]);

  const handleAgreementChange = (key: string) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAllAgree = () => {
    const allChecked = agreements.terms && agreements.privacy;
    setAgreements({
      terms: !allChecked,
      privacy: !allChecked,
      marketing: !allChecked,
      sms: !allChecked,
    });
  };

  const isRequiredAgreed = agreements.terms && agreements.privacy;
  const isNextEnabled = isRequiredAgreed;

  const handleNext = () => {
    if (!isNextEnabled) {
      alert('필수 약관 2가지에 동의해주세요.');
      return;
    }

    // 1단계 데이터를 세션 스토리지에 저장
    sessionStorage.setItem('businessType', businessType);
    sessionStorage.setItem('agreements', JSON.stringify(agreements));

    router.push('/auth/business-registration/step2');
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
          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">1</div>
          <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg">2</div>
          <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg">3</div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-6">사업자 유형을 선택해주세요.</h2>

          {/* 안내 문구 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              ✓ 귀사 계정의 정보, 세금 계산서 정보와 공개되기 때문에 계정 사업자 신청해주세요.
            </p>
          </div>

          {/* 사업자 유형 선택 */}
          <div className="space-y-4 mb-8">
            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="businessType"
                value="개인"
                checked={businessType === '개인'}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-5 h-5"
              />
              <span className="ml-3 font-medium">개인</span>
            </label>

            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="businessType"
                value="법인/개인"
                checked={businessType === '법인/개인'}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-5 h-5"
              />
              <span className="ml-3 font-medium">법인/개인 사업자 (세금계산서 제공)</span>
            </label>

            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="businessType"
                value="개인사업자"
                checked={businessType === '개인사업자'}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-5 h-5"
              />
              <span className="ml-3 font-medium">개인사업자 (세금계산서 미제공)</span>
            </label>
          </div>

          {/* 약관 동의 */}
          <div className="space-y-3 mb-8">
            {/* 전체 동의 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreements.terms && agreements.privacy && agreements.marketing && agreements.sms}
                  onChange={handleAllAgree}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="ml-3 font-bold text-gray-900">전체 동의</span>
              </label>
            </div>

            {/* 필수 약관 1 */}
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreements.terms}
                  onChange={() => handleAgreementChange('terms')}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="ml-3 text-sm">
                  <span className="font-bold text-red-500">[필수]</span> 서비스 약관에 동의합니다
                </span>
              </div>
              <a href="#" className="text-blue-500 text-sm hover:underline whitespace-nowrap ml-2">전문 보기</a>
            </label>

            {/* 필수 약관 2 */}
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreements.privacy}
                  onChange={() => handleAgreementChange('privacy')}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="ml-3 text-sm">
                  <span className="font-bold text-red-500">[필수]</span> 개인정보 수집 및 이용에 동의합니다
                </span>
              </div>
              <a href="#" className="text-blue-500 text-sm hover:underline whitespace-nowrap ml-2">전문 보기</a>
            </label>

            {/* 선택 약관 1 */}
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={() => handleAgreementChange('marketing')}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="ml-3 text-sm">
                  <span className="font-medium text-gray-500">[선택]</span> 마케팅 목적의 개인정보 수집 및 이용 동의
                </span>
              </div>
              <a href="#" className="text-blue-500 text-sm hover:underline whitespace-nowrap ml-2">전문 보기</a>
            </label>

            {/* 선택 약관 2 */}
            <label className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={agreements.sms}
                  onChange={() => handleAgreementChange('sms')}
                  className="w-5 h-5 accent-blue-500"
                />
                <span className="ml-3 text-sm">
                  <span className="font-medium text-gray-500">[선택]</span> 광고성 정보 수신 동의 (이메일, SMS)
                </span>
              </div>
              <a href="#" className="text-blue-500 text-sm hover:underline whitespace-nowrap ml-2">전문 보기</a>
            </label>
          </div>

          {/* 버튼 */}
          <button
            onClick={handleNext}
            disabled={!isNextEnabled}
            className={`w-full font-bold py-3 px-4 rounded-full transition text-lg ${
              isNextEnabled
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
  );
}

