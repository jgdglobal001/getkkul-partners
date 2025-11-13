import { PrismaClient, Prisma } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

export { Prisma }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Ensure connection
prisma.$connect().catch((err) => {
  console.error('Failed to connect to database:', err)
  process.exit(1)
})

