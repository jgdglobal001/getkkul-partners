'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'policy' | 'privacy'>('terms');

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
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'terms'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                이용약관
              </button>
              <button
                onClick={() => setActiveTab('policy')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'policy'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                운영정책
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                  activeTab === 'privacy'
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

// 이용약관 컴포넌트
function TermsOfService() {
  return (
    <div className="prose max-w-none text-sm">
      <h2 className="text-2xl font-bold mb-6">겟꿀 마케팅 제휴 프로그램 이용약관(겟꿀 파트너스)</h2>

      <h3 className="text-lg font-bold mt-6 mb-3">제1조 (목적)</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        이 약관은 주식회사 제이지디글로벌(이하 "회사"라고 합니다)이 제공하는 마케팅 제휴 프로그램인 겟꿀 파트너스를 회원이 이용함에 있어서,
        회사와 회원 사이의 권리ᆞ의무, 책임사항, 서비스 이용절차 및 그 밖의 제반 사항을 명확히 하여 쌍방의 원활한 거래를 도모하고
        궁극적으로 공동의 이익을 증진하여 상호 발전을 도모하는 것을 그 목적으로 합니다.
      </p>

      <h3 className="text-lg font-bold mt-6 mb-3">제2조 (용어의 정의)</h3>
      <p className="text-gray-700 leading-relaxed mb-2">
        이 약관에서 사용하는 용어의 정의는 다음과 같습니다. 이 약관에서 정의되지 않은 용어는 일반 거래 관행에 따라 정의된 의미를 가집니다.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
        <li>
          "겟꿀(Getkkul)"이란 회사가 컴퓨터, 스마트폰 등 정보통신설비를 이용하여 판매자와 이용자가 재화 또는 용역을 거래할 수 있도록
          통신판매중개 서비스를 제공하는 가상의 영업장(http://www.getkkul.com 등 회사가 운영하는 웹사이트 및 모바일 웹, 앱 등을 모두 포함)을 의미합니다.
        </li>
        <li>
          "겟꿀 파트너스(이하 "겟꿀 파트너스"라고 합니다)"란 회사가 제공하는 광고를 회원이 운영하는 미디어에 게재하여
          방문자의 관심에 의해 발생한 광고 클릭을 통해 회사가 얻은 수익을 회사와 회원이 일정한 비율로 분배하는 광고서비스 및 이에 부수되는 제반 서비스를 의미합니다.
        </li>
        <li>
          "회원"이란 회사가 제공하는 광고 등을 자신의 미디어에 게재하고, 겟꿀 내 공유하기 기능을 통해 그 성과에 대한 수입을 취할 목적으로
          이 약관에 동의하고 서비스 가입자로 승인을 받은 자를 의미합니다. 회원은 개인이나 법인 모두 가능하며 성과에 대해 회사로부터 약정된 대가를 받게 됩니다.
        </li>
        <li>
          "방문자"란 컴퓨터 또는 모바일기기 등 디바이스를 통해 회원의 미디어에 방문한 자를 의미합니다.
        </li>
        <li>
          "미디어"란 이 약관에 따라 회사의 광고를 게재하는 매체로 회원이 운영하는 블로그, 웹사이트 등을 의미합니다.
        </li>
        <li>
          "수입"이란 회사의 광고를 회원의 미디어에 게재하여 매출이 발생했을 때 회사가 회원에게 지급하게 되는 금액을 의미합니다.
        </li>
        <li>
          "겟꿀캐시"란 겟꿀에서 상품 등을 구매할 때 사용할 수 있는 결제 수단을 의미합니다.
        </li>
        <li>
          "부당한 수입"이란 회원이 약관, 운영정책, 또는 관련 법령 등을 위반하거나 방문자가 약관, 운영정책 또는 관련법령에서 금지한 행위를 하여
          회원에게 발생한 수입을 의미합니다.
        </li>
      </ul>

      <h3 className="text-lg font-bold mt-6 mb-3">제3조 (약관의 명시, 효력 및 개정)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사는 이 약관의 내용을 회원이 알 수 있도록 서비스의 관련 화면(파트너스 사이트 내 '약관 및 정책')을 통해 게시합니다.</li>
        <li>
          회사는 이 약관에서 규정되지 않은 세부적인 내용을 별도의 "겟꿀 파트너스 운영 정책(이하 "운영정책"이라 합니다)"으로 규정할 수 있고,
          이를 서비스의 관련 화면 등을 통하여 공지하기로 합니다. 또한, 이러한 운영정책은 이 약관의 일부를 구성하며, 이 약관과 동일한 효력이 있습니다.
        </li>
        <li>본 약관과 관련하여, 별도 합의가 필요한 경우 서면에 의해야 합니다. 별도 합의한 내용이 본 약관과 상이한 경우, 본 약관에 우선합니다.</li>
        <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 이 약관(또는 운영정책, 이하 동일함)을 개정할 수 있습니다.</li>
        <li>
          회사가 이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 그 적용일자 7일 이전(회원에게 불리한 내용으로 변경할 때에는 14일 이전)부터
          적용일자 전일까지 서비스의 관련 화면에 공지하거나 전자우편 또는 그 밖의 방법으로 통지합니다.
        </li>
        <li>
          회사가 전항에 따라 개정 약관을 공지하면서 회원에게 적용일자 전일까지 의사표시를 하지 않으면 의사표시가 표명된 것으로 본다는 뜻을 명확하게 공지 또는 통지하였음에도
          판매자가 명시적으로 거부의 의사표시를 하지 아니한 경우에는 회원이 개정 약관에 동의한 것으로 봅니다.
        </li>
        <li>회원은 개정 약관에 동의하지 않는 경우 적용일자 전일까지 회사에 거부의사를 표시하고 가입을 해지할 수 있습니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제4조 (회원가입)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>
          회원가입은 겟꿀 파트너스 사이트를 통해 서비스를 이용하고자 하는 자(이하 "가입신청자"라고 합니다)가 회사가 정한 가입 양식에 따라
          회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 하면, 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
        </li>
        <li>
          회사는 가입신청자의 신청에 대하여 아래 각 호의 사유가 있는 경우에는 승낙을 하지 않을 수 있으며,
          가입 이후에도 아래 각 호의 사유가 확인될 경우에는 이 약관을 해지할 수 있습니다.
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>가입신청자가 겟꿀 회원이 아닌 경우</li>
            <li>가입신청자가 겟꿀에 소속된 직원이거나 그 직계 가족일 경우</li>
            <li>가입신청자가 이 약관에 의하여 이전에 "회원" 자격을 상실한 적이 있는 경우</li>
            <li>가입신청자가 이 약관 위반 등의 사유로 서비스 이용제한 중에 재가입신청을 하는 경우</li>
            <li>가입신청자가 이미 서비스에 가입이 되어 있는 경우</li>
            <li>실명이 아닌 명의 또는 타인의 명의를 기재한 경우</li>
            <li>허위 또는 잘못된 정보를 기재 또는 제공하거나 회사가 정한 신청 요건이 미비한 경우</li>
            <li>가입신청자의 귀책사유로 인하여 승낙이 불가능하거나 기타 이 약관에서 규정한 제반 사항을 위반하여 신청을 하는 경우</li>
          </ul>
        </li>
        <li>본 조에 따른 신청에 대하여 회사는 본인확인기관을 통한 본인확인을 가입신청자에게 요청할 수 있습니다.</li>
        <li>회원가입은 회사의 승낙이 이용신청자에게 도달한 때 완료됩니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제5조 (정산방식)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>
          회사는 서비스를 통하여 측정된 실적과 그에 따라 별도로 정한 수익 배분 기준에 따라 CPS(Cost Per Sale) 방식으로 산정된 수입을 회원에게 지급합니다.
        </li>
        <li>수입 지급은 1일부터 말일 기준 1개월 단위를 원칙으로 하며, 취소 및 반품된 금액은 수입에서 모두 제외됩니다.</li>
        <li>
          수입지급의 최소 금액은 10,000원이며, 월간 수입이 10,000원을 넘지 않을 경우에 정산 금액은 이월 처리됩니다.
          금액 미달로 인한 최대 이월 가능 기간은 6개월이며, 그 이후에는 6개월간 적립된 금액이 일괄 지급됩니다.
        </li>
        <li>별도로 정하지 않은 경우, 수입 지급의 최대 금액은 1개월 기준 3,000만원이며, 이를 초과하여 발생한 수입은 이월되거나 지급되지 않습니다.</li>
        <li>
          회원이 사업자가 아닌 경우 회사는 수입 지급 금액에 따라 발생하는 제세공과금 등을 수입에서 공제하고 지급할 수 있습니다.
        </li>
        <li>지급 과정에서 회원의 은행계좌정보 등이 유효하지 않아 수입을 지급받지 못하는 경우 귀책사유는 회원에게 있으며 회사는 이를 보상하지 않습니다.</li>
        <li>전항의 사유로 수입이 지급되지 않은 경우 회사는 제18조에 따라 회원에게 통지하며, 회사는 회원이 은행계좌정보를 수정할 때까지 최대 6개월까지 수입의 지급을 보류할 수 있습니다.</li>
        <li>
          회사는 수입 지급 및 세무처리를 위하여 개인식별정보의 수집 동의, 세금계산서 등 조세 관련법령에서 규정하는 세무적 증빙의 발행을 요청할 수 있으며,
          회원이 개인식별정보수집에 동의하지 않거나 세금계산서를 승인 기간 내에 승인하지 않는 경우 또는 회원이 제공한 정보가 유효하지 않은 경우 회사는 수입의 지급을 보류할 수 있습니다.
        </li>
        <li>회원은 수입 잔액이 0원 미만이 되는 경우, 해당 금액을 회사에 변제하여야 합니다.</li>
        <li>회사는 부당한 수입에 대해 지급을 거절할 수 있으며 이미 지급된 경우 해당 "부당한 수입"을 회원으로부터 회수할 수 있습니다.</li>
        <li>회사는 신고 등에 의해 부당한 수입으로 의심될 경우, 이에 대한 확인을 위해 조사에 착수할 수 있으며, 조사가 완료될 때까지 수입의 지급을 보류할 수 있습니다.</li>
        <li>
          회원 또는 회사가 이 약관 해지 의사를 표시한 경우, 회사는 해지 의사를 표시한 날까지의 수입(이하 잔여수입이라고 합니다)을 확인하여,
          잔여수입이 회사가 정한 지급 기준액 이상이 되는 경우 회원에게 지급합니다. 구체적인 지급 방법 및 시기는 운영정책에서 정합니다.
        </li>
        <li>이용제한 또는 휴•폐업 상태에 있는 회원에게는 수입의 지급이 제한될 수 있습니다.</li>
        <li>그 외 구체적인 기준은 운영정책에서 정합니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제6조 (개인정보의 보호)</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        회사는 『정보통신망 이용촉진 및 정보보호 등에 관한 법률』, 『개인정보보호법』 등 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.
        개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의 개인정보처리방침이 적용됩니다. 다만, 회사의 공식 사이트 이외의 링크된 사이트에서는 회사의 개인정보처리방침이 적용되지 않습니다.
      </p>

      <h3 className="text-lg font-bold mt-6 mb-3">제7조 (회사의 의무)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사는 관련 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며, 이 약관이 정하는 바에 따라 지속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.</li>
        <li>회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보(신용정보 포함) 보호를 위하여 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.</li>
        <li>회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정될 경우에는 회원의 불만을 해결하기 위해 노력합니다.</li>
        <li>회사는 회사가 별도로 정한 광고수익 배분기준 및 지급절차에 따라 수입을 회원에게 지급합니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제8조 (회원의 의무)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회원은 관련 법령, 이 약관의 규정, 회사의 이용정책, 이용안내, 소명/시정 요구 등 회사가 통지하는 사항을 준수하여야 하며, 기타 회사 업무에 방해되는 행위를 하여서는 안 됩니다.</li>
        <li>
          회원은 다음 각호의 행위를 하여서는 안 됩니다.
          <ul className="list-disc pl-6 mt-2 space-y-1 text-xs">
            <li>회원가입을 신청하거나 회원정보 변경 신청 시 허위 또는 타인의 정보를 입력하는 행위</li>
            <li>회사 또는 제3자의 저작권 등 지식재산권을 침해하는 행위</li>
            <li>회사 또는 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>회사 또는 제3자를 가장 또는 사칭하여 허가 받지 않은 게시판, 스팸메일 등의 활용으로 회사의 명성에 해를 끼치는 행위</li>
            <li>회사의 서비스에 게시된 정보를 변경하거나 서비스를 이용하여 얻은 정보, 공개되지 말아야 할 기밀정보(클릭 수, CTR, PPC 등)를 회사의 사전 서면 승낙 없이 영리 또는 비영리의 목적으로 복제, 출판, 방송 등에 사용하거나 제3자에게 제공하는 행위</li>
            <li>부정한 방법을 사용하여 광고를 노출시키거나 클릭을 반복하여 회사에게 손해를 주거나 자신 또는 제3자에게 이익을 주는 행위, 또는 타인에게 그러한 행위를 유도하는 행위</li>
            <li>수신자의 사전 동의를 얻지 않은 불법 스팸 전송 행위 일체</li>
            <li>광고의 게재를 유도하기 위해 미디어의 콘텐츠 내용과 관계없이 무의미한 키워드를 반복하여 사용하는 행위</li>
            <li>겟꿀 파트너스에 등록되지 않은 미디어에 서비스 이용을 위해 회사로부터 제공받은 이미지, 상표, 데이터 등을 포함한 광고를 노출시키거나 겟꿀의 도메인이름(getkkul.com)과 유사한 도메인을 이용하여 수익을 발생시키는 행위</li>
            <li>계정을 매매, 양도, 명의변경, 재 판매하거나 질권의 목적으로 사용하는 행위</li>
            <li>서비스 이용 권한을 타인에게 공유, 제공, 양도, 중개, 재 판매하는 행위</li>
            <li>본 약관 상 의무를 회피하기 위해 중복계정, 타인명의 계정 등을 활용하여 서비스를 이용하는 행위</li>
            <li>서비스 내에 게재된 광고의 내용, 링크, 순서 및 이에 포함된 정보 등을 변경, 조작하는 등의 행위</li>
            <li>회원이 회사와 계약된 방법 이외의 부정한 수익을 추구하여 회사에 고의적인 손실을 입히는 행위</li>
            <li>방문자에게 금품을 제공하는 등 기타의 방법으로 겟꿀보다 더 낮은 가격으로 상품을 구매할 수 있도록 유인하는 행위</li>
            <li>본 서비스 제공 취지에 반하여 방문자의 관심이 아닌 회원이 발생시킨 광고 클릭이나 본인 및 가족 구매를 통해 수익을 발생시키는 행위</li>
            <li>겟꿀이 그 권리를 보유하고 있는 표장 및/또는 이와 혼동을 일으킬 정도로 유사한 단어와 동일하거나 유사한 상표를 겟꿀의 영업과 오인, 혼동을 일으키는 방식으로 상표/상호/도메인으로써 사용하는 행위</li>
            <li>회원이 미디어에 사실과 다르거나, 과장∙왜곡∙오인의 가능성이 있는 내용을 표시하는 등 표시광고법 기타 관련 법령에 위반되는 내용을 게시하는 행위</li>
            <li>회원이 제3자 컨텐츠 등에 해당 컨텐츠의 의도와 상관없는 내용이나 회사의 이미지/사업 등에 손실을 끼치는 내용 등의 댓글을 게시하는 행위</li>
            <li>해당 게시물과 관계없는 브랜드 및 제품명 등 제품정보를 언급하여 제3자에게 피해를 끼치거나 끼칠 우려가 있는 행위</li>
            <li>겟꿀에 공식적으로 공개되지 않은 프로모션 등을 광고하는 행위</li>
            <li>겟꿀 파트너스의 이용 목적 및 기타 서비스의 운영정책에 위배되는 모든 행위</li>
          </ul>
        </li>
        <li>
          회사는 회원이 본 조항을 위반한 경우, 회원의 소명/시정을 요청할 수 있습니다. 이러한 경우, 회원은 소명/시정 요청을 받은 기간
          (단, 불가피한 사유로 회사가 회원의 제출 기간 연장 요청에 동의한 경우에는 그 기간) 이내에 관련 소명을 제출하거나 회신하여야 합니다.
        </li>
        <li>회원은 본 조항에 명시된 의무를 이행하지 못하여 더 이상 겟꿀 파트너스 활동을 지속하기 어렵다고 판단되는 경우, 회사는 겟꿀 파트너스 활동을 제한하는 등의 조치를 취할 수 있습니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제9조 (회원정보 변경)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회원은 가입신청 시 기재한 회원정보에 변경이 있는 경우, 회원정보 수정 등의 방법으로 그 변경사항을 반영하여야 하며, 정산과 관련된 주요 정보(개인정보, 사업자정보, 계좌정보 등)를 변경할 경우, 회사에 별도로 통지하여야 합니다.</li>
        <li>연락처(전화번호, 이메일 주소 포함)가 변경되는 경우에는 즉시 전화번호, 이메일 주소 정보를 수정하고, 주기적으로 연락처가 유효한지 확인하여야 합니다.</li>
        <li>회원이 전항을 준수하지 않아 발생하는 회원의 손해에 대하여 회사는 아무런 책임을 지지 않습니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제10조 (아이디 및 비밀번호의 관리)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>겟꿀 파트너스의 경우 광고회원의 고유 아이디는 회사에서 자동으로 부여합니다.</li>
        <li>아이디와 비밀번호에 대한 모든 관리책임은 회원에게 있으며, 회원은 이를 제3자가 이용하도록 하여서는 안됩니다.</li>
        <li>아이디와 비밀번호의 관리소홀, 부정사용에 의하여 발생하는 모든 결과에 대한 책임은 회원에게 있습니다.</li>
        <li>회원은 아이디 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를 즉시 회사에 통지하고 회사의 안내에 따라야 합니다.</li>
        <li>회원이 전항을 준수하지 않아 발생한 불이익에 대하여 회사는 아무런 책임을 지지 않습니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제11조 (서비스의 변경)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사는 안정적인 서비스 제공을 위하여 서비스의 내용, 운영상 또는 기술상 사항 등을 변경할 수 있습니다.</li>
        <li>회사는 서비스를 변경할 경우 변경내용과 적용일자를 명시하여 서비스 내에 사전 공지합니다. 단, 회원의 권리나 의무 및 서비스 이용과 관련되는 실질적인 사항을 변경할 경우 적용일자 7일전부터 공지하며, 회원에게 불리한 변경의 경우 적용일자 14일전부터 공지합니다.</li>
        <li>회원은 서비스 변경에 동의하지 않을 경우 회사에 거부의사를 표시하고 회원 탈퇴를 할 수 있습니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제12조 (회원의 게시물)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회원은 자신이 운영하는 미디어 및 게재한 게시물의 내용이 회사 또는 제3자의 권리에 대한 침해나 지식재산권 및 관련 법령에 대한 위반이 되지 않음을 보증하여야 합니다.</li>
        <li>회원이 본 조 제1항을 위반하거나 회사가 규정한 게시물 또는 광고물 규격을 지키지 않는 등 이 약관을 위반(운영정책에서 정한 제한행위 모두 포함)하는 경우, 회사는 회원에게 이에 대한 시정요구 등을 할 수 있으며, 회원이 이를 거부하는 경우 회사는 서비스 이용제한, 회원 자격상실 등의 조치를 임의적으로 취할 수 있습니다.</li>
        <li>회원이 본 조를 위반하여 제3자의 권리를 침해하거나 지식재산권 및 관련 법령에 위반하였다는 이유로 회사가 금지청구, 손해배상청구, 고소 등 법적 조치를 당할 경우에는 자신의 비용으로 회사를 면책시켜야 합니다. 이와 관련하여 회사가 제3자에게 손해배상책임을 부담하는 경우에는 회사의 손해배상액 및 그 배상과 관련된 부대비용 등(이자 및 변호사 보수 등의 방어비용 포함)을 회원이 전적으로 부담합니다.</li>
        <li>회원은 자신이 운영하는 미디어에 상품 추천의 내용이 포함된 게시물을 게재할 경우, 공정거래위원회의 '추천·보증 등에 관한 표시·광고 심사지침'에 따라 추천·보증인인 회원과 회사의 경제적 이해관계에 대하여 공개하는 등 관련 법령 및 행정청의 가이드에 따른 의무를 준수하여야 합니다.</li>
        <li>본조에도 불구하고 회원은 지식재산권 침해 등 이용약관 및 운영정책을 위반하는 콘텐츠가 포함된 게시물이 발견되는 즉시 책임지고 삭제하여야 합니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제13조 (서비스의 중단)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사는 컴퓨터 등 정보통신설비의 보수, 점검, 교체, 고장 또는 통신의 두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
        <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스의 제공을 제한하거나 일시 중단할 수 있습니다.</li>
        <li>회사는 제1항 및 제2항에 따른 서비스 중단의 경우에는 그 사실과 사유를 사전에 공지합니다. 단, 사전에 공지하기 어려운 사정이 있는 경우에는 사후 가능한 시점에 공지합니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제14조 (실적 측정)</h3>
      <p className="text-gray-700 leading-relaxed mb-4">
        회원의 미디어를 통해 발생하는 모든 실적 집계는 회사에서 제공되는 실적 측정을 기준으로 하며, 회원은 이에 대해 이의를 제기할 수 없습니다.
      </p>

      <h3 className="text-lg font-bold mt-6 mb-3">제15조 (데이터의 수집 및 이용)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사는 서비스를 제공함에 있어 비정상적인 방법의 광고 여부 판단 등을 위하여 OS와 디바이스의 정보를 수집할 수 있습니다. "회사"는 수집하는 데이터의 주요 항목에 대해서는 운영정책에서 정합니다.</li>
        <li>회사는 전항에 따라 수집한 정보를 회사가 제공하는 서비스 등을 위하여 이용할 수 있으며, 관련 법령에 따라 제3자에게 제공할 수 있습니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제16조 (이용제한 등)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사는 회원이 관련법령, 이 약관 또는 운영정책상 의무를 위반하거나 기타 서비스의 정상적인 운영을 방해하는 경우 또는 회원이 운영하는 미디어가 운영정책에서 정한 기준에 따라 광고매체로써의 기능이 현저히 떨어진다고 판단될 경우 광고 게재 중지, 수익금 지급 중지, 회원자격 상실 등 단계적으로 이용을 제한할 수 있습니다.</li>
        <li>회사는 전항에도 불구하고 회원의 위반행위가 사회적 또는 서비스 운영으로 미치는 악영향이 크거나, 회사의 명예나 신용 등을 훼손하거나 훼손할 우려가 있는 경우, 소비자 보호 및 법률 준수 등을 위해 즉각적인 조치가 필요한 경우, 회사가 시정기한을 정하여 시정을 요청하였음에도 불구하고 정당한 사유 없이 이를 시정하지 않은 경우에는 사전 통지 없이 수익금 지급을 중지할 수 있으며, 즉시 회원자격 상실 조치를 하거나 직권 해지할 수 있습니다.</li>
        <li>회사는 판매자로부터 제품과 관련된 민원 등이 인입되는 경우에 회원에게 게시물의 노출 중단/삭제 등을 요청할 수 있으며, 이에 응하지 않을 경우 회사는 본조 제1항에 따라 단계적으로 조치를 취할 수 있습니다.</li>
        <li>회사는 회원이 휴업 또는 폐업 상태의 사업자로 확인될 경우 광고 게재를 중지할 수 있습니다.</li>
        <li>회사가 회원에게 이용제한을 하는 경우 회사는 이 약관 제18조에 따라 회원에게 통지합니다.</li>
        <li>회원은 회사의 이용제한에 대해 회사가 정한 절차에 따라 이의신청을 할 수 있습니다. 이 때 이의가 정당하다고 회사가 인정하는 경우 회사는 해당 조치를 철회할 수 있습니다.</li>
        <li>회사가 행하는 이용제한의 세부내용은 운영정책에서 정합니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제17조 (해지)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회원은 언제든지 직접 서비스에 접속하여 이 약관의 해지를 신청할 수 있으며, 회사는 관련 법령이 정하는 바에 따라 이를 즉시 처리하여야 합니다. 다만, 회원의 미정산 수입이 있는 경우 회사는 미정산 수입을 차후 지급합니다.</li>
        <li>본 조 제1항의 경우 회원은 이 약관의 해지일 이후 재가입 신청을 할 수 있습니다. 또한, 재가입하는 경우에도 회원의 기존의 이용 기록이 승계되지는 않습니다.</li>
        <li>
          회사는 회원에게 다음 각 호의 어느 하나에 해당하는 사유가 있는 경우에는 해당 회원과의 이 약관을 해지할 수 있습니다. 이 경우 회원에게 의견제출의 기회를 사전에 부여할 수 있습니다.
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>회사 또는 제3자의 권리, 명예, 신용 및 그 밖의 정당한 이익을 침해하거나 관련 법령 또는 공서양속에 위배되는 행위를 한 경우</li>
            <li>회사가 제공하는 서비스의 원활한 진행을 방해하는 행위를 하거나 시도한 경우</li>
            <li>제4조에 따른 승낙거부사유가 있는 경우</li>
            <li>회원이 회사로부터 요청 받은 정보 또는 증빙자료를 제공하지 아니하거나 허위로 제공한 경우</li>
            <li>이 약관 등에서 금지 또는 제한행위(등록제한, 이용제한 행위 등 모두 포함)를 한 경우</li>
            <li>이 약관에 따른 의무를 위반한 경우</li>
            <li>그 밖에 회사가 합리적인 이유로 서비스의 제공을 거부할 수 있는 경우</li>
          </ul>
        </li>
        <li>
          당사자 일방은 상대방에게 다음 각 호의 어느 하나에 해당하는 사유로 인하여 이 약관을 정상적으로 이행할 수 없게 된 경우에는 그 상대방에게 별도의 최고 없이 해지의 통지를 함으로써 이 약관을 해지할 수 있습니다.
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>이용계약에 따른 의무를 위반하고 이를 시정하지 아니한 경우</li>
            <li>부도 등 금융기관의 거래정지, 회생 및 파산절차의 개시가 있거나 이에 해당할 상당한 우려가 있는 경우</li>
            <li>법률, 법원의 판결이나 명령, 영업정지 및 취소 등의 행정처분, 또는 행정지도 등 정부의 명령 등</li>
            <li>가압류, 압류, 가처분, 경매 등의 강제집행 등</li>
            <li>주요 자산에 대한 보전처분, 영업양도 및 합병 등</li>
          </ul>
        </li>
        <li>본 조 제3항 및 제4항에 따라 해지된 회원 또는 이용제한 기간 중 해지한 회원은 재가입이 제한될 수 있습니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제18조 (회원 통지)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사가 회원에 대하여 통지를 하는 경우 이 약관에 별도의 규정이 없는 한 회원이 제공한 전자우편주소, (휴대)전화번호 등으로 할 수 있습니다.</li>
        <li>회사는 회원 전체에 대하여 통지를 하는 경우 7일 이상 서비스 내 게시판에 게시함으로써 전항의 통지에 갈음할 수 있습니다. 다만, 회원의 서비스 이용에 중대한 영향을 주는 사항에 대하여는 개별 통지합니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제19조 (지식재산권 등)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사가 제공하는 서비스와 관련하여 회사가 자체적으로 제작한 저작물(회원으로부터 제공받은 상품콘텐츠를 활용하여 회사가 제작한 2차적 저작물을 포함)에 관한 지식재산권(특허ㆍ실용실안ㆍ디자인ㆍ상표권과 저작권 포함)은 회사에게 있으며, 회원이 이를 회사의 사전 서면 승인 없이 사용한 경우 회원은 민·형사상 모든 책임을 부담합니다.</li>
        <li>회원이 작성한 콘텐츠, 게시물 등은 회원의 동의 없이 회사가 제공하는 서비스 및 관련 프로모션 등에 노출되거나 해당 노출을 위해 필요한 범위 내에서 일부 수정, 복제, 편집되어 게시될 수 있습니다.</li>
        <li>본 조의 내용은 이 약관이 종료 이후에도 유효하게 존속합니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제20조 (손해배상 등)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사는 서비스 이용과 관련하여 회사의 고의 또는 과실로 인해 회원에게 손해가 발생한 경우 관련 법령이 규정하는 범위 내에서 회원에게 그 손해를 배상합니다.</li>
        <li>회원이 이 약관 또는 관련 법령을 위반하여 회사에 손해가 발생한 경우 관련 법령이 규정하는 범위 내에서 회사에 그 손해를 배상합니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제21조 (회사의 면책)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>회사는 천재지변, 디도스(DDOS)공격, IDC장애, 기간통신사업자의 회선 장애, 미디어의 장애 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임을 지지 않습니다.</li>
        <li>회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여는 책임을 지지 않습니다.</li>
        <li>회사는 회원이 서비스를 이용하여 얻은 정보 등으로 인하여 입은 손해에 대하여 책임을 부담하지 않습니다.</li>
        <li>회원이 등록한 미디어의 내용, 영업 등에 대한 모든 책임은 회원에게 있으며 회사는 이에 대하여 책임을 지지 않습니다.</li>
      </ol>

      <h3 className="text-lg font-bold mt-6 mb-3">제22조 (준거법 및 관할법원)</h3>
      <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
        <li>이 약관의 해석 및 회사와 회원간의 분쟁에 대하여는 대한민국의 법률을 적용합니다.</li>
        <li>이 약관 및 "서비스" 이용과 관련하여 회사와 회원 사이에 분쟁이 발생하여 소송이 제기되는 경우에는 「민사소송법」에 따라 관할법원을 정합니다.</li>
      </ol>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>[부칙]</strong><br />
          본 약관은 2025년 9월 11일부터 적용됩니다.
        </p>
      </div>
    </div>
  );
}

// 운영정책 컴포넌트
function OperatingPolicy() {
  return (
    <div className="prose max-w-none text-sm">
      <h2 className="text-2xl font-bold mb-4">겟꿀 마케팅 제휴 프로그램 운영정책</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        겟꿀 파트너스는 공정한 서비스 유지 및 이용자 보호를 위해 다음의 정책에 따라 서비스를 운영하고 있습니다.
        겟꿀 파트너스 가입 신청자와 가입 회원은 다음의 운영정책을 반드시 확인하고 동의 및 준수하셔야 하며,
        운영정책을 준수하지 않음으로 인해 서비스 이용에 제한을 받으시는 일이 없도록 주의하여 주시기 바랍니다.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">1. 회원가입</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        겟꿀 파트너스는 다음의 기준에 따라 가입 여부를 심사하고 있습니다.
      </p>

      <h4 className="text-lg font-bold mt-6 mb-3">1.1. 가입심사</h4>
      <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
        <li>겟꿀 회원이라면 누구나 겟꿀 파트너스 서비스 신청이 가능합니다. 단, 미성년자나 비영리법인, 면세사업자, 외국인의 경우 신청이 거절될 수 있습니다.</li>
        <li>서비스 신청 이후 회사가 사전에 안내한 일정 금액의 수익 발생 시 해당 회원의 채널을 검토하여 최종승인 여부를 결정합니다.</li>
        <li>
          가입 신청자의 자격요건은 다음 기준에 의해 심사합니다.
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>
              <strong>개인회원(사업자가 아닌 회원)</strong><br />
              개인으로 가입을 원하는 자는 실명확인 절차를 거쳐 서비스 가입이 가능합니다.
            </li>
            <li>
              <strong>사업자인 회원</strong><br />
              사업자로 가입을 원하는 자는 사업자정보의 유효성과 계정 및 사업자정보 일치 여부 확인을 위해 별도의 서류를 제출해야 합니다. (사업자등록증 사본)<br />
              <span className="text-xs">※ 명의도용 방지를 위해 겟꿀 회원 가입자명과 개인사업자의 대표자명은 동일한 경우에 한해 가입이 허용됩니다.</span>
            </li>
          </ol>
        </li>
      </ul>

      <h4 className="text-lg font-bold mt-6 mb-3">1.2. 가입제한</h4>
      <p className="text-gray-700 leading-relaxed mb-2">
        겟꿀 파트너스는 안정적인 서비스 운영 및 회원의 이익 보호를 위해 다음의 경우 서비스 가입을 제한할 수 있습니다.
      </p>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
        <li>가입신청자가 겟꿀 파트너스 약관 및 운영정책에 어긋나는 행동을 한 후 자진하여 탈퇴한 적이 있는 경우</li>
        <li>가입신청자가 겟꿀 파트너스 약관 및 운영정책에 어긋나는 행동을 하여 직권해지 된 적이 있는 경우</li>
      </ul>

      <h4 className="text-lg font-bold mt-6 mb-3">1.3. 정보변경</h4>
      <p className="text-gray-700 leading-relaxed mb-2">
        회원은 정보변경페이지에서 본인의 정보를 열람하고 변경할 수 있습니다. 단, 다음에 해당하는 항목은 변경이 제한됩니다.
      </p>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
        <li>아이디, 이름, 주민등록번호, 사업자등록번호는 변경할 수 없습니다.</li>
        <li>대표자명 등 사업자정보를 변경하고자 하는 경우 회사가 요구하는 증빙 제출 및 심사를 통해 정보변경이 가능합니다.</li>
        <li>겟꿀 회원가입자명과 개인사업자의 대표자명을 서로 다르게 변경할 수 없습니다.</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4">2. 미디어등록기준</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        겟꿀 파트너스 서비스를 이용하기 위해서는 광고가 노출될 미디어를 등록하여야 합니다.
        회원이 등록 신청한 미디어에 대해 광고매체로서의 적합성 여부 등을 심사하며,
        이용약관 및 운영정책에 위배되는 사항이 발견될 경우 등록을 거절 또는 취소할 수 있습니다.
      </p>

      <h4 className="text-lg font-bold mt-6 mb-3">2.1. 공통 등록기준</h4>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
        <li>회원의 미디어에 대한 광고매체로써의 품질을 평가하기 위해 아래 내용을 종합적으로 심사합니다.</li>
        <li>미디어 운영기간 및 이용가능한 전체 공개 콘텐츠의 수</li>
        <li>광고매체로써의 콘텐츠 적합성, 등록제한 콘텐츠 존재 여부</li>
        <li>회원제로 운영되는 미디어의 경우 테스트ID 및 비밀번호를 검수 시 제공해야 합니다.</li>
      </ul>

      <h4 className="text-lg font-bold mt-6 mb-3">2.2. 등록제한</h4>
      <p className="text-gray-700 leading-relaxed mb-2">
        다음의 내용이 확인되는 미디어는 등록이 거절되거나 취소될 수 있습니다.
      </p>
      <ul className="list-disc pl-6 space-y-0.5 text-xs text-gray-700 mb-4">
        <li>성인콘텐츠, 성인용품, 성매매 또는 유흥업소 관련 내용</li>
        <li>애인대행 및 역할대행 서비스 관련 내용</li>
        <li>선정적이거나 혐오, 폭력적인 내용</li>
        <li>웹하드, P2P, 무료 음원 제공 관련 내용</li>
        <li>게임 아이템 거래 관련 내용</li>
        <li>도박, 카지노, 경륜, 경마 등 사행성이 포함된 내용</li>
        <li>대부업, 대부중개업 등 사금융 관련 내용</li>
        <li>흥신소, 심부름센터 관련 내용</li>
        <li>이미테이션 제품 홍보/판매 등 관련 내용</li>
        <li>복권 판매 내용</li>
        <li>총기, 도검류 판매 내용</li>
        <li>불법건강식품, 주류, 담배, 마약, 불법의약품 관련 내용</li>
        <li>해킹, 크래킹 관련 내용</li>
        <li>기타 불법 및 범죄적 행위에 결부 및 불법 행위를 조장하는 내용</li>
        <li>특정 개인이나 집단, 단체, 성별, 민족, 인종, 종교, 장애인 등에 대한 비방 및 차별 내용</li>
        <li>용공 등 이적 표현물</li>
        <li>광고 시청, 클릭 등의 콘텐츠 이용에 대해 보상을 제공하는 경우</li>
        <li>운영자 및 제3자의 저작권, 지식재산권을 침해한 내용</li>
        <li>공공질서 및 미풍양속에 위반되는 내용</li>
        <li>보편적 사회정서를 침해하거나 사회적 혼란을 야기할 우려가 있는 경우</li>
        <li>비정상적으로 트래픽을 유도하는 경우</li>
        <li>방문자에게 금품을 제공하는 등 기타의 방법으로 겟꿀보다 더 낮은 가격으로 상품을 구매할 수 있도록 유인하는 행위</li>
        <li>기타 관련법령 및 이용약관, 운영정책에 위배되는 경우</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4">3. 데이터의 수집 및 이용</h3>
      <p className="text-gray-700 leading-relaxed mb-2">
        겟꿀 파트너스 서비스를 제공함에 있어 어뷰징 여부의 판단, 광고의 타겟팅 등을 위해 필요할 경우 미디어와 Device의 정보를 수집할 수 있습니다.
        수집하는 주요 항목은 다음과 같으며, 개인정보처리방침에서 규정하지 않은 개인정보는 수집하지 않습니다.
      </p>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
        <li>OS의 종류 및 버전, 브라우저 정보, IP 정보 등</li>
      </ul>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>※ 본 운영정책은 2025년 9월 11일부터 적용됩니다.</strong>
        </p>
      </div>
    </div>
  );
}

// 개인정보 처리방침 컴포넌트
function PrivacyPolicy() {
  return (
    <div className="prose max-w-none text-sm">
      <h2 className="text-2xl font-bold mb-4">겟꿀 개인정보 처리방침</h2>

      <p className="text-gray-700 leading-relaxed mb-6">
        주식회사 제이지디글로벌(이하 '회사')는 「개인정보 보호법」및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 '정보통신망법')」에 따라
        이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
        개인정보 처리방침을 변경하는 경우에는 변경에 대한 사실 및 시행일, 변경 전후의 내용을 홈페이지 공지사항을 통해 지속적으로 공개합니다.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        본 개인정보 처리방침은 회사가 제공하는 겟꿀 파트너스 서비스에 적용됩니다.
      </p>

      <p className="text-gray-700 leading-relaxed mb-6">
        회사는 수집한 개인정보를 본래 수집한 목적 이외의 용도로 이용하지 않으며, 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라
        별도의 동의를 받는 등 필요한 조치를 이행합니다.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">1. 개인정보 수집 항목 및 목적과 보유 기간</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        회사는 서비스 이용에 필요한 최소한의 개인정보를 수집합니다.
      </p>

      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-300 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2">분류</th>
              <th className="border border-gray-300 px-3 py-2">목적</th>
              <th className="border border-gray-300 px-3 py-2">항목</th>
              <th className="border border-gray-300 px-3 py-2">보유 및 이용기간</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2">필수</td>
              <td className="border border-gray-300 px-3 py-2">회원 가입 및 이용자 식별, 회원관리</td>
              <td className="border border-gray-300 px-3 py-2">아이디(이메일), 이름, 휴대폰번호, 비밀번호</td>
              <td className="border border-gray-300 px-3 py-2">회원탈퇴 시 90일간 보관 후 파기</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">필수</td>
              <td className="border border-gray-300 px-3 py-2">수익금 정산 및 지급</td>
              <td className="border border-gray-300 px-3 py-2">계좌정보(은행명, 계좌번호, 예금주명), 사업자등록번호(사업자 회원)</td>
              <td className="border border-gray-300 px-3 py-2">회원탈퇴 시 90일간 보관 후 파기</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">필수</td>
              <td className="border border-gray-300 px-3 py-2">부정행위 방지</td>
              <td className="border border-gray-300 px-3 py-2">부정행위 탐지된 아이디(이메일), 이름, 휴대폰번호, 부정행위 기록</td>
              <td className="border border-gray-300 px-3 py-2">회원탈퇴 시 180일 보관 후 파기</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">선택</td>
              <td className="border border-gray-300 px-3 py-2">마케팅 및 프로모션</td>
              <td className="border border-gray-300 px-3 py-2">아이디(이메일), 휴대폰번호</td>
              <td className="border border-gray-300 px-3 py-2">회원탈퇴 시 파기</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 className="text-lg font-bold mt-6 mb-3">자동으로 수집되는 정보</h4>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
        <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 기기정보</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4">2. 개인정보의 제공과 위탁</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        회사는 이용자에게 사전 동의를 받은 범위 내에서만 개인정보를 제3자에게 제공합니다.
      </p>
      <p className="text-gray-700 leading-relaxed mb-4">
        다만, 회사는 「개인정보 보호법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 다른 법률에 특별한 규정이 있는 경우에
        법률에서 규정한 적법한 절차에 따라 제3자에게 이용자의 개인정보를 제공할 수 있습니다.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">3. 개인정보의 파기 절차 및 방법</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 해당 개인정보를 파기합니다.
      </p>

      <h4 className="text-lg font-bold mt-6 mb-3">파기 절차 및 방법</h4>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
        <li><strong>파기 절차:</strong> 개인정보 목적 달성 후 내부 방침 및 관련 법령에 의한 의무에 따라 일정기간 동안 별도로 분리하여 저장 후 파기합니다.</li>
        <li><strong>파기 방법:</strong> 전자적 파일 형태로 저장된 개인정보는 기록을 복원이 불가능한 방법으로 영구 파기하며, 종이문서에 저장된 개인정보는 분쇄기로 분쇄하거나 소각 등을 통하여 파기합니다.</li>
      </ul>

      <h4 className="text-lg font-bold mt-6 mb-3">법령에 따른 개인정보 보유</h4>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border border-gray-300 text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-3 py-2">보유정보</th>
              <th className="border border-gray-300 px-3 py-2">보유기간</th>
              <th className="border border-gray-300 px-3 py-2">근거법령</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-3 py-2">대금결제 및 재화 등의 공급에 관한 기록</td>
              <td className="border border-gray-300 px-3 py-2">5년</td>
              <td className="border border-gray-300 px-3 py-2">「전자상거래 등에서의 소비자보호에 관한 법률」</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">계약 또는 청약철회 등에 관한 기록</td>
              <td className="border border-gray-300 px-3 py-2">5년</td>
              <td className="border border-gray-300 px-3 py-2">「전자상거래 등에서의 소비자보호에 관한 법률」</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">소비자의 불만 또는 분쟁 처리에 관한 기록</td>
              <td className="border border-gray-300 px-3 py-2">3년</td>
              <td className="border border-gray-300 px-3 py-2">「전자상거래 등에서의 소비자보호에 관한 법률」</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-3 py-2">웹사이트, 앱 방문 기록</td>
              <td className="border border-gray-300 px-3 py-2">3개월</td>
              <td className="border border-gray-300 px-3 py-2">「통신비밀보호법」</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">4. 이용자의 권리·의무 및 그 방법</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 개인정보의 처리에 동의하지 않는 경우 동의를 거부하거나
        가입 해지(회원 탈퇴)를 요청할 수 있습니다.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">5. 개인정보의 안전성 확보조치</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        회사는 이용자의 개인정보를 처리함에 있어 개인정보가 도난, 유출, 변조, 또는 훼손되지 않도록 기술적 관리적 보호조치를 강구하고 있습니다.
      </p>
      <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-4">
        <li><strong>기술적 보호조치:</strong> 해킹시도 및 유출에 대한 실시간 모니터링 및 차단, 접근통제 적용, 비밀번호 및 개인정보 암호화 저장</li>
        <li><strong>관리적 보호조치:</strong> 개인정보보호 전담조직 운영, 개인정보취급자 대한 정기적인 교육 수행</li>
        <li><strong>물리적 보호조치:</strong> 외부로부터 접근이 통제된 구역에 시스템 설치 및 운영</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4">6. 개인정보보호책임자</h3>
      <p className="text-gray-700 leading-relaxed mb-3">
        회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여
        아래와 같이 개인정보보호책임자를 지정하고 있습니다.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-sm text-gray-700 mb-2"><strong>회사명:</strong> 주식회사 제이지디글로벌</p>
        <p className="text-sm text-gray-700 mb-2"><strong>개인정보보호 담당부서:</strong> 개인정보보호팀</p>
        <p className="text-sm text-gray-700 mb-2"><strong>이메일:</strong> privacy@getkkul.com</p>
        <p className="text-sm text-gray-700"><strong>겟꿀 파트너스 고객센터:</strong> partners@getkkul.com</p>
      </div>

      <h4 className="text-lg font-bold mt-6 mb-3">개인정보 침해 관련 상담 및 신고</h4>
      <ul className="list-disc pl-6 space-y-1 text-xs text-gray-700 mb-6">
        <li>개인정보분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)</li>
        <li>개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)</li>
        <li>대검찰청 : (국번없이) 1301 (www.spo.go.kr)</li>
        <li>경찰청 : (국번없이) 182 (ecrm.police.go.kr)</li>
      </ul>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>개인정보처리방침 시행일자:</strong> 2025년 9월 11일
        </p>
      </div>
    </div>
  );
}

