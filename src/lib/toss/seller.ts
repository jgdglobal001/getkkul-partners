import { CompactEncrypt, compactDecrypt } from 'jose';

export type TossSellerBusinessType = 'INDIVIDUAL' | 'INDIVIDUAL_BUSINESS' | 'CORPORATE';

type TossSellerPayload = {
  refSellerId: string;
  businessType: TossSellerBusinessType;
  account: {
    bankCode: string;
    accountNumber: string;
    holderName: string;
  };
  individual?: {
    name: string;
    email: string;
    phone?: string;
  };
  company?: {
    businessRegistrationNumber: string;
    name: string;
    representativeName: string;
    email: string;
    phone?: string;
  };
};

type TossApiResponse = {
  status?: string;
  message?: string;
  error?: {
    message?: string;
  };
  entityBody?: {
    id?: string;
    refSellerId?: string;
    status?: string;
    message?: string;
  };
  raw?: string;
};

type SellerPayloadInput = {
  userId: string;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  businessType: string;
  businessNumber?: string | null;
  businessName?: string | null;
  representativeName: string;
  contactEmail: string;
  contactPhone?: string | null;
};

export function resolveTossSellerBusinessType(
  businessType: string,
  businessNumber?: string | null
): TossSellerBusinessType {
  if (businessType === '개인') {
    return businessNumber ? 'INDIVIDUAL_BUSINESS' : 'INDIVIDUAL';
  }

  if (businessType === '개인사업자') {
    return 'INDIVIDUAL_BUSINESS';
  }

  return 'CORPORATE';
}

export function buildTossSellerPayload(input: SellerPayloadInput): TossSellerPayload {
  const resolvedBusinessType = resolveTossSellerBusinessType(input.businessType, input.businessNumber);
  const refSellerId = input.userId.slice(0, 20);
  const payload: TossSellerPayload = {
    refSellerId,
    businessType: resolvedBusinessType,
    account: {
      bankCode: input.bankCode,
      accountNumber: input.accountNumber.replace(/[^0-9]/g, ''),
      holderName: input.accountHolder,
    },
  };

  if (resolvedBusinessType === 'INDIVIDUAL') {
    payload.individual = {
      name: input.representativeName,
      email: input.contactEmail,
      phone: input.contactPhone?.replace(/-/g, ''),
    };
    return payload;
  }

  payload.company = {
    businessRegistrationNumber: input.businessNumber?.replace(/-/g, '') || '',
    name: input.businessName || input.representativeName,
    representativeName: input.representativeName,
    email: input.contactEmail,
    phone: input.contactPhone?.replace(/-/g, ''),
  };

  return payload;
}

function createSecurityKeyBytes(securityKey: string): Uint8Array {
  const parts = securityKey.match(/.{1,2}/g);
  if (!parts) {
    throw new Error('유효하지 않은 Toss 보안 키 형식입니다.');
  }

  return new Uint8Array(parts.map((byte) => parseInt(byte, 16)));
}

function createTossIssuedAt(): string {
  const now = new Date();
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const pad = (value: number) => value.toString().padStart(2, '0');

  return `${kstDate.getUTCFullYear()}-${pad(kstDate.getUTCMonth() + 1)}-${pad(kstDate.getUTCDate())}T${pad(kstDate.getUTCHours())}:${pad(kstDate.getUTCMinutes())}:${pad(kstDate.getUTCSeconds())}+09:00`;
}

export async function encryptTossPayload(payload: unknown, securityKey: string) {
  const key = createSecurityKeyBytes(securityKey);
  const iat = createTossIssuedAt();
  const nonce = crypto.randomUUID();
  const encryptedBody = await new CompactEncrypt(
    new TextEncoder().encode(JSON.stringify(payload))
  )
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM', iat, nonce })
    .encrypt(key);

  return { encryptedBody, key, iat, nonce };
}

export async function parseTossEncryptedResponse(
  responseText: string,
  key: Uint8Array
): Promise<TossApiResponse> {
  try {
    if (responseText.startsWith('ey')) {
      const { plaintext } = await compactDecrypt(responseText, key);
      return JSON.parse(new TextDecoder().decode(plaintext));
    }

    return JSON.parse(responseText);
  } catch {
    return { error: { message: '복호화 실패' }, raw: responseText };
  }
}

export function getMaskedTossPayloadForLog(payload: TossSellerPayload) {
  return {
    ...payload,
    account: {
      ...payload.account,
      accountNumber: '********',
    },
  };
}

export function getTossBasicAuthHeader(secretKey: string): string {
  return `Basic ${btoa(`${secretKey}:`)}`;
}

export function getTossSellerId(response: TossApiResponse, fallback: string): string {
  return response.entityBody?.id || response.entityBody?.refSellerId || fallback;
}

export function getTossSellerStatus(response: TossApiResponse, fallback = 'COMPLETED'): string {
  return response.entityBody?.status || response.status || fallback;
}