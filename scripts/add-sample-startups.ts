/**
 * Script to add sample startups to the database
 * Run with: npx tsx scripts/add-sample-startups.ts
 */

import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

const prisma = new PrismaClient();

// Sample startups data
const sampleStartups = [
  {
    name: "AI Code Assistant",
    oneLiner: "AI-powered coding assistant that writes, reviews, and debugs code",
    description: "We're building the next generation of developer tools using advanced AI models. Our assistant understands context, writes clean code, and helps teams ship faster.",
    website: "https://example-ai-code.com",
    category: "Developer Tools",
    location: "San Francisco, CA",
    founderNames: "Sarah Chen, Alex Rodriguez",
    founderEmail: "founders@example-ai-code.com",
    founderHighlight: "Ex-Google, YC Alum",
    companyStage: "LIVE" as const,
    financialStage: "RAISING" as const,
  },
  {
    name: "HealthTech Platform",
    oneLiner: "Connecting patients with specialized healthcare providers instantly",
    description: "Our platform uses AI to match patients with the right healthcare providers based on their needs, location, and insurance. We're making healthcare more accessible and efficient.",
    website: "https://example-healthtech.com",
    category: "Healthcare",
    location: "New York, NY",
    founderNames: "Dr. Michael Park",
    founderEmail: "michael@example-healthtech.com",
    founderHighlight: "2nd-time Founder",
    companyStage: "PRIVATE_BETA" as const,
    financialStage: "RAISING_SOON" as const,
  },
  {
    name: "Sustainable Fashion Marketplace",
    oneLiner: "Curated marketplace for sustainable and ethical fashion brands",
    description: "We're building a platform that connects conscious consumers with verified sustainable fashion brands. Every product is vetted for environmental and social impact.",
    website: "https://example-sustainable-fashion.com",
    category: "E-commerce",
    location: "Portland, OR",
    founderNames: "Emma Thompson, James Wilson",
    founderEmail: "hello@example-sustainable-fashion.com",
    companyStage: "BUILDING" as const,
    financialStage: "BOOTSTRAPPED" as const,
  },
  {
    name: "Remote Team Builder",
    oneLiner: "AI-powered platform for building and managing distributed teams",
    description: "We help companies build high-performing remote teams by matching talent, facilitating collaboration, and providing tools for remote team management.",
    website: "https://example-remote-teams.com",
    category: "HR Tech",
    location: "Austin, TX",
    founderNames: "David Kim",
    founderEmail: "david@example-remote-teams.com",
    founderHighlight: "Ex-Meta",
    companyStage: "LIVE" as const,
    financialStage: "FUNDED" as const,
  },
  {
    name: "Climate Data Platform",
    oneLiner: "Real-time climate data and analytics for businesses",
    description: "We aggregate climate data from multiple sources and provide actionable insights for businesses to understand and reduce their environmental impact.",
    website: "https://example-climate-data.com",
    category: "Climate Tech",
    location: "Seattle, WA",
    founderNames: "Lisa Anderson, Robert Martinez",
    founderEmail: "team@example-climate-data.com",
    founderHighlight: "Ex-Stripe",
    companyStage: "PRIVATE_BETA" as const,
    financialStage: "RAISING" as const,
  },
  {
    name: "EdTech Learning Platform",
    oneLiner: "Personalized learning paths for professional development",
    description: "Our AI-powered platform creates personalized learning paths for professionals looking to upskill. We partner with top educators and companies to deliver high-quality content.",
    website: "https://example-edtech.com",
    category: "Education",
    location: "Boston, MA",
    founderNames: "Jennifer Lee",
    founderEmail: "jennifer@example-edtech.com",
    companyStage: "LIVE" as const,
    financialStage: "NOT_RAISING" as const,
  },
  {
    name: "FinTech Payment Solution",
    oneLiner: "Simplified payment processing for small businesses",
    description: "We're making payment processing accessible for small businesses with transparent pricing, easy setup, and powerful features typically reserved for enterprise customers.",
    website: "https://example-fintech.com",
    category: "Fintech",
    location: "Chicago, IL",
    founderNames: "Marcus Johnson, Priya Patel",
    founderEmail: "founders@example-fintech.com",
    founderHighlight: "YC Alum",
    companyStage: "BUILDING" as const,
    financialStage: "RAISING_SOON" as const,
  },
  {
    name: "Food Waste Reduction App",
    oneLiner: "Connecting restaurants with food banks to reduce waste",
    description: "Our app helps restaurants donate surplus food to local food banks and shelters. We've diverted over 10,000 pounds of food from landfills in our first 6 months.",
    website: "https://example-food-waste.com",
    category: "Social Impact",
    location: "Los Angeles, CA",
    founderNames: "Carlos Mendez",
    founderEmail: "carlos@example-food-waste.com",
    companyStage: "LIVE" as const,
    financialStage: "BOOTSTRAPPED" as const,
  },
];

async function addSampleStartups() {
  try {
    console.log('🚀 Adding sample startups...\n');

    for (const startup of sampleStartups) {
      // Generate slug
      const baseSlug = slugify(startup.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      // Ensure unique slug
      while (true) {
        const existing = await prisma.startup.findUnique({ where: { slug } });
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Create startup
      const created = await prisma.startup.create({
        data: {
          ...startup,
          slug,
          status: 'APPROVED', // Auto-approve sample startups
        },
      });

      console.log(`✅ Added: ${created.name} (${created.slug})`);
    }

    console.log(`\n🎉 Successfully added ${sampleStartups.length} sample startups!`);
    console.log('💡 You can now view them at: http://localhost:3000/browse');
  } catch (error) {
    console.error('❌ Error adding sample startups:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addSampleStartups();

