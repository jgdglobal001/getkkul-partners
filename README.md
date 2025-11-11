# 🚀 겟꿀 파트너스 (Getkkul Partners)

겟꿀쇼핑의 파트너 판매 플랫폼입니다. 쿠팡 파트너스처럼 상위 1000개 상품을 판매하고 커미션을 획득할 수 있습니다.

## 📋 프로젝트 구조

```
getkkul-partners/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃
│   ├── page.tsx                 # 홈페이지
│   ├── globals.css              # 전역 스타일
│   └── api/                     # API 라우트
├── src/
│   ├── components/              # React 컴포넌트
│   ├── lib/
│   │   └── api-client.ts        # 겟꿀 메인 API 클라이언트
│   ├── types/
│   │   └── index.ts             # TypeScript 타입 정의
│   ├── hooks/                   # 커스텀 훅
│   ├── contexts/                # React Context
│   └── utils/                   # 유틸리티 함수
├── public/                      # 정적 자산
├── .env.example                 # 환경 변수 예시
├── package.json                 # 의존성
└── tsconfig.json               # TypeScript 설정
```

## 🎯 주요 기능

### 1. 파트너 대시보드
- 실시간 판매 현황
- 수익 및 커미션 추적
- 주문 관리
- 정산 현황

### 2. 상품 관리
- 겟꿀 메인에서 상위 1000개 상품 조회
- 상품 검색 및 필터링
- 상품 상세 정보 확인

### 3. 주문 관리
- 파트너의 판매 주문 조회
- 주문 상태 추적
- 배송 관리

### 4. 정산 관리
- 월별 정산 현황
- 커미션 계산
- 정산 내역 조회

## 🛠️ 기술 스택

- **프론트엔드**: Next.js 15, TypeScript, Tailwind CSS
- **상태관리**: Zustand
- **API 통신**: Axios
- **UI 라이브러리**: React Icons, Framer Motion
- **알림**: React Hot Toast

## 🚀 시작하기

### 1. 환경 설정

```bash
# .env 파일 생성
cp .env.example .env
```

필요한 환경 변수:
```
NEXT_PUBLIC_GETKKUL_API_URL=http://localhost:3002
GETKKUL_API_SECRET=your-api-secret-key
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=your-nextauth-secret-key
PORT=3003
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 시작

```bash
npm run dev
```

브라우저에서 `http://localhost:3003` 접속
