# Fix Gmail Security Warning for Resend Click Tracking

## The Problem
Gmail is showing a security warning: "This link looks dangerous" because links are going through `us-east-1.resend-clicks.com`, which has a low reputation.

## The Solution
You need to disable click tracking at the **domain level** in Resend, not just per-email.

## Steps to Fix

### Option 1: Disable in Resend Dashboard (Recommended)

1. **Go to Resend Dashboard**
   - Log in at https://resend.com
   - Navigate to **"Domains"** in the sidebar

2. **Select Your Domain**
   - If you're using a custom domain (e.g., `noreply@watercooler.world`), click on that domain
   - If you're using the default `onboarding@resend.dev`, you **cannot** disable click tracking for this domain (see Option 2)

3. **Disable Click Tracking**
   - In the domain settings, find **"Click Tracking"**
   - Toggle it to **"Off"**
   - Save the changes

### Option 2: Use a Custom Domain (Best Solution)

If you're currently using `onboarding@resend.dev`, you should set up a custom domain:

1. **Add Your Domain to Resend**
   - Go to Resend Dashboard → Domains
   - Click "Add Domain"
   - Enter your domain (e.g., `watercooler.world`)
   - Follow the DNS setup instructions

2. **Verify Your Domain**
   - Add the required DNS records (SPF, DKIM, DMARC)
   - Wait for verification (usually a few minutes)

3. **Disable Click Tracking for Your Domain**
   - Once verified, go to your domain settings
   - Disable "Click Tracking"
   - Disable "Open Tracking" (optional but recommended)

4. **Update Environment Variable**
   - In Vercel, update `EMAIL_FROM` to use your custom domain:
     ```
     EMAIL_FROM="Watercooler <noreply@watercooler.world>"
     ```
   - Redeploy

### Option 3: Verify Per-Email Setting (Already Done)

The code already disables click tracking per-email for authentication links:
- `disableClickTracking: true` is set in `auth.ts`
- `click_tracking: false` is set in `lib/email.ts`

However, **domain-level settings override per-email settings**, so you must disable it at the domain level.

## Why This Happens

- Resend wraps links through `resend-clicks.com` for click tracking
- This domain has a low reputation with Google Safe Browsing
- Gmail flags these links as potentially dangerous
- Even with per-email tracking disabled, domain-level settings can still enable it

## Best Practice

For authentication emails (magic links), you should:
1. ✅ Use a custom domain (not `onboarding@resend.dev`)
2. ✅ Disable click tracking at the domain level
3. ✅ Disable open tracking (optional but recommended)
4. ✅ Use direct links in your email HTML (already done)

## After Fixing

Once you disable click tracking at the domain level:
- Links will go directly to your site (no `resend-clicks.com` redirect)
- Gmail security warnings should disappear
- Email deliverability may improve
- Users will have a better experience

## Current Status

✅ Per-email click tracking is disabled in code
❌ Domain-level click tracking needs to be disabled in Resend dashboard
❓ Are you using a custom domain or `onboarding@resend.dev`?
