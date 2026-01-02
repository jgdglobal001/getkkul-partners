import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// 빌드 타임에는 더미 URL 사용, 런타임에는 실제 DATABASE_URL 사용
function getDatabaseUrl(): string {
  // 런타임에 환경 변수를 가져옴
  const url = process.env.DATABASE_URL;

  console.log('[DB] Getting database URL...');
  console.log('[DB] DATABASE_URL exists:', !!url);
  console.log('[DB] DATABASE_URL length:', url?.length || 0);

  if (!url) {
    // 빌드 타임에는 더미 URL 반환
    console.log('[DB] No DATABASE_URL found, using dummy URL');
    return 'postgresql://dummy:dummy@dummy:5432/dummy';
  }

  console.log('[DB] Using real DATABASE_URL');
  return url;
}

// 런타임에 DATABASE_URL을 가져오도록 함수로 래핑
let _db: ReturnType<typeof drizzle> | null = null;

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    // 처음 접근 시 실제 DB 연결 생성
    if (!_db) {
      console.log('[DB] Connecting to database...');
      try {
        const url = getDatabaseUrl();

        if (url.includes('dummy')) {
          console.warn('[DB] WARNING: Using dummy URL because DATABASE_URL is not set.');
        }

        const sql = neon(url);
        _db = drizzle(sql, { schema });
        console.log('[DB] Database driver initialized.');
      } catch (error) {
        console.error('[DB] DATABASE INITIALIZATION FAILED:', error);
        throw error;
      }
    }
    return (_db as any)[prop];
  }
});

