import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 특정 사업자번호 확인
export async function GET(request: NextRequest) {
  try {
    const businessNumber = '308-86-03448';
    
    console.log('🔍 [Debug] 사업자번호 검색:', businessNumber);

    // 사업자번호로 조회
    const registration = await prisma.business_registrations.findUnique({
      where: { businessNumber },
    });

    console.log('📊 [Debug] 조회 결과:', registration);

    // 모든 사업자 등록 정보 조회
    const allRegistrations = await prisma.business_registrations.findMany({
      select: {
        id: true,
        userId: true,
        businessName: true,
        businessNumber: true,
        representativeName: true,
        isCompleted: true,
        step: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log('📊 [Debug] 전체 사업자 등록 정보 개수:', allRegistrations.length);

    return NextResponse.json({
      searchBusinessNumber: businessNumber,
      found: !!registration,
      registration,
      allRegistrations,
      totalCount: allRegistrations.length,
    });
  } catch (error) {
    console.error('❌ [Debug] Error:', error);
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다.', details: (error as Error).message },
      { status: 500 }
    );
  }
}

