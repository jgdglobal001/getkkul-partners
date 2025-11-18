'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();
  const [partnershipId, setPartnershipId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 파트너십 ID 및 사업자명 가져오기
  useEffect(() => {
    const fetchPartnershipData = async () => {
      try {
        const response = await fetch('/api/partnership');
        const data = await response.json();
        if (data.partnershipId) {
          setPartnershipId(data.partnershipId);
        }
        
        // 사업자 등록 정보에서 사업자명 가져오기
        const businessResponse = await fetch('/api/business-registration');
        const businessData = await businessResponse.json();
        if (businessData.data?.businessName) {
          setBusinessName(businessData.data.businessName);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      }
    };

    if (session?.user?.id) {
      fetchPartnershipData();
    }
  }, [session]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <a href="/" className="flex items-center hover:opacity-80 transition">
            <img
              src="/겟꿀파트너스 로고(직원).png"
              alt="겟꿀 파트너스 로고"
              className="h-12 w-auto"
            />
          </a>

          {/* 네비게이션 */}
          <nav className="hidden md:flex gap-8 text-sm">
            <a href="#" className="text-gray-600 hover:text-indigo-600">파트너 정보</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">도움말</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">고객센터</a>
          </nav>

          {/* 우측 버튼 영역 */}
          <div className="flex gap-4 items-center">
            {session ? (
              // 로그인 상태
              <>
                {/* 알림 아이콘 */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition">
                  <FaBell className="w-5 h-5" />
                  {/* 알림 배지 (예시) */}
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* 대시보드 버튼 */}
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-gray-600 hover:text-indigo-600 font-medium transition"
                >
                  대시보드
                </Link>

                {/* 사용자 드롭다운 */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {(businessName || session.user?.name || session.user?.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {businessName || session.user?.name || '사용자'}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      {/* 사용자 정보 */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-bold text-gray-900">{businessName || session.user?.name || '사용자'}</p>
                        {partnershipId && (
                          <p className="text-xs text-gray-500 mt-1">🆔 ID: {partnershipId}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">📧 {session.user?.email}</p>
                      </div>

                      {/* 메뉴 항목 */}
                      <div className="py-2">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span>📊</span>
                          <span>대시보드</span>
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <span>👤</span>
                          <span>내 정보</span>
                        </Link>
                      </div>

                      {/* 로그아웃 */}
                      <div className="border-t border-gray-200 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                          <span>🚪</span>
                          <span>로그아웃</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // 비로그인 상태
              <a
                href="/auth"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium whitespace-nowrap transition"
              >
                시작하기
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

