import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { accounts, businessRegistrations, users } from '@/db/schema';
import {
  formatPhoneForDuplicateSearch,
  getBusinessTypeLabel,
  getSocialProviderDisplayName,
  maskBusinessName,
  maskEmail,
} from '@/lib/business-registration/format';

async function findDuplicateByRepresentativeAndPhone(representativeName: string, contactPhone: string) {
  const selectFields = {
    id: businessRegistrations.id,
    userId: businessRegistrations.userId,
    isCompleted: businessRegistrations.isCompleted,
    step: businessRegistrations.step,
    businessType: businessRegistrations.businessType,
    businessName: businessRegistrations.businessName,
    user: { email: users.email },
    account: { provider: accounts.provider },
  };

  return (
    await db
      .select(selectFields)
      .from(businessRegistrations)
      .leftJoin(users, eq(businessRegistrations.userId, users.id))
      .leftJoin(accounts, eq(businessRegistrations.userId, accounts.userId))
      .where(
        and(
          eq(businessRegistrations.representativeName, representativeName),
          eq(businessRegistrations.contactPhone, contactPhone)
        )
      )
      .limit(1)
  )[0];
}

export async function findCompletedDuplicateBusinessRegistration(input: {
  representativeName: string;
  contactPhone: string;
}) {
  const phoneFormatted = formatPhoneForDuplicateSearch(input.contactPhone);

  let result = await findDuplicateByRepresentativeAndPhone(input.representativeName, phoneFormatted);

  if (!result && phoneFormatted !== input.contactPhone) {
    result = await findDuplicateByRepresentativeAndPhone(input.representativeName, input.contactPhone);
  }

  if (!result || !result.isCompleted || result.step !== 3) {
    return null;
  }

  return {
    provider: result.account?.provider,
    providerName: getSocialProviderDisplayName(result.account?.provider),
    maskedEmail: maskEmail(result.user?.email),
    businessType: getBusinessTypeLabel(result.businessType),
    maskedBusinessName: result.businessType === '개인' ? '' : maskBusinessName(result.businessName),
  };
}