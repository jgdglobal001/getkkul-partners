'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';

interface DashboardHeaderProps {
  tossStatus?: string | null;
  onRefreshStatus?: () => void;
  refreshing?: boolean;
}

export default function DashboardHeader({ tossStatus, onRefreshStatus, refreshing }: DashboardHeaderProps) {
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
            {/* KYC 지급 상태 뱃지 */}
            {tossStatus && (
              <div className="hidden sm:flex items-center gap-1.5">
                {(tossStatus === 'PARTIALLY_APPROVED' || tossStatus === 'APPROVED') ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full border border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    {tossStatus === 'APPROVED' ? '지급가능' : '지급가능 (주 1천만원 미만)'}
                  </span>
                ) : tossStatus === 'KYC_REQUIRED' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full border border-red-200">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    지급불가 (KYC 필요)
                    {onRefreshStatus && (
                      <button
                        onClick={onRefreshStatus}
                        disabled={refreshing}
                        className="ml-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                        title="상태 새로고침"
                      >
                        <svg className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </span>
                ) : tossStatus !== 'APPROVAL_REQUIRED' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 rounded-full border border-yellow-200">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    {tossStatus}
                    {onRefreshStatus && (
                      <button
                        onClick={onRefreshStatus}
                        disabled={refreshing}
                        className="ml-1 text-yellow-500 hover:text-yellow-700 disabled:opacity-50"
                        title="상태 새로고침"
                      >
                        <svg className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </span>
                ) : null}
              </div>
            )}

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

            {/* 사용자 프로필 드롭다운 */}
            {session?.user && (
              <div className="relative group">
                <button className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                      {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-700 leading-none mb-0.5">
                      {session.user.name || "파트너"}
                    </p>
                    <p className="text-xs text-gray-500 leading-none">
                      {session.user.email}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 드롭다운 메뉴 */}
                <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                    <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                      <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>

                    <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      내 정보 수정
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      환경설정
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

