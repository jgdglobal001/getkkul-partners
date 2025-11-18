'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';

export default function DashboardHeader() {
  const { data: session } = useSession();
  const [partnershipId, setPartnershipId] = useState('');

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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/겟꿀파트너스 로고(직원).png"
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
            <Link href="/dashboard/help" className="text-gray-600 hover:text-blue-600">
              도움말
            </Link>
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

