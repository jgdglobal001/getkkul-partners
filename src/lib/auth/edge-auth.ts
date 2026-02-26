import { getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

export interface EdgeSession {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string;
  };
}

/**
 * Edge Runtime에서 사용 가능한 세션 검증 함수
 * getToken()을 사용하여 JWT만 검증 (auth() 대비 번들 크기 대폭 절감)
 */
export async function getEdgeSession(request?: Request): Promise<EdgeSession | null> {
  try {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

    const token = await getToken({
      req: request as any,
      secret,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    if (!token?.sub) {
      return null;
    }

    return {
      user: {
        id: (token.id as string) || token.sub,
        email: token.email as string,
        name: token.name as string | null,
        image: token.picture as string | null,
        role: (token.role as string) || 'user',
      },
    };
  } catch (error) {
    console.error('Edge session verification error:', error);
    return null;
  }
}

