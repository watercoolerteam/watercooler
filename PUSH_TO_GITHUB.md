# 📤 Push Code to GitHub

## Option 1: Create Repo First (If Not Created)

1. Go to: https://github.com/new
2. Repository name: `watercooler`
3. Owner: `watercoolerteam`
4. Choose Private or Public
5. **IMPORTANT:** Don't check any boxes (no README, no .gitignore, no license)
6. Click "Create repository"

## Option 2: If Repo Already Exists

If the repo exists but you're getting authentication errors:

### Use Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Watercooler Deploy"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you'll only see it once!)

7. Update the remote with your token:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/watercoolerteam/watercooler.git
   git push -u origin main
   ```

### Or Use SSH (Alternative):

1. Set up SSH key (if you haven't):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Add to GitHub: Settings → SSH and GPG keys
   ```

2. Change remote to SSH:
   ```bash
   git remote set-url origin git@github.com:watercoolerteam/watercooler.git
   git push -u origin main
   ```

## Quick Test

After setting up, test with:
```bash
git ls-remote origin
```

If this works, the repo exists and you have access!

