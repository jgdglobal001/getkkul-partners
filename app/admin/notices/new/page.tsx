'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminHeader from '@/components/admin/AdminHeader';
import Footer from '@/components/common/Footer';
import Link from 'next/link';

type NoticeCategory = '중요' | '공지사항' | '활동 규칙' | '최종승인 가이드' | '활동 가이드' | '프로모션 및 이벤트';

const CATEGORIES: NoticeCategory[] = ['중요', '공지사항', '활동 규칙', '최종승인 가이드', '활동 가이드', '프로모션 및 이벤트'];

export default function NewNoticePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    category: '' as NoticeCategory | '',
    title: '',
    content: '',
    isImportant: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: API 호출로 공지사항 등록
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('공지사항이 등록되었습니다.');
      router.push('/admin/notices');
    } catch (error) {
      console.error('공지사항 등록 실패:', error);
      alert('공지사항 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 브레드크럼 */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/admin" className="hover:text-gray-700">관리자</Link>
            <span>›</span>
            <Link href="/admin/notices" className="hover:text-gray-700">공지사항 관리</Link>
            <span>›</span>
            <span className="text-gray-900">새 공지사항 등록</span>
          </nav>

          {/* 페이지 헤더 */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">새 공지사항 등록</h1>

          {/* 등록 폼 */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* 카테고리 */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">카테고리를 선택하세요</option>
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 중요 공지 체크박스 */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isImportant"
                  checked={formData.isImportant}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">중요 공지로 설정 (⚠️ 아이콘 표시)</span>
              </label>
            </div>

            {/* 내용 */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="공지사항 내용을 입력하세요 (HTML 태그 사용 가능)"
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                required
              />
              <p className="mt-2 text-xs text-gray-500">
                HTML 태그를 사용할 수 있습니다. 예: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt; 등
              </p>
            </div>

            {/* 미리보기 */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-2">미리보기</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                {formData.content ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                ) : (
                  <p className="text-gray-400 text-sm">내용을 입력하면 미리보기가 표시됩니다.</p>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-4">
              <Link
                href="/admin/notices"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '등록 중...' : '등록하기'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

            {/* 제목 */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="공지사항 제목을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

