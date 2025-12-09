# Google OAuth Setup Guide

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console:**
   - Visit https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project (or select existing):**
   - Click the project dropdown at the top
   - Click "New Project"
   - Name it "Watercooler" (or your preferred name)
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity"
   - Click on it and click "Enable"

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External (unless you have Google Workspace)
     - App name: "Watercooler"
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Scopes: Just click "Save and Continue" (default is fine)
     - Test users: Add your email for testing
     - Click "Save and Continue" > "Back to Dashboard"

5. **Create OAuth Client:**
   - Application type: "Web application"
   - Name: "Watercooler Web"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "Create"
   - **Copy your Client ID and Client Secret**

## Step 2: Add Environment Variables

Add these to your `.env` file:

```env
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

## Step 3: Add to Production (Vercel)

1. Go to your Vercel project dashboard
2. Go to Settings > Environment Variables
3. Add:
   - `GOOGLE_CLIENT_ID` = Your Google Client ID
   - `GOOGLE_CLIENT_SECRET` = Your Google Client Secret
4. Redeploy your application

## Testing

1. Start your dev server: `npm run dev`
2. Go to `/auth/signin` or `/auth/signup`
3. Click "Continue with Google"
4. You should be redirected to Google sign-in
5. After signing in, you'll be redirected back to your dashboard

## Troubleshooting

**"redirect_uri_mismatch" error:**
- Make sure the redirect URI in Google Console exactly matches:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://yourdomain.com/api/auth/callback/google`

**"access_denied" error:**
- Make sure you added your email as a test user in OAuth consent screen
- Or publish your app (for production use)

**Not redirecting after sign-in:**
- Check that `AUTH_URL` is set correctly in your environment variables
- Should be `https://yourdomain.com` for production
