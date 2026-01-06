'use client';

// 이용약관 컴포넌트
export function TermsOfService() {
    return (
        <div className="prose max-w-none text-sm">
            <h2 className="text-2xl font-bold mb-6">겟꿀 마케팅 제휴 프로그램 이용약관 (겟꿀 파트너스)</h2>

            <h3 className="text-lg font-bold mt-6 mb-3">제1조 (목적)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                이 약관은 주식회사 제이지디글로벌(이하 “회사”라고 합니다)이 제공하는 마케팅 제휴 프로그램인 겟꿀 파트너스를 회원이 이용함에 있어서, 회사와 회원 사이의 권리ᆞ의무, 책임사항, 서비스 이용절차 및 그 밖의 제반 사항을 명확히 하여 쌍방의 원활한 거래를 도모하고 궁극적으로 공동의 이익을 증진하여 상호 발전을 도모하는 것을 그 목적으로 합니다.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">제2조 (용어의 정의)</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
                이 약관에서 사용하는 용어의 정의는 다음과 같습니다. 이 약관에서 정의되지 않은 용어는 일반 거래 관행에 따라 정의된 의미를 가집니다.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>“겟꿀(Getkkul)”이란 회사가 컴퓨터, 스마트폰 등 정보통신설비를 이용하여 판매자와 이용자가 재화 또는 용역을 거래할 수 있도록 통신판매중개 서비스를 제공하는 가상의 영업장((https://partners.getkkul.com 등 회사가 운영하는 웹사이트 및 모바일 웹, 앱 등을 모두 포함)을 의미합니다.</li>
                <li>“겟꿀 파트너스(이하 “겟꿀 파트너스”라고 합니다)”란 회사가 제공하는 광고를 회원이 운영하는 미디어에 게재하여 방문자의 관심에 의해 발생한 광고 클릭을 통해 회사가 얻은 수익을 회사”와 “회원”이 일정한 비율로 분배하는 광고서비스 및 이에 부수되는 제반 서비스를 의미합니다.</li>
                <li>“회원”이란 회사가 제공하는 광고 등을 자신의 미디어에 게재하고, 겟꿀 내 공유하기 기능을 통해 그 성과에 대한 수입을 취할 목적으로 이 약관에 동의하고 서비스 가입자로 승인을 받은 자를 의미합니다. 회원은 개인이나 법인 모두 가능하며 성과에 대해 회사로부터 약정된 대가를 받게 됩니다.</li>
                <li>“방문자”란 컴퓨터 또는 모바일기기 등 디바이스를 통해 회원의 미디어에 방문한 자를 의미합니다.</li>
                <li>“미디어”란 이 약관에 따라 회사의 광고를 게재하는 매체로 회원이 운영하는 블로그, 웹사이트 등을 의미합니다.</li>
                <li>“수입”이란 회사의 광고를 회원의 미디어에 게재하여 매출이 발생했을 때 회사가 회원에게 지급하게 되는 금액을 의미합니다.</li>
                <li>“겟꿀캐시”란 겟꿀에서 상품 등을 구매할 때 사용할 수 있는 결제 수단을 의미합니다.</li>
                <li>“부당한 수입”이란 회원이 약관, 운영정책, 또는 관련 법령 등을 위반하거나 방문자가 약관, 운영정책 또는 관련법령에서 금지한 행위를 하여 회원에게 발생한 수입을 의미합니다.</li>
            </ul>

            <h3 className="text-lg font-bold mt-6 mb-3">제3조 (약관의 명시, 효력 및 개정)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회사는 이 약관의 내용을 회원이 알 수 있도록 서비스의 관련 화면(파트너스 사이트 내 ‘약관 및 정책’)을 통해 게시합니다.</li>
                <li>회사는 이 약관에서 규정되지 않은 세부적인 내용을 별도의 “겟꿀 파트너스 운영 정책(이하 “운영정책“이라 합니다)“으로 규정할 수 있고, 이를 서비스의 관련 화면 등을 통하여 공지하기로 합니다. 또한, 이러한 운영정책은 이 약관의 일부를 구성하며, 이 약관과 동일한 효력이 있습니다.</li>
                <li>본 약관과 관련하여, 별도 합의가 필요한 경우 서면에 의해야 합니다. 별도 합의한 내용이 본 약관과 상이한 경우, 본 약관에 우선합니다.</li>
                <li>회사는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 이 약관(또는 운영정책, 이하 동일함)을 개정할 수 있습니다.</li>
                <li>회사가 이 약관을 개정할 경우에는 적용일자 및 개정사유를 명시하여 현행 약관과 함께 그 적용일자 7일 이전(회원에게 불리한 내용으로 변경할 때에는 14일 이전)부터 적용일자 전일까지 서비스의 관련 화면에 공지하거나 전자우편 또는 그 밖의 방법으로 통지합니다.</li>
                <li>회사가 전항에 따라 개정 약관을 공지하면서 회원에게 적용일자 전일까지 의사표시를 하지 않으면 의사표시가 표명된 것으로 본다는 뜻을 명확하게 공지 또는 통지하였음에도 판매자가 명시적으로 거부의 의사표시를 하지 아니한 경우에는 회원이 개정 약관에 동의한 것으로 봅니다.</li>
                <li>회원은 개정 약관에 동의하지 않는 경우 적용일자 전일까지 회사에 거부의사를 표시하고 가입을 해지할 수 있습니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제4조 (회원가입)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회원가입은 겟꿀 파트너스 사이트를 통해 서비스를 이용하고자 하는 자(이하 "가입신청자"라고 합니다)가 회사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 하면, 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</li>
                <li>
                    회사는 가입신청자의 신청에 대하여 아래 각 호의 사유가 있는 경우에는 승낙을 하지 않을 수 있으며, 가입 이후에도 아래 각 호의 사유가 확인될 경우에는 이 약관을 해지할 수 있습니다.
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>가입신청자가 겟꿀 회원이 아닌 경우.</li>
                        <li>가입신청자가 겟꿀에 소속된 직원이거나 그 직계 가족일 경우</li>
                        <li>가입신청자가 이 약관에 의하여 이전에 "회원" 자격을 상실한 적이 있는 경우.</li>
                        <li>가입신청자가 이 약관 위반 등의 사유로 서비스 이용제한 중에 재가입신청을 하는 경우.</li>
                        <li>가입신청자가 이미 서비스에 가입이 되어 있는 경우</li>
                        <li>실명이 아닌 명의 또는 타인의 명의를 기재한 경우.</li>
                        <li>허위 또는 잘못된 정보를 기재 또는 제공하거나 회사가 정한 신청 요건이 미비한 경우.</li>
                        <li>가입신청자의 귀책사유로 인하여 승낙이 불가능하거나 기타 이 약관에서 규정한 제반 사항을 위반하여 신청을 하는 경우.</li>
                    </ul>
                </li>
                <li>본 조에 따른 신청에 대하여 회사는 본인확인기관을 통한 본인확인을 가입신청자에게 요청할 수 있습니다.</li>
                <li>회원가입은 회사의 승낙이 이용신청자에게 도달한 때 완료됩니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제5조 (정산방식)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회사는 서비스를 통하여 측정된 실적과 그에 따라 별도로 정한 수익 배분 기준에 따라 CPS(Cost Per Sale) 방식으로 산정된 수입을 회원에게 지급합니다.</li>
                <li>수입 지급은 1일부터 말일 기준 1개월 단위를 원칙으로 하며, 취소 및 반품된 금액은 수입에서 모두 제외됩니다.</li>
                <li>수입지급의 최소 금액은 10,000원이며, 월간 수입이 10,000원을 넘지 않을 경우에 정산 금액은 이월 처리됩니다. 금액 미달로 인한 최대 이월 가능 기간은 6개월이며, 그 이후에는 6개월간 적립된 금액이 일괄 지급됩니다.</li>
                <li>별도로 정하지 않은 경우, 수입 지급의 최대 금액은 1개월 기준 3,000만원이며, 이를 초과하여 발생한 수입은 이월되거나 지급되지 않습니다.</li>
                <li>회원이 사업자가 아닌 경우 회사는 수입 지급 금액에 따라 발생하는 제세공과금 등을 수입에서 공제하고 지급할 수 있습니다.</li>
                <li>지급 과정에서 회원의 은행계좌정보 등이 유효하지 않아 수입을 지급받지 못하는 경우 귀책사유는 회원에게 있으며 회사는 이를 보상하지 않습니다.</li>
                <li>전항의 사유로 수입이 지급되지 않은 경우 회사는 회원에게 통지하며, 회사는 회원이 은행계좌정보를 수정할 때까지 최대 6개월까지 수입의 지급을 보류할 수 있습니다.</li>
                <li>회사는 수입 지급 및 세무처리를 위하여 개인식별정보의 수집 동의, 세금계산서 등 조세 관련법령에서 규정하는 세무적 증빙의 발행을 요청할 수 있으며, 회원이 개인식별정보수집에 동의하지 않거나 세금계산서를 승인 기간 내에 승인하지 않는 경우 또는 회원이 제공한 정보가 유효하지 않은 경우 회사는 수입의 지급을 보류할 수 있습니다.</li>
                <li>회원은 수입 잔액이 0원 미만이 되는 경우, 해당 금액을 회사에 변제하여야 합니다.</li>
                <li>회사는 부당한 수입에 대해 지급을 거절할 수 있으며 이미 지급된 경우 해당 "부당한 수입"을 회원으로부터 회수할 수 있습니다.</li>
                <li>회사는 신고 등에 의해 부당한 수입으로 의심될 경우, 이에 대한 확인을 위해 조사에 착수할 수 있으며, 조사가 완료될 때까지 수입의 지급을 보류할 수 있습니다.</li>
                <li>회원 또는 회사가 이 약관 해지 의사를 표시한 경우, 회사는 해지 의사를 표시한 날까지의 수입(이하 잔여수입이라고 합니다)을 확인하여, 잔여수입이 회사가 정한 지급 기준액 이상이 되는 경우 회원에게 지급합니다. 구체적인 지급 방법 및 시기는 운영정책에서 정합니다.</li>
                <li>이용제한 또는 휴•폐업 상태에 있는 회원에게는 수입의 지급이 제한될 수 있습니다.</li>
                <li>그 외 구체적인 기준은 운영정책에서 정합니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제6조 (개인정보의 보호)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                회사는 『정보통신망 이용촉진 및 정보보호 등에 관한 법률』, 『개인정보보호법』 등 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법령 및 회사의 개인정보처리방침이 적용됩니다. 다만, 회사의 공식 사이트 이외의 링크된 사이트에서는 회사의 개인정보처리방침이 적용되지 않습니다. (개인정보처리방침: https://partners.getkkul.com/policies?tab=privacy)
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">제7조 (회사의 의무)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회사는 관련 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며, 이 약관이 정하는 바에 따라 지속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.</li>
                <li>회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보(신용정보 포함) 보호 위하여 보안시스템을 갖추어야 하며 개인정보처리방침을 공시하고 준수합니다.</li>
                <li>회사는 서비스 이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정될 경우에는 회원의 불만을 해결하기 위해 노력합니다.</li>
                <li>회사는 회사가 별도로 정한 광고수익 배분기준 및 지급절차에 따라 수입을 회원에게 지급합니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제8조 (회원의 의무)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회원은 관련 법령, 이 약관의 규정, 회사의 이용정책, 이용안내, 소명/시정 요구 등 회사가 통지하는 사항을 준수하여야 하며, 기타 회사 업무에 방해되는 행위를 하여서는 안 됩니다.</li>
                <li>
                    회원은 다음 각호의 행위를 하여서는 안 됩니다.
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-xs text-gray-700">
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
                        <li>서비스 내에 게재된 광고의 내용, 링크, 순서 및 이에 포함된 정보 등을 변경, 조작하는 등의 행위.</li>
                        <li>회원이 회사와 계약된 방법 이외의 부정한 수익을 추구하여 회사에 고의적인 손실을 입히는 행위.</li>
                        <li>방문자에게 금품을 제공하는 등 기타의 방법으로 겟꿀보다 더 낮은 가격으로 상품을 구매할 수 있도록 유인하는 행위.</li>
                        <li>본 서비스 제공 취지에 반하여 방문자의 관심이 아닌 회원이 발생시킨 광고 클릭이나 본인 및 가족 구매를 통해 수익을 발생시키는 행위</li>
                        <li>겟꿀이 그 권리를 보유하고 있는 표장 및/또는 이와 혼동을 일으킬 정도로 유사한 단어와 동일하거나 유사한 상표를 겟꿀의 영업과 오인, 혼동을 일으키는 방식으로 상표/상호/도메인으로써 사용하는 행위</li>
                        <li>회원이 미디어에 사실과 다르거나, 과장ᆞ왜곡ᆞ오인의 가능성이 있는 내용을 표시하는 등 표시광고법 기타 관련 법령에 위반되는 내용을 게시하는 행위</li>
                        <li>회원이 제3자 컨텐츠 등에 해당 컨텐츠의 의도와 상관없는 내용이나 회사의 이미지/사업 등에 손실을 끼치는 내용 등의 댓글을 게시하는 행위</li>
                        <li>해당 게시물과 관계없는 브랜드 및 제품명 등 제품정보를 언급하여 제3자에게 피해를 끼치거나 끼칠 우려가 있는 행위</li>
                        <li>겟꿀에 공식적으로 공개되지 않은 프로모션 등을 광고하는 행위</li>
                        <li>겟꿀 파트너스의 이용 목적 및 기타 서비스의 운영정책에 위배되는 모든 행위</li>
                    </ul>
                </li>
                <li>회사는 회원이 본 조항을 위반한 경우, 회원의 소명/시정을 요청할 수 있습니다. 이러한 경우, 회원은 소명/시정 요청을 받은 기간 (단, 불가피한 사유로 회사가 회원의 제출 기간 연장 요청에 동의한 경우에는 그 기간) 이내에 관련 소명을 제출하거나 회신하여야 합니다.</li>
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

            <h3 className="text-lg font-bold mt-6 mb-3">제11조 (서비스의 이용 시간 및 제공 중단)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>서비스 이용은 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 운영을 원칙으로 합니다. 단, 회사는 시스템 정기점검, 증설 및 교체를 위해 회사가 정한 날이나 시간에 서비스를 일시 중단할 수 있으며, 예정되어 있는 작업으로 인한 서비스 일시 중단은 파트너스 사이트를 통해 사전에 공지합니다.</li>
                <li>회사는 긴급한 시스템 점검, 통신망의 장애, 설비의 장애, 서비스 이용의 폭주, 국가비상사태, 정전 등 부득이한 사유가 발생한 경우 사전 예고 없이 일시적으로 서비스의 전부 또는 일부를 중단할 수 있습니다.</li>
                <li>회사는 서비스 개편 등 운영상 필요한 경우 회원에게 사전 예고 후 서비스의 전부 또는 일부의 제공을 중지할 수 있습니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제12조 (서비스의 변경 및 종료)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경할 수 있습니다. 다만, 서비스의 내용, 이용방법, 이용시간에 대하여 회원에게 불리한 변경이 있는 경우에는 변경사유, 변경될 서비스의 내용 및 제공일자 등을 그 변경 7일 전부터 파트너스 사이트에 게시합니다.</li>
                <li>회사는 경영상의 판단 등 상당한 이유가 있는 경우에 제공하고 있는 서비스의 일부 또는 전부를 종료할 수 있습니다. 이 경우 회사는 종료 30일 전부터 파트너스 사이트를 통해 공지합니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제13조 (기타 광고서비스의 이용)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                회사는 동영상 광고 등 겟꿀 파트너스 내 기타 광고서비스를 제공할 수 있으며, 해당 서비스에 대해서는 본 약관의 내용과 더불어 해당 서비스와 관련하여 별도로 공지하는 운영정책이 적용됩니다. 본 약관과 기타 광고서비스 운영정책의 내용이 상충할 경우 해당 서비스에 대해서는 운영정책이 우선합니다.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">제14조 (계약해지 및 이용제한 등)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회원은 언제든지 회사에 해지 의사를 통지함으로써 이 약관을 해지할 수 있습니다. 다만, 회원은 해지 의사를 통지하기 전 현재 진행 중인 모든 정산 절차를 완료하여야 하며, 해지로 인한 불이익은 회원 본인이 부담하여야 합니다.</li>
                <li>회원이 제8조(회원의 의무)를 위반하는 경우 회사는 이 약관을 해지하거나 회원의 서비스 이용을 제한(수입 지급 보류, 광고 노출 중단, 계정 이용 정지 등)할 수 있습니다.</li>
                <li>회사는 전항에 따라 이용을 제한할 경우, 제18조에서 정한 방법으로 회원에게 통지합니다.</li>
                <li>회원은 회사의 이용제한 조치에 대하여 회사가 정한 절차에 따라 이의신청을 할 수 있습니다. 이 때 이의가 정당하다고 회사가 인정하는 경우 회사는 즉시 서비스의 이용을 재개합니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제15조 (양도 금지)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                회원은 이 약관상의 권리ᆞ의무의 전부 또는 일부를 회사의 사전 서면 동의 없이 제3자에게 양도, 증여하거나 담보로 제공할 수 없습니다.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">제16조 (손해배상 등)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회사 또는 회원이 이 약관을 위반하여 상대방에게 손해를 입힌 경우에는 그 손해를 배상하여야 합니다.</li>
                <li>회원이 이 약관을 위반하여 제3자의 권리를 침해하거나 제3자로부터 이의가 제기된 경우, 회원은 자신의 비용과 책임으로 회사를 면책시켜야 하며, 회사가 면책되지 못한 경우 그로 인해 발생한 모든 손해를 배상하여야 합니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제17조 (회사의 면책)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
                <li>회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</li>
                <li>회사는 회원 간 또는 회원과 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우에는 책임이 면제됩니다.</li>
                <li>회사는 무료로 제공되는 서비스 이용과 관련하여 관련법에 특별한 규정이 없는 한 책임을 지지 않습니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제18조 (회원에 대한 통지)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>회사가 회원에 대한 통지를 하는 경우 이 약관에 별도 규정이 없는 한 회원이 제공한 이메일 주소, 전화번호, 서비스 내 쪽지, 팝업창 등으로 할 수 있습니다.</li>
                <li>회사는 회원 전체에 대한 통지의 경우 7일 이상 파트너스 사이트의 게시판에 게시함으로써 전항의 통지에 갈음할 수 있습니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제19조 (비밀유지)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>양 당사자는 이 약관과 관련하여 취득한 상대방의 기밀정보(기술정보, 영업비밀, 회원정보, 수입정보 등)를 상대방의 사전 서면 승낙 없이 제3자에게 제공하거나 이 약관의 이행 이외의 목적으로 사용할 수 없습니다.</li>
                <li>본 조의 의무는 이 약관의 종료 후에도 2년간 유효합니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제20조 (지식재산권의 귀속)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>서비스에 대한 지식재산권은 회사에 귀속됩니다.</li>
                <li>회원은 서비스를 이용함으로써 얻은 정보를 회사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리 목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제21조 (준거법)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                회사와 회원 사이에 제기된 법적 분쟁은 대한민국의 법령을 준거법으로 합니다.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">제22조 (관할법원)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                회사와 회원 사이의 분쟁에 관한 소송은 회사의 본점 소재지 관할법원인 인천지방법원을 전속적 합의 관할법원으로 정합니다.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">부칙</h3>
            <p className="text-gray-700 leading-relaxed mb-2">1. 이 약관은 2026년 1월 2일부터 시행합니다.</p>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 font-bold text-center">
                    ※ 본 약관은 2026년 1월 2일부터 적용됩니다.
                </p>
            </div>
        </div>
    );
}

// 오픈 API 서비스 이용 약관 컴포넌트
export function OpenApiTerms() {
    return (
        <div className="prose max-w-none text-sm">
            <h2 className="text-2xl font-bold mb-6">오픈 API 서비스 이용 약관</h2>

            <h3 className="text-lg font-bold mt-6 mb-3">제1조 (목적)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                이 약관은 주식회사 제이지디글로벌(이하 “회사”라고 합니다)이 제공하는 겟꿀 파트너스 오픈 API 서비스(이하 “API 서비스”라고 합니다)를 이용함에 있어 “회사”와 이를 이용하는 겟꿀 파트너스 회원(이하 “회원”이라 합니다) 간의 권리, 의무 및 책임 사항 등을 규정함을 목적으로 합니다.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">제2조 (용어의 정의)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>“오픈 API(Application Programming Interface, 이하 “API”라 함)”라 함은 “회사”가 관리하는 정보를 제3자가 활용할 수 있도록 일정한 형식으로 구성하여 공개하는 인터페이스 및 관련 기술 일체를 의미합니다.</li>
                <li>“API 서비스”란 “회원”이 “회사”로부터 제공받은 “API”를 활용하여 “회사”가 제공하는 상품 등의 정보를 “회원”이 운영하는 미디어상에 게재할 수 있도록 지원하는 서비스를 의미합니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제3조 (약관의 명시, 효력 및 개정)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                본 약관은 겟꿀 파트너스 이용약관에 대한 특별 약관으로서 겟꿀 파트너스 이용약관과 함께 효력을 가집니다. 본 약관에서 정하지 아니한 사항은 겟꿀 파트너스 이용약관이 정한 바에 따르며, 본 약관과 겟꿀 파트너스 이용약관의 내용이 상충되는 경우 본 약관이 우선합니다. 겟꿀 파트너스 이용약관의 개정에 관한 규정은 본 약관의 개정 시에도 준용됩니다.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-3">제4조 (이용 신청 및 승낙)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>“API 서비스”를 이용하고자 하는 “회원”은 “회사”가 정한 절차에 따라 신청하여야 합니다.</li>
                <li>“회사”는 “API 서비스” 이용 신청에 대하여 승낙함을 원칙으로 합니다. 다만, “회사”는 다음 각 호에 해당하는 신청에 대하여는 승낙을 거절하거나 사후에 이용을 제한 또는 해지할 수 있습니다.
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                        <li>허위의 정보를 기재하거나, “회사”가 제시하는 내용을 기재하지 않은 경우</li>
                        <li>부정한 용도 또는 별도의 영리 목적으로 서비스를 이용하고자 하는 경우</li>
                        <li>“회사”의 업무상 또는 기술상 지장이 있는 경우</li>
                    </ul>
                </li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제5조 (API 서비스 이용 등)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>“회사”는 “API 서비스”를 “회원”에게 무료로 제공하는 것을 원칙으로 합니다. 다만, “회사”의 정책 변경에 따라 향후 유료로 전환될 수 있으며, 이 경우 “회사”는 사전에 공지합니다.</li>
                <li>“회원”은 “회사”가 제공하는 “API” 가이드 및 운영정책 등을 준수하여야 하며, 이를 위반하여 발생하는 모든 책임은 “회원”에게 있습니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제6조 (권리의 귀속 및 이용제한)</h3>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700 mb-4">
                <li>“API 서비스”에 대한 모든 지식재산권은 “회사”에 귀속됩니다.</li>
                <li>“회원”은 “API”를 통해 제공받은 정보를 “회사”의 사전 동의 없이 제3자에게 제공하거나 판매, 배포할 수 없습니다.</li>
            </ol>

            <h3 className="text-lg font-bold mt-6 mb-3">제7조 (관할법원)</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                “API 서비스” 이용과 관련한 “회사”와 “회원” 간의 분쟁에 관한 소송은 “회사”의 본점 소재지 관할법원인 인천지방법원을 전속적 합의 관할법원으로 합니다.
            </p>

            <h3 className="text-lg font-bold mt-6 mb-4">부칙</h3>
            <p className="text-gray-700 leading-relaxed mb-2">1. 이 약관은 2026년 1월 2일부터 시행합니다.</p>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 font-bold text-center">
                    ※ 본 약관은 2026년 1월 2일부터 적용됩니다.
                </p>
            </div>
        </div>
    );
}

// 운영정책 컴포넌트
export function OperatingPolicy() {
    return (
        <div className="prose max-w-none text-sm">
            <h2 className="text-2xl font-bold mb-4">겟꿀 마케팅 제휴 프로그램 운영정책</h2>

            <p className="text-gray-700 leading-relaxed mb-6">
                겟꿀 파트너스는 공정한 서비스 유지 및 이용자 보호를 위해 다음의 정책에 따라 서비스를 운영하고 있습니다. 겟꿀 파트너스 가입 신청자와 가입 회원은 다음의 운영정책을 반드시 확인하고 동의 및 준수하셔야 하며, 운영정책을 준수하지 않음으로 인해 서비스 이용에 제한을 받으시는 일이 없도록 주의하여 주시기 바랍니다.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">1. 회원가입</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
                겟꿀 파트너스는 다음의 기준에 따라 가입 여부를 심사하고 있습니다.
            </p>

            <h4 className="text-lg font-bold mt-6 mb-3">1.1. 가입심사</h4>
            <p className="text-gray-700 leading-relaxed mb-2">
                겟꿀 회원이라면 누구나 겟꿀 파트너스 서비스 신청이 가능합니다. 단, 미성년자나 비영리법인, 면세사업자, 외국인의 경우 신청이 거절될 수 있습니다.
                서비스 신청 이후 회사가 사전에 안내한 일정 금액의 수익 발생 시 해당 회원의 채널을 검토하여 최종승인 여부를 결정합니다.
                가입 신청자의 자격요건은 다음 기준에 의해 심사합니다.
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-4">
                <li>
                    <strong>개인회원(사업자가 아닌 회원)</strong><br />
                    개인으로 가입을 원하는 자는 실명확인 절차를 거쳐 서비스 가입이 가능합니다.
                </li>
                <li>
                    <strong>사업자인 회원</strong><br />
                    사업자로 가입을 원하는 자는 사업자정보의 유효성과 계정 및 사업자정보 일치 여부 확인을 위해 별도의 서류를 제출해야 합니다. (사업자등록증 사본)<br />
                    <span className="text-xs text-blue-600">※ 명의도용 방지를 위해 겟꿀 회원 가입자명과 개인사업자의 대표자명은 동일한 경우에 한해 가입이 허용됩니다.</span>
                </li>
            </ol>

            <h4 className="text-lg font-bold mt-8 mb-3">1.2. 가입제한</h4>
            <p className="text-gray-700 leading-relaxed mb-2">
                겟꿀 파트너스는 안정적인 서비스 운영 및 회원의 이익 보호를 위해 다음의 경우 서비스 가입을 제한할 수 있습니다.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>가입신청자가 겟꿀 파트너스 약관 및 운영정책에 어긋나는 행동을 한 후 자진하여 탈퇴한 적이 있는 경우</li>
                <li>가입신청자가 겟꿀 파트너스 약관 및 운영정책에 어긋나는 행동을 하여 직권해지 된 적이 있는 경우</li>
            </ul>

            <h4 className="text-lg font-bold mt-8 mb-3">1.3. 정보변경</h4>
            <p className="text-gray-700 leading-relaxed mb-2">
                회원은 정보변경페이지에서 본인의 정보를 열람하고 변경할 수 있습니다. 단, 다음에 해당하는 항목은 변경이 제한됩니다.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>아이디, 이름, 주민등록번호, 사업자등록번호는 변경할 수 없습니다.</li>
                <li>대표자명 등 사업자정보를 변경하고자 하는 경우 회사가 요구하는 증빙 제출 및 심사를 통해 정보변경이 가능합니다.</li>
                <li>겟꿀 회원가입자명과 개인사업자의 대표자명을 서로 다르게 변경할 수 없습니다.</li>
            </ul>

            <h3 className="text-xl font-bold mt-10 mb-4">2. 미디어등록기준</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
                겟꿀 파트너스 서비스를 이용하기 위해서는 광고가 노출될 미디어를 등록하여야 합니다. 회원이 등록 신청한 미디어에 대해 광고매체로서의 적합성 여부 등을 심사하며, 이용약관 및 운영정책에 위배되는 사항이 발견될 경우 등록을 거절 또는 취소할 수 있습니다.
            </p>

            <h4 className="text-lg font-bold mt-6 mb-3">2.1. 공통 등록기준</h4>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>회원의 미디어에 대한 광고매체로써의 품질을 평가하기 위해 아래 내용을 종합적으로 심사합니다.</li>
                <li>미디어 운영기간 및 이용가능한 전체 공개 콘텐츠의 수</li>
                <li>광고매체로써의 콘텐츠 적합성, 등록제한 콘텐츠 존재 여부</li>
                <li>회원제로 운영되는 미디어의 경우 테스트ID 및 비밀번호를 검수 시 제공해야 합니다.</li>
            </ul>

            <h4 className="text-lg font-bold mt-8 mb-3">2.2. 등록제한</h4>
            <p className="text-gray-700 leading-relaxed mb-2">
                다음의 내용이 확인되는 미디어는 등록이 거절되거나 취소될 수 있습니다.
            </p>
            <ul className="list-disc pl-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-600">
                <li>성인콘텐츠, 성인용품, 성매매 등 관련 내용</li>
                <li>애인대행 및 역할대행 서비스 관련 내용</li>
                <li>선정적이거나 혐오, 폭력적인 내용</li>
                <li>웹하드, P2P, 무료 음원 제공 관련 내용</li>
                <li>게임 아이템 거래 관련 내용</li>
                <li>도박, 카지노, 경마 등 사행성 내용</li>
                <li>대부업 등 사금융 관련 내용</li>
                <li>흥신소, 심부름센터 관련 내용</li>
                <li>이미테이션 제품 홍보/판매 관련 내용</li>
                <li>복권 판매 내용</li>
                <li>총기, 도검류 판매 내용</li>
                <li>불법건강식품, 주류, 담배, 마약 관련 내용</li>
                <li>해킹, 크래킹 관련 내용</li>
                <li>특정 대상에 대한 비방 및 차별 내용</li>
                <li>보상 제공(광고 시청/클릭 등) 미디어</li>
                <li>저작권, 지식재산권을 침해한 내용</li>
                <li>비정상적으로 트래픽을 유도하는 경우</li>
                <li>겟꿀보다 낮은 가격 유인 행위(금품 제공 등)</li>
                <li>기타 규정 및 법령 위배 사례</li>
            </ul>

            <h3 className="text-xl font-bold mt-10 mb-4">3. 데이터의 수집 및 이용</h3>
            <p className="text-gray-700 leading-relaxed mb-2">
                겟꿀 파트너스 서비스를 제공함에 있어 어뷰징 여부의 판단, 광고의 타겟팅 등을 위해 필요할 경우 미디어와 Device의 정보를 수집할 수 있습니다. 수집하는 주요 항목은 다음과 같으며, 개인정보처리방침에서 규정하지 않은 개인정보는 수집하지 않습니다.
            </p>
            <ul className="list-disc pl-6 text-gray-700">
                <li>OS의 종류 및 버전, 브라우저 정보, IP 정보 등</li>
            </ul>

            <h3 className="text-xl font-bold mt-10 mb-4">4. 이용제한</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                겟꿀 파트너스는 회원의 미디어가 서비스 이용약관 또는 운영정책에 위반되는 사항이 없는지 주기적으로 확인하며, 위반 사항이 확인되는 경우 이용제한 정책에 따라 회원의 서비스 이용을 일시적 또는 영구적으로 제한하고 있습니다.
            </p>

            <h4 className="text-lg font-bold mt-6 mb-3">4.1. 이용제한 사유</h4>
            <div className="space-y-6">
                <div>
                    <h5 className="font-bold text-gray-900 mb-2">1) 기술적 금지 행위</h5>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>자사의 서버에 부하를 가하는 행위</li>
                        <li>광고 링크, 형태, 갱신주기 및 정보 조작 행위</li>
                        <li>등록되지 않은 미디어에 광고를 노출시키는 행위</li>
                        <li>지정 가이드를 따르지 않는 등 부정한 방법 활용</li>
                    </ul>
                </div>

                <div>
                    <h5 className="font-bold text-gray-900 mb-2">2) 무효클릭 및 이를 유도하는 행위</h5>
                    <p className="text-gray-700 mb-2">방문자의 관심이 아닌 인위적인 클릭(무효클릭)은 엄격히 금지됩니다.</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>본인 또는 타인의 미디어 광고를 반복 클릭하는 행위</li>
                        <li>클릭 유도 문구("도와주세요", "클릭하세요" 등) 및 이미지 삽입</li>
                        <li>메일, 메신저, SMS 등을 이용한 불법 스팸 전송 행위</li>
                        <li>자동화 도구(로봇, 매크로 등)를 이용한 클릭 발생</li>
                        <li>광고를 숨기거나 오클릭을 유도하는 레이아웃 구성</li>
                    </ul>
                </div>

                <div>
                    <h5 className="font-bold text-gray-900 mb-2">3) 인위적 노출 유도 행위</h5>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1">
                        <li>관계 없는 무의미한 키워드 삽입</li>
                        <li>브랜드/제품명을 오용하여 제3자에게 피해를 주는 행위</li>
                    </ul>
                </div>

                <div>
                    <h5 className="font-bold text-gray-900 mb-2">4) 기밀정보 공개 행위</h5>
                    <p className="text-gray-700 mb-2">리포트 통계 내용 중 다음 지표의 외부 공개를 금지합니다.</p>
                    <ul className="list-disc pl-6 text-gray-700">
                        <li><strong>공개불가:</strong> 노출수, 클릭수, 클릭률(CTR) 및 관련 그래프</li>
                        <li><strong>공개가능:</strong> 수입 정보(일/누적/지급 수익 및 그래프)</li>
                    </ul>
                </div>

                <div>
                    <h5 className="font-bold text-gray-900 mb-2">5) 권한 재판매 행위</h5>
                    <p className="text-gray-700">부여받은 권한을 회사의 서면 동의 없이 양도, 중개, 재판매할 수 없습니다.</p>
                </div>

                <div>
                    <h5 className="font-bold text-gray-900 mb-2">6) 부적합 콘텐츠 게시 행위</h5>
                    <p className="text-gray-700 mb-2">다음 콘텐츠를 포함한 미디어에는 광고 노출이 제한되며, 즉시 삭제 의무가 발생합니다.</p>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1 text-xs">
                        <li>개인정보 노출 게시물</li>
                        <li>겟꿀/파트너스 사칭 및 지식재산권(BI/CI) 무단 활용</li>
                        <li>불법 제품/해킹 정보/도박/음란성 게시물</li>
                        <li>혐오감을 주거나 사회적 혼란을 야기할 우려가 있는 내용</li>
                        <li>표시광고법 위반(허위/과장/왜곡 등)</li>
                    </ul>
                </div>
            </div>

            <h4 className="text-lg font-bold mt-10 mb-3">4.2. 이용제한 정책</h4>
            <div className="space-y-4">
                <p className="text-gray-700">위반 행위 확인 시 계정 이용 제한, 수익금 몰수, 계정 해지 등의 조치가 단계적으로 시행됩니다.</p>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 text-xs">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 p-2">제재수준</th>
                                <th className="border border-gray-300 p-2">주요 위반행위</th>
                                <th className="border border-gray-300 p-2">위반횟수</th>
                                <th className="border border-gray-300 p-2">제재내용</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td rowSpan={2} className="border border-gray-300 p-2 text-center font-bold">A</td>
                                <td rowSpan={2} className="border border-gray-300 p-2 text-center">기술적 금지, 무효클릭, 인위적 노출, 금지된 광고 유형</td>
                                <td className="border border-gray-300 p-2 text-center">1회</td>
                                <td className="border border-gray-300 p-2">최근 14일 수익금 몰수</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2 text-center text-red-600 font-bold">2회</td>
                                <td className="border border-gray-300 p-2 text-red-600 font-bold">최근 30일 수익금 몰수 및 계정 해지</td>
                            </tr>
                            <tr>
                                <td rowSpan={3} className="border border-gray-300 p-2 text-center font-bold">B</td>
                                <td rowSpan={3} className="border border-gray-300 p-2 text-center">기밀정보 공개, 부적합 콘텐츠(일부)</td>
                                <td className="border border-gray-300 p-2 text-center">1회</td>
                                <td className="border border-gray-300 p-2">경고</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2 text-center">2회</td>
                                <td className="border border-gray-300 p-2">위반일 수익금 몰수</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2 text-center text-red-600 font-bold">3회</td>
                                <td className="border border-gray-300 p-2 text-red-600 font-bold">최근 30일 수익금 몰수 및 계정 해지</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2 text-center font-bold text-red-600">C</td>
                                <td className="border border-gray-300 p-2 text-center font-bold text-red-600">심각한 부적합 콘텐츠 게시 등</td>
                                <td className="border border-gray-300 p-2 text-center">1회</td>
                                <td className="border border-gray-300 p-2 font-bold text-red-600">즉시 계정 해지 및 수익금 몰수</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <h3 className="text-xl font-bold mt-10 mb-4">5. 수익배분</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>수익 지급율:</strong> 별도로 정하지 않은 경우 결제금액의 3%로 함. (카테고리별 상이할 수 있음)</li>
                <li><strong>정산 주기:</strong> 매월 1일~말일 실적에 대해 매출 정산 후 익익월 15일 지급.</li>
                <li><strong>지급 조건:</strong> 누적 수익이 10,000원 이상일 때 지급 (미달 시 이월).</li>
                <li><strong>지급 한도:</strong> 월 최대 3,000만원 (초과분은 이월 또는 지급 불가).</li>
            </ul>

            <h3 className="text-xl font-bold mt-10 mb-4">6. 부당한 수입의 지급 보류ㆍ거절 및 회수</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                정책 위반으로 판단되는 '부당한 수입'에 대해서는 확인 시까지 지급이 보류될 수 있으며, 이미 지급된 경우에도 회수할 수 있습니다.
            </p>

            <h3 className="text-xl font-bold mt-10 mb-4">7. 회원탈퇴</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                <li>정산 완료 후 탈퇴 처리가 완료됩니다.</li>
                <li><strong>자동 탈퇴 기준:</strong> 12개월 이상 사이트 미접속, API 미호출, 또는 링크 클릭 미발생 시.</li>
            </ul>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 font-bold text-center">
                    ※ 본 운영정책은 2026년 1월 2일부터 적용됩니다.
                </p>
            </div>
        </div>
    );
}

