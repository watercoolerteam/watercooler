import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL has ?pgbouncer=true for Transaction Mode Pooler
// Transaction Mode doesn't support prepared statements, so we must disable them
function ensurePgbouncerParam(url: string | undefined): string {
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  // If it's a transaction mode pooler (port 6543) and doesn't have pgbouncer=true, add it
  if (url.includes(':6543/') && !url.includes('pgbouncer=true')) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}pgbouncer=true`
  }
  
  return url
}

const databaseUrl = ensurePgbouncerParam(process.env.DATABASE_URL)

// Optimize Prisma for production with connection pooling
// Cache Prisma client globally to prevent multiple instances in development
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  // Connection pool configuration for serverless environments
  // For Supabase with Vercel, use transaction mode pooler (port 6543)
  // Connection string should be: postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
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
