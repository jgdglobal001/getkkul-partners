'use client';

import { useState } from 'react';
import { FaStar, FaExternalLinkAlt, FaLink } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const hasDiscount = product.discountPercentage > 0;

  // 상품정보 버튼 - 겟꿀 쇼핑 상품 페이지로 새 창 열기
  const handleProductInfo = () => {
    const shoppingUrl = process.env.NEXT_PUBLIC_GETKKUL_SHOPPING_URL || 'http://localhost:3002';
    window.open(`${shoppingUrl}/products/${product.id}`, '_blank');
  };

  // 링크 생성 버튼 - 링크 생성 페이지로 이동
  const handleCreateLink = () => {
    router.push(`/dashboard/link-create/${product.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* 상품 이미지 */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-product.png';
          }}
        />

        {/* 할인 배지 */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold z-10">
            {product.discountPercentage}% OFF
          </div>
        )}

        {/* 재고 상태 */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
            <span className="text-white text-lg font-bold">품절</span>
          </div>
        )}

        {/* Hover 시 나타나는 버튼들 */}
        <div className="absolute inset-0 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={handleProductInfo}
            className="w-full bg-pink-50 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-pink-100 flex items-center justify-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-auto border-2 border-pink-300"
          >
            <FaExternalLinkAlt className="w-4 h-4" />
            상품정보
          </button>
          <button
            onClick={handleCreateLink}
            className="w-full bg-pink-50 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-pink-100 flex items-center justify-center gap-2 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75 pointer-events-auto border-2 border-pink-300"
          >
            <FaLink className="w-4 h-4" />
            링크 생성
          </button>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-4">
        {/* 상품명 */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
          {product.title}
        </h3>

        {/* 가격 */}
        <div>
          {hasDiscount ? (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-500 font-bold">
                  {product.discountPercentage}%
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ₩{product.price.toLocaleString()}
                </span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ₩{discountedPrice.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              ₩{product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

