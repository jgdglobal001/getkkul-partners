'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { BANK_NAMES } from '@/lib/constants';
import { safeFetchJson } from '@/lib/safe-fetch';

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
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [accountVerifyLoading, setAccountVerifyLoading] = useState(false);
  const [taxInvoiceProvided, setTaxInvoiceProvided] = useState<boolean | null>(null);
  // 개인 중복 가입 확인 상태
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
  const [duplicateCheckLoading, setDuplicateCheckLoading] = useState(false);
  const [duplicateModal, setDuplicateModal] = useState<{
    show: boolean;
    providerName: string;
    maskedEmail: string;
    provider: string;
  } | null>(null);

  // 필수 항목 입력 여부 확인
  const isVerifyButtonEnabled =
    formData.businessName &&
    formData.businessNumber1 &&
    formData.businessNumber2 &&
    formData.businessNumber3 &&
    formData.representativeName &&
    formData.startDate &&
    !isBusinessVerified;

  const isAccountVerifyEnabled =
    formData.bankName &&
    formData.accountNumber &&
    formData.accountHolder &&
    !isAccountVerified;

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

    // 이전에 입력한 Step2 데이터가 있으면 불러오기
    const savedStep2Data = sessionStorage.getItem('step2Data');
    if (savedStep2Data) {
      const parsed = JSON.parse(savedStep2Data);
      setFormData(prev => ({
        ...prev,
        ...parsed
      }));
      // 세금계산서 제공 여부도 불러오기
      if (parsed.taxInvoiceProvided !== undefined) {
        setTaxInvoiceProvided(parsed.taxInvoiceProvided);
      }

      // 계좌 인증 상태 복원: 저장된 계좌 데이터가 유효할 때만 복원
      const savedAccountVerified = sessionStorage.getItem('isAccountVerified');
      if (savedAccountVerified === 'true') {
        if (parsed.bankName && parsed.accountNumber && parsed.accountHolder) {
          setIsAccountVerified(true);
        } else {
          // 계좌 데이터가 비어있으면 인증 상태 초기화
          sessionStorage.removeItem('isAccountVerified');
        }
      }
    } else {
      // step2Data 자체가 없으면 계좌 인증 상태도 초기화
      sessionStorage.removeItem('isAccountVerified');
    }

    const savedVerified = sessionStorage.getItem('isBusinessVerified');
    if (savedVerified === 'true') {
      setIsBusinessVerified(true);
    }
  }, [session, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 계좌 정보가 변경되면 인증 상태 초기화
    if (['bankName', 'accountNumber', 'accountHolder'].includes(name)) {
      setIsAccountVerified(false);
      sessionStorage.removeItem('isAccountVerified');
    }

    // 개인: 이름/전화번호/이메일 변경 시 중복 확인 리셋
    if (['representativeName', 'contactPhone', 'contactEmail', 'contactName'].includes(name)) {
      setIsDuplicateChecked(false);
    }

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

      const { ok, data: result, error } = await safeFetchJson('/api/verify-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessNumber,
          businessName: formData.businessName,
          representativeName: formData.representativeName,
          startDate,
        }),
      });

      if (ok && result?.success) {
        setIsBusinessVerified(true);
        sessionStorage.setItem('isBusinessVerified', 'true');
        alert('✓ 사업자 정보가 확인되었습니다!');
      } else {
        setIsBusinessVerified(false);
        if (result?.isAlreadyRegistered) {
          const msg = `기존에 등록된 사업자등록 정보입니다! 다시 확인하시어 로그인을 해주세요!\n\n가입된 계정: ${result.existingAccount?.providerName} (${result.existingAccount?.maskedEmail})`;
          alert(msg);
        } else {
          alert('✗ ' + (result?.message || error || '사업자 정보가 일치하지 않습니다.'));
        }
      }
    } catch (error) {
      console.error('사업자 정보 검증 오류:', error);
      alert('사업자 정보 검증 중 오류가 발생했습니다.');
      setIsBusinessVerified(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleVerifyAccount = async () => {
    if (!formData.bankName || !formData.accountNumber || !formData.accountHolder) {
      alert('은행, 계좌번호, 예금주명을 모두 입력해주세요.');
      return;
    }

    console.log('--- Account Verification Start ---');
    console.log('Request Payload:', { bankName: formData.bankName, accountNumber: formData.accountNumber });

    setAccountVerifyLoading(true);
    try {
      const { ok, data: result, error, status, isHtmlResponse } = await safeFetchJson('/api/verify-business?action=verify-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
        }),
      });

      console.log('API Result:', { ok, status, result });

      if (isHtmlResponse) {
        alert('서버에서 예상치 못한 응답이 왔습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      if (ok && result?.success) {
        const actualHolder = result.holderName?.trim() || '';
        const inputHolder = formData.accountHolder.trim();

        console.log(`Comparison: Actual Member Name[${actualHolder}] vs Input Name[${inputHolder}]`);

        if (actualHolder === inputHolder) {
          setIsAccountVerified(true);
          sessionStorage.setItem('isAccountVerified', 'true');
          alert(`✓ 계좌 인증 성공! (예금주: ${actualHolder})`);
        } else {
          setIsAccountVerified(false);
          alert(`✗ 예금주 정보가 일치하지 않습니다.\n입력하신 성함: ${inputHolder}\n은행 등록 성함: ${actualHolder}`);
        }
      } else {
        console.error('API Business Logic Error:', result);
        const errorMsg = result?.error || error || '계좌 정보를 확인할 수 없습니다.';
        const errorCode = result?.code ? `[${result.code}] ` : '';
        alert(`✗ ${errorCode}${errorMsg}`);
      }
    } catch (error: any) {
      console.error('Network or Runtime Error during Verification:', error);
      alert('연결 중 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    } finally {
      console.log('--- Account Verification End ---');
      setAccountVerifyLoading(false);
    }
  };

  // 개인 중복 가입 확인
  const handleCheckDuplicate = async () => {
    if (!formData.representativeName) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!formData.businessAddress) {
      alert('주소를 입력해주세요.');
      return;
    }
    if (!formData.contactName) {
      alert('연락처 이름을 입력해주세요.');
      return;
    }
    if (!formData.contactPhone) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }
    if (!formData.contactEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }

    setDuplicateCheckLoading(true);
    const { ok, data: result, error } = await safeFetchJson('/api/business-registration?action=check-duplicate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        representativeName: formData.representativeName,
        contactPhone: formData.contactPhone,
      }),
    });

    if (ok && result?.success) {
      setIsDuplicateChecked(true);
      alert('✓ 확인되었습니다. 계좌정보를 입력해주세요.');
    } else if (result?.isAlreadyRegistered) {
      setIsDuplicateChecked(false);
      setDuplicateModal({
        show: true,
        providerName: result.existingAccount?.providerName || '소셜',
        maskedEmail: result.existingAccount?.maskedEmail || '',
        provider: result.existingAccount?.provider || '',
      });
    } else {
      alert(result?.message || error || '확인 중 오류가 발생했습니다.');
    }
    setDuplicateCheckLoading(false);
  };

  const handlePrev = () => {
    router.push('/auth/business-registration/step1');
  };

  const handleNext = () => {
    if (businessType !== '개인') {
      if (!formData.businessName || !formData.businessNumber1 || !formData.businessNumber2 || !formData.businessNumber3 || !formData.representativeName || !formData.startDate) {
        alert('필수 항목을 모두 입력해주세요.');
        return;
      }
      if (!isBusinessVerified) {
        alert('사업자 정보를 먼저 확인해주세요.');
        return;
      }
    } else {
      // 개인의 경우 필수 정보 확인
      if (!formData.representativeName || !formData.businessAddress) {
        alert('필수 항목(이름, 주소)을 모두 입력해주세요.');
        return;
      }
      // 개인 중복 확인 게이트
      if (!isDuplicateChecked) {
        alert('중복 가입 확인을 먼저 진행해주세요.');
        return;
      }
    }

    // 계좌 인증 확인
    if (!isAccountVerified) {
      alert('계좌 정보를 먼저 확인(인증)해주세요.');
      return;
    }

    // 개인사업자일 경우 세금계산서 제공 여부 선택 확인
    if (businessType === '개인사업자' && taxInvoiceProvided === null) {
      alert('세금계산서 제공 여부를 선택해주세요.');
      return;
    }

    // 2단계 데이터를 세션 스토리지에 저장
    sessionStorage.setItem('step2Data', JSON.stringify({
      ...formData,
      businessName: businessType === '개인' ? formData.representativeName : formData.businessName,
      taxInvoiceProvided: businessType === '개인사업자' ? taxInvoiceProvided : null,
    }));

    router.push('/auth/business-registration/step3');
  };

  const isIndividual = businessType === '개인';

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
              <h2 className="text-lg font-bold mb-4">{isIndividual ? '인적 정보' : '결제자 정보'}</h2>
            </div>

            {!isIndividual && (
              <>
                {/* 세금계산서 제공 여부 - 개인사업자만 표시 */}
                {businessType === '개인사업자' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <label className="block text-sm font-bold mb-3">세금계산서 제공 여부 *</label>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="taxInvoice"
                          checked={taxInvoiceProvided === true}
                          onChange={() => setTaxInvoiceProvided(true)}
                          className="w-4 h-4"
                        />
                        <span className="ml-2 text-sm">세금계산서 제공 (일반과세자)</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="taxInvoice"
                          checked={taxInvoiceProvided === false}
                          onChange={() => setTaxInvoiceProvided(false)}
                          className="w-4 h-4"
                        />
                        <span className="ml-2 text-sm">세금계산서 미제공 (간이/면세사업자)</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 사업자명 */}
                <div>
                  <label className="block text-sm font-bold mb-2">사업자명 *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="사업자 등록 증명서 상의 사업자명"
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
                    className={`w-full px-4 py-3 rounded-lg font-bold transition ${isBusinessVerified
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
              </>
            )}

            {isIndividual && (
              <div>
                <label className="block text-sm font-bold mb-2">이름 *</label>
                <input
                  type="text"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleInputChange}
                  placeholder="본인의 실명을 입력해주세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* 정보 섹션 제목 */}
            <div className="pt-4">
              <h3 className="text-base font-bold mb-4">{isIndividual ? '주소 및 연락처' : '사업자 정보'}</h3>
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-bold mb-2">{isIndividual ? '주소 *' : '사업자 주소 *'}</label>
              <input
                type="text"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleInputChange}
                placeholder={isIndividual ? "수익금 정산 관련 우편물 수령이 가능한 주소" : "사업자등록증의 주소 그대로 작성해주세요!"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {!isIndividual && (
              /* 업태 / 종목 */
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
            )}

            {/* 연락처 섹션 제목 */}
            {!isIndividual && (
              <div className="pt-4">
                <h3 className="text-base font-bold mb-4">
                  {businessType === '법인' ? '연락처' : '대표자 연락처'}
                </h3>
              </div>
            )}

            {/* 개인/개인사업자: 토스페이먼츠 본인인증 안내 */}
            {(isIndividual || businessType === '개인사업자') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <p className="font-bold mb-1">📱 토스페이먼츠 본인인증 안내</p>
                <p>
                  {isIndividual
                    ? '가입 완료 후 토스페이먼츠에서 카카오톡을 통해 본인 인증을 요청합니다. 아래 휴대폰 번호로 인증 메시지가 발송되며, 인증을 완료해야 최종 가입이 완료됩니다.'
                    : '가입 완료 후 토스페이먼츠에서 카카오톡을 통해 대표자 본인 인증을 요청합니다. 아래 대표자 휴대폰 번호로 인증 메시지가 발송되며, 인증을 완료해야 최종 가입이 완료됩니다.'}
                </p>
                <p className="mt-1 font-semibold text-blue-900">
                  ⚠️ 반드시 {isIndividual ? '본인' : '대표자 본인'}의 휴대폰 번호를 입력해주세요.
                </p>
              </div>
            )}

            {/* 연락처 정보 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  {isIndividual ? '이름 *' : businessType === '개인사업자' ? '대표자 이름 *' : '연락 담당자 이름 *'}
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder={isIndividual ? "본인 이름" : businessType === '개인사업자' ? "사업자등록증의 대표자명" : ""}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  {isIndividual ? '휴대폰 번호 *' : businessType === '개인사업자' ? '대표자 휴대폰 번호 *' : '연락처 *'}
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="010-0000-0000"
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
              {(isIndividual || businessType === '개인사업자') && (
                <p className="text-xs text-gray-500 mt-1">※ 토스페이먼츠 KYC 심사 안내가 이 이메일로 발송됩니다.</p>
              )}
            </div>

            {/* 개인: 중복 가입 확인 버튼 */}
            {isIndividual && (
              <div>
                <button
                  onClick={handleCheckDuplicate}
                  disabled={isDuplicateChecked || duplicateCheckLoading}
                  className={`w-full px-4 py-3 rounded-lg font-bold transition ${isDuplicateChecked
                    ? 'bg-green-500 text-white cursor-default'
                    : duplicateCheckLoading
                      ? 'bg-gray-400 text-gray-600 cursor-wait'
                      : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                    }`}
                >
                  {isDuplicateChecked ? '✓ 확인 완료' : duplicateCheckLoading ? '확인 중...' : '확인'}
                </button>
                {isDuplicateChecked && (
                  <p className="text-xs text-green-600 mt-1 text-center font-bold">정보가 확인되었습니다. 아래 계좌정보를 입력해주세요.</p>
                )}
              </div>
            )}

            {/* 계좌정보 섹션 — 본인/사업자 확인 완료 후에만 표시 */}
            {(isIndividual ? isDuplicateChecked : isBusinessVerified) && (
            <>
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
                {BANK_NAMES.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
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
                  placeholder="실명"
                  disabled={isAccountVerified}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
                <p className="text-xs text-red-500 mt-1">※ 본인 명의의 <b>정확한 예금주명</b>을 입력해주세요.</p>
              </div>
            </div>

            {/* 계좌 확인 버튼 */}
            <div>
              <button
                onClick={handleVerifyAccount}
                disabled={!isAccountVerifyEnabled || accountVerifyLoading}
                className={`w-full px-4 py-3 rounded-lg font-bold transition ${isAccountVerified
                  ? 'bg-green-500 text-white cursor-default'
                  : !isAccountVerifyEnabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : accountVerifyLoading
                      ? 'bg-gray-400 text-gray-600 cursor-wait'
                      : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                  }`}
              >
                {isAccountVerified ? '✓ 계좌 확인 완료' : accountVerifyLoading ? '확인 중...' : '계좌 확인하기'}
              </button>
              {isAccountVerified && (
                <p className="text-xs text-green-600 mt-1 text-center font-bold">인증된 계좌입니다.</p>
              )}
            </div>
            </>
            )}

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

      {/* 중복 가입 안내 모달 */}
      {duplicateModal?.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚠️</div>
              <h3 className="text-lg font-bold text-gray-900">이미 가입된 정보입니다</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-700 space-y-2">
              <p>입력하신 이름과 휴대폰 번호로 이미 가입된 계정이 있습니다.</p>
              <p className="font-bold text-gray-900">
                가입 경로: <span className="text-blue-600">{duplicateModal.providerName}</span>
                {duplicateModal.maskedEmail && (
                  <span className="text-gray-500"> ({duplicateModal.maskedEmail})</span>
                )}
              </p>
              <p>기존 계정으로 로그인해주세요.</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/auth/signin')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                로그인 페이지로 이동
              </button>
              <button
                onClick={() => setDuplicateModal(null)}
                className="w-full border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-50 transition"
              >
                닫기
              </button>
              <p className="text-xs text-center text-gray-400 mt-2">
                로그인이 안 되는 경우 고객센터로 문의해주세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

