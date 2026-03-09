import { handlers } from "@/auth";
import { NextRequest } from "next/server";

// Cloudflare Pages는 Edge Runtime만 지원
export const runtime = 'edge';

const { GET: originalGET, POST: originalPOST } = handlers;

function createInternalErrorResponse() {
  return new Response(
    JSON.stringify({
      error: 'Internal Server Error',
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

// 에러를 캡처하는 래퍼
export async function GET(request: NextRequest) {
  try {
    return await originalGET(request);
  } catch (error) {
    console.error('[NextAuth GET Error]:', error);
    return createInternalErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    return await originalPOST(request);
  } catch (error) {
    console.error('[NextAuth POST Error]:', error);
    return createInternalErrorResponse();
  }
}

