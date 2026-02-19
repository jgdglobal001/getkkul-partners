import { db } from '@/db';
import { businessRegistrations, users, accounts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * 개인 유형 중복 가입 확인 API
 * POST /api/business-registration/check-duplicate
 * 
 * body: { representativeName: string, contactPhone: string }
 * 
 * 이름 + 전화번호로 businessRegistrations 테이블을 조회하여
 * 이미 등록된 사용자가 있는지 확인합니다.
 */
export async function POST(request: NextRequest) {
  console.log('[API] Check Duplicate - Request Received');

  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'JSON 파싱 오류' },
        { status: 400 }
      );
    }

    const { representativeName, contactPhone } = body;

    if (!representativeName || !contactPhone) {
      return NextResponse.json(
        { success: false, message: '이름과 휴대폰 번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 전화번호 정규화: 하이픈 제거 후 다시 포맷 (DB에 저장된 형식과 맞추기)
    const phoneClean = contactPhone.replace(/-/g, '');
    // DB에 저장될 수 있는 형식들 모두 검색 (010-1234-5678 또는 01012345678)
    const phoneFormatted = phoneClean.length === 11
      ? `${phoneClean.slice(0, 3)}-${phoneClean.slice(3, 7)}-${phoneClean.slice(7)}`
      : contactPhone;

    console.log('[API] Check Duplicate - 이름:', representativeName, '전화번호:', phoneFormatted);

    // 이름 + 전화번호로 기존 등록 조회 (두 가지 전화번호 형식 모두 시도)
    const existingRegistration = await db
      .select({
        id: businessRegistrations.id,
        userId: businessRegistrations.userId,
        isCompleted: businessRegistrations.isCompleted,
        step: businessRegistrations.step,
        user: {
          email: users.email,
        },
        account: {
          provider: accounts.provider,
        }
      })
      .from(businessRegistrations)
      .leftJoin(users, eq(businessRegistrations.userId, users.id))
      .leftJoin(accounts, eq(businessRegistrations.userId, accounts.userId))
      .where(
        and(
          eq(businessRegistrations.representativeName, representativeName),
          eq(businessRegistrations.contactPhone, phoneFormatted)
        )
      )
      .limit(1);

    // 포맷된 번호로 못 찾았으면 원본 번호로도 시도
    let result = existingRegistration[0];
    if (!result && phoneFormatted !== contactPhone) {
      const fallback = await db
        .select({
          id: businessRegistrations.id,
          userId: businessRegistrations.userId,
          isCompleted: businessRegistrations.isCompleted,
          step: businessRegistrations.step,
          user: {
            email: users.email,
          },
          account: {
            provider: accounts.provider,
          }
        })
        .from(businessRegistrations)
        .leftJoin(users, eq(businessRegistrations.userId, users.id))
        .leftJoin(accounts, eq(businessRegistrations.userId, accounts.userId))
        .where(
          and(
            eq(businessRegistrations.representativeName, representativeName),
            eq(businessRegistrations.contactPhone, contactPhone)
          )
        )
        .limit(1);
      result = fallback[0];
    }

    if (result && result.isCompleted && result.step === 3) {
      console.log('[API] Check Duplicate - 중복 발견! userId:', result.userId);

      const rawEmail = result.user?.email || '';
      let maskedEmail = '';
      if (rawEmail) {
        const [id, domain] = rawEmail.split('@');
        maskedEmail = id.substring(0, 1) + '*'.repeat(Math.max(id.length - 1, 1)) + '@' + domain;
      }

      const providerMap: Record<string, string> = {
        'google': '구글',
        'naver': '네이버',
        'kakao': '카카오'
      };
      const providerName = providerMap[result.account?.provider || ''] || result.account?.provider || '소셜';

      return NextResponse.json({
        success: false,
        isAlreadyRegistered: true,
        message: `이미 가입된 정보입니다. 기존 계정으로 로그인해주세요.`,
        existingAccount: {
          provider: result.account?.provider,
          providerName: providerName,
          maskedEmail: maskedEmail
        }
      }, { status: 409 });
    }

    console.log('[API] Check Duplicate - 중복 없음, 가입 가능');
    return NextResponse.json({
      success: true,
      message: '가입 가능합니다.'
    });

  } catch (error: any) {
    console.error('[API] Check Duplicate - 오류:', error);
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

