'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const [partnershipId, setPartnershipId] = useState('');
  const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
  const helpDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 파트너십 ID 가져오기
    const fetchPartnershipId = async () => {
      try {
        const response = await fetch('/api/partnership');
        const data = await response.json();
        if (data.partnershipId) {
          setPartnershipId(data.partnershipId);
        }
      } catch (error) {
        console.error('파트너십 ID 조회 실패:', error);
      }
    };

    if (session?.user?.id) {
      fetchPartnershipId();
    }
  }, [session]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpDropdownRef.current && !helpDropdownRef.current.contains(event.target as Node)) {
        setIsHelpDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/getkkul-partners-logo.png"
              alt="겟꿀 파트너스"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* 메뉴 */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/dashboard" className="text-gray-900 hover:text-blue-600 border-b-2 border-blue-500 pb-1">
              홈
            </Link>
            <Link href="/dashboard/profile" className="text-gray-600 hover:text-blue-600">
              내 정보
            </Link>
            <Link href="/dashboard/link-generator" className="text-gray-600 hover:text-blue-600">
              링크 생성
            </Link>
            <Link href="/dashboard/reports" className="text-gray-600 hover:text-blue-600">
              리포트
            </Link>
            <Link href="/dashboard/terms" className="text-gray-600 hover:text-blue-600">
              약관 및 정책
            </Link>

            {/* 도움말 드롭다운 */}
            <div className="relative" ref={helpDropdownRef}>
              <button
                onClick={() => setIsHelpDropdownOpen(!isHelpDropdownOpen)}
                className="text-gray-600 hover:text-blue-600 flex items-center gap-1"
              >
                도움말
                <svg
                  className={`w-4 h-4 transition-transform ${isHelpDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isHelpDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/dashboard/support"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsHelpDropdownOpen(false)}
                  >
                    도움말 센터
                  </Link>
                  <Link
                    href="/dashboard/support/faq"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsHelpDropdownOpen(false)}
                  >
                    자주 묻는 질문
                  </Link>
                  <Link
                    href="/dashboard/support/contact"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsHelpDropdownOpen(false)}
                  >
                    1:1 문의하기
                  </Link>
                </div>
              )}
            </div>

            <Link href="/dashboard/notices" className="text-gray-600 hover:text-blue-600">
              공지사항
            </Link>
          </nav>

          {/* 우측 영역 */}
          <div className="flex items-center gap-4">
            {/* 알림 아이콘 */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <FaBell className="w-5 h-5" />
            </button>

            {/* 파트너십 ID */}
            {partnershipId && (
              <div className="hidden sm:block text-sm text-gray-700 font-medium">
                ID: {partnershipId}
              </div>
            )}

            {/* 이메일 */}
            {session?.user?.email && (
              <div className="hidden lg:block text-sm text-gray-600">
                {session.user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

