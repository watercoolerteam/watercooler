# Watercooler

A public, browsable directory of early-stage startups. Founders can submit their startup via a simple form (no auth required), and each approved submission becomes a public startup profile. Scouts, investors, and operators can freely browse, search, and filter startups.

## Features

- **Public by default** - Browse and startup pages are open, no login required
- **Simple submission** - Founders can submit their startup without an account
- **Founder email required** - Each submission includes a required founder email for later account linking
- **Clean, obvious UX** - Landing page instantly communicates the purpose
- **SEO/indexable** - Startup profile URLs and list pages are indexable
- **Search & Filter** - Browse startups by category, location, and more
- **Claim functionality** - Founders can later claim their page to edit it

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Prisma 5** - Database ORM
- **Supabase (PostgreSQL)** - Database

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up Supabase:**

   - Create a project at [supabase.com](https://supabase.com)
   - Go to Project Settings > Database
   - Copy your connection string (URI format)
   - Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

   Replace `[YOUR-PASSWORD]` with your database password and `[YOUR-PROJECT-REF]` with your project reference.

3. **Run database migrations:**

```bash
npx prisma migrate dev --name init
```

This will create all the necessary tables in your Supabase database.

4. **Start the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
  - `page.tsx` - Landing page
  - `submit/` - Startup submission form
  - `browse/` - Browse/search/filter startups
  - `startup/[slug]/` - Individual startup profile pages
  - `claim/` - Claim startup page
  - `api/` - API routes for submissions and claims
- `lib/` - Utility functions (Prisma client)
- `prisma/` - Database schema and migrations

## Database Schema

- **Startup** - Main entity with name, description, website, founder email, status, category, etc.
- **User** - For founders who claim their startups (future editing functionality)

## Next Steps

To make this production-ready, you'll want to:

1. Set up email sending for claim verification (e.g., using Resend, SendGrid, or similar)
2. Implement authentication for founders to edit their claimed startups
3. Add an admin interface to approve/reject submissions
4. Add image upload for startup logos
5. Set up proper error handling and logging
6. Add analytics and monitoring
7. Configure SEO metadata and sitemap generation

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Make sure to:
1. Set the `DATABASE_URL` environment variable in Vercel
2. Run `prisma migrate deploy` in your deployment environment
3. Run `prisma generate` during build (already configured in package.json)
