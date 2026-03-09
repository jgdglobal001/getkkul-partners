# 🏗️ 겟꿀 파트너스 프로젝트 구조

> **주의:** 이 문서는 초기 설계/정리 시점의 기록입니다.
> 현재 구조의 최신 기준은 `README.md`, `package.json`, `wrangler.toml`, 실제 `app/`·`src/` 코드를 우선 확인하세요.

## 📂 디렉토리 구조

```
getkkul-partners/
│
├── app/                              # Next.js App Router (메인 페이지)
│   ├── layout.tsx                   # 루트 레이아웃
│   ├── page.tsx                     # 홈페이지 (/)
│   ├── globals.css                  # 전역 스타일
│   ├── favicon.ico                  # 파비콘
│   └── api/                         # API 라우트 (향후 추가)
│       ├── auth/                    # 인증 API
│       ├── products/                # 상품 API
│       ├── orders/                  # 주문 API
│       └── settlement/              # 정산 API
│
├── src/                             # 소스 코드
│   ├── components/                  # React 컴포넌트
│   │   ├── Header.tsx              # 헤더 컴포넌트
│   │   ├── Footer.tsx              # 푸터 컴포넌트
│   │   ├── Sidebar.tsx             # 사이드바 (대시보드용)
│   │   ├── ProductCard.tsx         # 상품 카드
│   │   ├── OrderTable.tsx          # 주문 테이블
│   │   └── ...                     # 기타 컴포넌트
│   │
│   ├── lib/                         # 유틸리티 라이브러리
│   │   ├── api-client.ts           # 겟꿀 메인 API 클라이언트
│   │   ├── auth.ts                 # 인증 유틸리티
│   │   └── utils.ts                # 공통 유틸리티
│   │
│   ├── types/                       # TypeScript 타입 정의
│   │   └── index.ts                # 모든 타입 정의
│   │
│   ├── hooks/                       # 커스텀 React 훅
│   │   ├── useProducts.ts          # 상품 조회 훅
│   │   ├── useOrders.ts            # 주문 조회 훅
│   │   ├── useSettlement.ts        # 정산 조회 훅
│   │   └── ...                     # 기타 훅
│   │
│   ├── contexts/                    # React Context
│   │   ├── AuthContext.tsx         # 인증 컨텍스트
│   │   ├── PartnerContext.tsx      # 파트너 정보 컨텍스트
│   │   └── ...                     # 기타 컨텍스트
│   │
│   ├── utils/                       # 유틸리티 함수
│   │   ├── formatters.ts           # 포맷팅 함수
│   │   ├── validators.ts           # 검증 함수
│   │   └── ...                     # 기타 유틸리티
│   │
│   └── stores/                      # Zustand 상태 관리 (선택사항)
│       ├── productStore.ts         # 상품 상태
│       ├── orderStore.ts           # 주문 상태
│       └── ...                     # 기타 상태
│
├── public/                          # 정적 자산
│   ├── images/                     # 이미지
│   ├── icons/                      # 아이콘
│   └── ...                         # 기타 자산
│
├── .env.example                     # 환경 변수 예시
├── .env.local                       # 환경 변수 (로컬)
├── .gitignore                       # Git 무시 파일
├── next.config.ts                   # Next.js 설정
├── tsconfig.json                    # TypeScript 설정
├── tailwind.config.ts               # Tailwind CSS 설정
├── postcss.config.mjs               # PostCSS 설정
├── package.json                     # 의존성 및 스크립트
├── package-lock.json                # 의존성 잠금 파일
├── README.md                        # 프로젝트 설명
└── PROJECT_STRUCTURE.md             # 이 파일
```

## 🔄 데이터 흐름

