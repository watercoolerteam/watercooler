# 🚀 Vercel Setup Checklist

## Step 1: Choose or Create Project

You have 3 projects visible. Choose one:
- **watercoolerworld** (recommended - matches your domain)
- **watercoolerv1**
- **watercooler**

Or create a new one by clicking "Add New..." → "Project"

---

## Step 2: Verify GitHub Connection

1. Click on your chosen project
2. Go to **Settings** → **Git**
3. Verify it's connected to: `watercoolerteam/watercooler`
4. If not connected, click **"Connect Git Repository"** and select it

---

## Step 3: Add Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add these 7 variables (check all: Production, Preview, Development):

```
DATABASE_URL
postgresql://postgres.jjgvsmuvkbhfkwcesrcw:WW88Lneq!!@aws-0-us-west-2.pooler.supabase.com:5432/postgres

NEXT_PUBLIC_SITE_URL
https://watercooler.world

ADMIN_PASSWORD
[your admin password]

RESEND_API_KEY
re_3x5NqYft_3UDF2sTEN6r43y9S6Fn4sLwe

EMAIL_FROM
Watercooler <onboarding@resend.dev>

NEXT_PUBLIC_SUPABASE_URL
https://jjgvsmuvkbhfkwcesrcw.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqZ3ZzbXV2a2JoZmt3Y2VzcmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5ODM3MjAsImV4cCI6MjA4MDU1OTcyMH0.w7bpFzwjoZFdqzyL9VNldfOOrwtft0vKZ08L_dGlysU
```

---

## Step 4: Connect Domain

1. Go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `watercooler.world`
4. Select **"Connect to an environment"** → **"Production"**
5. Click **"Save"**
6. Vercel will show DNS records - update them in Namecheap (if not already done)

---

## Step 5: Deploy

If GitHub is connected, it should auto-deploy. Or:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment
3. Wait 2-3 minutes

---

## Step 6: Test

1. Visit: `https://watercooler.world`
2. Test submission form
3. Test admin panel
4. Check emails are sending

---

**That's it!** Your site should be live. 🎉

