import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
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

