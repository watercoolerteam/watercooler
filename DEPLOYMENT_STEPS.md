# 🚀 Simple Deployment Steps

## Part 1: Set Up Supabase Storage (5 minutes)

This lets images work in production. Follow these steps:

### Step 1: Get Your Supabase Info

1. Go to: https://supabase.com/dashboard
2. Click your project: **Watercooler V1**
3. Click **Settings** (⚙️ icon on left)
4. Click **API**
5. You'll see:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string)
6. **Copy both** - you'll need them!

### Step 2: Create Storage Bucket

1. In Supabase dashboard, click **Storage** (left sidebar)
2. Click **New bucket**
3. Fill in:
   - Name: `logos`
   - ✅ Check **Public bucket**
   - File size limit: `5242880`
4. Click **Create bucket**

### Step 3: Make It Public

1. Click on the **logos** bucket you just created
2. Click **Policies** tab
3. Click **New Policy**
4. Click **For full customization**
5. Name: `Public Access`
6. Paste this code in the policy box:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'logos' );

CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'logos' );
```

7. Click **Review** → **Save policy**

### Step 4: Add to Your .env File

Tell me when you've completed Steps 1-3, and I'll help you add the environment variables!

---

## Part 2: Deploy to Vercel (Easiest Option)

### Step 1: Push to GitHub

1. If you haven't already, create a GitHub account
2. Create a new repository
3. Push your code (I can help with this if needed)

### Step 2: Connect to Vercel

1. Go to: https://vercel.com
2. Sign up/login (use GitHub)
3. Click **Add New Project**
4. Import your GitHub repository
5. Vercel will detect it's Next.js automatically

### Step 3: Set Environment Variables

In Vercel, add these environment variables:

```
DATABASE_URL=postgresql://postgres.jjgvsmuvkbhfkwcesrcw:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres

NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app

NEXT_PUBLIC_ADMIN_PASSWORD=your-strong-password

RESEND_API_KEY=re_3x5NqYft_3UDF2sTEN6r43y9S6Fn4sLwe

EMAIL_FROM=Watercooler <onboarding@resend.dev>

NEXT_PUBLIC_SUPABASE_URL=https://jjgvsmuvkbhfkwcesrcw.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-step-1
```

### Step 4: Deploy!

1. Click **Deploy**
2. Wait 2-3 minutes
3. Your site will be live! 🎉

---

## What I've Already Done For You

✅ Updated code to use Supabase Storage  
✅ Added fallback to local storage (works in development)  
✅ Fixed all build errors  
✅ Created all necessary files  
✅ Production build passes  

## What You Need To Do

1. ✅ Set up Supabase Storage (Steps 1-3 above)
2. ✅ Add environment variables (I'll help)
3. ✅ Deploy to Vercel (or your preferred platform)

## Need Help?

Just tell me:
- "I completed Step 1" → I'll help with the next step
- "I'm stuck on..." → I'll guide you through it
- "Ready to deploy" → I'll help you deploy!

