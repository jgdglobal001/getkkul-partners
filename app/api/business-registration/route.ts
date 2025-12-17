import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  console.log('[API] Isolation Test Request Received');
  return NextResponse.json({ message: "Isolation Test OK. Imports are likely the cause." });
}
