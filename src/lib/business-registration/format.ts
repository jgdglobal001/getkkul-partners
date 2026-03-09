const PROVIDER_LABELS: Record<string, string> = {
  google: '구글',
  naver: '네이버',
  kakao: '카카오',
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  개인: '개인',
  개인사업자: '개인사업자',
  법인: '법인',
};

export function getSocialProviderDisplayName(provider?: string | null): string {
  return PROVIDER_LABELS[provider ?? ''] || provider || '소셜';
}

export function getBusinessTypeLabel(businessType?: string | null): string {
  return BUSINESS_TYPE_LABELS[businessType ?? ''] || businessType || '';
}

export function maskEmail(email?: string | null): string {
  if (!email) return '';

  const [id = '', domain = ''] = email.split('@');
  if (!domain) return email;

  const visibleId = id.substring(0, 1) || '*';
  return `${visibleId}${'*'.repeat(Math.max(id.length - 1, 1))}@${domain}`;
}

export function maskBusinessName(businessName?: string | null): string {
  if (!businessName) return '';

  if (businessName.length <= 2) {
    return `${businessName[0]}*`;
  }

  const visibleLength = Math.ceil(businessName.length / 2);
  return `${businessName.substring(0, visibleLength)}${'*'.repeat(businessName.length - visibleLength)}`;
}

export function formatPhoneForDuplicateSearch(phone: string): string {
  const phoneClean = phone.replace(/-/g, '');

  if (phoneClean.length !== 11) {
    return phone;
  }

  return `${phoneClean.slice(0, 3)}-${phoneClean.slice(3, 7)}-${phoneClean.slice(7)}`;
}