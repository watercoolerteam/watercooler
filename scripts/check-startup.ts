/**
 * Quick script to check startup status
 * Run with: npx tsx scripts/check-startup.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStartups() {
  try {
    const startups = await prisma.startup.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    console.log('\n📊 Recent Startups:');
    console.log('─'.repeat(80));
    startups.forEach((s) => {
      console.log(`Name: ${s.name}`);
      console.log(`Slug: ${s.slug}`);
      console.log(`Status: ${s.status}`);
      console.log(`URL: /startup/${s.slug}`);
      console.log('─'.repeat(80));
    });

    const approved = startups.filter((s) => s.status === 'APPROVED');
    console.log(`\n✅ Approved: ${approved.length}/${startups.length}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStartups();

