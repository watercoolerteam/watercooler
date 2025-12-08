# GitHub Authentication Setup for Git Push

## Option 1: Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "Watercooler Project"
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again)

2. **Use the token when pushing:**
   ```bash
   git push
   # When prompted for username: enter your GitHub username
   # When prompted for password: paste the token (not your GitHub password)
   ```

3. **Or configure Git to use the token:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/watercoolerteam/watercooler.git
   ```
   Replace `YOUR_TOKEN` with your actual token.

## Option 2: SSH Authentication (More Secure)

1. **Check if you have SSH keys:**
   ```bash
   ls -la ~/.ssh
   ```

2. **Generate SSH key if needed:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   # Press Enter to accept default location
   # Optionally set a passphrase
   ```

3. **Add SSH key to GitHub:**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the output
   ```
   - Go to GitHub.com → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your public key
   - Click "Add SSH key"

4. **Change remote to use SSH:**
   ```bash
   git remote set-url origin git@github.com:watercoolerteam/watercooler.git
   ```

5. **Test SSH connection:**
   ```bash
   ssh -T git@github.com
   # Should see: "Hi username! You've successfully authenticated..."
   ```

6. **Now you can push:**
   ```bash
   git push
   ```

## Option 3: GitHub CLI (Easiest)

1. **Install GitHub CLI:**
   ```bash
   brew install gh  # macOS
   # or download from: https://cli.github.com/
   ```

2. **Authenticate:**
   ```bash
   gh auth login
   # Follow the prompts
   ```

3. **Push:**
   ```bash
   git push
   ```

## Quick Fix: Use Token in URL (Temporary)

For a quick one-time push, you can embed the token in the URL:

```bash
git push https://YOUR_TOKEN@github.com/watercoolerteam/watercooler.git
```

**Note:** This is less secure but works for quick pushes. Consider using one of the methods above for long-term use.

