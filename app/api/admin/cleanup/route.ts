import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";

/**
 * One-time cleanup endpoint to delete all startups
 * WARNING: This deletes ALL startups in the database
 * 
 * To use:
 * 1. Visit: https://your-domain.com/api/admin/cleanup?confirm=true
 * 2. Or call with: DELETE /api/admin/cleanup?confirm=true
 * 
 * After cleanup, DELETE THIS FILE for security
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirm = searchParams.get("confirm");

    if (confirm !== "true") {
      return NextResponse.json(
        { 
          error: "Safety check: Add ?confirm=true to the URL to confirm deletion",
          warning: "This will delete ALL startups in the database"
        },
        { status: 400 }
      );
    }

    // Get count before deletion
    const count = await prisma.startup.count();
    
    if (count === 0) {
      return createSuccessResponse({ 
        message: "Database is already empty",
        deleted: 0 
      });
    }

    // Delete all startups
    const result = await prisma.startup.deleteMany({});

    return createSuccessResponse({
      message: `Successfully deleted ${result.count} startup(s)`,
      deleted: result.count,
      note: "You can now submit new startups through the form"
    });
  } catch (error) {
    console.error("Error during cleanup:", error);
    return createErrorResponse(error, "Failed to cleanup database");
  }
}

// Also support GET for easy browser access
export async function GET(request: NextRequest) {
  return DELETE(request);
}

