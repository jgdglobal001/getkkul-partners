'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export default function SimpleSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  // 카테고리 목록 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('카테고리 로드 오류:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim() && !selectedCategory) {
      toast.error('검색어를 입력하거나 카테고리를 선택해주세요.');
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery);
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }

    // /dashboard/link-generator 페이지로 이동
    router.push(`/dashboard/link-generator?${params.toString()}`);
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
            {/* 카테고리 드롭다운 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] text-sm"
            >
              <option value="">전체 카테고리</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* 검색 입력창 */}
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

