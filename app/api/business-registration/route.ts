import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
      console.error('[API] 인증되지 않은 사용자');
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('[API] 받은 데이터:', JSON.stringify(body, null, 2));

    const {
      businessType,
      businessName,
      businessNumber1,
      businessNumber2,
      businessNumber3,
      representativeName,
      businessCategory,
      businessType: businessType2,
      businessAddress,
      contactName,
      contactPhone,
      contactEmail,
      bankName,
      accountNumber,
      accountHolder,
      platformUrl,
      mobileAppUrl,
      agreements,
    } = body;

    // 필수 필드 검증
    if (!businessName || !businessNumber1 || !businessNumber2 || !businessNumber3) {
      console.error('[API] 필수 항목 누락: 사업자명, 사업자번호');
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다. (사업자명, 사업자번호)' },
        { status: 400 }
      );
    }

    // 추가 필수 필드 검증
    if (!representativeName || !businessCategory || !businessAddress) {
      console.error('[API] 필수 항목 누락: 대표자명, 업종, 주소');
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다. (대표자명, 업종, 주소)' },
        { status: 400 }
      );
    }

    if (!contactName || !contactPhone || !contactEmail) {
      console.error('[API] 필수 항목 누락: 담당자 정보');
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다. (담당자 정보)' },
        { status: 400 }
      );
    }

    if (!bankName || !accountNumber || !accountHolder) {
      console.error('[API] 필수 항목 누락: 계좌 정보');
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다. (계좌 정보)' },
        { status: 400 }
      );
    }

    // 사업자 번호 조합
    const fullBusinessNumber = `${businessNumber1}-${businessNumber2}-${businessNumber3}`;

    console.log('[API] 데이터베이스 저장 시도...');
    console.log('[API] userId:', session.user.id);
    console.log('[API] businessNumber:', fullBusinessNumber);

    // 기존 등록 정보 확인 (userId 또는 businessNumber로)
    const existingByUserId = await prisma.business_registrations.findUnique({
      where: { userId: session.user.id },
    });

    const existingByBusinessNumber = await prisma.business_registrations.findUnique({
      where: { businessNumber: fullBusinessNumber },
    });

    let businessRegistration;

    // 사업자번호가 다른 사용자에게 이미 등록되어 있는 경우
    if (existingByBusinessNumber && existingByBusinessNumber.userId !== session.user.id) {
      console.error('[API] 사업자번호 중복:', fullBusinessNumber);
      return NextResponse.json(
        { error: '이미 등록된 사업자번호입니다. 다른 사업자번호를 사용해주세요.' },
        { status: 400 }
      );
    }

    if (existingByUserId) {
      // 이미 등록된 경우 업데이트
      console.log('[API] 기존 등록 정보 업데이트...');
      businessRegistration = await prisma.business_registrations.update({
        where: { userId: session.user.id },
        data: {
          businessType: businessType || '법인',
          businessName,
          businessNumber: fullBusinessNumber,
          representativeName,
          businessCategory,
          businessType2: businessType2 || '',
          businessAddress,
          contactName,
          contactPhone,
          contactEmail,
          bankName,
          accountNumber,
          accountHolder,
          platformUrl: platformUrl || null,
          mobileAppUrl: mobileAppUrl || null,
          step: 3,
          isCompleted: true,
        },
      });
    } else {
      // 새로 등록
      console.log('[API] 새로운 등록 정보 생성...');
      businessRegistration = await prisma.business_registrations.create({
        data: {
          userId: session.user.id,
          businessType: businessType || '법인',
          businessName,
          businessNumber: fullBusinessNumber,
          representativeName,
          businessCategory,
          businessType2: businessType2 || '',
          businessAddress,
          contactName,
          contactPhone,
          contactEmail,
          bankName,
          accountNumber,
          accountHolder,
          platformUrl: platformUrl || null,
          mobileAppUrl: mobileAppUrl || null,
          step: 3,
          isCompleted: true,
        },
      });
    }

    console.log('[API] 저장 성공:', businessRegistration.id);

    return NextResponse.json(
      {
        success: true,
        message: '사업자 등록 정보가 저장되었습니다.',
        data: businessRegistration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error saving business registration:', error);

    // 에러 상세 정보 추출
    let errorMessage = '사업자 등록 정보 저장 중 오류가 발생했습니다.';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('[API] Error message:', error.message);
      console.error('[API] Error stack:', error.stack);
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // 사용자의 사업자 등록 정보 조회
    const businessRegistration = await prisma.business_registrations.findUnique({
      where: { userId: session.user.id },
    });

    if (!businessRegistration) {
      return NextResponse.json(
        { data: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { data: businessRegistration },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching business registration:', error);
    return NextResponse.json(
      { error: '사업자 등록 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

