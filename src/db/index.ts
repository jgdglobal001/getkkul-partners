import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// 빌드 타임에는 더미 URL 사용, 런타임에는 실제 DATABASE_URL 사용
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://dummy:dummy@dummy:5432/dummy';

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

