import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authConfig);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();

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
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 사업자 번호 조합
    const fullBusinessNumber = `${businessNumber1}-${businessNumber2}-${businessNumber3}`;

    // 데이터베이스에 저장
    const businessRegistration = await prisma.business_registrations.create({
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
        platformUrl,
        mobileAppUrl,
        step: 3,
        isCompleted: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: '사업자 등록 정보가 저장되었습니다.',
        data: businessRegistration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving business registration:', error);
    return NextResponse.json(
      { error: '사업자 등록 정보 저장 중 오류가 발생했습니다.' },
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

