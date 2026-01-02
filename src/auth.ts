import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "@/lib/auth/providers/kakao";
import Naver from "@/lib/auth/providers/naver";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  // 디버그 모드 활성화 (Cloudflare 로그에서 상세 내용 확인용)
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }: { user: any; account?: any }) {
      if (account?.provider === "google" || account?.provider === "kakao" || account?.provider === "naver") {
        try {
          console.log(`[OAuth SignIn] Provider: ${account?.provider}`);

          const userEmail = user.email || `${account.provider}_${account.providerAccountId}@oauth.local`;
          console.log(`[OAuth SignIn] Syncing user to DB: ${userEmail}`);

          try {
            // 1. 기존 사용자 조회
            const existingUsers = await db.select().from(users).where(eq(users.email, userEmail)).limit(1);
            let targetUser = existingUsers[0] || null;

            // 2. 새 사용자 생성
            if (!targetUser) {
              console.log(`[OAuth SignIn] Creating user in DB...`);
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
              console.log(`[OAuth SignIn] DB Sync Success: ${targetUser.id}`);
            }
          } catch (dbError) {
            console.error("[OAuth SignIn] DB SYNC FAILURE:", dbError);
          }

          console.log(`[OAuth SignIn] Completed for: ${userEmail}`);
        } catch (error) {
          console.error("[OAuth SignIn] Fatal Error:", error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async jwt({ token, user }: { token: any; user: any }) {
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
    async session({ session, token }: { session: any; token: any }) {
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

