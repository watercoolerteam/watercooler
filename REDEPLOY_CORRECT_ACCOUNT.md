# 🔄 Redeploy to Correct Accounts

## Step 1: Verify GitHub Connection

Your GitHub remote is already set to:
```
https://github.com/watercoolerteam/watercooler.git
```

**Check if this repo exists and you have access:**
- Visit: https://github.com/watercoolerteam/watercooler
- If it doesn't exist, create it:
  1. Go to https://github.com/new
  2. Repository name: `watercooler`
  3. Owner: `watercoolerteam`
  4. Create repository

---

## Step 2: Push Code to GitHub

```bash
# Make sure you're on the right branch
git branch

# Add all changes
git add .

# Commit (if you have uncommitted changes)
git commit -m "Clean database and prepare for redeploy"

# Push to GitHub
git push -u origin main
```

If you get authentication errors, you may need to:
- Set up a GitHub Personal Access Token
- Or use SSH instead of HTTPS

---

## Step 3: Connect to Correct Vercel Account

1. **Log out of current Vercel CLI** (if logged in):
   ```bash
   npx vercel logout
   ```

2. **Log in to the correct Vercel account**:
   ```bash
   npx vercel login
   ```
   - This will open a browser
   - Make sure you're logged into the **watercooler** Vercel account (not the other one)

3. **Link to the correct project**:
   ```bash
   npx vercel link
   ```
   - It will ask if you want to link to an existing project or create a new one
   - Choose **"Link to existing project"** if you already have a watercooler project
   - Or **"Create new project"** if starting fresh

---

## Step 4: Add Environment Variables

Once linked, add all environment variables in Vercel:

1. Go to: https://vercel.com → Your Project → Settings → Environment Variables
2. Add these (same values as before):

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

## Step 5: Deploy

**Option A: Deploy via Vercel Dashboard (Easiest)**
1. Go to your Vercel project
2. Click **"Deployments"** tab
3. If GitHub is connected, push to GitHub and it auto-deploys
4. Or click **"Redeploy"** on the latest deployment

**Option B: Deploy via CLI**
```bash
npx vercel --prod
```

---

## Step 6: Connect Domain

Once deployed:
1. Go to Vercel → Settings → Domains
2. Add `watercooler.world`
3. Update DNS in Namecheap (if not already done)

---

## Troubleshooting

**"Repository not found" error?**
- Make sure the GitHub repo exists
- Check you have push access
- Verify the remote URL: `git remote -v`

**"Wrong Vercel account"?**
- Log out: `npx vercel logout`
- Log in again: `npx vercel login`
- Make sure you're in the right browser account

**Environment variables missing?**
- They need to be added in the new Vercel project
- Check all 7 variables are set
- Redeploy after adding them

