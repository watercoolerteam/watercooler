# Supabase Storage Setup Guide

## Why We Need This

For production deployment, we need to store images in the cloud instead of on the server. Supabase Storage is perfect because:
- ✅ You're already using Supabase
- ✅ Free tier available
- ✅ Includes CDN (fast image delivery)
- ✅ Works on any deployment platform

## Step-by-Step Setup (5 minutes)

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Click on your project: **Watercooler V1**
3. Go to **Settings** (gear icon in left sidebar)
4. Click **API** in the settings menu
5. You'll see two important values:
   - **Project URL** (looks like: `https://jjgvsmuvkbhfkwcesrcw.supabase.co`)
   - **anon public** key (a long string starting with `eyJ...`)

**Copy both of these** - you'll need them in Step 3.

### Step 2: Create Storage Bucket

1. In your Supabase dashboard, click **Storage** in the left sidebar
2. Click **New bucket** button
3. Fill in:
   - **Name**: `logos`
   - **Public bucket**: ✅ **Check this box** (important!)
   - **File size limit**: `5242880` (5MB in bytes)
   - **Allowed MIME types**: Leave empty (allows all image types)
4. Click **Create bucket**

### Step 3: Set Up Bucket Policies (Make it Public)

1. Still in Storage, click on the **logos** bucket you just created
2. Click the **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Give it a name: `Public Access`
6. In the policy SQL, paste this:

```sql
-- Allow anyone to read files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'logos' );

-- Allow authenticated users to upload (optional - for future use)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'logos' AND auth.role() = 'authenticated' );

-- Allow anyone to upload (for public submissions)
CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'logos' );
```

7. Click **Review** then **Save policy**

### Step 4: Add Environment Variables

Add these to your `.env` file (I'll help you with this):

```env
NEXT_PUBLIC_SUPABASE_URL=https://jjgvsmuvkbhfkwcesrcw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace `your-anon-key-here` with the actual anon key from Step 1.

### Step 5: Test It

1. Restart your dev server
2. Go to the submit form
3. Try uploading an image
4. Check if it works!

## Troubleshooting

**"Bucket not found" error?**
- Make sure the bucket name is exactly `logos`
- Make sure it's marked as **Public**

**"Permission denied" error?**
- Check that you created the policies in Step 3
- Make sure the bucket is public

**Images not showing?**
- Check the Supabase Storage dashboard - do you see the uploaded files?
- Verify the public URL is correct

## What Happens Next

Once this is set up:
- ✅ Images upload to Supabase Storage
- ✅ Images work in production
- ✅ Images are served via CDN (fast!)
- ✅ No server storage needed

The code automatically falls back to local storage if Supabase isn't configured, so your local development will still work!

