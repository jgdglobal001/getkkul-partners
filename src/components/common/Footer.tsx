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
                <a href="#" className="text-gray-400 hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  문의하기
                </a>
              </li>
              <li>
                <a href="/policies?tab=service" className="text-gray-400 hover:text-white transition">
                  이용약관
                </a>
              </li>
              <li>
                <a href="/policies?tab=privacy" className="text-gray-400 hover:text-white transition">
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

        {/* 저작권 */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 겟꿀 파트너스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

