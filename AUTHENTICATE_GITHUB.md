# 🔐 Authenticate GitHub for Private Repo

## Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Watercooler Deploy`
4. Set expiration: `90 days` (or your preference)
5. Select scopes: Check **`repo`** (this gives full control of private repositories)
6. Scroll down and click **"Generate token"**
7. **COPY THE TOKEN IMMEDIATELY** - you won't see it again!
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Use Token to Push

Once you have the token, I'll help you push. The token will be embedded in the git URL temporarily.

**Security Note:** The token will be stored in your git config, but only locally. For production, consider using SSH keys or GitHub CLI.

## Alternative: Make Repo Public (Easier)

If you don't mind making it public:
1. Go to: https://github.com/watercoolerteam/watercooler/settings
2. Scroll to "Danger Zone"
3. Click "Change visibility" → "Make public"
4. Then we can push without authentication

---

**Which do you prefer?**
- Option A: Create Personal Access Token (keeps repo private)
- Option B: Make repo public (easier, no token needed)

