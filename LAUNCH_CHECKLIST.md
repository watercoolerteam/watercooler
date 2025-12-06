# Launch Checklist

Since you have a domain, here's what to do to launch:

## Pre-Launch Setup

### 1. Domain Configuration
- [ ] Point your domain to your hosting provider (Vercel recommended)
- [ ] Set up DNS records
- [ ] Verify domain is working

### 2. Email Setup (Resend)
- [ ] Create Resend account at https://resend.com
- [ ] Get API key from Resend dashboard
- [ ] Add `RESEND_API_KEY` to your `.env` file
- [ ] Verify your domain in Resend (for production emails)
- [ ] Update `EMAIL_FROM` to use your domain
- [ ] Update `NEXT_PUBLIC_SITE_URL` to your domain

### 3. Environment Variables
Make sure these are set in your production environment:

```env
# Database
DATABASE_URL="your-supabase-connection-string"

# Email
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="Watercooler <noreply@yourdomain.com>"
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"

# Admin (optional but recommended)
NEXT_PUBLIC_ADMIN_PASSWORD="your-secure-password"
```

### 4. Deploy to Vercel
- [ ] Push code to GitHub
- [ ] Connect GitHub repo to Vercel
- [ ] Add all environment variables in Vercel dashboard
- [ ] Deploy
- [ ] Run database migrations: `npx prisma migrate deploy`

### 5. Final Checks
- [ ] Test submission form
- [ ] Test admin approval (check email is sent)
- [ ] Test browse page
- [ ] Test startup profile pages
- [ ] Check all links work
- [ ] Verify emails are sending correctly

## Post-Launch

### Immediate
- [ ] Monitor error logs
- [ ] Check email delivery rates
- [ ] Test on mobile devices

### First Week
- [ ] Monitor performance
- [ ] Check analytics (if added)
- [ ] Gather user feedback

## Quick Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variables
   - Deploy!

3. **Run Migrations:**
   - In Vercel dashboard, go to your project
   - Use the terminal or run locally with production DATABASE_URL
   - Run: `npx prisma migrate deploy`

## Domain Setup

Once deployed, update your domain:
- Add your domain in Vercel project settings
- Update DNS records as Vercel instructs
- Wait for DNS propagation (usually 5-30 minutes)

