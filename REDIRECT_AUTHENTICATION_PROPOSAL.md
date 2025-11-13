# 🔄 겟꿀 파트너스 ↔ 겟꿀 쇼핑 인증 리다이렉트 구조 제안

## 📋 현황 분석

### 겟꿀 쇼핑 (포트 3002)
- **인증 방식**: NextAuth.js v5 + Neon PostgreSQL
- **OAuth 제공자**: Google, Kakao, Naver (3가지)
- **로그인 페이지**: `/auth/signin`
- **회원가입 페이지**: `/auth/register`
- **미들웨어**: 보호된 라우트 자동 리다이렉트
- **세션**: JWT 기반 + Prisma Adapter

### 겟꿀 파트너스 (포트 3003)
- **현황**: 홈페이지만 완성, 인증 미구현
- **필요**: 회원가입/로그인 페이지 필요

---

## 🎯 제안 구조: 크로스 도메인 리다이렉트 인증

### 방식 1️⃣: Query Parameter 기반 리다이렉트 (권장)

```
파트너스 회원가입 클릭
    ↓
파트너스 → 쇼핑 리다이렉트 (redirect_uri 포함)
    ↓
쇼핑 회원가입/로그인 완료
    ↓
쇼핑 → 파트너스로 리다이렉트 (토큰/세션 포함)
    ↓
파트너스 대시보드 진입
```

### 구현 흐름

#### 1️⃣ 파트너스 회원가입 버튼 (`app/page.tsx`)
```typescript
// 쇼핑으로 리다이렉트 (redirect_uri 포함)
const handleSignup = () => {
  const redirectUri = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_PARTNERS_URL}/auth/callback`
  );
  window.location.href =
    `${process.env.NEXT_PUBLIC_SHOPPING_URL}/auth/register?redirect_uri=${redirectUri}&source=partners`;
};
```

#### 2️⃣ 쇼핑 회원가입 폼 수정 (`RegisterForm.tsx` & `SignInForm.tsx`)

**현재 코드:**
```typescript
await signIn(provider, { callbackUrl: "/" });  // ❌ 항상 쇼핑 홈으로만 이동
```

**수정 코드:**
```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterForm() {
  const searchParams = useSearchParams();

  const handleOAuthSignIn = async (provider: "google" | "kakao" | "naver") => {
    try {
      // redirect_uri가 있으면 그것을 사용, 없으면 쇼핑 홈으로
      const redirectUri = searchParams.get('redirect_uri') || '/';
      const source = searchParams.get('source');

      // callbackUrl을 동적으로 설정
      const callbackUrl = source === 'partners'
        ? redirectUri  // 파트너스로 리다이렉트
        : '/';         // 쇼핑 홈으로 리다이렉트

      await signIn(provider, { callbackUrl });
    } catch (error) {
      toast.error("소셜 로그인에 실패했습니다");
    }
  };

  // ... 나머지 코드
}
```

#### 3️⃣ 파트너스 콜백 페이지 (`app/auth/callback/page.tsx`)
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // NextAuth 세션이 자동으로 설정됨
    // 파트너스에서 쇼핑의 세션 쿠키를 공유할 수 있도록 설정

    // 대시보드로 리다이렉트
    router.push('/dashboard');
  }, [router]);

  return <div>인증 처리 중...</div>;
}
```

---

## � **핵심: 세션 공유 방식**

### 방식 A: 쿠키 기반 세션 공유 (권장)

NextAuth.js는 기본적으로 **쿠키에 세션을 저장**합니다.

```
파트너스 (localhost:3003)
    ↓ [쇼핑 회원가입 페이지로 이동]
쇼핑 (localhost:3002)
    ↓ [OAuth 인증 완료]
    ↓ [NextAuth가 쿠키에 세션 저장]
    ↓ [redirect_uri로 파트너스로 리다이렉트]
파트너스 (localhost:3003)
    ↓ [쇼핑의 세션 쿠키가 자동으로 전달됨]
    ↓ [파트너스에서 쇼핑의 세션 인증 확인 가능]
```

**문제**: 기본적으로 쿠키는 같은 도메인에서만 공유됨

**해결책**:
1. **개발 환경**: `localhost` 도메인이므로 쿠키 공유 가능 (SameSite=Lax 설정)
2. **프로덕션**: 같은 도메인 사용 (예: `shopping.getkkul.com`, `partners.getkkul.com`)

### 방식 B: 토큰 기반 세션 공유 (대체 방안)

쿠키 공유가 안 되는 경우:

```typescript
// 쇼핑에서 JWT 토큰 생성
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.SHARED_SECRET,
  { expiresIn: '7d' }
);

// 파트너스로 리다이렉트 (토큰 포함)
window.location.href = `${redirectUri}?token=${token}`;

// 파트너스에서 토큰 검증
const decoded = jwt.verify(token, process.env.SHARED_SECRET);
```

