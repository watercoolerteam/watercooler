import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ValidationError, NotFoundError, handlePrismaError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { sendClaimEmail } from "@/lib/email";
import { createClaimToken } from "@/lib/claim-token";

const claimSchema = z.object({
  email: z.string().email("Valid email is required"),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError("Invalid JSON in request body");
    }

    // Validate input
    let validatedData;
    try {
      validatedData = claimSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        throw new ValidationError(firstError.message);
      }
      throw error;
    }

    // Normalize email to lowercase to match how emails are stored (via sanitizeEmail)
    const normalizedEmail = validatedData.email.toLowerCase().trim();

    // Find startups for this email
    try {
      const startups = await prisma.startup.findMany({
        where: {
          founderEmail: normalizedEmail,
          status: "APPROVED",
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      if (startups.length === 0) {
        throw new NotFoundError("No approved startups found for this email address");
      }

      // Get full startup records to check claim status
      const fullStartups = await prisma.startup.findMany({
        where: {
          id: { in: startups.map((s) => s.id) },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          claimedBy: true,
        },
      });

      // Filter out already claimed startups
      const unclaimedStartups = fullStartups.filter((s) => !s.claimedBy);

      if (unclaimedStartups.length === 0) {
        throw new ValidationError(
          "All startups associated with this email have already been claimed."
        );
      }

      // Generate claim token
      let token: string;
      try {
        token = await createClaimToken(
          normalizedEmail,
          unclaimedStartups.map((s) => s.id),
          24 // 24 hour expiration
        );
      } catch (error) {
        console.error("Error creating claim token:", error);
        throw new ValidationError("Failed to generate claim token. Please try again.");
      }

      // Send claim email with verification link
      const emailResult = await sendClaimEmail(
        normalizedEmail,
        unclaimedStartups.map((s) => ({ name: s.name, slug: s.slug })),
        token
      );

      if (!emailResult.success) {
        console.error("Failed to send claim email:", emailResult.error);
        // Still return success - email failure shouldn't block the request
        // But log it for debugging
      }

      return createSuccessResponse({
        message: "Claim verification email sent! Please check your inbox.",
        startups: unclaimedStartups.map((s) => ({ name: s.name, slug: s.slug })),
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  } catch (error) {
    // Log the full error for debugging
    console.error("Claim API error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return createErrorResponse(error, "Failed to process claim request");
  }
}
