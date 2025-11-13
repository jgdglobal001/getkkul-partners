# 📋 쇼핑 → 파트너스 파일 복사 계획

## ✅ 이미 가져온 파일들

### 1. 인증 설정 파일
- ✅ `src/lib/auth/authOptions.ts` - NextAuth 설정
- ✅ `src/lib/auth/providers/kakao.ts` - 카카오 OAuth
- ✅ `src/lib/auth/providers/naver.ts` - 네이버 OAuth

### 2. Prisma 파일
- ✅ `src/lib/prisma.ts` - Prisma 클라이언트
- ✅ `src/lib/prisma/userService.ts` - 사용자 서비스

### 3. 컴포넌트
- ✅ `src/components/auth/RegisterForm.tsx` - 회원가입 폼
- ✅ `src/components/auth/SignInForm.tsx` - 로그인 폼
- ✅ `src/components/auth/AuthProvider.tsx` - Auth Provider

---

## 📁 파트너스에 생성할 파일 구조

```
src/
├── lib/
│   ├── auth/
│   │   ├── authOptions.ts          ← 복사
│   │   └── providers/
│   │       ├── kakao.ts            ← 복사
│   │       └── naver.ts            ← 복사
│   ├── prisma.ts                   ← 복사
│   └── prisma/
│       └── userService.ts          ← 복사
└── components/
    └── auth/
        ├── RegisterForm.tsx        ← 복사
        ├── SignInForm.tsx          ← 복사
        └── AuthProvider.tsx        ← 복사

app/
├── auth/
│   ├── signin/
│   │   └── page.tsx                ← 새로 생성
│   ├── register/
│   │   └── page.tsx                ← 새로 생성
│   └── error/
│       └── page.tsx                ← 새로 생성
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts            ← 새로 생성
└── layout.tsx                       ← 수정 (AuthProvider 추가)

root/
├── auth.ts                          ← 새로 생성
├── middleware.ts                    ← 새로 생성
└── prisma/
    └── schema.prisma               ← 복사 (쇼핑과 동일)
```

---

## 🔧 필요한 작업

### 1단계: 디렉토리 생성
- [ ] `src/lib/auth/providers/` 디렉토리
- [ ] `src/lib/prisma/` 디렉토리
- [ ] `src/components/auth/` 디렉토리
- [ ] `app/auth/signin/` 디렉토리
- [ ] `app/auth/register/` 디렉토리
- [ ] `app/auth/error/` 디렉토리
- [ ] `app/api/auth/[...nextauth]/` 디렉토리
- [ ] `prisma/` 디렉토리

### 2단계: 파일 복사
- [ ] 인증 설정 파일 (3개)
- [ ] Prisma 파일 (2개)
- [ ] 컴포넌트 (3개)

### 3단계: 새 파일 생성
- [ ] `app/auth/signin/page.tsx`
- [ ] `app/auth/register/page.tsx`
- [ ] `app/auth/error/page.tsx`
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] `auth.ts` (루트)
- [ ] `middleware.ts` (루트)
- [ ] `prisma/schema.prisma`

### 4단계: 기존 파일 수정
- [ ] `app/layout.tsx` - AuthProvider 추가
- [ ] `.env.local` - 환경 변수 확인

### 5단계: 패키지 확인
- [ ] `package.json` - 필요한 패키지 설치 확인

---

## 🚀 다음 단계

제가 모든 파일을 GitHub에서 가져와서 파트너스에 생성하겠습니다!

**준비 완료!** ✋

