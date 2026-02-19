'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { safeFetchJson } from '@/lib/safe-fetch';

export default function CompletePage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [tossStatus, setTossStatus] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBizType] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  // 연락처 수정
  const [editMode, setEditMode] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // 토스 셀러 상태 확인
  const checkStatus = useCallback(async () => {
    setChecking(true);
    const { ok, data } = await safeFetchJson('/api/business-registration?action=check-status');
    if (ok && data?.tossStatus) {
      setTossStatus(data.tossStatus);
      if (data.contactPhone) setContactPhone(data.contactPhone);
      if (data.businessType) setBizType(data.businessType);
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (sessionStatus !== 'authenticated') return;

    const fetchData = async () => {
      const { ok, data: result } = await safeFetchJson('/api/business-registration');
      if (ok && result?.data) {
        setBusinessName(result.data.businessName || '');
        setBizType(result.data.businessType || '');
        setContactPhone(result.data.contactPhone || '');
        setTossStatus(result.data.tossStatus || 'PENDING');
      }
      setLoading(false);
    };
    fetchData();
  }, [sessionStatus, router]);

  // 연락처 수정 핸들러
  const handleUpdateContact = async () => {
    if (!newPhone.trim()) { alert('새 전화번호를 입력해주세요.'); return; }
    setUpdating(true);
    setUpdateMsg('');
    const { ok, data, error } = await safeFetchJson('/api/business-registration?action=update-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactPhone: newPhone }),
    });
    if (ok && data) {
      setContactPhone(newPhone);
      setEditMode(false);
      setNewPhone('');
      setUpdateMsg('✅ 연락처가 수정되었습니다. 새 번호로 인증 메시지가 발송됩니다.');
      if (data.tossStatus) setTossStatus(data.tossStatus);
    } else {
      setUpdateMsg(`❌ ${error || '수정 실패'}`);
    }
    setUpdating(false);
  };

  const handleConfirm = () => { router.push('/dashboard'); };

  if (loading || sessionStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const displayName = businessName || session?.user?.name || '';
  const isApprovalRequired = tossStatus === 'APPROVAL_REQUIRED';
  const isApproved = tossStatus === 'PARTIALLY_APPROVED' || tossStatus === 'APPROVED';
  const maskedPhone = contactPhone
    ? contactPhone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-****-$3')
    : '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* 상태 아이콘 */}
        <div className="mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isApprovalRequired ? 'bg-yellow-400' : 'bg-blue-500'
          }`}>
            {isApprovalRequired ? (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        {/* 제목 — 상태별 분기 */}
        <h1 className="text-2xl font-bold mb-4">
          {isApprovalRequired
            ? `${displayName}님, 본인인증을 완료해주세요`
            : `${displayName}님, 가입이 완료되었습니다!`}
        </h1>

        {/* APPROVAL_REQUIRED — 본인인증 대기 상태 */}
        {isApprovalRequired && (
          <>
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4 text-left">
              <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ 토스페이먼츠 본인인증이 필요합니다</p>
              <p className="text-sm text-yellow-700">
                {businessType === '개인'
                  ? '입력하신 휴대폰 번호로 카카오톡 인증 메시지가 발송됩니다. 카카오톡에서 본인인증을 완료해주세요.'
                  : '대표자 휴대폰 번호로 카카오톡 인증 메시지가 발송됩니다. 대표자가 직접 카카오톡에서 인증을 완료해주세요.'}
              </p>
            </div>

            {/* 현재 전화번호 표시 + 수정 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">인증 발송 번호</p>
              <p className="text-lg font-bold text-gray-900 mb-2">{maskedPhone || contactPhone || '-'}</p>

              {!editMode ? (
                <button
                  onClick={() => { setEditMode(true); setUpdateMsg(''); }}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  전화번호가 잘못되었나요? 수정하기
                </button>
              ) : (
                <div className="mt-3 space-y-2">
                  <input
                    type="tel"
                    placeholder="새 전화번호 (예: 01012345678)"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateContact}
                      disabled={updating}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm py-2 rounded disabled:opacity-50"
                    >
                      {updating ? '수정 중...' : '수정하기'}
                    </button>
                    <button
                      onClick={() => { setEditMode(false); setNewPhone(''); }}
                      className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-2 rounded"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 업데이트 메시지 */}
            {updateMsg && (
              <p className="text-sm mb-4">{updateMsg}</p>
            )}

            {/* 상태 확인 버튼 */}
            <button
              onClick={checkStatus}
              disabled={checking}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-full transition mb-3 disabled:opacity-50"
            >
              {checking ? '확인 중...' : '✅ 인증 완료 확인하기'}
            </button>
            <p className="text-xs text-gray-500 mb-2">
              카카오톡에서 인증을 완료한 후 위 버튼을 눌러주세요.
            </p>
          </>
        )}

        {/* 승인 완료 상태 — 대시보드 진입 가능 */}
        {isApproved && (
          <>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                {displayName}님의 겟꿀 파트너스
              </p>
              <p className="text-lg font-semibold text-blue-500 mb-2">
                가입 승인 완료
              </p>
              <p className="text-sm text-gray-600">
                대시보드에서 자금 바로 링크를 만들어보세요.
              </p>
            </div>

            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-6 text-left space-y-3">
              <p className="text-sm text-gray-700">
                정산 대금은 매월 15일에 확정되며, 누계 수익이 1만원 이상인 경우 지급됩니다.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition"
            >
              대시보드로 이동
            </button>
          </>
        )}

        {/* 기타 상태 — 대시보드에서 KYC 배너로 안내 */}
        {!isApprovalRequired && !isApproved && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-3">
              가입 처리가 완료되었습니다. 대시보드에서 상세 상태를 확인할 수 있습니다.
            </p>
            <button
              onClick={handleConfirm}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition"
            >
              대시보드로 이동
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
