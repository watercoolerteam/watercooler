/**
 * Script to backfill updateCount and lastUpdateAt for existing startups
 * Run with: npx tsx scripts/backfill-update-tracking.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function backfillUpdateTracking() {
  try {
    console.log('🔄 Backfilling update tracking fields...\n');

    // Get all startups
    const startups = await prisma.startup.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    console.log(`Found ${startups.length} startups to process\n`);

    let updated = 0;

    for (const startup of startups) {
      // Get update count and latest update
      const [updateCount, latestUpdate] = await Promise.all([
        prisma.startupUpdate.count({
          where: { startupId: startup.id },
        }),
        prisma.startupUpdate.findFirst({
          where: { startupId: startup.id },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
      ]);

      // Update the startup
      await prisma.startup.update({
        where: { id: startup.id },
        data: {
          updateCount,
          lastUpdateAt: latestUpdate?.createdAt || null,
        },
      });

      updated++;
      console.log(`✅ ${startup.name}: ${updateCount} updates, last update: ${latestUpdate?.createdAt ? latestUpdate.createdAt.toISOString() : 'never'}`);
    }

    console.log(`\n🎉 Successfully backfilled ${updated} startups!`);
  } catch (error) {
    console.error('❌ Error backfilling update tracking:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

backfillUpdateTracking();
