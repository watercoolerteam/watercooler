# Check Your Supabase Storage Bucket

## Quick Checklist

The image upload is falling back to local storage, which means Supabase Storage isn't working. Let's verify:

### 1. Check Bucket Exists

1. Go to Supabase Dashboard → **Storage**
2. Do you see a bucket named **`logos`**?
   - ✅ If YES → Continue to Step 2
   - ❌ If NO → Create it (name: `logos`, make it **Public**)

### 2. Check Bucket is Public

1. Click on the **`logos`** bucket
2. Look at the bucket settings
3. Is **"Public bucket"** checked?
   - ✅ If YES → Continue to Step 3
   - ❌ If NO → Edit bucket → Check "Public bucket" → Save

### 3. Check Policies

1. Still in the **`logos`** bucket, click **Policies** tab
2. Do you see policies listed?
   - ✅ If YES → Continue
   - ❌ If NO → You need to add policies (see below)

### 4. Add Policies (If Missing)

1. Click **New Policy**
2. Click **For full customization**
3. Name: `Public Access`
4. Paste this SQL:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'logos' );

CREATE POLICY "Anyone can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'logos' );
```

5. Click **Review** → **Save policy**

## Test Again

After checking/fixing the above:
1. Restart your dev server (I'll do this)
2. Try uploading an image again
3. Check the server terminal for error messages
4. Check Supabase Storage → logos bucket for the uploaded file

Let me know what you find!

