'use client';

import { useState } from 'react';
import { FaStar, FaShoppingCart, FaHeart } from 'react-icons/fa';

interface ProductCardProps {
  product: {
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
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  const handleAddToCart = () => {
    // TODO: 장바구니 추가 기능
    console.log('장바구니 추가:', product.id);
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: 위시리스트 추가/제거 기능
    console.log('위시리스트 토글:', product.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* 상품 이미지 */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-product.png';
          }}
        />
        
        {/* 할인 배지 */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* 재고 상태 */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white text-lg font-bold">품절</span>
          </div>
        )}

        {/* 위시리스트 버튼 */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <FaHeart className={`w-5 h-5 ${isWishlisted ? 'text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        {/* 브랜드 & 카테고리 */}
        <div className="flex items-center gap-2 mb-2">
          {product.brand && (
            <span className="text-xs text-gray-500 font-medium">{product.brand}</span>
          )}
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500">{product.category}</span>
        </div>

        {/* 상품명 */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
          {product.title}
        </h3>

        {/* 평점 */}
        <div className="flex items-center gap-1 mb-3">
          <FaStar className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700">{product.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400 ml-1">({product.stock}개 재고)</span>
        </div>

        {/* 가격 */}
        <div className="mb-4">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">
                ₩{discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₩{product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-indigo-600">
              ₩{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* 태그 */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 버튼 */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <FaShoppingCart className="w-4 h-4" />
          {product.stock === 0 ? '품절' : '판매하기'}
        </button>
      </div>
    </div>
  );
}

