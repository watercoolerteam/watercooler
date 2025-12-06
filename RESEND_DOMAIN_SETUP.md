# Resend Domain Verification - Quick Fix

## The Issue

Resend's free tier only allows sending emails to your verified account email (`watercoolerteam@gmail.com`) until you verify a domain.

**Error you're seeing:**
> "You can only send testing emails to your own email address. To send emails to other recipients, please verify a domain"

## Solution Options

### Option 1: Verify Your Domain (Recommended for Production)

1. **Go to Resend Dashboard:**
   - Visit https://resend.com/domains
   - Click **"Add Domain"**

2. **Enter Your Domain:**
   - Type your domain (e.g., `yourdomain.com`)
   - Click **"Add"**

3. **Add DNS Records:**
   - Resend will show you DNS records to add
   - Go to your domain registrar (where you bought the domain)
   - Add the DNS records Resend provides
   - Usually 2-3 records (SPF, DKIM, etc.)

4. **Wait for Verification:**
   - Usually takes 5-30 minutes
   - Resend will show "Verified" when ready

5. **Update Your .env:**
   ```env
   EMAIL_FROM="Watercooler <noreply@yourdomain.com>"
   RESEND_DOMAIN_VERIFIED="true"
   ```

### Option 2: Test with Your Verified Email (Quick Test)

For now, you can test by:
1. Using `watercoolerteam@gmail.com` as the founder email when submitting
2. Approving the startup
3. The email will be sent to that address

### Option 3: Use Resend's Test Mode (Current)

The code now logs emails in development mode. Check your terminal/console when approving - you'll see:
```
📧 EMAIL (Test Mode - would send to): founder@example.com
📧 Subject: 🎉 Your startup has been approved!
```

## Quick Domain Setup Steps

1. **In Resend:**
   - Go to https://resend.com/domains
   - Click "Add Domain"
   - Enter your domain

2. **In Your Domain Registrar:**
   - Go to DNS settings
   - Add the records Resend shows you
   - Save

3. **Wait & Verify:**
   - Wait 5-30 minutes
   - Check Resend dashboard for "Verified" status

4. **Update Code:**
   - Add `RESEND_DOMAIN_VERIFIED="true"` to `.env`
   - Update `EMAIL_FROM` to use your domain

## What I've Done

I've updated the code to:
- ✅ Log emails in test mode (so you can see what would be sent)
- ✅ Handle the domain verification error gracefully
- ✅ Show clear messages about what's happening

## Next Steps

**For Testing Now:**
- Check your terminal/console when approving - you'll see the email details logged
- Or use `watercoolerteam@gmail.com` as the founder email to test real delivery

**For Production:**
- Verify your domain in Resend (5-10 minutes)
- Update `.env` with your domain email
- Emails will work for all addresses!

Would you like help setting up the domain verification, or should we test with the verified email first?

