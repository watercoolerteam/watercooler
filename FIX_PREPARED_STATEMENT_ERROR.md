# Fix: "prepared statement already exists" Error

## The Problem
You're seeing this error:
```
Error: prepared statement "s0" already exists
```

This happens because **Supabase Transaction Mode Pooler (port 6543) doesn't support prepared statements**, but Prisma uses them by default.

## The Solution
Add `?pgbouncer=true` to the end of your `DATABASE_URL` connection string.

## Quick Fix

1. **Go to Vercel** → Your Project → Settings → Environment Variables

2. **Find `DATABASE_URL`** and update it to include `?pgbouncer=true` at the end:
   
   **Before:**
   ```
   postgresql://postgres.jjgvsmuvkbhfkwcesrcw:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres
   ```
   
   **After:**
   ```
   postgresql://postgres.jjgvsmuvkbhfkwcesrcw:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

3. **Save and redeploy**

That's it! The `?pgbouncer=true` parameter tells Prisma to disable prepared statements, which makes it compatible with Transaction Mode Pooler.

## Why This Happens

- **Transaction Mode Pooler** (port 6543) is optimized for serverless but doesn't support prepared statements
- **Prisma** uses prepared statements by default for performance
- **`?pgbouncer=true`** disables prepared statements in Prisma, making it compatible

## Optional: Direct URL for Migrations

If you want to run Prisma migrations, you can optionally add a `DIRECT_DATABASE_URL` environment variable pointing to the direct database connection (not the pooler). This is only needed if you run migrations from Vercel.

The direct connection string would be:
```
postgresql://postgres:[PASSWORD]@db.jjgvsmuvkbhfkwcesrcw.supabase.co:5432/postgres
```

But for most cases, you can run migrations locally and they'll work fine with the pooler connection.
