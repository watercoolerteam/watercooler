import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Rate limiting: 100 views per hour per IP per slug
    // This prevents view count manipulation
    const clientIP = getClientIP(request);
    const rateLimitKey = `${clientIP}:${slug}`;
    const rateLimit = checkRateLimit(rateLimitKey, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 100, // Max 100 views per hour per IP per startup
    });

    // If rate limited, still return success but don't increment
    // This prevents abuse while not breaking the user experience
    if (!rateLimit.allowed) {
      // Get current view count without incrementing
      const startup = await prisma.startup.findUnique({
        where: { slug },
        select: { views: true },
      });
      return createSuccessResponse({ views: startup?.views || 0 });
    }

    // Increment view count
    const startup = await prisma.startup.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        views: true,
      },
    });

    return createSuccessResponse({ views: startup.views });
  } catch (error) {
    console.error("Error tracking view:", error);
    // Don't fail the request if view tracking fails
    return createSuccessResponse({ views: 0 });
  }
}

