'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaCopy, FaCheck, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface LinkData {
  id: string;
  shortCode: string;
  shortUrl: string;
  iframeCode: string;
  imgCode: string;
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

  const handleCopyHtml = async () => {
    if (!linkData) return;
    const code = htmlType === 'iframe' ? linkData.iframeCode : linkData.imgCode;
    await navigator.clipboard.writeText(code);
    setCopiedHtml(true);
    toast.success('HTML 코드가 복사되었습니다!');
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">링크 생성 중...</p>
        </div>
      </div>
    );
  }

  if (!linkData) return null;

  const discountedPrice = linkData.product.price * (1 - linkData.product.discountPercentage / 100);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft />
            대시보드로 돌아가기
          </button>
          <h1 className="text-3xl font-bold text-gray-900">링크 생성</h1>
          <p className="text-gray-600 mt-2">
            단축 URL 혹은 HTML 코드를 복사하여 블로그, SNS, 웹사이트에 붙여주세요
          </p>
        </div>

        {/* 단축 URL */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">단축 URL</h2>
          <div className="flex gap-2">
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
        </div>

        {/* 이미지 + 텍스트 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">이미지 + 텍스트</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* 미리보기 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">미리보기</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="w-32 mx-auto">
                  <img src={linkData.product.thumbnail} alt={linkData.product.title} className="w-full rounded" />
                  <p className="text-sm text-gray-800 mt-2 line-clamp-2">{linkData.product.title}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">₩{discountedPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* HTML 코드 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">HTML</h3>
              
              {/* 라디오 버튼 */}
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={htmlType === 'iframe'}
                    onChange={() => setHtmlType('iframe')}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">일반태그</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={htmlType === 'img'}
                    onChange={() => setHtmlType('img')}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="text-sm text-gray-700">블로그용 태그</span>
                </label>
              </div>

              {/* HTML 코드 */}
              <textarea
                value={htmlType === 'iframe' ? linkData.iframeCode : linkData.imgCode}
                readOnly
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-xs mb-3"
              />

              {/* 복사 버튼 */}
              <button
                onClick={handleCopyHtml}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 font-medium"
              >
                {copiedHtml ? <FaCheck /> : <FaCopy />}
                {copiedHtml ? '복사됨' : 'HTML 복사'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

