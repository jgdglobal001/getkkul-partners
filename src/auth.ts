import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Kakao from "@/lib/auth/providers/kakao";
import Naver from "@/lib/auth/providers/naver";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Cloudflare Pages에서 호스트 신뢰 설정 필요
  trustHost: true,
  // NextAuth v5는 AUTH_SECRET을 사용하지만, NEXTAUTH_SECRET도 호환됨
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
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
          console.log(`[OAuth SignIn] User from profile:`, {
            email: user.email,
            name: user.name,
            image: user.image?.substring(0, 50) + (user.image && user.image.length > 50 ? '...' : ''),
          });

          if (user.email) {
            console.log(`[OAuth SignIn] Finding user by email: ${user.email}`);
            const existingUsers = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
            let existingUser = existingUsers[0];
            console.log(`[OAuth SignIn] Existing user found:`, existingUser ? "YES" : "NO");

            if (!existingUser) {
              console.log(`[OAuth SignIn] Creating new user...`);
              const newUsers = await db.insert(users).values({
                name: user.name || "",
                email: user.email,
                image: user.image || "",
                provider: account.provider,
                emailVerified: new Date(),
              }).returning();
              existingUser = newUsers[0];
              console.log(`[OAuth SignIn] User created successfully:`, existingUser?.id);
            }

            if (existingUser) {
              user.id = existingUser.id;
              console.log(`[OAuth SignIn] User ID set to:`, user.id);
            }
          } else {
            const tempEmail = `${account.provider}_${account.providerAccountId}@oauth.local`;
            console.log(`[OAuth SignIn] No email, using temp email: ${tempEmail}`);

            const existingUsers = await db.select().from(users).where(eq(users.email, tempEmail)).limit(1);
            let existingUser = existingUsers[0];
            console.log(`[OAuth SignIn] Existing user found:`, existingUser ? "YES" : "NO");

            if (!existingUser) {
              console.log(`[OAuth SignIn] Creating new user with temp email...`);
              const newUsers = await db.insert(users).values({
                name: user.name || `${account.provider} User`,
                email: tempEmail,
                image: user.image || "",
                provider: account.provider,
                emailVerified: null,
              }).returning();
              existingUser = newUsers[0];
              console.log(`[OAuth SignIn] User created successfully:`, existingUser?.id);
            }

            if (existingUser) {
              user.id = existingUser.id;
              user.email = tempEmail;
              console.log(`[OAuth SignIn] User ID set to:`, user.id);
            }
          }
          console.log(`[OAuth SignIn] SignIn callback completed successfully`);
        } catch (error) {
          console.error("Error handling OAuth user:", error);
          console.error("Error stack:", (error as any)?.stack);
          throw error;
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
          token.id = `temp_${token.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
        }
      }

      if (!token.role) {
        token.role = "user";
      }

      return token;
    },
    async session({ session, token }) {
      console.log('[Session Callback] Starting session callback');
      console.log('[Session Callback] Token:', { id: token.id, email: token.email, role: token.role });

      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        session.user.email = token.email as string;
        session.user.name = token.name as string;

        try {
          console.log('[Session Callback] Fetching user from database...');
          console.log('[Session Callback] Database URL exists:', !!process.env.DATABASE_URL);

          const userResults = await db.select().from(users).where(eq(users.email, session.user.email!)).limit(1);
          const user = userResults[0];

          console.log('[Session Callback] User found in DB:', !!user);

          if (user) {
            session.user.role = user.role || "user";
            session.user.name = user.name || session.user.name;
            session.user.image = user.image || (token.picture as string);
          } else {
            session.user.role = (token.role as string) || "user";
          }
        } catch (error) {
          console.error("[Session Callback] Error fetching user data from database:", error);
          console.error("[Session Callback] Error details:", {
            message: (error as any)?.message,
            stack: (error as any)?.stack,
            name: (error as any)?.name,
          });
          session.user.role = (token.role as string) || "user";
        }

        if (token.picture && !session.user.image) {
          session.user.image = token.picture as string;
        }
      }

      console.log('[Session Callback] Session callback completed');
      return session;
    },
  },
});