// 개인정보 처리방침 컴포넌트
export function PrivacyPolicy() {
    return (
        <div className="prose max-w-none text-sm">
            <h2 className="text-2xl font-bold mb-6">개인정보 처리방침</h2>

            <p className="text-gray-700 leading-relaxed mb-4">
                주식회사 제이지디글로벌(이하 ‘회사’)는 「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률(이하 ‘정보통신망법’)」 등 관련 법령에 따라 이용자의 개인정보 및 연계정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다. 개인정보 처리방침을 변경하는 경우에는 변경에 대한 사실 및 시행일, 변경 전후의 내용을 홈페이지 공지사항을 통해 공개합니다.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4 font-bold">
                본 개인정보 처리방침은 회사가 제공하는 겟꿀 파트너스 서비스에 적용됩니다.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">1. 개인정보 수집 항목 및 목적과 보유 기간</h3>
            <p className="text-gray-700 mb-4">회사는 서비스 이용에 필요한 최소한의 개인정보를 수집합니다. 수집한 개인정보를 본래 수집한 목적 이외의 용도로 이용하지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행합니다.</p>

            <div className="overflow-x-auto mb-6">
                <table className="min-w-full border-collapse border border-gray-300 text-xs text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 p-2">분류</th>
                            <th className="border border-gray-300 p-2">목적</th>
                            <th className="border border-gray-300 p-2">항목</th>
                            <th className="border border-gray-300 p-2">보유 및 이용기간</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan={3} className="border border-gray-300 p-2 text-center font-bold">필수</td>
                            <td className="border border-gray-300 p-2">회원 가입 및 이용자 식별, 회원관리</td>
                            <td className="border border-gray-300 p-2">아이디(이메일), 이름, 휴대폰번호, 비밀번호</td>
                            <td className="border border-gray-300 p-2">회원탈퇴 시 90일간 보관 후 파기</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">부정행위 방지</td>
                            <td className="border border-gray-300 p-2">부정행위 탐지된 아이디, 이름, 휴대폰번호, 부정행위 기록, CI</td>
                            <td className="border border-gray-300 p-2">회원탈퇴 시 180일 보관 후 파기</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">수익금 정산 및 세무 신고</td>
                            <td className="border border-gray-300 p-2">성명, 주민등록번호(개인), 사업자번호(사업자), 계좌정보</td>
                            <td className="border border-gray-300 p-2">관련 법령에 따른 보존 (5년)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2 text-center font-bold">선택</td>
                            <td className="border border-gray-300 p-2">마케팅 및 프로모션 활용</td>
                            <td className="border border-gray-300 p-2">아이디(이메일), 휴대폰번호</td>
                            <td className="border border-gray-300 p-2">회원탈퇴 시 또는 동의 철회 시 파기</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 className="text-xl font-bold mt-10 mb-4">2. 개인정보의 제공과 위탁</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                회사는 이용자에게 사전 동의를 받은 범위 내에서만 개인정보를 제3자에게 제공합니다. 다만, 법률에 특별한 규정이 있는 경우나 재난, 감염병 등에 의한 긴급 상황 시에는 관련 절차에 따라 제공될 수 있습니다.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
                회사는 원활한 서비스 제공을 위하여 개인정보 처리업무를 위탁하고 있으며, 계약 시 개인정보가 안전하게 관리될 수 있도록 수탁자를 철저히 관리·감독합니다.
            </p>

            <h3 className="text-xl font-bold mt-10 mb-4">3. 이용자의 동의없는 이용 및 제공</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                회사는 「개인정보 보호법」 제15조제3항 또는 제17조제4항에 따라 이용자의 이익을 부당하게 침해하지 않는 범위 내에서 당초 수집 목적과 관련성이 있는 경우 등에는 이용자의 동의 없이 개인정보를 추가적으로 이용·제공할 수 있습니다.
            </p>

            <h3 className="text-xl font-bold mt-10 mb-4">4. 개인정보의 파기 절차 및 방법</h3>
            <p className="text-gray-700 leading-relaxed mb-4">회사는 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다. 단, 관계 법령에 따라 일정 기간 보존해야 하는 경우 별도의 DB로 옮겨 보관합니다.</p>
            <div className="bg-gray-50 p-4 border border-gray-200 rounded-md text-xs mb-4">
                <ul className="list-disc pl-5 space-y-1">
                    <li>대금결제 및 재화 등의 공급 기록: 5년 (전자상거래법)</li>
                    <li>계약 또는 청약철회 기록: 5년 (전자상거래법)</li>
                    <li>소비자 불만 또는 분쟁 처리 기록: 3년 (전자상거래법)</li>
                    <li>접근 로그(웹사이트 방문 기록): 3개월 (통신비밀보호법)</li>
                    <li>제세공과금 대납 정보: 5년 (소득세법)</li>
                </ul>
            </div>

            <h3 className="text-xl font-bold mt-10 mb-4">5. 이용자와 법정대리인의 권리·의무 및 그 방법</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                이용자는 언제든지 자신의 개인정보를 열람하거나 수정할 수 있으며, 가입 해지(동의 철회)를 요청할 수 있습니다. 온라인상에서 직접 처리하기 어려운 경우 고객센터(help@getkkul.com)를 통해 요청하실 수 있으며, 회사는 요청을 받은 날로부터 10일 이내에 조치합니다.
            </p>

            <h3 className="text-xl font-bold mt-10 mb-4">6. 개인정보의 안전성 확보 조치</h3>
            <p className="text-gray-700 mb-4">회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>기술적 조치:</strong> 개인정보의 암호화 저장, 전송 시 암호화 통신, 해킹 시도 실시간 모니터링 및 차단</li>
                <li><strong>관리적 조치:</strong> 개인정보보호 전담 조직 운영, 정기적인 임직원 교육, 접근 권한의 최소화</li>
                <li><strong>물리적 조치:</strong> 전산실 등 개인정보 보관 장소의 출입 통제</li>
            </ul>

            <h3 className="text-xl font-bold mt-10 mb-4">7. 연계정보(CI)의 처리</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
                회사는 본인 확인 절차를 위해 이용자의 연계정보(CI)를 수집하여 안전하게 관리합니다. 본인 확인 정보에 대한 열람 및 정정 요청 절차는 개인정보와 동일하게 운영됩니다. 연계정보의 안전성 확보를 위해 분리 보관 및 접근 권한 최소화 조치를 시행하고 있습니다.
            </p>

            <h3 className="text-xl font-bold mt-10 mb-4">8. 개인정보보호책임자와 민원처리 부서</h3>
            <p className="text-gray-700 leading-relaxed mb-4">회사는 개인정보 처리에 관한 업무를 총괄하여 책임지고 이용자의 불만 및 피해구제를 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다.</p>

            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">개인정보 보호책임자 (CPO)</h5>
                        <ul className="text-gray-700 space-y-1 text-xs">
                            <li>성명: 주식회사 제이지디글로벌</li>
                            <li>부서: 개인정보보호부서 (Digital Trust Privacy)</li>
                            <li>이메일: <a href="mailto:jgdglobal@kakao.com" className="text-blue-600 underline">jgdglobal@kakao.com</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 mb-2">고객센터 (민원처리)</h5>
                        <ul className="text-gray-700 space-y-1 text-xs">
                            <li>연락처: <span className="font-bold">010-7218-2858</span></li>
                            <li>이메일: <a href="mailto:jgdglobal@kakao.com" className="text-blue-600 underline">jgdglobal@kakao.com</a></li>
                            <li>운영시간: 평일 10:00 ~ 17:00</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-12 p-6 bg-gray-50 border-t-2 border-gray-200 rounded-b-xl">
                <p className="text-center text-gray-600 font-bold">
                    본 개인정보 처리방침은 2026년 1월 2일부터 적용됩니다.
                </p>
            </div>
        </div>
    );
}

// 약관 데이터 내보내기 (선택적 사용)
export const POLICIES = {
    terms: TermsOfService,
    openapi: OpenApiTerms,
    operating: OperatingPolicy,
    privacy: PrivacyPolicy,
};
