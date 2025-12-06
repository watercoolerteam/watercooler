/**
 * Cleanup script to delete all existing startups
 * Run with: npx tsx scripts/cleanup-db.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  try {
    console.log('🗑️  Starting database cleanup...');

    // Get count before deletion
    const count = await prisma.startup.count();
    console.log(`📊 Found ${count} startup(s) in database`);

    if (count === 0) {
      console.log('✅ Database is already empty. Nothing to clean up.');
      return;
    }

    // Delete all startups
    const result = await prisma.startup.deleteMany({});
    console.log(`✅ Deleted ${result.count} startup(s)`);

    console.log('🎉 Database cleanup complete!');
    console.log('💡 You can now submit new startups through the form.');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();

