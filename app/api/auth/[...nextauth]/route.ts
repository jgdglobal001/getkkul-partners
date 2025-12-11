import { handlers } from "@/auth";
import { NextRequest } from "next/server";

// NextAuth v5는 Edge Runtime을 완벽하게 지원
export const runtime = 'edge';

const { GET: originalGET, POST: originalPOST } = handlers;

// 에러를 캡처하는 래퍼
export async function GET(request: NextRequest) {
  try {
    return await originalGET(request);
  } catch (error) {
    console.error('[NextAuth GET Error]:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: (error as any)?.message || 'Unknown error',
        stack: (error as any)?.stack,
        name: (error as any)?.name,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    return await originalPOST(request);
  } catch (error) {
    console.error('[NextAuth POST Error]:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: (error as any)?.message || 'Unknown error',
        stack: (error as any)?.stack,
        name: (error as any)?.name,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

