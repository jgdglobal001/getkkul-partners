import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
    const url = req.nextUrl.clone();
    const host = req.headers.get("host");

    // 1. 도메인 일관성 강제 (non-www -> www 리다이렉트)
    // 사용자 환경 변수 NEXTAUTH_URL이 www 버전이므로 일치시켜야 함
    if (
        process.env.NODE_ENV === "production" &&
        host === "partners.getkkul.com"
    ) {
        url.host = "www.partners.getkkul.com";
        return NextResponse.redirect(url, 301);
    }

    // 2. 보호된 경로 처리 (대시보드 등)
    const isDashboard = url.pathname.startsWith("/dashboard");
    const isLoggedIn = !!req.auth;

    if (isDashboard && !isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        /*
         * 아래와 같은 경로를 제외한 모든 요청에 미들웨어 적용:
         * - api (인증 API 제외)
         * - _next/static (정적 파일)
         * - _next/image (이미지 최적화 파일)
         * - favicon.ico (파비콘)
         */
        "/((?!api(?!/auth)|_next/static|_next/image|favicon.ico).*)",
    ],
};
