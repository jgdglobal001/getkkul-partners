import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const runtime = 'edge';

export async function GET() {
  try {
    // 1. 환경 변수 체크
    const envStatus = {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
      DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
      GOOGLE_ID_EXISTS: !!process.env.GOOGLE_CLIENT_ID,
    };

    // 2. DB 연결 테스트
    let dbStatus = 'Unknown';
    let userCount = -1;
    let dbError = null;

    try {
      console.log('Testing DB connection...');
      // 간단한 쿼리 실행
      const result = await db.execute(sql`SELECT 1`);
      dbStatus = 'Connected';
      
      // 유저 테이블 카운트 확인
      const countResult = await db.select({ count: sql<number>`count(*)` }).from(users);
      userCount = Number(countResult[0]?.count || 0);

    } catch (e: any) {
      dbStatus = 'Failed';
      dbError = {
        message: e.message,
        stack: e.stack,
        name: e.name
      };
      console.error('DB Test Error:', e);
    }

    return NextResponse.json({
      status: 'Debug Check',
      timestamp: new Date().toISOString(),
      env: envStatus,
      database: {
        status: dbStatus,
        userCount,
        error: dbError
      }
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      status: 'Critical Failure',
      error: error.message
    }, { status: 500 });
  }
}
