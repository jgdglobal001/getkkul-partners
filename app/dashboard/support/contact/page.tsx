'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';
import Link from 'next/link';

// 문의 유형 옵션
const INQUIRY_TYPES = [
  { value: '', label: '문의 유형을 선택하세요' },
  { value: 'settlement', label: '수익 정산 관련' },
  { value: 'link', label: '링크 생성 관련' },
  { value: 'account', label: '계정 관리' },
  { value: 'media', label: '미디어 등록' },
  { value: 'policy', label: '정책 및 약관' },
  { value: 'technical', label: '기술적 문제' },
  { value: 'other', label: '기타' },
];

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    inquiryType: '',
    title: '',
    content: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 글자 수 카운터
  const titleLength = formData.title.length;
  const contentLength = formData.content.length;

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 글자 수 제한
    if (name === 'title' && value.length > 200) return;
    if (name === 'content' && value.length > 1000) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // 파일 유효성 검사
    const validFiles = selectedFiles.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif'];
      const maxSize = 20 * 1024 * 1024; // 20MB
      
      if (!validTypes.includes(file.type)) {
        alert(`${file.name}은(는) 지원하지 않는 파일 형식입니다. (jpg, png, bmp, gif만 가능)`);
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`${file.name}의 크기가 20MB를 초과합니다.`);
        return false;
      }
      
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  // 파일 삭제 핸들러
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!formData.inquiryType) {
      alert('문의 유형을 선택해주세요.');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('문의 제목을 입력해주세요.');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('문의 내용을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // TODO: API 호출로 문의 등록
      // const formDataToSend = new FormData();
      // formDataToSend.append('inquiryType', formData.inquiryType);
      // formDataToSend.append('title', formData.title);
      // formDataToSend.append('content', formData.content);
      // files.forEach(file => formDataToSend.append('files', file));
      
      // 임시: 2초 대기
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('문의가 성공적으로 접수되었습니다.');
      router.push('/dashboard/support');
    } catch (error) {
      console.error('문의 등록 실패:', error);
      alert('문의 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 브레드크럼 */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/dashboard" className="hover:text-gray-700">홈</Link>
            <span>›</span>
            <Link href="/dashboard/support" className="hover:text-gray-700">도움말</Link>
            <span>›</span>
            <span className="text-gray-900">문의하기</span>
          </nav>

          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">문의하기</h1>
            <p className="text-gray-600 mb-4">
              겟꿀 파트너스를 이용하면서 느끼신 불편사항이나 바라는 점을 알려주세요.
            </p>
            <Link 
              href="/dashboard/support/faq" 
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              자주 찾는 Q&A를 먼저 확인 해보시겠어요? FAQ 바로가기 &gt;
            </Link>
          </div>

          {/* 문의 폼 */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* 문의 유형 */}
            <div className="mb-6">
              <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                문의 유형 <span className="text-red-500">*</span>
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {INQUIRY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 문의 제목 */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                문의 제목 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="문의 제목"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {titleLength}/200
                </div>
              </div>
            </div>

            {/* 문의 내용 */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                문의 내용 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="고객님의 억울한 일이 뭔가요?"
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
                <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                  {contentLength}/1000
                </div>
              </div>
            </div>

            {/* 파일 첨부 */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                파일 첨부 (선택)
              </label>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  이미지 첨부 20Mb이내 / jpg, png, bmp, gif만 가능
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  이미지 내 개인정보가 포함되지 않도록 주의 (주민번호, 전화번호 등)
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  여러장을 넣기로 원하실 경우, 파일을 눌러 파일을 업로드하세요.
                </p>

                <label className="inline-block px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
                  파일 선택
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/bmp,image/gif"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 선택된 파일 목록 */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '전송 중...' : '보내기'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

