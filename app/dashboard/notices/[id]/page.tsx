'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';

// 공지사항 상세 데이터 (실제로는 API에서 가져와야 함)
const NOTICE_DETAILS: { [key: string]: any } = {
  '161': {
    id: 161,
    category: '활동 규칙',
    title: '무적립 참가 혜택 금지 안내 - SMS 상 의료기기 광고의 \'혜택·제한·오인\' 혜택 금지 관련 가이드',
    isImportant: false,
    createdAt: '2025. 10. 15.',
    content: `
      <h2>무적립 참가 혜택 금지 안내</h2>
      <p>안녕하세요, 겟꿀 파트너스입니다.</p>
      <p>SMS 상 의료기기 광고 시 '혜택·제한·오인' 관련 혜택 표현이 금지됩니다.</p>
      
      <h3>주요 내용</h3>
      <ul>
        <li>의료기기 광고 시 과장된 혜택 표현 금지</li>
        <li>소비자 오인을 유발할 수 있는 표현 금지</li>
        <li>관련 법규 준수 필수</li>
      </ul>
      
      <h3>위반 시 조치</h3>
      <p>해당 규정을 위반할 경우 파트너스 활동이 제한될 수 있습니다.</p>
      
      <p>자세한 내용은 운영정책을 참고해주시기 바랍니다.</p>
      <p>감사합니다.</p>
    `,
  },
  '160': {
    id: 160,
    category: '활동 규칙',
    title: '광계약 어뷰징 금지 가이드',
    isImportant: false,
    createdAt: '2025. 10. 15.',
    content: `
      <h2>광계약 어뷰징 금지 가이드</h2>
      <p>안녕하세요, 겟꿀 파트너스입니다.</p>
      <p>공정한 파트너스 운영을 위해 광계약 어뷰징 행위를 엄격히 금지합니다.</p>
      
      <h3>금지 행위</h3>
      <ul>
        <li>본인 또는 지인의 링크를 통한 반복 구매</li>
        <li>허위 클릭 및 구매 유도</li>
        <li>자동화 프로그램을 이용한 부정 행위</li>
        <li>기타 부정한 방법으로 수익을 발생시키는 행위</li>
      </ul>
      
      <h3>적발 시 조치</h3>
      <ul>
        <li>1차: 경고 및 수익 회수</li>
        <li>2차: 30일 활동 정지</li>
        <li>3차: 영구 이용 정지</li>
      </ul>
      
      <p>건전한 파트너스 활동을 위해 협조 부탁드립니다.</p>
      <p>감사합니다.</p>
    `,
  },
  '158': {
    id: 158,
    category: '활동 규칙',
    title: '⚠️ 파트너스 활동 금지 민감어리스트 명칭 안내 [2025.11.03 update]',
    isImportant: true,
    createdAt: '2025. 09. 19.',
    content: `
      <h2>⚠️ 파트너스 활동 금지 민감어리스트 명칭 안내</h2>
      <p><strong>중요 공지입니다. 반드시 확인해주세요.</strong></p>
      
      <p>안녕하세요, 겟꿀 파트너스입니다.</p>
      <p>파트너스 활동 시 사용이 금지되는 민감어 리스트를 안내드립니다.</p>
      
      <h3>금지 민감어 카테고리</h3>
      <ul>
        <li><strong>의료 관련:</strong> 질병 치료, 효능 효과 등</li>
        <li><strong>과장 광고:</strong> 최고, 최저가, 1위 등 (근거 없는 경우)</li>
        <li><strong>비교 광고:</strong> 타사 제품 비하</li>
        <li><strong>허위 사실:</strong> 사실과 다른 정보</li>
      </ul>
      
      <h3>업데이트 내역 (2025.11.03)</h3>
      <ul>
        <li>의료기기 관련 민감어 추가</li>
        <li>건강기능식품 표현 제한 강화</li>
        <li>화장품 효능 표현 가이드 추가</li>
      </ul>
      
      <h3>위반 시 조치</h3>
      <p>민감어 사용 적발 시 즉시 활동이 제한되며, 발생한 수익은 회수됩니다.</p>
      
      <p>자세한 민감어 리스트는 운영정책 페이지에서 확인하실 수 있습니다.</p>
      <p>감사합니다.</p>
    `,
  },
  '149': {
    id: 149,
    category: '공지사항',
    title: '이용약관 및 운영정책 개정 안내 (2025. 9.11 시행)',
    isImportant: false,
    createdAt: '2025. 08. 11.',
    content: `
      <h2>이용약관 및 운영정책 개정 안내</h2>
      <p>안녕하세요, 겟꿀 파트너스입니다.</p>
      <p>이용약관 및 운영정책이 2025년 9월 11일부로 개정됩니다.</p>
      
      <h3>주요 개정 내용</h3>
      <ul>
        <li>수익 정산 기준 명확화</li>
        <li>금지 행위 항목 추가</li>
        <li>회원 탈퇴 절차 개선</li>
        <li>개인정보 처리방침 업데이트</li>
      </ul>
      
      <h3>시행일</h3>
      <p>2025년 9월 11일부터 적용됩니다.</p>
      
      <p>개정된 약관은 '약관 및 정책' 메뉴에서 확인하실 수 있습니다.</p>
      <p>감사합니다.</p>
    `,
  },
};

export default function NoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noticeId = params.id as string;
  
  const notice = NOTICE_DETAILS[noticeId];

  if (!notice) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">존재하지 않는 공지사항입니다.</p>
              <Link
                href="/dashboard/notices"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                목록으로 돌아가기
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 브레드크럼 */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
            <Link href="/dashboard" className="hover:text-gray-700">홈</Link>
            <span>›</span>
            <Link href="/dashboard/notices" className="hover:text-gray-700">공지사항</Link>
            <span>›</span>
            <span className="text-gray-900">상세보기</span>
          </nav>

          {/* 공지사항 상세 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 헤더 */}
            <div className="border-b border-gray-200 px-8 py-6">
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  {notice.category}
                </span>
                <span className="text-sm text-gray-500">{notice.createdAt}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">
                {notice.isImportant && (
                  <span className="inline-block mr-2 text-yellow-600">⚠️</span>
                )}
                {notice.title}
              </h1>
            </div>

            {/* 본문 */}
            <div 
              className="px-8 py-8 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: notice.content }}
            />
          </div>

          {/* 하단 버튼 */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              목록으로
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

