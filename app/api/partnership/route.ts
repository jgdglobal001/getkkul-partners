import { NextRequest, NextResponse } from 'next/server';
import { getEdgeSession } from '@/lib/auth/edge-auth';
import { db } from '@/db';
import { businessRegistrations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

// 파트너십 ID 생성 함수
function generatePartnershipId(): string {
  const prefix = 'AF';
  const randomNumber = Math.random().toString().slice(2, 9).padEnd(7, '0');
  return prefix + randomNumber;
}

// 파트너십 ID 조회
export async function GET(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getEdgeSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // 사업자 등록 정보에서 파트너십 ID 조회
    const results = await db
      .select()
      .from(businessRegistrations)
      .where(eq(businessRegistrations.userId, session.user.id))
      .limit(1);
    const businessRegistration = results[0];

    if (!businessRegistration) {
      return NextResponse.json(
        { partnershipId: null },
        { status: 200 }
      );
    }

    // 파트너십 ID가 없으면 생성
    let partnershipId = businessRegistration.businessNumber; // 임시로 사업자번호 사용

    // 사업자번호를 파트너십 ID 형식으로 변환 (예: 123-45-67890 -> AF1234567)
    if (partnershipId) {
      const cleanNumber = partnershipId.replace(/-/g, '');
      partnershipId = 'AF' + cleanNumber.slice(0, 7);
    } else {
      partnershipId = generatePartnershipId();
    }

    return NextResponse.json(
      {
        partnershipId,
        businessName: businessRegistration.businessName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching partnership ID:', error);
    return NextResponse.json(
      { error: '파트너십 ID 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

