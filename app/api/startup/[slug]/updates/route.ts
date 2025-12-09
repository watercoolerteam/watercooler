import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { ValidationError, NotFoundError, AppError, handlePrismaError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { sanitizeString } from "@/lib/sanitize";

const updateSchema = z.object({
  content: z.string().min(1, "Update content is required").max(1000, "Update content must be less than 1000 characters"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return createErrorResponse(
        new AppError("You must be signed in to post updates", 401),
        "You must be signed in to post updates"
      );
    }

    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Find startup
    const startup = await prisma.startup.findUnique({
      where: { slug },
      select: { id: true, claimedBy: true, status: true },
    });

    if (!startup || startup.status !== "APPROVED") {
      return createErrorResponse(new NotFoundError("Startup not found"), "Startup not found");
    }

    // Check ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || startup.claimedBy !== user.id) {
      return createErrorResponse(
        new AppError("You can only post updates for startups you own", 403),
        "You can only post updates for startups you own"
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError("Invalid JSON in request body");
    }

    let validatedData;
    try {
      validatedData = updateSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        throw new ValidationError(firstError.message);
      }
      throw error;
    }

    // Get the next update number
    const lastUpdate = await prisma.startupUpdate.findFirst({
      where: { startupId: startup.id },
      orderBy: { updateNumber: "desc" },
      select: { updateNumber: true },
    });

    const nextUpdateNumber = lastUpdate ? lastUpdate.updateNumber + 1 : 1;

    // Sanitize content
    const sanitizedContent = sanitizeString(validatedData.content);

    // Create update
    const update = await prisma.startupUpdate.create({
      data: {
        startupId: startup.id,
        content: sanitizedContent,
        updateNumber: nextUpdateNumber,
      },
      select: {
        id: true,
        content: true,
        updateNumber: true,
        createdAt: true,
      },
    });

    return createSuccessResponse({
      update,
      message: "Update posted successfully",
    });
  } catch (error) {
    console.error("Error posting startup update:", error);
    return createErrorResponse(error, "Failed to post update");
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Find startup
    const startup = await prisma.startup.findUnique({
      where: { slug },
      select: { id: true, status: true },
    });

    if (!startup || startup.status !== "APPROVED") {
      return createErrorResponse(new NotFoundError("Startup not found"), "Startup not found");
    }

    // Get updates
    const updates = await prisma.startupUpdate.findMany({
      where: { startupId: startup.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        updateNumber: true,
        createdAt: true,
      },
    });

    return createSuccessResponse({ updates });
  } catch (error) {
    console.error("Error fetching startup updates:", error);
    return createErrorResponse(error, "Failed to fetch updates");
  }
}
