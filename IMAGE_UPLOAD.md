# Image Upload Feature

## Overview
The submission form now supports direct image uploads instead of requiring logo URLs. Images are automatically optimized and stored locally.

## Features

### ✅ What's Included
- **File Upload**: Direct image upload via file input
- **Image Preview**: See your logo before submitting
- **Automatic Optimization**: Images are resized to max 800x800px and converted to WebP format
- **File Validation**: 
  - Allowed types: JPEG, PNG, WebP, GIF
  - Max file size: 5MB
- **Error Handling**: Clear error messages for invalid files

### 📁 Storage
- Images are stored in: `public/uploads/logos/`
- Files are automatically named with timestamps to prevent conflicts
- Images are converted to WebP for better compression and performance

### 🔒 Security
- File type validation (only images allowed)
- File size limits (5MB max)
- Automatic image processing to prevent malicious files
- Uploaded files are excluded from git (see `.gitignore`)

## How It Works

1. **User selects image** → File input accepts image files
2. **Preview shown** → User sees thumbnail immediately
3. **Auto-upload** → Image is uploaded to `/api/upload` when selected
4. **Optimization** → Image is resized and converted to WebP
5. **Submission** → Logo URL is included in startup submission

## API Endpoint

### `POST /api/upload`
- Accepts: `multipart/form-data` with `file` field
- Returns: `{ success: true, data: { url: string, filename: string } }`
- Validates file type and size
- Processes image with Sharp library
- Stores in `public/uploads/logos/`

## Production Considerations

### Current Setup (Local Storage)
- ✅ Simple and works immediately
- ✅ No additional services needed
- ⚠️ Files stored on server filesystem
- ⚠️ Not ideal for serverless/horizontal scaling

### Recommended for Production
For production, consider using cloud storage:

1. **AWS S3** + CloudFront
2. **Cloudinary** (image CDN with optimization)
3. **Vercel Blob Storage** (if deploying on Vercel)
4. **Supabase Storage** (since you're using Supabase)

### Migration Path
If you want to switch to cloud storage later:
1. Update `/api/upload/route.ts` to upload to cloud service
2. Return cloud URL instead of local path
3. Existing logo URLs in database will continue to work
4. No changes needed to frontend or database schema

## Testing

To test the upload:
1. Go to `/submit`
2. Fill out the form
3. Click "Choose File" under "Company Logo"
4. Select an image file
5. You should see a preview
6. Submit the form
7. Check `public/uploads/logos/` for the uploaded file

## Troubleshooting

**Image not uploading?**
- Check file size (must be < 5MB)
- Check file type (JPEG, PNG, WebP, GIF only)
- Check server logs for errors
- Ensure `public/uploads/logos/` directory exists

**Image not displaying?**
- Check that image URL starts with `/uploads/logos/`
- Verify file exists in `public/uploads/logos/`
- Check browser console for 404 errors

**Build errors?**
- Ensure `sharp` is installed: `npm install sharp`
- Check that uploads directory exists

