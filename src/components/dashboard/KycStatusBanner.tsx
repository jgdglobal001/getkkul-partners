'use client';

interface KycStatusBannerProps {
  tossStatus: string | null;
  onRefresh: () => void;
  refreshing: boolean;
}

export default function KycStatusBanner({ tossStatus, onRefresh, refreshing }: KycStatusBannerProps) {
  // 지급가능 상태이거나 상태 없으면 배너 미표시
  if (!tossStatus || tossStatus === 'PARTIALLY_APPROVED' || tossStatus === 'APPROVED') {
    return null;
  }

  // KYC_REQUIRED 상태일 때 경고 배너
  if (tossStatus === 'KYC_REQUIRED') {
    return (
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-red-500 text-xl">⚠️</span>
              <div>
                <p className="text-sm font-semibold text-red-800">
                  KYC 심사가 필요합니다 — 지급이 일시 중단되었습니다
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  주간 정산금액이 1천만원을 초과하여 KYC 심사가 요청되었습니다. 
                  토스페이먼츠에서 발송한 이메일을 확인하여 KYC 서류를 제출해주세요. 
                  심사 완료 후 정상 지급이 재개됩니다.
                </p>
              </div>
            </div>
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="shrink-0 ml-4 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  확인 중...
                </span>
              ) : (
                '🔄 상태 확인'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 기타 알 수 없는 상태
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-yellow-500 text-xl">ℹ️</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                토스페이먼츠 상태: {tossStatus}
              </p>
              <p className="text-xs text-yellow-600 mt-0.5">
                현재 상태를 확인 중입니다. 문제가 지속되면 고객센터에 문의해주세요.
              </p>
            </div>
          </div>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="shrink-0 ml-4 px-3 py-1.5 text-xs font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors disabled:opacity-50"
          >
            {refreshing ? '확인 중...' : '🔄 상태 확인'}
          </button>
        </div>
      </div>
    </div>
  );
}

