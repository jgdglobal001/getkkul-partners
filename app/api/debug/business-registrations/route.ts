import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

// 디버깅용 API - 모든 사업자 등록 정보 조회
export async function GET(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authConfig);
    
    console.log('🔍 [Debug] 세션 정보:', {
      userId: session?.user?.id,
      email: session?.user?.email,
      name: session?.user?.name,
    });

    console.log('🔍 [Debug] 찾아야 할 userId:', 'cmhx1365n0000wmh4y7atq4rg');
    console.log('🔍 [Debug] 현재 userId:', session?.user?.id);
    console.log('🔍 [Debug] 일치 여부:', session?.user?.id === 'cmhx1365n0000wmh4y7atq4rg');

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      );
    }

    // 현재 사용자의 사업자 등록 정보 조회
    const myRegistration = await prisma.business_registrations.findUnique({
      where: { userId: session.user.id },
    });

    console.log('📊 [Debug] 내 사업자 등록 정보:', myRegistration);

    // 모든 사업자 등록 정보 조회 (디버깅용)
    const allRegistrations = await prisma.business_registrations.findMany({
      select: {
        id: true,
        userId: true,
        businessName: true,
        businessNumber: true,
        isCompleted: true,
        createdAt: true,
      },
    });

    console.log('📊 [Debug] 전체 사업자 등록 정보:', allRegistrations);

    // 모든 사용자 조회 (디버깅용)
    const allUsers = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        createdAt: true,
      },
    });

    console.log('📊 [Debug] 전체 사용자:', allUsers);

    return NextResponse.json({
      session: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      myRegistration,
      allRegistrations,
      allUsers,
    });
  } catch (error) {
    console.error('❌ [Debug] Error:', error);
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

