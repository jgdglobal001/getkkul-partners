'use client';

export default function PromotionBanner() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4">
          {/* 메인 배너 */}
          <div className="flex-1 bg-linear-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-lg overflow-hidden relative h-64">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="text-sm mb-2">11/3(월) ~ 11/11(화)</div>
              <div className="text-lg mb-4">1년에 단 한번!</div>
              <div className="text-5xl font-bold mb-2">11.11</div>
              <div className="text-3xl font-bold">겟꿀 대축제</div>
            </div>
            {/* 배경 장식 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
            </div>
          </div>

          {/* 서브 배너들 */}
          <div className="w-48 flex flex-col gap-4">
            {/* 배너 1 */}
            <div className="bg-blue-100 rounded-lg p-4 h-14 flex items-center justify-center">
              <div className="text-sm font-medium text-blue-900">무궁화 파워 프로그램</div>
            </div>

            {/* 배너 2 */}
            <div className="bg-green-100 rounded-lg p-4 h-14 flex items-center justify-center">
              <div className="text-sm font-medium text-green-900">겟꿀 하고 계세요</div>
            </div>

            {/* 배너 3 */}
            <div className="bg-purple-100 rounded-lg p-4 h-14 flex items-center justify-center">
              <div className="text-sm font-medium text-purple-900">겟꿀 골프</div>
            </div>

            {/* 배너 4 */}
            <div className="bg-yellow-100 rounded-lg p-4 h-14 flex items-center justify-center">
              <div className="text-sm font-medium text-yellow-900">WOW프로모션</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

