import { NextRequest } from "next/server";
import sharp from "sharp";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 10 uploads per hour per IP
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10,
    });

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new ValidationError(
          `Too many uploads. Please try again after ${new Date(rateLimit.resetAt).toLocaleTimeString()}`
        ),
        "Rate limit exceeded"
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw new ValidationError("No file provided");
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ValidationError(
        `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(", ")}`
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Process image: resize to max 800x800, maintain aspect ratio, convert to WebP
    const processedBuffer = await sharp(buffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `logo_${timestamp}_${randomString}.webp`;

    // Upload to Supabase Storage if available, otherwise fall back to local storage
    if (supabase) {
      try {
        console.log('Attempting to upload to Supabase Storage...');
        console.log('Bucket: logos, Filename:', filename);
        
        const { data, error } = await supabase.storage
          .from('logos')
          .upload(filename, processedBuffer, {
            contentType: 'image/webp',
            upsert: false,
          });

        if (error) {
          console.error('❌ Supabase upload error:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          // Don't throw - fall back to local storage
          console.log('Falling back to local storage...');
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('logos')
            .getPublicUrl(filename);

          const publicUrl = urlData.publicUrl;

          console.log(`✅ Image uploaded successfully to Supabase: ${publicUrl}`);

          return createSuccessResponse({ url: publicUrl, filename });
        }
      } catch (error) {
        console.error('❌ Error uploading to Supabase:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        // Fall through to local storage if Supabase fails
        console.log('Falling back to local storage...');
      }
    } else {
      console.warn('⚠️ Supabase client not initialized. Using local storage.');
    }

    // Fallback to local storage (for development or if Supabase not configured)
    const { writeFile, mkdir } = await import("fs/promises");
    const { join } = await import("path");
    const { existsSync } = await import("fs");

    const uploadsDir = join(process.cwd(), "public", "uploads", "logos");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, processedBuffer);

    const publicUrl = `/uploads/logos/${filename}`;
    console.log(`✅ Image uploaded successfully (local): ${publicUrl}`);

    return createSuccessResponse({ url: publicUrl, filename });
  } catch (error) {
    console.error("Error uploading image:", error);
    return createErrorResponse(error, "Failed to upload image");
  }
}
