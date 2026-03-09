import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function findUserByEmail(email: string) {
  const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return existingUsers[0] || null;
}

interface EnsureOAuthUserRecordInput {
  userId: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  provider?: string | null;
  fallbackEmail?: string | null;
  fallbackName?: string | null;
}

export async function ensureOAuthUserRecord({
  userId,
  email,
  name,
  image,
  provider,
  fallbackEmail,
  fallbackName,
}: EnsureOAuthUserRecordInput) {
  const existingUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (existingUser[0]) {
    return existingUser[0];
  }

  await db.insert(users).values({
    id: userId,
    name: name || fallbackName || '',
    email: email || fallbackEmail || `unknown_${userId}@oauth.local`,
    provider: provider || 'oauth',
    image: image || '',
    updatedAt: new Date(),
    emailVerified: new Date(),
  });

  const createdUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return createdUser[0] || null;
}