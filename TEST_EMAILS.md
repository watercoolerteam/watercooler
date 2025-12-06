# Testing Email Notifications

## ✅ Setup Complete!

Your Resend API key is configured. Emails are ready to test!

## How to Test

### 1. Test Approval Email
1. Submit a test startup at http://localhost:3000/submit
   - Use your real email address so you can receive the email
   - Fill out all required fields
2. Go to http://localhost:3000/admin
   - Login with password: `admin123`
   - Find your test startup
   - Click **"Approve"**
3. Check your email inbox (and spam folder)
   - You should receive a beautiful approval email!

### 2. Test Rejection Email
1. Submit another test startup
2. In admin panel, click **"Reject"**
3. Check your email for the rejection email

### 3. Test Claim Email
1. Make sure you have an approved startup
2. Go to http://localhost:3000/claim
3. Enter the email you used when submitting
4. Check your email for the claim verification email

## What to Check

✅ **Email arrives** - Check inbox and spam folder
✅ **Email looks good** - Professional HTML design
✅ **Links work** - Click links in email to verify they work
✅ **Content is correct** - Startup name, links, etc. are correct

## Troubleshooting

**Not receiving emails?**
- Check spam/junk folder
- Verify email address is correct
- Check Resend dashboard at https://resend.com/emails for logs
- Check browser console for errors
- Make sure dev server was restarted after adding API key

**Email looks broken?**
- Check Resend dashboard for delivery status
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly

## Next: Use Your Domain

When ready to use your domain for emails:

1. Go to Resend dashboard → Domains
2. Add your domain
3. Add DNS records Resend provides
4. Wait for verification
5. Update `.env`:
   ```env
   EMAIL_FROM="Watercooler <noreply@yourdomain.com>"
   ```

## Production Setup

When deploying:
1. Add `RESEND_API_KEY` to Vercel environment variables
2. Add `EMAIL_FROM` with your domain
3. Add `NEXT_PUBLIC_SITE_URL` with your production URL
4. Verify domain in Resend before going live

