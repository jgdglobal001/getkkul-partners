import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// 빌드 타임에는 환경 변수가 없을 수 있으므로 런타임에만 체크
const DATABASE_URL = process.env.DATABASE_URL || '';

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

