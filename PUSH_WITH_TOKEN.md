# 🔑 Push with Personal Access Token

Since your SSH key is already in use, let's use a Personal Access Token:

## Step 1: Create Token

1. Go to: https://github.com/settings/tokens (logged in as `watercoolerteam`)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `Watercooler Deploy`
4. Expiration: `90 days` (or your preference)
5. Check **`repo`** scope (full control of private repositories)
6. Click **"Generate token"**
7. **Copy the token immediately** (starts with `ghp_`)

## Step 2: Push with Token

Once you have the token, run:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/watercoolerteam/watercooler.git
git push -u origin main
```

Replace `YOUR_TOKEN` with your actual token.

**Note:** The token will be stored in your git config. For security, you can remove it after pushing by running:
```bash
git remote set-url origin https://github.com/watercoolerteam/watercooler.git
```

