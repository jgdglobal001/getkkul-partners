'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CompletePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [partnershipId, setPartnershipId] = useState('');
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/auth/signin');
      return;
    }

    // 파트너십 ID 생성 (예: AF5287182)
    const id = 'AF' + Math.random().toString().slice(2, 9).padEnd(7, '0');
    setPartnershipId(id);

    // sessionStorage에서 사업자명 가져오기
    const savedBusinessName = sessionStorage.getItem('businessName');
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
    }
  }, [session, router]);

  const handleConfirm = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 체크 아이콘 */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold mb-4">
          {businessName || session?.user?.name}님, 가입이 완료되었습니다!
        </h1>

        {/* 파트너십 ID */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <p className="text-sm text-gray-600 mb-2">
            {businessName || session?.user?.name}님의 겟꿀 파트너스 ID
          </p>
          <p className="text-2xl font-bold text-blue-500 mb-2">
            {partnershipId}
          </p>
          <p className="text-sm text-gray-600">
            자금 바도 링크를 만들어보세요.
          </p>
        </div>

        {/* 안내 문구 */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6 text-left space-y-3">
          <p className="text-sm text-gray-700">
            경제정보 입력된 대금 자금 조건을 자신 회정에 해당 15일에 확정됩니다.
          </p>
          <p className="text-sm text-gray-700">
            대금지급조건은 최소 중인의 영도되었으며, 직접 정기지여 누계 수익이 1만원 이상인 경우에 해당됩니다.
          </p>
        </div>

        {/* 버튼 */}
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition"
        >
          확인
        </button>
      </div>
    </div>
  );
}

