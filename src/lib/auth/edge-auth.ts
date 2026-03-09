import { getToken } from "next-auth/jwt";

export interface EdgeSession {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    role?: string;
    provider?: string | null;
  };
}

/**
 * Edge Runtime에서 사용 가능한 세션 검증 함수
 * getToken()을 사용하여 JWT만 검증 (auth() 대비 번들 크기 대폭 절감)
 */
export async function getEdgeSession(request?: Request): Promise<EdgeSession | null> {
  try {
    if (!request) {
      return null;
    }

    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

    const token = await getToken({
      req: request,
      secret,
      secureCookie: process.env.NODE_ENV === 'production',
    });

    if (!token?.sub) {
      return null;
    }

    return {
      user: {
        id: token.id || token.sub,
        email: token.email || '',
        name: token.name ?? null,
        image: token.picture ?? null,
        role: token.role || 'user',
        provider: token.provider || null,
      },
    };
  } catch (error: unknown) {
    console.error('Edge session verification error:', error);
    return null;
  }
}

