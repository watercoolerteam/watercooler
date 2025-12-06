# Email Setup Guide

## Setting Up Resend

### Step 1: Create Resend Account

1. Go to https://resend.com
2. Sign up for a free account (3,000 emails/month free)
3. Verify your email address

### Step 2: Get Your API Key

1. Once logged in, go to **API Keys** in the sidebar
2. Click **"Create API Key"**
3. Give it a name (e.g., "Watercooler Production")
4. Copy the API key (you'll only see it once!)

### Step 3: Add to Your .env File

Add these to your `.env` file:

```env
# Resend API Key (get from https://resend.com/api-keys)
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# Email sender address
# For testing: Use Resend's default (onboarding@resend.dev)
# For production: Use your domain (e.g., noreply@yourdomain.com)
EMAIL_FROM="Watercooler <onboarding@resend.dev>"

# Your site URL (for email links)
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
# In production, use: NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### Step 4: Verify Domain (For Production)

When you're ready to use your domain:

1. Go to **Domains** in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend provides to your domain
5. Wait for verification (usually a few minutes)
6. Update `EMAIL_FROM` to use your domain:
   ```env
   EMAIL_FROM="Watercooler <noreply@yourdomain.com>"
   ```

## Email Templates

The following emails are automatically sent:

1. **Approval Email** - Sent when admin approves a startup
2. **Rejection Email** - Sent when admin rejects a startup  
3. **Claim Email** - Sent when founder requests to claim their startup

All emails are HTML-formatted and include:
- Professional design
- Links to relevant pages
- Clear call-to-actions

## Testing

To test emails:

1. Make sure `RESEND_API_KEY` is set in your `.env`
2. Submit a test startup
3. Approve it in the admin panel
4. Check the founder's email inbox
5. Check Resend dashboard for email logs

## Troubleshooting

**Emails not sending?**
- Check that `RESEND_API_KEY` is set correctly
- Check Resend dashboard for error logs
- Verify email addresses are valid
- Check spam folder

**Domain verification issues?**
- Make sure DNS records are added correctly
- Wait a few minutes for DNS propagation
- Check Resend dashboard for verification status

## Free Tier Limits

Resend free tier includes:
- 3,000 emails/month
- 100 emails/day
- Perfect for getting started!

