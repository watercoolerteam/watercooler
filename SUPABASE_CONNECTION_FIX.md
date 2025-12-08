# Fix Supabase Connection for Vercel

## The Problem
Your current connection string is using **Session Mode Pooler** (port 5432), which doesn't work well with Vercel's serverless functions. The error shows:
```
Can't reach database server at `aws-0-us-west-2.pooler.supabase.com:5432`
```

## The Solution
You need to use **Transaction Mode Pooler** (port 6543) for Vercel/serverless environments.

## How to Get the Correct Connection String

1. **Go to your Supabase Dashboard**
   - Navigate to your project: https://supabase.com/dashboard/project/jjgvsmuvkbhfkwcesrcw

2. **Get Transaction Mode Connection String**
   - Click **"Connect"** button at the top (or go to Settings → Database)
   - Look for **"Connection string"** section
   - Select **"Transaction Pooler"** (NOT Session Pooler)
   - Copy the connection string - it should look like:
     ```
     postgresql://postgres.jjgvsmuvkbhfkwcesrcw:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres
     ```
   - **Important**: Notice it uses port **6543** (transaction mode), not 5432 (session mode)

3. **Update Vercel Environment Variable**
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Find `DATABASE_URL`
   - Update it with the new connection string (port 6543)
   - Make sure to replace `[YOUR-PASSWORD]` with your actual database password
   - Save and redeploy

## Alternative: Direct Connection (Not Recommended)
If you can't use the pooler, you can use the direct connection:
```
postgresql://postgres:[YOUR-PASSWORD]@db.jjgvsmuvkbhfkwcesrcw.supabase.co:5432/postgres
```
But this is **not recommended** for serverless/Vercel as it doesn't scale well.

## After Updating
1. Save the new `DATABASE_URL` in Vercel
2. Redeploy your application
3. The browse page should now work!

## Important Notes
- **Transaction Mode** (port 6543) is optimized for serverless/serverless functions
- **Session Mode** (port 5432) is for persistent connections (not suitable for Vercel)
- **Direct Connection** works but doesn't scale well for serverless
