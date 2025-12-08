import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Optimize Prisma for production with connection pooling
// Cache Prisma client globally to prevent multiple instances in development
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Connection pool configuration
  // These are defaults, but can be adjusted based on your database provider
  // For Supabase, connection pooling is handled by the connection string
})

// Cache the Prisma client globally to prevent multiple instances
// This is important for both development and production
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
