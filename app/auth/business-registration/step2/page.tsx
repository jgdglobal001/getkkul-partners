'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Step2Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [businessType, setBusinessType] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    businessNumber1: '',
    businessNumber2: '',
    businessNumber3: '',
    representativeName: '',
    startDate: '',
    businessCategory: '',
    businessType: '',
    businessAddress: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  });
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // 필수 항목 입력 여부 확인
  const isVerifyButtonEnabled =
    formData.businessName &&
    formData.businessNumber1 &&
    formData.businessNumber2 &&
    formData.businessNumber3 &&
    formData.representativeName &&
    formData.startDate &&
    !isBusinessVerified;

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    // Step1에서 저장한 사업자 유형 가져오기
    const savedBusinessType = sessionStorage.getItem('businessType');
    if (savedBusinessType) {
      setBusinessType(savedBusinessType);
    } else {
      router.push('/auth/business-registration/step1');
    }
  }, [session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerifyBusiness = async () => {
    if (!formData.businessName || !formData.businessNumber1 || !formData.businessNumber2 || !formData.businessNumber3 || !formData.representativeName || !formData.startDate) {
      alert('사업자명, 사업자번호, 대표자명, 개업일자를 모두 입력해주세요.');
      return;
    }

    setVerifyLoading(true);
    try {
      const businessNumber = `${formData.businessNumber1}${formData.businessNumber2}${formData.businessNumber3}`;
      const startDate = formData.startDate.replace(/-/g, '');

      const response = await fetch('/api/verify-business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessNumber,
          businessName: formData.businessName,
          representativeName: formData.representativeName,
          startDate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsBusinessVerified(true);
        alert('✓ 사업자 정보가 확인되었습니다!');
      } else {
        setIsBusinessVerified(false);
        alert('✗ ' + (result.message || '사업자 정보가 일치하지 않습니다.'));
      }
    } catch (error) {
      console.error('사업자 정보 검증 오류:', error);
      alert('사업자 정보 검증 중 오류가 발생했습니다.');
      setIsBusinessVerified(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handlePrev = () => {
    router.push('/auth/business-registration/step1');
  };

  const handleNext = () => {
    // 필수 필드 검증
    if (!formData.businessName || !formData.businessNumber1 || !formData.businessNumber2 || !formData.businessNumber3 || !formData.representativeName || !formData.startDate) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 사업자 정보 검증 확인
    if (!isBusinessVerified) {
      alert('사업자 정보를 먼저 확인해주세요.');
      return;
    }

    // 2단계 데이터를 세션 스토리지에 저장
    sessionStorage.setItem('step2Data', JSON.stringify(formData));

    router.push('/auth/business-registration/step3');
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
          <h1 className="text-center text-3xl font-bold mb-2">겟꿀 파트너스 가입</h1>
          <p className="text-center text-sm text-gray-600 mb-8">{businessType}</p>

          {/* 진행도 */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg">1</div>
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">2</div>
            <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-lg">3</div>
          </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 space-y-6">
          {/* 결제자 정보 섹션 */}
          <div>
            <h2 className="text-lg font-bold mb-4">결제자 정보</h2>
          </div>

          {/* 사업자명 */}
          <div>
            <label className="block text-sm font-bold mb-2">사업자명 *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="사업자 등록 증명서 또는 신분증 상의 사업자명"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 사업자번호 */}
          <div>
            <label className="block text-sm font-bold mb-2">사업자번호 *</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                name="businessNumber1"
                value={formData.businessNumber1}
                onChange={handleInputChange}
                maxLength={3}
                placeholder="123"
                disabled={isBusinessVerified}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
              <span>-</span>
              <input
                type="text"
                name="businessNumber2"
                value={formData.businessNumber2}
                onChange={handleInputChange}
                maxLength={2}
                placeholder="45"
                disabled={isBusinessVerified}
                className="w-16 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
              <span>-</span>
              <input
                type="text"
                name="businessNumber3"
                value={formData.businessNumber3}
                onChange={handleInputChange}
                maxLength={5}
                placeholder="67890"
                disabled={isBusinessVerified}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* 대표자명 */}
          <div>
            <label className="block text-sm font-bold mb-2">대표자명 *</label>
            <input
              type="text"
              name="representativeName"
              value={formData.representativeName}
              onChange={handleInputChange}
              placeholder="사업자등록증의 대표자명"
              disabled={isBusinessVerified}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* 개업일자 */}
          <div>
            <label className="block text-sm font-bold mb-2">개업일자 *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              disabled={isBusinessVerified}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* 확인하기 버튼 */}
          <div>
            <button
              onClick={handleVerifyBusiness}
              disabled={!isVerifyButtonEnabled || verifyLoading}
              className={`w-full px-4 py-3 rounded-lg font-bold transition ${
                isBusinessVerified
                  ? 'bg-green-500 text-white cursor-default'
                  : !isVerifyButtonEnabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : verifyLoading
                  ? 'bg-gray-400 text-gray-600 cursor-wait'
                  : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
              }`}
            >
              {isBusinessVerified ? '✓ 확인됨' : verifyLoading ? '확인중...' : '확인하기'}
            </button>
          </div>

          {/* 사업자 정보 섹션 제목 */}
          <div className="pt-4">
            <h3 className="text-base font-bold mb-4">사업자 정보</h3>
          </div>

          {/* 사업자 주소 */}
          <div>
            <label className="block text-sm font-bold mb-2">사업자 주소 *</label>
            <input
              type="text"
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleInputChange}
              placeholder="사업자등록증의 주소 그대로 작성해주세요!"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 업태 / 종목 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">업태 *</label>
              <input
                type="text"
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">종목 *</label>
              <input
                type="text"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 연락처 섹션 제목 */}
          <div className="pt-4">
            <h3 className="text-base font-bold mb-4">연락처</h3>
          </div>

          {/* 연락처 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">이름 *</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">연락처 *</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-bold mb-2">이메일 *</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* 계좌정보 섹션 제목 */}
          <div className="pt-4">
            <h3 className="text-base font-bold mb-4">계좌정보</h3>
          </div>

          {/* 계좌 정보 */}
          <div>
            <label className="block text-sm font-bold mb-2">은행 *</label>
            <select
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">은행 선택</option>
              <option value="국민은행">국민은행</option>
              <option value="우리은행">우리은행</option>
              <option value="신한은행">신한은행</option>
              <option value="하나은행">하나은행</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2">계좌번호 *</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">계좌주 *</label>
              <input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
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
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition"
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

