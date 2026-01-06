'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CompanyIntroPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const totalSlides = 14;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const goToNextSlide = () => {
    if (currentSlide < totalSlides) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (slideNumber: number) => {
    setCurrentSlide(slideNumber);
  };

  const slideImagePath = `/company-slides/slide_${currentSlide}.jpg`;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center hover:opacity-80 transition">
              <img
                src="/getkkul-partners-logo.png"
                alt="겟꿀 파트너스 로고"
                className="h-10 w-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              회사 소개
            </h1>
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition font-semibold"
            >
              돌아가기
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 슬라이드 뷰어 */}
        <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* 슬라이드 이미지 */}
          <div className="relative w-full bg-gray-900 flex items-center justify-center min-h-[600px]">
            <img
              src={slideImagePath}
              alt={`슬라이드 ${currentSlide}`}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* 네비게이션 버튼 */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-t border-gray-200">
            <button
              onClick={goToPreviousSlide}
              disabled={currentSlide === 1}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition transform hover:scale-105"
            >
              ← 이전
            </button>

            <div className="text-center">
              <p className="text-gray-700 font-semibold text-lg">
                슬라이드 <span className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{currentSlide}</span> / {totalSlides}
              </p>
            </div>

            <button
              onClick={goToNextSlide}
              disabled={currentSlide === totalSlides}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition transform hover:scale-105"
            >
              다음 →
            </button>
          </div>
        </div>

        {/* 슬라이드 썸네일 네비게이션 */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <p className="text-gray-700 font-semibold mb-4">슬라이드 선택:</p>
          <div className="grid grid-cols-7 gap-2 sm:grid-cols-14">
            {Array.from({ length: totalSlides }, (_, i) => i + 1).map((slideNum) => (
              <button
                key={slideNum}
                onClick={() => goToSlide(slideNum)}
                className={`py-2 px-3 rounded-lg font-semibold transition transform hover:scale-110 ${
                  currentSlide === slideNum
                    ? 'bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {slideNum}
              </button>
            ))}
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            <span className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">JGDGLOBAL & Getkkul</span> 회사 소개
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            위 슬라이드를 통해 저희 회사의 비전, 미션, 사업 모델, 그리고 파트너십 기회에 대해 자세히 알아보실 수 있습니다.
            <br />
            <br />
            더 궁금한 점이 있으시면 고객센터로 문의해주세요! 📞
          </p>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 JGDGLOBAL & Getkkul. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

