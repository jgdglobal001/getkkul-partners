'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminHeader from '@/components/admin/AdminHeader';
import Footer from '@/components/common/Footer';
import Link from 'next/link';

// 공지사항 타입
type NoticeCategory = '중요' | '공지사항' | '활동 규칙' | '최종승인 가이드' | '활동 가이드' | '프로모션 및 이벤트';

interface Notice {
  id: number;
  category: NoticeCategory;
  title: string;
  isImportant: boolean;
  createdAt: string;
}

// 샘플 데이터 (실제로는 API에서 가져와야 함)
const SAMPLE_NOTICES: Notice[] = [
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
];

export default function AdminNoticesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [notices, setNotices] = useState<Notice[]>(SAMPLE_NOTICES);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      alert('관리자 권한이 필요합니다.');
      router.push('/dashboard');
    }
  }, [status, session, router]);

  // 삭제 핸들러
  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setNotices(prev => prev.filter(notice => notice.id !== id));
      alert('삭제되었습니다.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">공지사항 관리</h1>
              <p className="text-gray-600">공지사항을 등록, 수정, 삭제할 수 있습니다.</p>
            </div>
            <Link
              href="/admin/notices/new"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 새 공지사항 등록
            </Link>
          </div>

          {/* 공지사항 테이블 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    카테고리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    중요
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    생성일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      등록된 공지사항이 없습니다.
                    </td>
                  </tr>
                ) : (
                  notices.map((notice) => (
                    <tr key={notice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {notice.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {notice.isImportant && (
                          <span className="inline-block mr-2 text-yellow-600">⚠️</span>
                        )}
                        {notice.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        {notice.isImportant ? (
                          <span className="text-red-600 font-bold">●</span>
                        ) : (
                          <span className="text-gray-300">○</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {notice.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <Link
                          href={`/admin/notices/${notice.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

