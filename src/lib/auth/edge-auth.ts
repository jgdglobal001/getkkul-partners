import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key');

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
 * NextAuth의 getServerSession 대체용
 */
export async function getEdgeSession(): Promise<EdgeSession | null> {
  try {
    const cookieStore = await cookies();
    
    // NextAuth의 세션 토큰 쿠키 이름
    const sessionToken = cookieStore.get(
      process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token'
    );

    if (!sessionToken?.value) {
      return null;
    }

    // JWT 검증
    const { payload } = await jwtVerify(sessionToken.value, secret);

    if (!payload || !payload.sub || !payload.email) {
      return null;
    }

    return {
      user: {
        id: payload.sub as string,
        email: payload.email as string,
        name: payload.name as string | null | undefined,
        image: payload.picture as string | null | undefined,
        role: payload.role as string | undefined,
      },
    };
  } catch (error) {
    console.error('Edge session verification error:', error);
    return null;
  }
}

/**
 * JWT 토큰 생성 (필요시 사용)
 */
export async function createEdgeToken(payload: Record<string, any>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

