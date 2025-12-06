import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ValidationError, NotFoundError, handlePrismaError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/email";

// GET - Fetch all startups for admin
export async function GET(request: NextRequest) {
  try {
    const startups = await prisma.startup.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        oneLiner: true,
        description: true,
        website: true,
        category: true,
        location: true,
        founderNames: true,
        founderEmail: true,
        status: true,
        createdAt: true,
      },
    });

    return createSuccessResponse({ startups });
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch startups");
  }
}

// PATCH - Update startup status (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError("Invalid JSON in request body");
    }

    const { id, status } = body;

    // Validate required fields
    if (!id || !status) {
      throw new ValidationError("Missing required fields: id and status");
    }

    // Validate status value
    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      throw new ValidationError("Invalid status. Must be APPROVED, REJECTED, or PENDING");
    }

    // Check if startup exists
    const existing = await prisma.startup.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("Startup");
    }

    // Update startup
    try {
      const startup = await prisma.startup.update({
        where: { id },
        data: { status },
      });

      // Send email notification based on status change
      if (status === "APPROVED" && existing.status !== "APPROVED") {
        // Only send if status changed to approved
        console.log(`Sending approval email to ${startup.founderEmail} for ${startup.name}`);
        const emailResult = await sendApprovalEmail(startup.founderEmail, startup.name, startup.slug);
        if (!emailResult.success) {
          console.error("Failed to send approval email:", emailResult.error);
          // Don't fail the request if email fails, but log it
        } else {
          console.log("Approval email sent successfully:", emailResult.id);
        }
      } else if (status === "REJECTED" && existing.status !== "REJECTED") {
        // Only send if status changed to rejected
        console.log(`Sending rejection email to ${startup.founderEmail} for ${startup.name}`);
        const emailResult = await sendRejectionEmail(startup.founderEmail, startup.name);
        if (!emailResult.success) {
          console.error("Failed to send rejection email:", emailResult.error);
          // Don't fail the request if email fails, but log it
        } else {
          console.log("Rejection email sent successfully:", emailResult.id);
        }
      }

      return createSuccessResponse({ startup });
    } catch (error) {
      throw handlePrismaError(error);
    }
  } catch (error) {
    return createErrorResponse(error, "Failed to update startup");
  }
}

