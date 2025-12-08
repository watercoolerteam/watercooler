import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ValidationError, NotFoundError, handlePrismaError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { verifyClaimToken, markTokenAsUsed } from "@/lib/claim-token";

export async function GET(request: NextRequest) {
  try {
    // Get token from query parameters
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      throw new ValidationError("Token is required");
    }

    // Verify the token
    const claimToken = await verifyClaimToken(token);

    if (!claimToken) {
      throw new NotFoundError(
        "Invalid or expired token. Please request a new claim link."
      );
    }

    // Get or create user account
    let user = await prisma.user.findUnique({
      where: { email: claimToken.email },
    });

    if (!user) {
      // Create new user account
      user = await prisma.user.create({
        data: {
          email: claimToken.email,
          name: claimToken.email.split("@")[0], // Default name from email
        },
      });
    }

    // Link all startups to the user account
    const startupIds = claimToken.startups.map((cts) => cts.startupId);
    
    await prisma.startup.updateMany({
      where: {
        id: { in: startupIds },
      },
      data: {
        claimedBy: user.id,
        claimedAt: new Date(),
      },
    });

    // Mark token as used
    await markTokenAsUsed(claimToken.id);

    // Get the claimed startups for the response
    const claimedStartups = await prisma.startup.findMany({
      where: {
        id: { in: startupIds },
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return createSuccessResponse({
      message: "Startups successfully claimed!",
      user: {
        id: user.id,
        email: user.email,
      },
      startups: claimedStartups,
    });
  } catch (error) {
    return createErrorResponse(error, "Failed to verify claim token");
  }
}
