import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { ValidationError, NotFoundError, handlePrismaError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { sendClaimEmail } from "@/lib/email";

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

    // Find startups for this email
    try {
      const startups = await prisma.startup.findMany({
        where: {
          founderEmail: validatedData.email,
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

      // Send claim email
      const emailResult = await sendClaimEmail(
        validatedData.email,
        startups.map((s) => ({ name: s.name, slug: s.slug }))
      );

      if (!emailResult.success) {
        console.error("Failed to send claim email:", emailResult.error);
        // Still return success - email failure shouldn't block the request
      }

      return createSuccessResponse({
        message: "Claim verification email sent! Please check your inbox.",
        startups: startups.map((s) => ({ name: s.name, slug: s.slug })),
      });
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw handlePrismaError(error);
    }
  } catch (error) {
    return createErrorResponse(error, "Failed to process claim request");
  }
}
