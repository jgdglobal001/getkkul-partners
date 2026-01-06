'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <Header />

      {/* 히어로 섹션 */}
      <section className="bg-linear-to-r from-indigo-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">"겟꿀파트너스"</span>와 함께<br />
                <span className="text-indigo-600">수익을 창출하세요</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                이미 검증된 상품 5000+를 통해<br />
                소비자의 구매률을 높이고 매월 커미션을 획득하세요
              </p>
              <div className="flex gap-4">
                <a
                  href="/auth"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 hover:shadow-lg transition text-lg transform hover:scale-105"
                >
                  시작하기
                </a>
                <a
                  href="/company-intro"
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition text-lg transform hover:scale-105"
                >
                  회사소개
                </a>
              </div>
            </div>
            <div
              className={`rounded-2xl h-96 flex items-center justify-center ${isLoaded ? 'animate-fade-in-down' : 'opacity-0'} animate-float overflow-hidden`}
              style={{
                backgroundImage: 'url(/hero-background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 파트너 혜택 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              왜 겟꿀 파트너스 인가요?
            </h2>
            <p className="text-xl text-gray-600">
              파트너들이 선택하는 이유를 확인해보세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 혜택 1 */}
            <div className={`text-center ${isLoaded ? 'animate-fade-in-up delay-100' : 'opacity-0'} hover:transform hover:scale-105 transition-transform duration-300`}>
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:shadow-lg transition-shadow">
                <span className="text-5xl animate-float">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">쉬운 가입</h3>
              <p className="text-gray-600 leading-relaxed">
                간단한 정보 입력만으로<br />
                누구나 쉽게 파트너가 될 수 있습니다
              </p>
            </div>

            {/* 혜택 2 */}
            <div className={`text-center ${isLoaded ? 'animate-fade-in-up delay-200' : 'opacity-0'} hover:transform hover:scale-105 transition-transform duration-300`}>
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:shadow-lg transition-shadow">
                <span className="text-5xl animate-float" style={{ animationDelay: '0.5s' }}>✅</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">검증된 상품 5000+</h3>
              <p className="text-gray-600 leading-relaxed">
                이미 검증된 우리 자체 상품으로<br />
                소비자의 구매률을 높일 수 있습니다
              </p>
            </div>

            {/* 혜택 3 */}
            <div className={`text-center ${isLoaded ? 'animate-fade-in-up delay-300' : 'opacity-0'} hover:transform hover:scale-105 transition-transform duration-300`}>
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:shadow-lg transition-shadow">
                <span className="text-5xl animate-float" style={{ animationDelay: '1s' }}>💰</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">높은 수익</h3>
              <p className="text-gray-600 leading-relaxed">
                판매액의 15% 이상 커미션으로<br />
                안정적인 수익을 창출하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 프로모션 배너 */}
      <section className="bg-linear-to-r from-blue-500 to-indigo-600 py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className={`${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔊</span>
                <h2 className="text-4xl font-bold text-white">
                  신규 파트너 가입 이벤트
                </h2>
              </div>
              <p className="text-blue-100 text-lg mb-6">
                지금 가입하면 첫 달 커미션 20% 추가 보너스!<br />
                한정된 기간이니 지금 바로 신청하세요.
              </p>
              <a
                href="/auth"
                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition transform hover:scale-105 hover:shadow-lg"
              >
                지금 시작하기
              </a>
            </div>
            <div className={`rounded-2xl overflow-hidden shadow-2xl ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <img
                src="/signup-image.jpg"
                alt="신규 파트너 가입 이벤트"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className="py-24 bg-linear-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              이렇게 사용하나요?
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              3가지 간단한 단계로 시작하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* 연결선 */}
            <div className="hidden md:block absolute top-32 left-0 right-0 h-1 bg-linear-to-r from-transparent via-pink-400 to-transparent z-0"></div>

            {/* 단계 1 */}
            <div className={`relative z-10 bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 ${isLoaded ? 'animate-fade-in-up delay-100' : 'opacity-0'} hover:transform hover:-translate-y-6 border-t-4 border-pink-500 group`}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-linear-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-pink-300/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">내 사이트에서 겟꿀 광고 링크를 보여주세요</h3>
                <p className="text-gray-600 leading-relaxed text-center mb-8 font-medium">
                  자신의 웹사이트나 블로그에<br />
                  겟꿀의 광고 링크를 삽입하세요
                </p>
                <div className="bg-linear-to-r from-pink-50 to-rose-50 rounded-xl p-4 text-center border border-pink-200">
                  <p className="text-sm font-bold text-pink-700">🔗 광고 링크: 무료 제공</p>
                </div>
              </div>
            </div>

            {/* 단계 2 */}
            <div className={`relative z-10 bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 ${isLoaded ? 'animate-fade-in-up delay-200' : 'opacity-0'} hover:transform hover:-translate-y-6 border-t-4 border-purple-500 group`}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-linear-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-purple-300/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">방문자가 광고 클릭하고 구매합니다</h3>
                <p className="text-gray-600 leading-relaxed text-center mb-8 font-medium">
                  사용자가 광고를 클릭하면<br />
                  겟꿀로 이동하여 구매를 진행합니다
                </p>
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 rounded-xl p-4 text-center border border-purple-200">
                  <p className="text-sm font-bold text-purple-700">🛍️ 구매: 실시간 추적</p>
                </div>
              </div>
            </div>

            {/* 단계 3 */}
            <div className={`relative z-10 bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 ${isLoaded ? 'animate-fade-in-up delay-300' : 'opacity-0'} hover:transform hover:-translate-y-6 border-t-4 border-indigo-500 group`}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-linear-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:shadow-indigo-300/50 group-hover:scale-110 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">구매액의 수익으로 지급합니다</h3>
                <p className="text-gray-600 leading-relaxed text-center mb-8 font-medium">
                  구매 발생 시 커미션 수익을<br />
                  정산 주기에 맞춰 지급합니다
                </p>
                <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-xl p-4 text-center border border-indigo-200">
                  <p className="text-sm font-bold text-indigo-700">💰 정산: 월 1회</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-16 bg-linear-to-br from-white via-gray-50 to-white relative overflow-hidden">
        {/* 배경 장식 - 더 미묘하게 */}
        <div className="absolute top-10 right-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              겟꿀 파트너스 현황
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              빠르게 성장하는 파트너 플랫폼
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 통계 1 */}
            <div className={`bg-linear-to-br from-white to-gray-50 rounded-3xl p-10 border border-gray-200 hover:border-pink-500/50 transition-all duration-300 ${isLoaded ? 'animate-fade-in-up delay-100' : 'opacity-0'} hover:transform hover:-translate-y-6 hover:shadow-2xl hover:shadow-pink-500/10 group text-center`}>
              <div className="w-16 h-16 bg-linear-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-pink-500/50 group-hover:scale-110 transition-all duration-300 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
                </svg>
              </div>
              <div className="text-2xl font-bold bg-linear-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
                5000+
              </div>
              <p className="text-gray-700 font-semibold">검증된 상품</p>
            </div>

            {/* 통계 2 */}
            <div className={`bg-linear-to-br from-white to-gray-50 rounded-3xl p-10 border border-gray-200 hover:border-purple-500/50 transition-all duration-300 ${isLoaded ? 'animate-fade-in-up delay-200' : 'opacity-0'} hover:transform hover:-translate-y-6 hover:shadow-2xl hover:shadow-purple-500/10 group text-center`}>
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/50 group-hover:scale-110 transition-all duration-300 mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="text-2xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                500+
              </div>
              <p className="text-gray-700 font-semibold">활성 파트너</p>
            </div>

            {/* 통계 3 */}
            <div className={`bg-linear-to-br from-white to-gray-50 rounded-3xl p-10 border border-gray-200 hover:border-blue-500/50 transition-all duration-300 ${isLoaded ? 'animate-fade-in-up delay-300' : 'opacity-0'} hover:transform hover:-translate-y-6 hover:shadow-2xl hover:shadow-blue-500/10 group text-center`}>
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 group-hover:scale-110 transition-all duration-300 mx-auto">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-4h2V17z" />
                </svg>
              </div>
              <div className="text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                10M+
              </div>
              <p className="text-gray-700 font-semibold">월 거래액</p>
            </div>

            {/* 통계 4 */}
            <div className={`bg-linear-to-br from-white to-gray-50 rounded-3xl p-10 border border-gray-200 hover:border-yellow-500/50 transition-all duration-300 ${isLoaded ? 'animate-fade-in-up delay-400' : 'opacity-0'} hover:transform hover:-translate-y-6 hover:shadow-2xl hover:shadow-yellow-500/10 group text-center`}>
              <div className="w-16 h-16 bg-linear-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-yellow-500/50 group-hover:scale-110 transition-all duration-300 mx-auto">
                <span className="text-3xl font-bold text-white">₩</span>
              </div>
              <div className="text-2xl font-bold bg-linear-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3">
                15%
              </div>
              <p className="text-gray-700 font-semibold">평균 커미션</p>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src="/getkkul-partners-logo.png"
                alt="겟꿀 파트너스 로고"
                className="h-12 w-auto mb-4"
              />
              <p className="text-gray-400 text-sm">
                검증된 상품 5000+로<br />
                수익을 창출하는 파트너 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">회사</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white">회사소개</a></li>
                <li><a href="#" className="hover:text-white">채용정보</a></li>
                <li><a href="#" className="hover:text-white">뉴스</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">고객지원</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white">도움말</a></li>
                <li><a href="#" className="hover:text-white">고객센터</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">팔로우</h4>
              <div className="flex gap-4">
                {/* 카카오톡 로고 */}
                <a href="#" className="w-6 h-6 text-gray-400 hover:text-yellow-400 transition-colors" title="카카오">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.687 1.786 5.053 4.478 6.394-.143.525-.518 1.907-.594 2.2-.092.357.131.352.276.256.113-.075 1.8-1.222 2.534-1.717.422.063.858.096 1.306.096 5.523 0 10-3.463 10-7.229C20 6.463 17.523 3 12 3z"/>
                  </svg>
                </a>
                {/* 네이버 로고 */}
                <a href="#" className="w-6 h-6 text-gray-400 hover:text-green-500 transition-colors" title="네이버">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
                  </svg>
                </a>
                {/* TikTok 로고 */}
                <a href="#" className="w-6 h-6 text-gray-400 hover:text-white transition-colors" title="TikTok">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-6 h-6 text-gray-400 hover:text-pink-500 transition-colors" title="Instagram">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#" className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" title="YouTube">
                  <svg fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          {/* 회사 정보 */}
          <div className="border-t border-gray-800 pt-8">
            <div className="text-gray-400 text-sm mb-6">
              <p className="mb-2">
                <span className="font-semibold text-gray-300">주식회사 제이지디글로벌</span>
                <span className="mx-2">|</span>
                대표자: 전은찬
                <span className="mx-2">|</span>
                개인정보보호책임자: 백인희
              </p>
              <p className="mb-2">
                사업자등록번호: 308-86-03448
                <span className="mx-2">|</span>
                통신판매신고번호: 제 2025-인천연수구-2051 호
              </p>
              <p className="mb-2">
                주소: 인천광역시 연수구 송도과학로 32, 엠동 2201호(송도동, 송도테크노파크 IT센터)
              </p>
              <p>
                고객센터: <a href="tel:010-7218-2858" className="hover:text-white">010-7218-2858</a>
                <span className="mx-2">|</span>
                이메일: <a href="mailto:jgdglobal@kakao.com" className="hover:text-white">jgdglobal@kakao.com</a>
              </p>
            </div>
            <div className="mb-6 text-gray-400 text-sm space-x-4 text-center">
              <a href="/policies?tab=service" className="hover:text-white">이용약관</a>
              <span>|</span>
              <a href="/policies?tab=privacy" className="hover:text-white font-semibold">개인정보처리방침</a>
              <span>|</span>
              <a href="/policies?tab=operating" className="hover:text-white">이용정책</a>
            </div>
            <div className="text-center text-gray-400 text-sm">
              <p>&copy; 2026 겟꿀 파트너스. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
