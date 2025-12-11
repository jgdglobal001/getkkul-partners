import { auth } from "@/auth";

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
 * NextAuth v5의 auth() 함수를 사용
 */
export async function getEdgeSession(): Promise<EdgeSession | null> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return null;
    }

    return {
      user: {
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role as string | undefined,
      },
    };
  } catch (error) {
    console.error('Edge session verification error:', error);
    return null;
  }
}

