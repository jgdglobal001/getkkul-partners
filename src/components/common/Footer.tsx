export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 회사 정보 */}
          <div>
            <h3 className="text-lg font-bold mb-4">겟꿀 파트너스</h3>
            <p className="text-gray-400 text-sm">
              상품을 광고하고 수익을 창출하세요.
            </p>
          </div>

          {/* 링크 */}
          <div>
            <h3 className="text-lg font-bold mb-4">바로가기</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-white transition">
                  대시보드
                </a>
              </li>
              <li>
                <a href="/products/search" className="text-gray-400 hover:text-white transition">
                  상품 검색
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  리포트
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">고객 지원</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard/support/faq" className="text-gray-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/dashboard/support/contact" className="text-gray-400 hover:text-white transition">
                  문의하기
                </a>
              </li>
              <li>
                <a href="/policies?tab=service" className="text-gray-400 hover:text-white transition">
                  이용약관
                </a>
              </li>
              <li>
                <a href="/policies?tab=privacy" className="text-gray-400 hover:text-white transition font-semibold">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="/policies?tab=operating" className="text-gray-400 hover:text-white transition">
                  운영정책
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 회사 정보 */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-gray-400">
          <p className="mb-2">
            <span className="font-semibold text-gray-300">주식회사 제이지디글로벌</span>
            <span className="mx-2">|</span>
            대표자: 전은찬
            <span className="mx-2">|</span>
            개인정보보호책임자: 백인희
          </p>
          <p className="mb-2">
            사업자등록번호: 308-86-03448
            <span className="mx-2">|</span>
            통신판매신고번호: 제 2025-인천연수구-2051 호
          </p>
          <p className="mb-2">
            주소: 인천광역시 연수구 송도과학로 32, 엠동 2201호(송도동, 송도테크노파크 IT센터)
          </p>
          <p className="mb-4">
            고객센터: <a href="tel:010-7218-2858" className="hover:text-white">010-7218-2858</a>
            <span className="mx-2">|</span>
            이메일: <a href="mailto:jgdglobal@kakao.com" className="hover:text-white">jgdglobal@kakao.com</a>
          </p>
          <p className="text-center">&copy; 2026 겟꿀 파트너스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

