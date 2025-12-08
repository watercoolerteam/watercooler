# Authentication Setup Guide

## Environment Variables

Add these to your `.env` file:

```env
# NextAuth.js
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"  # For local development
# In production, use: AUTH_URL="https://yourdomain.com"

# Email (already configured)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="Watercooler <noreply@yourdomain.com>"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"  # Or your production URL
```

## Generate AUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use an online generator, or just use a long random string.

## How It Works

1. **User signs in**: Goes to `/auth/signin`, enters email
2. **Email sent**: NextAuth sends magic link email
3. **User clicks link**: Automatically signed in
4. **Session created**: Stored in database (Session table)
5. **Dashboard access**: User can access `/dashboard` to see their startups

## Testing

1. Make sure you have `AUTH_SECRET` in `.env`
2. Restart your dev server
3. Go to `/auth/signin`
4. Enter an email of a user who has claimed a startup
5. Check email for sign-in link
6. Click link → should be signed in
7. Go to `/dashboard` → should see your startups

## Routes

- `/auth/signin` - Sign in page
- `/dashboard` - User dashboard (protected, requires sign-in)
- `/api/auth/[...nextauth]` - NextAuth API routes
- `/api/auth/signout` - Sign out endpoint

## Notes

- Sessions are stored in the database (Session table)
- Email-based authentication (no passwords)
- Users must have claimed a startup to have an account
- Account is created automatically when startup is claimed