---

## �🔐 보안 고려사항

### 1. CSRF 보호
```typescript
// 쇼핑에서 state 파라미터 생성
const state = generateRandomString(32);
sessionStorage.setItem('auth_state', state);

// 리다이렉트 URI에 state 포함
const redirectUri = `${PARTNERS_URL}/auth/callback?state=${state}`;
```

### 2. 토큰 검증
```typescript
// 파트너스에서 토큰 검증
const verifyToken = async (token: string) => {
  const response = await fetch(
    `${SHOPPING_URL}/api/auth/verify-token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    }
  );
  return response.json();
};
```

### 3. 환경 변수 설정
```env
# 파트너스 (.env.local)
NEXT_PUBLIC_SHOPPING_URL=http://localhost:3002
NEXT_PUBLIC_PARTNERS_URL=http://localhost:3003
PARTNERS_AUTH_SECRET=your-secret-key

# 쇼핑 (.env.local)
NEXT_PUBLIC_PARTNERS_URL=http://localhost:3003
SHOPPING_AUTH_SECRET=your-secret-key
```

---

## 📁 필요한 파일 생성

### 파트너스 측
1. `app/auth/callback/page.tsx` - 콜백 페이지
2. `src/lib/auth-client.ts` - 인증 클라이언트
3. `src/hooks/useAuthRedirect.ts` - 리다이렉트 훅

### 쇼핑 측 수정
1. `app/auth/register/page.tsx` - redirect_uri 처리 추가
2. `app/auth/signin/page.tsx` - redirect_uri 처리 추가
3. `app/api/auth/verify-token/route.ts` - 토큰 검증 API

---

## ✅ 장점

- ✅ 기존 쇼핑 인증 시스템 활용
- ✅ 파트너스에서 별도 DB 불필요
- ✅ 사용자 정보 동기화 용이
- ✅ 보안 토큰 기반 검증
- ✅ 크로스 도메인 호환

---

## ⚠️ 주의사항

1. **CORS 설정**: 필요시 쇼핑에서 파트너스 도메인 허용
2. **토큰 만료**: 적절한 TTL 설정 필요
3. **HTTPS**: 프로덕션에서는 HTTPS 필수
4. **쿠키 정책**: SameSite 속성 설정 필요

---

## � **최종 비교: 어디로 갈지 어떻게 구분하는가?**

| 상황 | 파라미터 | 리다이렉트 대상 |
|------|---------|-----------------|
| 파트너스에서 회원가입 클릭 | `?redirect_uri=...&source=partners` | 쇼핑 회원가입 |
| 쇼핑에서 회원가입 클릭 | 파라미터 없음 | 쇼핑 홈 (`/`) |
| 쇼핑 회원가입 완료 (파트너스 출처) | `redirect_uri` 파라미터 있음 | **파트너스 콜백** |
| 쇼핑 회원가입 완료 (쇼핑 직접) | 파라미터 없음 | **쇼핑 홈** |

**핵심**: `redirect_uri` 파라미터로 출처를 판단!

---

## �🚀 다음 단계

### 쇼핑 프로젝트 수정 (필수)
1. `src/components/auth/RegisterForm.tsx` - `redirect_uri` 파라미터 처리
2. `src/components/auth/SignInForm.tsx` - `redirect_uri` 파라미터 처리
3. NextAuth 설정에서 쿠키 SameSite 정책 확인

### 파트너스 프로젝트 구현 (필수)
1. `app/page.tsx` - 회원가입/로그인 버튼에 리다이렉트 로직 추가
2. `app/auth/callback/page.tsx` - 콜백 페이지 생성
3. 환경 변수 설정 (`NEXT_PUBLIC_SHOPPING_URL`)

### 프로덕션 배포 시 (필수)
1. OAuth 제공자 콘솔에서 리다이렉트 URI 등록
   - 쇼핑: `https://shopping.getkkul.com/api/auth/callback/{provider}`
   - 파트너스: `https://partners.getkkul.com/auth/callback`
2. 쿠키 도메인 설정 (`.getkkul.com`)
3. HTTPS 적용

---

## ✅ 요약

**당신의 질문: "파트너스에서 회원가입하면 쇼핑으로 갈지? 파트너스로 갈지 어떻게 구분하는데?"**

**답변:**
1. 파트너스에서 회원가입 클릭 → `redirect_uri` 파라미터 포함해서 쇼핑으로 이동
2. 쇼핑의 회원가입 폼에서 `redirect_uri` 파라미터 확인
3. 파라미터가 있으면 → **파트너스로 리다이렉트**
4. 파라미터가 없으면 → **쇼핑 홈으로 리다이렉트**

**코딩 허가를 기다리고 있습니다!** ✋

