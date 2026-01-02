import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Kakao from "@/lib/auth/providers/kakao";
import Naver from "@/lib/auth/providers/naver";

// NextAuth v5 (Auth.js) 설정
export const { handlers, signIn, signOut, auth } = NextAuth({
  // Cloudflare Pages에서 호스트 신뢰 설정 필요
  trustHost: true,
  // NextAuth v5는 AUTH_SECRET을 사용하지만, NEXTAUTH_SECRET도 호환됨
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          hl: "ko",
        },
      },
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID || process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || process.env.AUTH_KAKAO_SECRET,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID || process.env.AUTH_NAVER_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET || process.env.AUTH_NAVER_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  // 프로덕션에서도 디버그 모드 활성화 (임시)
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "kakao" || account?.provider === "naver") {
        try {
          console.log(`[OAuth SignIn] Provider: ${account?.provider}`);

          if (!user.email && !account.providerAccountId) {
            console.error("[OAuth SignIn] No email and no providerAccountId found");
            return true; // 에러로 차단하기보다 일단 통과시킨 후 세션에서 처리 시도
          }

          const userEmail = user.email || `${account.provider}_${account.providerAccountId}@oauth.local`;

          // DB 작업 시도
          try {
            console.log(`[OAuth SignIn] Syncing user to DB: ${userEmail}`);
            const existingUsers = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
            let targetUser = existingUsers[0];

            if (!targetUser) {
              console.log(`[OAuth SignIn] Creating new user record...`);
              const newUsers = await db.insert(users).values({
                name: user.name || (user.email ? "" : `${account.provider} User`),
                email: userEmail,
                image: user.image || "",
                provider: account.provider,
                emailVerified: user.email ? new Date() : null,
              }).returning();
              targetUser = newUsers[0];
            }

            if (targetUser) {
              user.id = targetUser.id;
              if (!user.email) user.email = userEmail;
            }
          } catch (dbError) {
            // DB 에러가 발생하더라도 로그인은 허용 (AccessDenied 방지)
            console.error("[OAuth SignIn] DB Sync Error (skipping):", dbError);
          }

          console.log(`[OAuth SignIn] Completed for: ${userEmail}`);
        } catch (error) {
          // 최상위 수준에서도 에러를 삼키고 true 반환하여 AccessDenied 방지
          console.error("[OAuth SignIn] Critical Error in callback:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.sub || `user_${Date.now()}`;
        token.role = "user";
        token.email = user.email;
        token.name = user.name;
        if (user.image) {
          token.picture = user.image;
        }
      }

      if (!token.id) {
        if (token.sub) {
          token.id = token.sub;
        } else if (token.email) {
          token.id = `temp_${(token.email as string).replace(/[^a-zA-Z0-9]/g, "_")}`;
        }
      }

      if (!token.role) {
        token.role = "user";
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = (token.role as string) || "user";

        if (token.picture) {
          session.user.image = token.picture as string;
        }
      }

      return session;
    },
  },
});

