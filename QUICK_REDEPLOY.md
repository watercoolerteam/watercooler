# 🚀 Quick Redeploy Steps

## Step 1: Create GitHub Repo (if it doesn't exist)

1. Go to: https://github.com/new
2. Repository name: `watercooler`
3. Owner: Select `watercoolerteam` (or your watercooler GitHub account)
4. Make it **Private** (recommended) or Public
5. **Don't** initialize with README, .gitignore, or license
6. Click **"Create repository"**

---

## Step 2: Push Code to GitHub

After creating the repo, run:

```bash
# If the repo is empty, push directly:
git push -u origin main

# If you get authentication errors, you may need to:
# - Use a Personal Access Token instead of password
# - Or switch to SSH: git remote set-url origin git@github.com:watercoolerteam/watercooler.git
```

---

## Step 3: Connect to Correct Vercel Account

1. **Log in to the correct Vercel account**:
   ```bash
   npx vercel login
   ```
   - Opens browser - make sure you're logged into the **watercooler** Vercel account

2. **Link to project**:
   ```bash
   npx vercel link
   ```
   - Choose **"Link to existing project"** if you have a watercooler project
   - Or **"Create new project"** if starting fresh
   - Select the correct team/account when prompted

---

## Step 4: Add Environment Variables in Vercel

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add all 7 variables (see REDEPLOY_CORRECT_ACCOUNT.md for the list)

---

## Step 5: Connect GitHub Repo in Vercel

1. Go to: Vercel Dashboard → Your Project → Settings → Git
2. Click **"Connect Git Repository"**
3. Select `watercoolerteam/watercooler`
4. This enables auto-deploy on push

---

## Step 6: Deploy

**Option A: Auto-deploy (after GitHub connection)**
- Just push to GitHub: `git push origin main`
- Vercel automatically deploys

**Option B: Manual deploy**
```bash
npx vercel --prod
```

---

## Step 7: Connect Domain

1. Vercel → Settings → Domains
2. Add `watercooler.world`
3. Update DNS in Namecheap (if needed)

---

**That's it!** Your site will be live on the correct accounts.

