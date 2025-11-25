'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';

// FAQ 데이터
const FAQ_DATA = [
  {
    category: '수익 정산',
    items: [
      {
        question: '수익은 언제 정산되나요?',
        answer: '매월 1일부터 말일까지 발생한 수익은 익월 말일에 정산됩니다. 예를 들어, 1월에 발생한 수익은 2월 말일에 지급됩니다.',
      },
      {
        question: '최소 정산 금액이 있나요?',
        answer: '최소 정산 금액은 10,000원입니다. 정산 금액이 10,000원 미만인 경우 다음 달로 이월됩니다.',
      },
      {
        question: '정산 계좌는 어떻게 등록하나요?',
        answer: '마이페이지 > 정산 정보에서 계좌 정보를 등록할 수 있습니다. 본인 명의의 계좌만 등록 가능합니다.',
      },
    ],
  },
  {
    category: '링크 생성',
    items: [
      {
        question: '링크는 어떻게 생성하나요?',
        answer: '대시보드 > 링크 생성 메뉴에서 원하는 상품을 검색한 후 "링크 생성" 버튼을 클릭하면 됩니다.',
      },
      {
        question: '생성한 링크의 유효기간이 있나요?',
        answer: '생성된 링크는 별도의 유효기간 없이 계속 사용 가능합니다. 단, 상품이 품절되거나 판매 종료된 경우 구매가 불가능합니다.',
      },
      {
        question: '링크를 여러 개 생성할 수 있나요?',
        answer: '네, 제한 없이 원하는 만큼 링크를 생성할 수 있습니다.',
      },
    ],
  },
  {
    category: '계정 관리',
    items: [
      {
        question: '비밀번호를 잊어버렸어요.',
        answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하여 등록된 이메일로 비밀번호 재설정 링크를 받을 수 있습니다.',
      },
      {
        question: '회원 정보를 수정하고 싶어요.',
        answer: '마이페이지 > 회원 정보 수정에서 이메일, 전화번호 등의 정보를 수정할 수 있습니다.',
      },
      {
        question: '회원 탈퇴는 어떻게 하나요?',
        answer: '마이페이지 > 회원 정보 수정 하단의 "회원 탈퇴" 버튼을 클릭하여 탈퇴할 수 있습니다. 단, 미정산 수익이 있는 경우 정산 완료 후 탈퇴 가능합니다.',
      },
    ],
  },
  {
    category: '미디어 등록',
    items: [
      {
        question: '어떤 미디어를 등록할 수 있나요?',
        answer: '블로그, 웹사이트, 유튜브, 인스타그램 등 다양한 미디어를 등록할 수 있습니다.',
      },
      {
        question: '미디어 승인은 얼마나 걸리나요?',
        answer: '미디어 등록 후 영업일 기준 1~3일 이내에 승인 여부가 결정됩니다.',
      },
      {
        question: '미디어가 거절되었어요.',
        answer: '운영정책에 위배되는 콘텐츠가 있거나 미디어 품질이 기준에 미달하는 경우 거절될 수 있습니다. 자세한 사유는 등록 시 입력한 이메일로 안내됩니다.',
      },
    ],
  },
  {
    category: '기타',
    items: [
      {
        question: '고객센터 운영 시간은 어떻게 되나요?',
        answer: '평일 오전 9시부터 오후 6시까지 운영됩니다. (주말 및 공휴일 제외)',
      },
      {
        question: '세금계산서 발행이 가능한가요?',
        answer: '사업자 회원의 경우 세금계산서 발행이 가능합니다. 마이페이지 > 정산 내역에서 신청할 수 있습니다.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (categoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
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
            <span className="text-gray-900">FAQ</span>
          </nav>

          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h1>
            <p className="text-gray-600">
              겟꿀 파트너스 이용 중 자주 묻는 질문들을 모았습니다.
            </p>
          </div>

          {/* FAQ 목록 */}
          <div className="space-y-8">
            {FAQ_DATA.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{category.category}</h2>
                
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => {
                    const key = `${categoryIndex}-${itemIndex}`;
                    const isOpen = openItems[key];
                    
                    return (
                      <div key={itemIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <button
                          onClick={() => toggleItem(categoryIndex, itemIndex)}
                          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3 flex-1">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                              Q
                            </span>
                            <span className="font-medium text-gray-900">{item.question}</span>
                          </div>
                          <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {isOpen && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                                A
                              </span>
                              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* 추가 문의 안내 */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-gray-700 mb-4">
              원하는 답변을 찾지 못하셨나요?
            </p>
            <Link
              href="/dashboard/support/contact"
              className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              1:1 문의하기
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

