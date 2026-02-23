'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Footer from '@/components/common/Footer';
import ProductCard from '@/components/dashboard/ProductCard';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string | null;
  category: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  sku: string;
  availabilityStatus: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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

  useEffect(() => {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    // URL 쿼리 파라미터에서 검색어와 카테고리 가져오기
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
    if (query || category) {
      if (query) setSearchQuery(query);
      performSearch(query || '', category || '');
    }
  }, [searchParams]);

  const performSearch = async (query: string, category?: string) => {
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      params.set('limit', '500');

      const response = await fetch(`/api/products/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
        if (data.data.length === 0) {
          toast.error('검색 결과가 없습니다.');
        } else {
          toast.success(`${data.data.length}개의 상품을 찾았습니다.`);
        }
      } else {
        toast.error('검색 중 오류가 발생했습니다.');
        setProducts([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('검색 중 오류가 발생했습니다.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim() && !selectedCategory) {
      toast.error('검색어를 입력하거나 카테고리를 선택해주세요.');
      return;
    }

    // URL 업데이트
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    router.push(`/products/search?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 로딩 중
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <DashboardHeader />

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        <div className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* 제목 */}
            <h1 className="text-3xl font-bold text-center mb-4">상품 링크</h1>

          {/* 안내 문구 */}
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-1">상품을 광고할 링크 혹은 배너를 생성할 수 있습니다.</p>
            <p className="text-gray-600 text-sm">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs font-bold mr-1">🔘</span>
              을 클릭하여 생성해 보세요.
            </p>
          </div>

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

              {/* 2단계 - 현재 단계 (중앙) */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl mb-3">
                  2
                </div>
                <p className="text-sm font-bold text-gray-900 text-center">
                  마음에 드는 상품 선택
                </p>
              </div>

              {/* 화살표 */}
              <div className="text-gray-400 text-3xl pt-3">→</div>

              {/* 3단계 */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xl mb-3">
                  3
                </div>
                <p className="text-sm text-gray-600 text-center">URL 혹은 배너 만들기</p>
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

          {/* 검색 영역 */}
          <div className="max-w-3xl mx-auto mb-8">
            {/* 검색창 */}
            <div className="flex gap-2">
              {/* 카테고리 드롭다운 */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px] text-sm"
                disabled={loading}
              >
                <option value="">전체 카테고리</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="판매하고 싶은 상품을 검색해보세요!"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FaSearch className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 검색 결과 */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">상품을 검색하는 중...</p>
            </div>
          )}

          {!loading && searched && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">검색 결과가 없습니다</p>
              <p className="text-gray-500">다른 검색어로 시도해보세요.</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div>
              {/* 검색 결과 헤더 */}
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-blue-600">&quot;{searchQuery || selectedCategory}&quot;</span> 검색 결과{' '}
                  <span className="text-blue-600">{products.length}개</span>
                </p>
              </div>

              {/* 상품 그리드 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {!loading && !searched && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">🛍️</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">상품을 검색해보세요</p>
              <p className="text-gray-500">원하는 상품을 찾아 판매를 시작하세요!</p>
            </div>
          )}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}

export default function ProductSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
