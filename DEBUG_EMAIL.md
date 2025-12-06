# Debugging Email Issues

## Current Setup
- API Key: Using the "Onboarding" key (re_QapBLTvK...)
- New Key Available: "Watercooler Email Send" (Full access)

## What I Just Fixed
1. ✅ Removed test mode - emails will actually attempt to send now
2. ✅ Added detailed logging - you'll see exactly what's happening
3. ✅ Better error handling - will show Resend's specific error messages

## How to Debug

### 1. Check Server Logs
When you approve a startup, check your terminal where `npm run dev` is running. You should see:
```
📧 Attempting to send email to: founder@example.com
📧 Subject: 🎉 Your startup has been approved!
📧 From: Watercooler <onboarding@resend.dev>
```

Then either:
- ✅ Email sent successfully! ID: abc123
- ❌ Error sending email: [error details]

### 2. Check Resend Dashboard
- Go to https://resend.com/emails
- You'll see all email attempts
- Check for errors or delivery status

### 3. Common Issues

**Issue: "You can only send to your verified email"**
- Solution: Use `watercoolerteam@gmail.com` as founder email, OR verify your domain

**Issue: API key not working**
- Solution: Use the new "Watercooler Email Send" key with full access

**Issue: Email in spam**
- Solution: Check spam folder, verify domain for better deliverability

## Next Steps

1. **Try approving again** - Check terminal logs for detailed output
2. **Check Resend dashboard** - See if email was attempted
3. **Use new API key** - If you want, share the new key and I'll update it
4. **Verify domain** - For production, verify your domain in Resend

## To Use New API Key

If you want to use "Watercooler Email Send" instead:
1. Click the "..." menu next to it in Resend
2. Click "View" to see the full key
3. Share it here and I'll update your .env file

