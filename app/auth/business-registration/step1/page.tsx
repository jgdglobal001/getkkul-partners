'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

// 약관 전문 내용
const TERMS_CONTENT: Record<string, { title: string; content: string }> = {
  terms: {
    title: '서비스 이용약관',
    content: `제1조 (목적)
이 약관은 겟꿀 파트너스(이하 "회사")가 제공하는 파트너스 서비스(이하 "서비스")의 이용과 관련하여 회사와 파트너(이하 "회원") 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 제휴 마케팅 플랫폼 및 관련 부가 서비스를 말합니다.
2. "회원"이란 이 약관에 동의하고 회사와 파트너 계약을 체결한 자를 말합니다.
3. "파트너십 ID"란 회원에게 부여되는 고유 식별번호를 말합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스 화면에 게시하거나 기타 방법으로 회원에게 공지함으로써 효력이 발생합니다.
2. 회사는 관련 법령에 위배되지 않는 범위에서 이 약관을 변경할 수 있으며, 변경 시 적용일자 및 변경사유를 명시하여 공지합니다.

제4조 (서비스의 제공)
1. 회사는 회원에게 제휴 링크 생성, 수익 관리, 정산 등의 서비스를 제공합니다.
2. 서비스의 구체적인 내용은 회사의 정책에 따라 변경될 수 있습니다.

제5조 (회원의 의무)
1. 회원은 관련 법령, 이 약관의 규정, 이용안내 등을 준수하여야 합니다.
2. 회원은 부정한 방법으로 수익을 창출하는 행위를 하여서는 안 됩니다.
3. 회원은 회사의 사전 동의 없이 서비스를 이용한 영리 활동을 할 수 없습니다.

제6조 (수익 정산)
1. 회원의 수익은 매월 정산되며, 정산 기준일은 회사의 정책에 따릅니다.
2. 정산금은 회원이 등록한 계좌로 입금됩니다.
3. 부정 행위가 확인된 경우, 회사는 정산을 보류하거나 취소할 수 있습니다.`,
  },
  privacy: {
    title: '개인정보 수집 및 이용 동의',
    content: `1. 수집하는 개인정보 항목
- 필수: 이름, 이메일, 연락처, 사업자등록번호(사업자의 경우), 은행명, 계좌번호, 예금주명
- 선택: 플랫폼 URL, 모바일 앱 URL

2. 개인정보의 수집 및 이용 목적
- 파트너 회원 가입 및 관리
- 수익 정산 및 지급
- 세금계산서 발행
- 서비스 관련 공지사항 전달
- 본인 확인 및 부정 이용 방지

3. 개인정보의 보유 및 이용 기간
- 회원 탈퇴 시까지 (단, 관련 법령에 의한 보존 기간이 있는 경우 해당 기간까지)
- 전자상거래 등에서의 소비자 보호에 관한 법률에 의한 계약 또는 청약철회 등에 관한 기록: 5년
- 대금결제 및 재화 등의 공급에 관한 기록: 5년

4. 동의 거부 권리
- 위 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으나, 이 경우 파트너스 서비스 이용이 제한됩니다.`,
  },
  marketing: {
    title: '마케팅 목적의 개인정보 수집 및 이용 동의',
    content: `1. 수집하는 개인정보 항목
- 이름, 이메일, 연락처

2. 수집 및 이용 목적
- 신규 서비스 및 이벤트 안내
- 맞춤형 광고 제공
- 서비스 이용 통계 및 분석

3. 보유 및 이용 기간
- 동의 철회 시 또는 회원 탈퇴 시까지

4. 동의 거부 권리
- 마케팅 목적의 개인정보 수집 및 이용에 대한 동의를 거부할 수 있으며, 이 경우에도 기본 서비스 이용은 가능합니다.`,
  },
  sms: {
    title: '광고성 정보 수신 동의 (이메일, SMS)',
    content: `1. 수신 정보의 내용
- 겟꿀 파트너스의 새로운 기능, 업데이트 안내
- 프로모션 및 이벤트 정보
- 수익 극대화를 위한 팁 및 가이드
- 파트너 전용 혜택 안내

2. 수신 방법
- 이메일, SMS(문자메시지)

3. 수신 동의 변경
- 서비스 내 설정 또는 고객센터를 통해 언제든지 수신 동의를 철회할 수 있습니다.

4. 동의 거부 권리
- 광고성 정보 수신에 대한 동의를 거부할 수 있으며, 이 경우에도 기본 서비스 이용은 가능합니다.
- 단, 서비스 관련 필수 공지사항은 수신 동의 여부와 관계없이 발송됩니다.`,
  },
};

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
  const [termsModal, setTermsModal] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    // Step1 진입 시 이전 등록 과정의 모든 데이터 초기화
    // (이전 시도가 실패했을 수 있으므로 처음부터 다시 시작)
    sessionStorage.removeItem('businessType');
    sessionStorage.removeItem('agreements');
    sessionStorage.removeItem('step2Data');
    sessionStorage.removeItem('isBusinessVerified');
  }, [session, router]);

  const handleAgreementChange = (key: keyof typeof agreements) => {
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
              <div className="ml-3">
                <span className="font-medium">개인 (사업자 아님)</span>
                <p className="text-sm text-gray-500">사업자등록증 없이 개인으로 활동</p>
              </div>
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
              <div className="ml-3">
                <span className="font-medium">개인사업자 (세금계산서 제공/미제공)</span>
                <p className="text-sm text-gray-500">개인 명의 사업자등록증 보유</p>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <input
                type="radio"
                name="businessType"
                value="법인"
                checked={businessType === '법인'}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-5 h-5"
              />
              <div className="ml-3">
                <span className="font-medium">법인사업자 (세금계산서 제공)</span>
                <p className="text-sm text-gray-500">법인 명의 사업자등록증 보유</p>
              </div>
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
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTermsModal('terms'); }} className="text-blue-500 text-sm hover:underline whitespace-nowrap ml-2">전문 보기</button>
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
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTermsModal('privacy'); }} className="text-blue-500 text-sm hover:underline whitespace-nowrap ml-2">전문 보기</button>
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
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTermsModal('marketing'); }} className="text-blue-500 text-sm hover:underline whitespace-nowrap ml-2">전문 보기</button>
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
              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setTermsModal('sms'); }} className="text-blue-500 text-sm hover:underline whitespace-nowrap ml-2">전문 보기</button>
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

      {/* 약관 전문 보기 모달 */}
      {termsModal && TERMS_CONTENT[termsModal] && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setTermsModal(null)}>
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{TERMS_CONTENT[termsModal].title}</h3>
              <button
                type="button"
                onClick={() => setTermsModal(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
              >
                ✕
              </button>
            </div>
            {/* 모달 본문 */}
            <div className="overflow-y-auto px-6 py-4 flex-1">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
                {TERMS_CONTENT[termsModal].content}
              </pre>
            </div>
            {/* 모달 하단 */}
            <div className="px-6 py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setTermsModal(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-lg transition"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

