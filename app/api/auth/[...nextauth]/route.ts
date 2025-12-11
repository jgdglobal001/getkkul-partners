import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/authOptions";

// NextAuth v4는 Edge Runtime을 완전히 지원하지 않으므로 Node.js runtime 사용
export const runtime = 'nodejs';

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };

