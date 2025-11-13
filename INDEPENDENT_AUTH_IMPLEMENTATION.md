# 🔐 파트너스 독립적 회원가입/로그인 구현 가이드

## 📋 개요

**목표**: 쇼핑의 회원가입/로그인 구현을 파트너스에 그대로 적용
- 각 프로젝트가 **독립적으로 관리**
- **같은 데이터베이스 공유** (Neon PostgreSQL)
- 사용자 정보는 **User 테이블에서 공유**

---

## 🏗️ 아키텍처

```
파트너스 (localhost:3003)          쇼핑 (localhost:3002)
├─ NextAuth.js                    ├─ NextAuth.js
├─ OAuth (Google, Kakao, Naver)   ├─ OAuth (Google, Kakao, Naver)
└─ Prisma Client                  └─ Prisma Client
        ↓                                 ↓
        └─────────────────────────────────┘
                  Neon PostgreSQL
                  (공유 데이터베이스)
```

---

## 📁 파트너스에 필요한 파일 구조

```
src/
├── lib/
│   ├── auth/
│   │   ├── authOptions.ts          ← 쇼핑에서 복사
│   │   ├── providers/
│   │   │   ├── kakao.ts            ← 쇼핑에서 복사
│   │   │   └── naver.ts            ← 쇼핑에서 복사
│   │   └── userService.ts          ← 쇼핑에서 복사
│   └── prisma.ts                   ← 쇼핑에서 복사
├── prisma/
│   └── schema.prisma               ← 쇼핑과 동일
└── components/
    └── auth/
        ├── RegisterForm.tsx        ← 쇼핑에서 복사
        └── SignInForm.tsx          ← 쇼핑에서 복사

app/
├── auth/
│   ├── signin/
│   │   └── page.tsx                ← 쇼핑에서 복사
│   ├── register/
│   │   └── page.tsx                ← 쇼핑에서 복사
│   └── error/
│       └── page.tsx                ← 쇼핑에서 복사
└── api/
    └── auth/
        └── [...nextauth]/
            └── route.ts            ← 쇼핑에서 복사
```

---

## 🔧 구현 단계

### 1단계: 필수 패키지 확인

파트너스의 `package.json`에 다음이 있는지 확인:

```json
{
  "dependencies": {
    "next-auth": "^5.x.x",
    "@auth/prisma-adapter": "^1.x.x",
    "prisma": "^5.x.x",
    "@prisma/client": "^5.x.x",
    "react-hot-toast": "^2.x.x",
    "react-icons": "^4.x.x"
  }
}
```

### 2단계: 쇼핑에서 파일 복사

**복사할 파일 목록:**

1. `src/lib/auth/authOptions.ts` (Google, Kakao, Naver 설정)
2. `src/lib/auth/providers/kakao.ts`
3. `src/lib/auth/providers/naver.ts`
4. `src/lib/prisma/userService.ts`
5. `src/lib/prisma.ts`
6. `src/components/auth/RegisterForm.tsx`
7. `src/components/auth/SignInForm.tsx`
8. `src/components/Logo.tsx`
9. `app/auth/signin/page.tsx`
10. `app/auth/register/page.tsx`
11. `app/auth/error/page.tsx`
12. `app/api/auth/[...nextauth]/route.ts`
13. `prisma/schema.prisma`

### 3단계: 환경 변수 설정

파트너스의 `.env.local`에 추가:

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3003

# OAuth Providers (Google, Kakao, Naver)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
KAKAO_CLIENT_ID=...
KAKAO_CLIENT_SECRET=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...

# Database (쇼핑과 동일)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

### 4단계: Prisma 마이그레이션

```bash
# 파트너스 프로젝트에서
npx prisma generate
npx prisma db push
```

### 5단계: 미들웨어 설정 (선택사항)

쇼핑의 `middleware.ts`를 참고하여 파트너스에 추가:

```typescript
// middleware.ts
export const config = {
  matcher: [
    "/account/:path*",
    "/auth/:path*",
    "/dashboard/:path*",
  ],
};

import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function middleware(request: any) {
  const { pathname } = request.nextUrl;
  const session = await auth();

  // 보호된 라우트
  if (pathname.startsWith("/account") || pathname.startsWith("/dashboard")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}
```

### 6단계: auth.ts 생성

```typescript
// auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth/authOptions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
});
```

---

## ✅ 확인 사항

- [ ] 모든 파일 복사 완료
- [ ] 환경 변수 설정 완료
- [ ] Prisma 마이그레이션 완료
- [ ] NextAuth 라우트 설정 완료
- [ ] 로컬 테스트 완료

---

## 🚀 테스트

```bash
# 파트너스 개발 서버 시작
npm run dev

# 브라우저에서 확인
http://localhost:3003/auth/signin
http://localhost:3003/auth/register
```

---

## 📊 데이터베이스 공유 확인

```sql
-- 쇼핑에서 회원가입 후
SELECT * FROM users WHERE email = 'test@example.com';

-- 파트너스에서도 같은 사용자 조회 가능
SELECT * FROM users WHERE email = 'test@example.com';
```

---

## ⚠️ 주의사항

1. **환경 변수**: 각 프로젝트의 `NEXTAUTH_URL`은 다름
   - 쇼핑: `http://localhost:3002`
   - 파트너스: `http://localhost:3003`

2. **OAuth 리다이렉트 URI**: 각 프로젝트별로 등록 필요 (Google, Kakao, Naver)
   - 쇼핑: `http://localhost:3002/api/auth/callback/{provider}`
   - 파트너스: `http://localhost:3003/api/auth/callback/{provider}`

3. **프로덕션**: 각 도메인별로 OAuth 설정 필요 (Google, Kakao, Naver 각각)

---

**코딩 허가를 기다리고 있습니다!** ✋

