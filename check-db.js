const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    console.log('🔍 데이터베이스 연결 확인 중...\n');

    // 1. 모든 사용자 조회
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    console.log('📊 전체 사용자 수:', users.length);
    console.log('사용자 목록:');
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (${user.name}) - ID: ${user.id}`);
    });
    console.log('\n');

    // 2. 모든 사업자 등록 정보 조회
    const businessRegistrations = await prisma.business_registrations.findMany({
      include: {
        users: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    console.log('📋 전체 사업자 등록 수:', businessRegistrations.length);
    console.log('사업자 등록 상세 정보:\n');
    
    businessRegistrations.forEach((reg, index) => {
      console.log(`${index + 1}. 사업자 정보:`);
      console.log(`   - 사용자: ${reg.users.email} (${reg.users.name})`);
      console.log(`   - 사업자명: ${reg.businessName}`);
      console.log(`   - 사업자번호: ${reg.businessNumber}`);
      console.log(`   - 대표자명: ${reg.representativeName}`);
      console.log(`   - 현재 단계: ${reg.step}`);
      console.log(`   - 완료 여부: ${reg.isCompleted ? '✅ 완료' : '❌ 미완료'}`);
      console.log(`   - 생성일: ${reg.createdAt}`);
      console.log(`   - 수정일: ${reg.updatedAt}`);
      console.log('');
    });

    // 3. 완료된 사업자 등록과 미완료 사업자 등록 구분
    const completed = businessRegistrations.filter(r => r.isCompleted);
    const incomplete = businessRegistrations.filter(r => !r.isCompleted);

    console.log('✅ 완료된 사업자 등록:', completed.length);
    console.log('❌ 미완료 사업자 등록:', incomplete.length);
    console.log('\n');

    // 4. 미완료 사업자 등록 상세
    if (incomplete.length > 0) {
      console.log('⚠️ 미완료 사업자 등록 상세:');
      incomplete.forEach((reg, index) => {
        console.log(`  ${index + 1}. ${reg.users.email} - 단계: ${reg.step}, isCompleted: ${reg.isCompleted}`);
      });
    }

  } catch (error) {
    console.error('❌ 에러 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();

