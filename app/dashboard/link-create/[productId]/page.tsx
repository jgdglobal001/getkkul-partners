'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaCopy, FaCheck, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';
import toast from 'react-hot-toast';

interface LinkData {
  id: string;
  shortCode: string;
  shortUrl: string;
  iframeCode: string;
  iframeCodeNoBorder: string;
  imgCode: string;
  imgCodeWithBorder: string;
  product: {
    id: string;
    title: string;
    price: number;
    discountPercentage: number;
    thumbnail: string;
  };
}

export default function LinkCreatePage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.productId as string;

  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [htmlType, setHtmlType] = useState<'iframe' | 'img'>('iframe');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showBorder, setShowBorder] = useState(true);

  useEffect(() => {
    createLink();
  }, [productId]);

  const createLink = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/partner-links/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('🔍 링크 데이터:', result.data);
        setLinkData(result.data);
      } else {
        toast.error(result.error || '링크 생성 실패');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('링크 생성 오류:', error);
      toast.error('링크 생성 중 오류가 발생했습니다.');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!linkData) return;
    await navigator.clipboard.writeText(linkData.shortUrl);
    setCopiedUrl(true);
    toast.success('URL이 복사되었습니다!');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // HTML 코드 생성 (보더라인 옵션에 따라 다른 코드 반환)
  const getHtmlCode = () => {
    if (!linkData) return '';

    console.log('🔍 getHtmlCode 호출:', {
      htmlType,
      showBorder,
      iframeCode: linkData.iframeCode,
      iframeCodeNoBorder: linkData.iframeCodeNoBorder,
      imgCode: linkData.imgCode,
      imgCodeWithBorder: linkData.imgCodeWithBorder,
    });

    if (htmlType === 'iframe') {
      // 일반태그: 체크 시 테두리 있음, 해제 시 테두리 없음
      return showBorder ? linkData.iframeCode : linkData.iframeCodeNoBorder;
    } else {
      // 블로그용 태그: 체크 시 테두리 없음, 해제 시 테두리 있음
      return showBorder ? linkData.imgCode : linkData.imgCodeWithBorder;
    }
  };

  const handleCopyHtml = async () => {
    if (!linkData) return;
    const code = getHtmlCode();

    await navigator.clipboard.writeText(code);
    setCopiedHtml(true);
    setShowTooltip(true);
    toast.success('HTML 코드가 복사되었습니다!');

    // 말풍선은 3초 후 사라짐
    setTimeout(() => setShowTooltip(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">링크 생성 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!linkData) return null;

  const discountedPrice = linkData.product.price * (1 - linkData.product.discountPercentage / 100);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <DashboardHeader />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">링크 생성</h1>
          <p className="text-gray-600 text-center mb-8">
            단축 URL 혹은 HTML 코드를 복사하여 블로그, SNS, 웹사이트에 붙여주세요
          </p>

          {/* 단계 안내 */}
          <div className="mb-8">
            <div className="flex items-start justify-center gap-8">
              {/* 1단계 */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xl mb-3">
                  1
                </div>
                <p className="text-sm text-gray-600 text-center">상품 탐색</p>
              </div>

              {/* 화살표 */}
              <div className="text-gray-400 text-3xl pt-3">→</div>

              {/* 2단계 */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xl mb-3">
                  2
                </div>
                <p className="text-sm text-gray-600 text-center">마음에 드는 상품 선택</p>
              </div>

              {/* 화살표 */}
              <div className="text-gray-400 text-3xl pt-3">→</div>

              {/* 3단계 - 현재 단계 (중앙) */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl mb-3">
                  3
                </div>
                <p className="text-sm font-bold text-gray-900 text-center">URL 혹은 배너 만들기</p>
              </div>
            </div>
          </div>

          {/* 광고 배너 */}
          <div className="w-full mb-8">
            <div className="bg-linear-to-r from-purple-500 to-pink-500 p-6 text-white text-center">
              <h2 className="text-2xl font-bold mb-2">🎉 특별 프로모션!</h2>
              <p className="text-lg mb-4">지금 가입하고 첫 수익 10% 추가 보너스 받으세요!</p>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                자세히 보기
              </button>
            </div>
          </div>
        </div>

        {/* 단축 URL */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">단축 URL</h2>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={linkData.shortUrl}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
            />
            <button
              onClick={handleCopyUrl}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 font-medium"
            >
              {copiedUrl ? <FaCheck /> : <FaCopy />}
              {copiedUrl ? '복사됨' : 'URL 복사'}
            </button>
          </div>

          {/* 활동 시 주의 사항 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">*활동 시 주의 사항</h3>

            <div className="space-y-4">
              {/* 주의사항 1 */}
              <div>
                <p className="font-semibold text-gray-900 mb-2">1. 게시글 작성 시, 아래 문구를 반드시 기재해 주세요.</p>
                <div className="bg-white border border-yellow-300 rounded p-3 mb-2">
                  <p className="text-sm text-gray-800 italic">
                    "이 포스팅은 겟꿀 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
                  </p>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  겟꿀 파트너스의 활동은 공정거래위원회의 심사지침에 따라 추천, 보증인인 파트너스 회원과 당사의 경제적 이해관계에 대하여 공개하여야 합니다.<br />
                  자세한 내용은 "도움말&gt;자주묻는질문&gt;이용문의&gt;광고 삽입 시 대가성 문구를 써야하나요?"를 참고해 주세요.
                </p>
              </div>

              {/* 주의사항 2 */}
              <div>
                <p className="font-semibold text-gray-900 mb-2">2. 바로가기 아이콘 이용 시, 수신자의 사전 동의를 얻지 않은 메신저, SNS 등으로 메시지를 발송하는 행위는</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  불법 스팸 전송 행위로 간주되어 규제기관의 행정제재(3천만원 이하의 과태료) 또는 형사 처벌<br />
                  (1년 이하의 징역 또는 1천만원 이하의 벌금)의 대상이 될 수 있으니 이 점 유의하시기 바랍니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 + 텍스트 (좌우 분리) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">이미지 + 텍스트</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 미리보기 (왼쪽) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">미리보기</h3>
              <div className="flex justify-center">
                <div className={`w-40 bg-white ${
                  htmlType === 'iframe'
                    ? (showBorder ? 'border border-gray-900' : '')
                    : (showBorder ? '' : 'border border-gray-900')
                } p-3`}>
                  {/* 겟꿀 쇼핑 로고 */}
                  <div className="flex justify-center mb-2">
                    <Image
                      src="/getkkul-logo-left-right.png"
                      alt="겟꿀"
                      width={120}
                      height={30}
                      className="h-8 w-auto"
                    />
                  </div>

                  {/* 상품 이미지 */}
                  <div className="mb-2">
                    <img
                      src={linkData.product.thumbnail}
                      alt={linkData.product.title}
                      className="w-full"
                    />
                  </div>

                  {/* 상품명 */}
                  <p className="text-xs text-gray-800 text-center mb-3 line-clamp-2 min-h-8">
                    {linkData.product.title}
                  </p>

                  {/* 쇼핑하기 버튼 */}
                  <button className="w-full bg-blue-600 text-white text-sm py-2 rounded-full hover:bg-blue-700 transition">
                    쇼핑하기
                  </button>
                </div>
              </div>

              {/* 보더라인 체크박스 */}
              <div className="mt-4 flex justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showBorder}
                    onChange={(e) => setShowBorder(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span className="text-sm text-gray-700">보더라인</span>
                </label>
              </div>
            </div>

            {/* HTML (오른쪽) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">HTML</h3>
                <p className="text-xs text-green-600">
                  iframe이 적용되지 않는 곳에는 블로그용 태그를 이용하세요
                </p>
              </div>

              {/* 라디오 버튼 */}
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={htmlType === 'iframe'}
                    onChange={() => {
                      setHtmlType('iframe');
                      setCopiedHtml(false); // 경고 문구 숨김
                    }}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">일반태그</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={htmlType === 'img'}
                    onChange={() => {
                      setHtmlType('img');
                      setCopiedHtml(false); // 경고 문구 숨김
                    }}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">블로그용 태그</span>
                </label>
              </div>

              {/* HTML 코드 */}
              <textarea
                value={getHtmlCode()}
                readOnly
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-xs mb-3"
              />

              {/* 경고 말풍선 + 복사 버튼 */}
              <div className="relative">
                {/* 말풍선 (3초간만 표시) */}
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 z-10">
                    <div className="bg-purple-600 text-white text-xs px-4 py-2 rounded-lg text-center relative">
                      복사 완료! 개시글에 대가성 문구 기재를 잊지 마세요!
                      {/* 화살표 */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-purple-600"></div>
                    </div>
                  </div>
                )}

                {/* 복사 버튼 */}
                <button
                  onClick={handleCopyHtml}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium"
                >
                  {copiedHtml ? <FaCheck /> : <FaCopy />}
                  HTML 복사
                </button>
              </div>

              {/* 활동 시 주의 사항 (복사 후 표시) */}
              {copiedHtml && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5 mt-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">*활동 시 주의 사항</h3>

                  <div className="space-y-4">
                    {/* 주의사항 1 */}
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">1. 게시글 작성 시, 아래 문구를 반드시 기재해 주세요.</p>
                      <div className="bg-white border border-yellow-300 rounded p-3 mb-2">
                        <p className="text-sm text-gray-800 italic">
                          "이 포스팅은 겟꿀 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        겟꿀 파트너스의 활동은 공정거래위원회의 심사지침에 따라 추천, 보증인인 파트너스 회원과 당사의 경제적 이해관계에 대하여 공개하여야 합니다.<br />
                        자세한 내용은 "도움말&gt;자주묻는질문&gt;이용문의&gt;광고 삽입 시 대가성 문구를 써야하나요?"를 참고해 주세요.
                      </p>
                    </div>

                    {/* 주의사항 2 */}
                    <div>
                      <p className="font-semibold text-gray-900 mb-2">2. 바로가기 아이콘 이용 시, 수신자의 사전 동의를 얻지 않은 메신저, SNS 등으로 메시지를 발송하는 행위는</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        불법 스팸 전송 행위로 간주되어 규제기관의 행정제재(3천만원 이하의 과태료) 또는 형사 처벌<br />
                        (1년 이하의 징역 또는 1천만원 이하의 벌금)의 대상이 될 수 있으니 이 점 유의하시기 바랍니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}

