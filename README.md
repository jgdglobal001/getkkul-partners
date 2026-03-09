# 겟꿀 파트너스

겟꿀 파트너 판매 플랫폼입니다. Next.js App Router 기반으로 구성되어 있고,
인증(Auth.js/NextAuth v5), Drizzle + Neon DB, Toss/국세청 연동 라우트를 포함합니다.

## 현재 기준 문서

이 저장소에서 **최신 기준**으로 봐야 할 것은 아래입니다.

- `README.md`
- `package.json`
- `wrangler.toml`
- `next.config.mjs`
- `src/`, `app/` 실제 코드

루트에 있는 `*_PROPOSAL.md`, `*_SUMMARY.md`, `*_FINAL.md` 문서는
작업 기록/보조 문서일 수 있으므로 **현재 구조의 단일 진실 원천으로 간주하지 않습니다.**

## 주요 구조

```text
app/                    Next.js App Router 페이지 및 API 라우트
src/auth.ts             Auth.js(NextAuth v5) 설정
src/db/                 Drizzle 스키마 및 DB 연결
src/lib/auth/           Edge 세션/소셜 provider/user sync helper
src/lib/business-registration/
                        사업자 등록 관련 store/duplicate-check/format helper
src/lib/toss/           Toss seller 연동 helper
docs/                   Toss 연동 문서
public/                 정적 자산
```

## 주요 기능

- 파트너 인증 및 소셜 로그인
- 사업자 등록/중복 확인/상태 조회
- Toss seller 등록 및 상태 연동
- 상품 검색, 리포트, 파트너 링크 생성
- 파트너 대시보드/공지/설정 화면

## 기술 스택

- Next.js 16.0.1 + React 19
- TypeScript 5
- Auth.js / NextAuth v5 beta
- Drizzle ORM + Neon Serverless
- Tailwind CSS 4
- Cloudflare Pages + `@cloudflare/next-on-pages`

## 실행 스크립트

```bash
npm run dev
npm run verify:core
npm run verify:deploy
npm run build
npm run lint
npm run build:pages
npm run deploy
```

- 개발 서버: `http://localhost:3003`
- 배포 산출물 기준: `.vercel/output/static`

## 주요 환경 변수

최소한 아래 값들이 필요합니다.

```bash
DATABASE_URL=
AUTH_SECRET=                # 또는 NEXTAUTH_SECRET
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
TOSS_PAYMENTS_SECRET_KEY=
TOSS_PAYMENTS_SECURITY_KEY=
NTS_BUSINESSMAN_API_KEY=
```

참고:

- Auth는 `AUTH_SECRET` 또는 `NEXTAUTH_SECRET`를 사용합니다.
- Google/Kakao/Naver provider는 `AUTH_*` 대체 키도 일부 호환합니다.
- DB는 `DATABASE_URL` 없이는 초기화되지 않습니다.

## 배포 메모

- `wrangler.toml`의 `pages_build_output_dir`는 `.vercel/output/static`
- 현재 Cloudflare Pages 빌드 경로를 사용합니다.
- `@cloudflare/next-on-pages`는 deprecated 경고가 있으므로 추후 OpenNext 전환 검토가 필요합니다.
- native Windows에서는 `@cloudflare/next-on-pages` 로컬 검증이 불안정하므로, `npm run verify:deploy`는 core 검증 후 Cloudflare 배포 로그 확인 절차를 안내합니다.
- 자세한 기준은 `docs/deployment-verification.md`를 따릅니다.

## 검증 상태 메모

현재 레포에는 별도 `test` 스크립트는 없지만, 구조/배포 검증 기본값은 아래 순서입니다.

```bash
npm run verify:core
npm run verify:deploy
```

- `verify:core`: 타입체크 + 핵심 lint + Next 프로덕션 빌드
- `verify:deploy`: 로컬 사전 검증 + Cloudflare Pages 기준 배포 검증 절차 진입점
