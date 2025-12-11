import { NextResponse } from 'next/server';

// Cloudflare Pages는 Edge Runtime만 지원
export const runtime = 'edge';

// NextAuth v4는 Edge Runtime을 지원하지 않으므로 임시로 비활성화
// TODO: NextAuth v5 (Auth.js)로 업그레이드 필요
export async function GET() {
  return NextResponse.json(
    { error: 'NextAuth is temporarily disabled on Cloudflare Pages' },
    { status: 503 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'NextAuth is temporarily disabled on Cloudflare Pages' },
    { status: 503 }
  );
}

