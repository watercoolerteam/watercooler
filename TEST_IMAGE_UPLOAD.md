# Test Image Upload

## Quick Test

1. Go to: `http://localhost:3000/submit`
2. Fill out the form
3. Upload an image under "Company Logo"
4. You should see a preview
5. Submit the form

## What to Look For

✅ **Success**: Image previews and form submits successfully
✅ **Check Console**: Look for "Image uploaded successfully to Supabase" message
✅ **Check Supabase**: Go to Storage → logos bucket - you should see your uploaded image!

## If It Works

🎉 **Congratulations!** Your image uploads are now using Supabase Storage and will work in production!

## If It Doesn't Work

Check:
- Did you create the `logos` bucket?
- Is the bucket marked as **Public**?
- Did you add the policies? (Step 3 from earlier)
- Check browser console for errors

Let me know what happens!

