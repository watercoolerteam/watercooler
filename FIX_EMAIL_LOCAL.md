# 📧 Fix Email Not Sending Locally

## The Problem

When you submit a startup locally, the confirmation email isn't being sent because `RESEND_API_KEY` isn't set in your local `.env` file.

## Quick Fix

Add these to your `.env` file:

```env
RESEND_API_KEY=re_3x5NqYft_3UDF2sTEN6r43y9S6Fn4sLwe
EMAIL_FROM=Watercooler <onboarding@resend.dev>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Steps

1. **Open your `.env` file**
   ```bash
   # In the project root
   code .env
   # or
   nano .env
   ```

2. **Add the email variables:**
   ```env
   RESEND_API_KEY=re_3x5NqYft_3UDF2sTEN6r43y9S6Fn4sLwe
   EMAIL_FROM=Watercooler <onboarding@resend.dev>
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Restart your dev server:**
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

4. **Test again:**
   - Submit a new startup
   - Check your email inbox
   - Check the terminal/console for email logs

## Check Server Logs

When you submit, you should see logs like:
```
📧 Attempting to send email to: your@email.com
📧 Subject: Your startup "..." has been submitted to Watercooler
✅ Email sent successfully! ID: ...
```

If you see:
```
⚠️ RESEND_API_KEY not set - email not sent
```
Then the environment variable isn't being loaded.

## Troubleshooting

**Still not working?**
1. Make sure `.env` is in the project root (same folder as `package.json`)
2. Restart the dev server after adding variables
3. Check the terminal for error messages
4. Verify the email address you used is correct

**Production emails work?**
- Production uses environment variables from Vercel
- Local development needs them in `.env`
- They're separate - that's why production works but local doesn't

