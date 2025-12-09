import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { ValidationError, handlePrismaError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { sanitizeString } from "@/lib/sanitize";

const profileSchema = z.object({
  name: z.string().max(100, "Name must be 100 characters or less").optional().or(z.literal("")).transform((val) => (val === "" ? null : val)),
});

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError("Invalid JSON in request body");
    }

    // Sanitize input
    const sanitizedBody: any = {
      name: body.name ? sanitizeString(body.name) : body.name,
    };

    // Process empty strings to null
    const processedBody: any = {
      ...sanitizedBody,
    };

    if (!processedBody.name || processedBody.name === "") {
      processedBody.name = null;
    }

    // Validate input
    const validatedData = profileSchema.parse(processedBody);

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: validatedData.name,
      },
    });

    return createSuccessResponse({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return createErrorResponse(
        new ValidationError(firstError.message),
        "Validation failed"
      );
    }
    return createErrorResponse(error, "Failed to update profile");
  }
}