```
┌─────────────────────────────────────────────────────────┐
│         겟꿀 파트너스 (Frontend)                        │
│  - 파트너 대시보드                                      │
│  - 상품 관리                                            │
│  - 주문 관리                                            │
│  - 정산 관리                                            │
└─────────────────────────────────────────────────────────┘
           ↓ API 요청 (axios)
┌─────────────────────────────────────────────────────────┐
│         겟꿀 메인 (Backend)                             │
│  - 회원가입/로그인 (통합 인증)                          │
│  - 상위 1000개 상품 조회                                │
│  - 파트너 주문 조회                                     │
│  - 정산 정보 조회                                       │
└─────────────────────────────────────────────────────────┘
           ↓ 데이터베이스
┌─────────────────────────────────────────────────────────┐
│         Neon PostgreSQL                                 │
│  - 상품 정보                                            │
│  - 주문 정보                                            │
│  - 파트너 정보                                          │
│  - 정산 정보                                            │
└─────────────────────────────────────────────────────────┘
```

## 📝 주요 파일 설명

### `src/lib/api-client.ts`
겟꿀 메인 API와 통신하는 클라이언트입니다.

**주요 메서드:**
- `getTopProducts()` - 상위 1000개 상품 조회
- `getProductDetail()` - 상품 상세 정보 조회
- `searchProducts()` - 상품 검색
- `getPartnerOrders()` - 파트너 주문 조회
- `getPartnerSettlement()` - 정산 정보 조회

### `src/types/index.ts`
프로젝트에서 사용하는 모든 TypeScript 타입을 정의합니다.

**주요 타입:**
- `Partner` - 파트너 정보
- `Product` - 상품 정보
- `PartnerProduct` - 파트너 상품
- `Order` - 주문 정보
- `Settlement` - 정산 정보
- `DashboardStats` - 대시보드 통계

## 🚀 개발 가이드

### 새로운 페이지 추가

```typescript
// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getKkulApi } from '@/lib/api-client';
import { Product } from '@/types';

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getKkulApi.getTopProducts();
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>대시보드</h1>
      {/* 대시보드 콘텐츠 */}
    </div>
  );
}
```

### 커스텀 훅 작성

```typescript
// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { getKkulApi } from '@/lib/api-client';
import { Product, ApiResponse } from '@/types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getKkulApi.getTopProducts();
        setProducts(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
}
```

### 컴포넌트 작성

```typescript
// src/components/ProductCard.tsx
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold text-indigo-600">₩{product.price.toLocaleString()}</span>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          판매하기
        </button>
      </div>
    </div>
  );
}
```

## 🔐 환경 변수

```env
# 겟꿀 메인 API
NEXT_PUBLIC_GETKKUL_API_URL=http://localhost:3002
GETKKUL_API_SECRET=your-api-secret-key

# NextAuth 설정
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=your-nextauth-secret-key

# 포트
PORT=3003
```

## 📦 의존성

- **next**: React 프레임워크
- **typescript**: 타입 안전성
- **tailwindcss**: CSS 프레임워크
- **axios**: HTTP 클라이언트
- **zustand**: 상태 관리
- **react-hot-toast**: 알림
- **react-icons**: 아이콘
- **framer-motion**: 애니메이션
- **next-auth**: 인증 (향후)
- **prisma**: ORM (향후)

## 🚀 배포

### Vercel 배포

```bash
# GitHub에 푸시
git add .
git commit -m "Initial commit"
git push origin main

# Vercel에서 배포
# https://vercel.com/new에서 저장소 선택
```

## 📚 다음 단계

1. **인증 구현** - NextAuth.js를 사용한 파트너 로그인
2. **대시보드 페이지** - 판매 현황, 수익, 주문 관리
3. **상품 관리 페이지** - 상품 검색, 필터링, 판매 설정
4. **주문 관리 페이지** - 주문 조회, 상태 관리
5. **정산 관리 페이지** - 월별 정산, 커미션 조회
6. **API 라우트** - 백엔드 API 구현
7. **데이터베이스** - Prisma + PostgreSQL 설정

