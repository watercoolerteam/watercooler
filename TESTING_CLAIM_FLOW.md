# Testing the Claim Flow

## Prerequisites

1. **Make sure you have:**
   - At least one approved startup in the database
   - Email service configured (RESEND_API_KEY in .env)
   - Development server running (`npm run dev`)

## Test Steps

### Step 1: Find a Test Startup

1. Go to `/browse` and find an approved startup
2. Note the founder email (you'll need this)
3. Make sure the startup is NOT already claimed (should show "Claim this startup" link)

### Step 2: Request Claim

1. Go to `/claim` page
2. Enter the founder email from Step 1
3. Click "Send Claim Link"
4. You should see: "Claim Email Sent!" success message

**Check the console/logs:**
- Should see email sending attempt
- Should see token creation in database

### Step 3: Check Email

1. Check the email inbox (and spam folder)
2. You should receive an email with:
   - List of startups to claim
   - "Verify Email & Claim Startup" button
   - Link that looks like: `http://localhost:3000/claim/verify?token=...`

### Step 4: Verify Token

1. Click the verification link in the email (or copy/paste it)
2. You should see:
   - Loading state briefly
   - Success page with:
     - Green checkmark
     - "Successfully Claimed!" message
     - List of claimed startups
     - Links to view each startup

### Step 5: Verify Claim Status

1. Go to one of the claimed startup profile pages
2. Should see:
   - "Claimed ✓" badge with green checkmark
   - Message: "This startup has been claimed by its founder"
   - NO "Claim this startup" link

### Step 6: Test Edge Cases

#### Test Already Claimed
1. Try to claim the same startup again with the same email
2. Should see error: "All startups associated with this email have already been claimed."

#### Test Invalid Token
1. Go to `/claim/verify?token=invalid-token`
2. Should see error page with "Invalid or expired token"

#### Test Expired Token (optional)
- Tokens expire after 24 hours
- You'd need to wait or manually expire one in the database to test this

## What to Check

### Database Verification

You can verify in Supabase or using Prisma Studio:

```bash
npx prisma studio
```

Check:
1. **ClaimToken table**: Should have a new token with your email
2. **ClaimTokenStartup table**: Should link the token to startup(s)
3. **User table**: Should have a new user with the email
4. **Startup table**: `claimedBy` should be set to user ID, `claimedAt` should have timestamp

### Console/Logs

Watch for:
- ✅ Token generation
- ✅ Email sending (success or error)
- ✅ Token verification
- ✅ User creation
- ✅ Startup linking

## Troubleshooting

### Email Not Sending
- Check `RESEND_API_KEY` is set in `.env`
- Check email logs in console
- Verify Resend account is active

### Token Not Working
- Check token exists in database
- Check token hasn't expired
- Check token hasn't been used (`usedAt` is null)
- Check startups aren't already claimed

### User Not Created
- Check database connection
- Check for unique constraint errors (email already exists)
- Check Prisma logs

## Success Criteria

✅ Email is sent with verification link
✅ Token is created in database
✅ Verification link works
✅ User account is created
✅ Startups are linked to user
✅ Token is marked as used
✅ Startup page shows "Claimed ✓"
✅ Can't claim same startup twice

## Next Steps After Testing

Once Phase 1 is verified working:
- Move to Phase 2: Authentication system
- Add dashboard for founders
- Add edit functionality
