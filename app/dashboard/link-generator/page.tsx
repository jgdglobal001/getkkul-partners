'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaSearch, FaSpinner, FaChevronRight, FaHome } from 'react-icons/fa';
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

interface CategoryGroup {
  category: string;
  totalCount: number;
  products: Product[];
}

function LinkGeneratorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // 카테고리 목록 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/search?action=categories');
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

  // 카테고리별 추천 상품 로드
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setCategoryLoading(true);
      try {
        const response = await fetch('/api/products/search?action=by-category&perCategory=6');
        const data = await response.json();
        if (data.success) {
          setCategoryGroups(data.data || []);
        }
      } catch (error) {
        console.error('카테고리별 상품 로드 오류:', error);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategoryProducts();
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
    const page = parseInt(searchParams.get('page') || '1');
    if (category) {
      setSelectedCategory(category);
    }
    if (query || category) {
      if (query) setSearchQuery(query);
      setCurrentPage(page);
      performSearch(query || '', category || '', page);
    }
  }, [searchParams]);

  const performSearch = async (query: string, category?: string, page: number = 1) => {
    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category) params.set('category', category);
      params.set('page', String(page));
      params.set('perPage', '60');

      const response = await fetch(`/api/products/search?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
        setTotalPages(data.totalPages || 0);
        setTotalCount(data.total || 0);
        setCurrentPage(data.page || 1);
        if (data.data.length === 0) {
          toast.error('검색 결과가 없습니다.');
        } else if (page === 1) {
          toast.success(`총 ${data.total}개의 상품을 찾았습니다.`);
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

  const goToPage = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (page > 1) params.set('page', String(page));
    router.push(`/dashboard/link-generator?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = () => {
    if (!searchQuery.trim() && !selectedCategory) {
      toast.error('검색어를 입력하거나 카테고리를 선택해주세요.');
      return;
    }

    // URL 업데이트 (검색 시 항상 1페이지부터)
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    router.push(`/dashboard/link-generator?${params.toString()}`);
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

  // 검색 키워드 유무 확인
  const hasSearchQuery = searchParams.get('q') !== null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 헤더 */}
      <DashboardHeader />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 브레드크럼 네비게이션 */}
          <nav className="mb-4 flex items-center text-sm text-gray-500">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center hover:text-blue-600 transition-colors"
            >
              <FaHome className="w-3.5 h-3.5 mr-1" />
              홈
            </button>
            <FaChevronRight className="w-2.5 h-2.5 mx-2 text-gray-400" />
            {searched || selectedCategory ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setProducts([]);
                  setSearched(false);
                  setCurrentPage(1);
                  setTotalPages(0);
                  setTotalCount(0);
                  router.push('/dashboard/link-generator');
                }}
                className="hover:text-blue-600 transition-colors"
              >
                링크 생성
              </button>
            ) : (
              <span className="text-gray-900 font-medium">링크 생성</span>
            )}
            {selectedCategory && !searchQuery && (
              <>
                <FaChevronRight className="w-2.5 h-2.5 mx-2 text-gray-400" />
                <span className="text-gray-900 font-medium">{selectedCategory}</span>
              </>
            )}
            {searchQuery && (
              <>
                <FaChevronRight className="w-2.5 h-2.5 mx-2 text-gray-400" />
                <span className="text-gray-900 font-medium">&quot;{searchQuery}&quot; 검색결과</span>
              </>
            )}
          </nav>

          {/* 페이지 제목 */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">링크 생성</h1>
          <p className="text-gray-600 text-center mb-8">
            마음에 드는 상품을 찾아보세요
          </p>

          {/* 단계 안내 */}
          <div className="mb-8">
            <div className="flex items-start justify-center gap-8">
              {/* 1단계 */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl mb-3 ${
                  hasSearchQuery
                    ? 'bg-gray-300 text-gray-600'
                    : 'bg-green-600 text-white font-bold'
                }`}>
                  1
                </div>
                <p className={`text-sm text-center ${
                  hasSearchQuery ? 'text-gray-600' : 'font-bold text-gray-900'
                }`}>
                  상품 탐색
                </p>
              </div>

              {/* 화살표 */}
              <div className="text-gray-400 text-3xl pt-3">→</div>

              {/* 2단계 */}
              <div className="flex flex-col items-center flex-1 max-w-[200px]">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl mb-3 ${
                  hasSearchQuery
                    ? 'bg-green-600 text-white font-bold'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <p className={`text-sm text-center ${
                  hasSearchQuery ? 'font-bold text-gray-900' : 'text-gray-600'
                }`}>
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

          {/* 로딩 중 */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">검색 중...</p>
            </div>
          )}

          {/* 검색 결과 */}
          {!loading && products.length > 0 && (
            <div>
              {/* 검색 결과 헤더 */}
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-700">
                  <span className="text-blue-600">&quot;{searchQuery || selectedCategory}&quot;</span> 검색 결과{' '}
                  <span className="text-blue-600">{totalCount}개</span>
                  {totalPages > 1 && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({currentPage}/{totalPages} 페이지)
                    </span>
                  )}
                </p>
              </div>

              {/* 상품 그리드 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {/* 이전 버튼 */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ← 이전
                  </button>

                  {/* 페이지 번호 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        page === currentPage
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* 다음 버튼 */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    다음 →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 검색 결과 없을 때 */}
          {!loading && searched && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">검색 결과가 없습니다</p>
              <p className="text-gray-500">다른 검색어로 다시 시도해보세요.</p>
            </div>
          )}

          {/* 검색 전: 카테고리별 추천 상품 섹션 */}
          {!loading && !searched && (
            <div>
              {categoryLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">상품을 불러오는 중...</p>
                </div>
              ) : categoryGroups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">🛍️</div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">상품을 검색해보세요</p>
                  <p className="text-gray-500">원하는 상품을 찾아 판매를 시작하세요!</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {categoryGroups.map((group) => (
                    <div key={group.category}>
                      {/* 카테고리 헤더 */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl font-bold text-gray-900">{group.category}</h2>
                          <span className="text-sm text-gray-500">({group.totalCount}개)</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCategory(group.category);
                            setSearchQuery('');
                            const params = new URLSearchParams();
                            params.set('category', group.category);
                            router.push(`/dashboard/link-generator?${params.toString()}`);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          더보기 →
                        </button>
                      </div>

                      {/* 상품 가로 스크롤 */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {group.products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* 푸터 */}
      <Footer />
    </div>
  );
}

export default function LinkGeneratorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <LinkGeneratorContent />
    </Suspense>
  );
}

