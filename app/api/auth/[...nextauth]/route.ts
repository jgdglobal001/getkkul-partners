import { handlers } from "@/auth";

// NextAuth v5는 Edge Runtime을 완벽하게 지원
export const runtime = 'edge';

export const { GET, POST } = handlers;

