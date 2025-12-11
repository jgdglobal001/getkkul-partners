'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/admin" className="flex items-center">
            <Image
              src="/getkkul-partners-logo.png"
              alt="겟꿀 파트너스 관리자"
              width={160}
              height={40}
              className="h-10 w-auto"
            />
            <span className="ml-3 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
              ADMIN
            </span>
          </Link>

          {/* 메뉴 */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/admin" className="text-gray-900 hover:text-blue-600">
              대시보드
            </Link>
            <Link href="/admin/notices" className="text-gray-600 hover:text-blue-600">
              공지사항 관리
            </Link>
            <Link href="/admin/partners" className="text-gray-600 hover:text-blue-600">
              파트너 관리
            </Link>
            <Link href="/admin/settlements" className="text-gray-600 hover:text-blue-600">
              정산 관리
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
              파트너 대시보드
            </Link>
          </nav>

          {/* 우측 영역 */}
          <div className="flex items-center gap-4">
            {/* 알림 아이콘 */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <FaBell className="w-5 h-5" />
            </button>

            {/* 관리자 정보 */}
            {session?.user?.email && (
              <div className="hidden lg:flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{session.user.name}</div>
                  <div className="text-xs text-gray-500">{session.user.email}</div>
                </div>
              </div>
            )}

            {/* 로그아웃 버튼 */}
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

