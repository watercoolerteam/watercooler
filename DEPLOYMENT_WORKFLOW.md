# 🚀 Deployment Workflow

## Quick Deploy (Recommended)

### Step 1: Make Your Changes
Edit your code locally.

### Step 2: Commit & Push to GitHub
```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Your change description"

# Push to GitHub
git push origin main
```

### Step 3: Vercel Auto-Deploys! 🎉
- Vercel automatically detects the push
- Builds your app (takes 1-3 minutes)
- Deploys to production
- You'll get a notification when it's done

**Check deployment status:**
- Go to: https://vercel.com/joinarche-1951s-projects/watercooler
- Click "Deployments" tab to see build progress

---

## Manual Deploy (Alternative)

If you want to deploy without pushing to GitHub:

```bash
# Deploy directly from your local machine
npx vercel --prod
```

This will:
- Build your app
- Deploy to production
- Skip GitHub (useful for quick tests)

---

## Preview Deployments

Every push to GitHub also creates a **preview deployment**:
- Preview URL: `https://watercooler-xxx-joinarche-1951s-projects.vercel.app`
- Production URL: `https://watercooler-8tplmcbz8-joinarche-1951s-projects.vercel.app`

Preview deployments let you test changes before they go live!

---

## Environment Variables

**Important:** Environment variables are already set in Vercel. They apply to:
- ✅ Production deployments
- ✅ Preview deployments
- ✅ Development deployments

You don't need to re-add them for each deployment.

---

## Common Commands

```bash
# Check what changed
git status

# See deployment history
# Visit: https://vercel.com/joinarche-1951s-projects/watercooler/deployments

# View logs for a deployment
# Click on any deployment → "View Function Logs"
```

---

## Troubleshooting

**Deployment failed?**
1. Check the build logs in Vercel dashboard
2. Make sure all environment variables are set
3. Run `npm run build` locally to catch errors early

**Changes not showing?**
1. Wait 1-2 minutes for deployment to complete
2. Hard refresh your browser (Cmd+Shift+R / Ctrl+Shift+R)
3. Check that you pushed to the correct branch (usually `main`)

