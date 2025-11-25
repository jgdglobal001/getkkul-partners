'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';

// 공지사항 카테고리 타입
type NoticeCategory = '중요' | '공지사항' | '활동 규칙' | '최종승인 가이드' | '활동 가이드' | '프로모션 및 이벤트';

// 공지사항 인터페이스
interface Notice {
  id: number;
  category: NoticeCategory;
  title: string;
  isImportant: boolean;
  createdAt: string;
}

// 샘플 공지사항 데이터
const NOTICES: Notice[] = [
  {
    id: 161,
    category: '활동 규칙',
    title: '무적립 참가 혜택 금지 안내 - SMS 상 의료기기 광고의 \'혜택·제한·오인\' 혜택 금지 관련 가이드',
    isImportant: false,
    createdAt: '2025. 10. 15.',
  },
  {
    id: 160,
    category: '활동 규칙',
    title: '광계약 어뷰징 금지 가이드',
    isImportant: false,
    createdAt: '2025. 10. 15.',
  },
  {
    id: 158,
    category: '활동 규칙',
    title: '⚠️ 파트너스 활동 금지 민감어리스트 명칭 안내 [2025.11.03 update]',
    isImportant: true,
    createdAt: '2025. 09. 19.',
  },
  {
    id: 149,
    category: '공지사항',
    title: '이용약관 및 운영정책 개정 안내 (2025. 9.11 시행)',
    isImportant: false,
    createdAt: '2025. 08. 11.',
  },
  {
    id: 147,
    category: '공지사항',
    title: '무정광구 제보 포인트 제도 실시 안내',
    isImportant: false,
    createdAt: '2025. 08. 01.',
  },
  {
    id: 146,
    category: '프로모션 및 이벤트',
    title: '알림 수신 동의하고 다양한 이벤트, 광정 혜택을 공유받아보세요!',
    isImportant: false,
    createdAt: '2025. 07. 28.',
  },
  {
    id: 139,
    category: '활동 가이드',
    title: '쿠팡 파트너스에 연결된지역 공지단위 ~해당 프로 가능~ 에 저장해보세요!',
    isImportant: false,
    createdAt: '2025. 06. 30.',
  },
  {
    id: 134,
    category: '공지사항',
    title: '국세청이 적업 안전 간편 확인 서비스 조치 안내',
    isImportant: false,
    createdAt: '2025. 05. 22.',
  },
  {
    id: 132,
    category: '활동 규칙',
    title: '무적립 참가 혜택 금지 안내 - 의료기기 활동 참고 관련 주요 공지',
    isImportant: false,
    createdAt: '2025. 05. 16.',
  },
  {
    id: 130,
    category: '공지사항',
    title: '운영정책 개정 안내 (2025. 06. 12. 시행)',
    isImportant: false,
    createdAt: '2025. 05. 12.',
  },
];

// 탭 메뉴
const TABS: NoticeCategory[] = ['중요', '공지사항', '활동 규칙', '최종승인 가이드', '활동 가이드', '프로모션 및 이벤트'];

export default function NoticesPage() {
  const [activeTab, setActiveTab] = useState<NoticeCategory>('중요');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 탭에 따라 필터링
  const filteredNotices = activeTab === '중요' 
    ? NOTICES.filter(notice => notice.isImportant)
    : NOTICES.filter(notice => notice.category === activeTab);

  // 페이지네이션
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  // 페이지 변경
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 탭 변경 시 페이지 초기화
  const handleTabChange = (tab: NoticeCategory) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 브레드크럼 */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/dashboard" className="hover:text-gray-700">홈</Link>
            <span>›</span>
            <span className="text-gray-900">공지사항</span>
          </nav>

          {/* 페이지 헤더 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">공지사항</h1>

          {/* 탭 메뉴 */}
          <div className="bg-white rounded-t-lg border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 공지사항 테이블 */}
          <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    생성일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentNotices.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  currentNotices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notice.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <Link href={`/dashboard/notices/${notice.id}`} className="hover:text-blue-600">
                          {notice.isImportant && (
                            <span className="inline-block mr-2 text-yellow-600">⚠️</span>
                          )}
                          {notice.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {notice.createdAt}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {filteredNotices.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                {filteredNotices.length}개 중 {startIndex + 1}-{Math.min(endIndex, filteredNotices.length)}개 표시
              </div>

              <div className="flex items-center space-x-2">
                {/* 이전 페이지 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>

                {/* 페이지 번호 */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* 다음 페이지 */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>

                {/* 페이지당 항목 수 */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-4 px-3 py-1 border border-gray-300 rounded text-sm text-gray-700"
                >
                  <option value={10}>10 / 쪽</option>
                  <option value={20}>20 / 쪽</option>
                  <option value={50}>50 / 쪽</option>
                </select>

                {/* 이동하기 */}
                <button className="ml-2 px-4 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">
                  이동하기
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

