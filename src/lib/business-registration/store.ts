import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';

type BusinessRegistrationRecord = typeof businessRegistrations.$inferSelect;
type BusinessRegistrationInsert = typeof businessRegistrations.$inferInsert;

export type BusinessRegistrationDraftInput = Pick<
  BusinessRegistrationInsert,
  | 'businessType'
  | 'businessName'
  | 'businessNumber'
  | 'representativeName'
  | 'businessCategory'
  | 'businessType2'
  | 'businessAddress'
  | 'contactName'
  | 'contactPhone'
  | 'contactEmail'
  | 'bankName'
  | 'accountNumber'
  | 'accountHolder'
  | 'platformUrl'
  | 'mobileAppUrl'
  | 'step'
  | 'isCompleted'
  | 'sellerId'
  | 'tossStatus'
>;

export async function findBusinessRegistrationByUserId(userId: string) {
  const existing = await db
    .select()
    .from(businessRegistrations)
    .where(eq(businessRegistrations.userId, userId))
    .limit(1);

  return existing[0] || null;
}

export async function savePendingBusinessRegistration(
  userId: string,
  data: BusinessRegistrationDraftInput
): Promise<'created' | 'updated' | 'duplicate-completed'> {
  const existing = await findBusinessRegistrationByUserId(userId);

  if (existing?.isCompleted && existing.step === 3) {
    return 'duplicate-completed';
  }

  if (existing) {
    await db
      .update(businessRegistrations)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(businessRegistrations.userId, userId));
    return 'updated';
  }

  await db.insert(businessRegistrations).values({
    userId,
    ...data,
  });

  return 'created';
}

export async function markBusinessRegistrationTossFailed(userId: string) {
  await db
    .update(businessRegistrations)
    .set({
      tossStatus: 'FAILED',
      updatedAt: new Date(),
    })
    .where(eq(businessRegistrations.userId, userId));
}

export async function completeBusinessRegistration(
  userId: string,
  sellerId: string | null,
  tossStatus: string
) {
  await db
    .update(businessRegistrations)
    .set({
      sellerId,
      tossStatus,
      isCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(businessRegistrations.userId, userId));
}

export async function updateBusinessRegistrationTossStatus(userId: string, tossStatus: string) {
  await db
    .update(businessRegistrations)
    .set({ tossStatus, updatedAt: new Date() })
    .where(eq(businessRegistrations.userId, userId));
}

export async function updateBusinessRegistrationContact(
  userId: string,
  input: {
    contactPhone?: string;
    contactEmail?: string;
    tossStatus?: string | null;
  }
) {
  const updateData: Partial<BusinessRegistrationRecord> = {
    updatedAt: new Date(),
  };

  if (input.contactPhone) updateData.contactPhone = input.contactPhone;
  if (input.contactEmail) updateData.contactEmail = input.contactEmail;
  if (input.tossStatus) updateData.tossStatus = input.tossStatus;

  await db
    .update(businessRegistrations)
    .set(updateData)
    .where(eq(businessRegistrations.userId, userId));
}

export async function updateBusinessRegistrationSeller(
  userId: string,
  sellerId: string,
  tossStatus: string
) {
  await db
    .update(businessRegistrations)
    .set({
      sellerId,
      tossStatus,
      updatedAt: new Date(),
    })
    .where(eq(businessRegistrations.userId, userId));
}