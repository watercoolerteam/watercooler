# Deployment Guide

## Pre-Deployment Checklist

### ✅ Critical Issues to Fix

1. **Image Upload Storage** ⚠️ **CRITICAL**
   - Currently using local filesystem (`public/uploads/logos/`)
   - **Won't work on serverless platforms** (Vercel, Netlify, etc.)
   - **Solution**: Switch to Supabase Storage (recommended) or another cloud storage

2. **Database Connection**
   - Currently using direct connection for development
   - **For production**: Use connection pooling URL
   - Update `DATABASE_URL` in production environment

3. **Environment Variables**
   - All required env vars must be set in production
   - See "Required Environment Variables" below

4. **Prisma Migrations**
   - Migrations must run in production
   - Vercel: Automatic via `prisma migrate deploy` in build
   - Other platforms: Run manually or via CI/CD

## Required Environment Variables

Set these in your production environment (Vercel, Netlify, etc.):

```env
# Database (use connection pooling for production)
DATABASE_URL="postgresql://postgres.jjgvsmuvkbhfkwcesrcw:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

# Site URL (your production domain)
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Admin Password
NEXT_PUBLIC_ADMIN_PASSWORD="your-strong-password-here"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="Watercooler <noreply@yourdomain.com>"
```

## Deployment Platforms

### Vercel (Recommended for Next.js)

**Why Vercel:**
- Built for Next.js
- Automatic deployments from Git
- Built-in environment variable management
- Automatic Prisma migrations
- Edge functions support

**Steps:**
1. Push code to GitHub/GitLab
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

**Vercel-specific considerations:**
- Image uploads won't work with local storage (see below)
- Use Supabase Storage or Vercel Blob Storage
- Connection pooling recommended for database

### Other Platforms

**Netlify, Railway, Render, etc.**
- Similar process to Vercel
- Make sure to set all environment variables
- Run Prisma migrations manually or via build script

## Critical Fix: Image Upload Storage

### Current Problem
Images are saved to `public/uploads/logos/` which:
- ❌ Doesn't persist on serverless platforms
- ❌ Gets wiped on each deployment
- ❌ Not scalable

### Solution Options

#### Option 1: Supabase Storage (Recommended)
Since you're already using Supabase, this is the easiest:

1. Enable Supabase Storage in your project
2. Create a `logos` bucket
3. Update `/api/upload/route.ts` to upload to Supabase
4. Return Supabase public URL

**Pros:**
- Already using Supabase
- Free tier available
- CDN included
- Easy to implement

#### Option 2: Vercel Blob Storage
If deploying on Vercel:

1. Install `@vercel/blob`
2. Update upload route to use Vercel Blob
3. Return blob URL

**Pros:**
- Native Vercel integration
- Simple setup
- Good performance

#### Option 3: AWS S3 + CloudFront
For maximum control:

1. Set up S3 bucket
2. Configure CloudFront CDN
3. Update upload route
4. More complex but very scalable

## Database Connection

### Development
- Use direct connection: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

### Production
- Use connection pooling: `postgresql://postgres.[PROJECT]:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres`
- Better for serverless/horizontal scaling
- Handles connection limits better

## Prisma Migrations in Production

### Vercel (Automatic)
Vercel automatically runs `prisma migrate deploy` during build if:
- `prisma` is in `package.json`
- Migrations are in `prisma/migrations/`

### Manual (Other Platforms)
Add to your build script:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "migrate": "prisma migrate deploy"
  }
}
```

Or run manually:
```bash
npx prisma migrate deploy
```

## Build Configuration

### Next.js Config
Your `next.config.ts` is minimal, which is good. No changes needed.

### Package.json
Make sure these scripts exist:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "postinstall": "prisma generate"
  }
}
```

## Post-Deployment Checklist

After deploying:

1. ✅ Test homepage loads
2. ✅ Test startup submission form
3. ✅ Test image upload (if using cloud storage)
4. ✅ Test browse page with filters
5. ✅ Test startup profile pages
6. ✅ Test admin panel
7. ✅ Test email notifications
8. ✅ Test analytics page
9. ✅ Verify environment variables are set
10. ✅ Check database connection is working

## Monitoring

### Recommended Tools
- **Vercel Analytics**: Built-in if using Vercel
- **Sentry**: Error tracking
- **LogRocket**: User session replay
- **Supabase Dashboard**: Database monitoring

## Security Checklist

- [ ] Admin password is strong and unique
- [ ] Environment variables are not committed to Git
- [ ] Database password is secure
- [ ] Email API key is protected
- [ ] CORS is configured (if needed)
- [ ] Rate limiting on API routes (consider adding)

## Performance Optimization

### Already Implemented
- ✅ Image optimization with Sharp
- ✅ WebP conversion
- ✅ Image resizing

### Consider Adding
- CDN for static assets
- Database query optimization
- Caching strategy
- Image CDN (if using Supabase Storage)

## Troubleshooting

### Build Fails
- Check environment variables are set
- Verify Prisma migrations are up to date
- Check for TypeScript errors
- Review build logs

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check if database is paused (Supabase free tier)
- Try connection pooling URL instead of direct

### Image Upload Fails
- If using local storage, switch to cloud storage
- Check file size limits
- Verify storage bucket permissions (if using cloud)

### Emails Not Sending
- Verify `RESEND_API_KEY` is set
- Check `EMAIL_FROM` is correct
- Verify domain is verified in Resend (if using custom domain)

## Next Steps

1. **Immediate**: Fix image upload storage (switch to Supabase Storage)
2. **Before Launch**: Set all environment variables
3. **After Launch**: Monitor errors and performance
4. **Ongoing**: Keep dependencies updated

