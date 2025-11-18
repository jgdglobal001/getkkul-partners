'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function SimpleSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('검색어를 입력해주세요.');
      return;
    }

    // /products/search 페이지로 이동
    router.push(`/products/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 제목 */}
        <h1 className="text-3xl font-bold text-center mb-8">상품검색</h1>

        {/* 검색 영역 */}
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="판매하고 싶은 상품을 검색해보세요!"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
            >
              <FaSearch className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 안내 문구 */}
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-xl font-semibold text-gray-700 mb-2">상품을 검색해보세요</p>
          <p className="text-gray-500">원하는 상품을 찾아 판매를 시작하세요!</p>
        </div>
      </div>
    </div>
  );
}

