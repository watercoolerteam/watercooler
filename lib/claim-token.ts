import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

/**
 * Generate a secure random token for email verification
 * Uses crypto.randomBytes for cryptographically secure randomness
 */
export function generateClaimToken(): string {
  // Generate 32 random bytes and convert to base64url (URL-safe)
  // This gives us a 43-character token that's safe to use in URLs
  return randomBytes(32).toString("base64url");
}

/**
 * Create a claim token for one or more startups
 * @param email - The founder's email address
 * @param startupIds - Array of startup IDs to claim
 * @param expiresInHours - How many hours until token expires (default: 24)
 * @returns The created token string
 */
export async function createClaimToken(
  email: string,
  startupIds: string[],
  expiresInHours: number = 24
): Promise<string> {
  if (startupIds.length === 0) {
    throw new Error("At least one startup ID is required");
  }

  // Generate unique token
  let token: string | undefined;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  // Ensure token is unique (very unlikely to collide, but safety first)
  while (!isUnique && attempts < maxAttempts) {
    token = generateClaimToken();
    const existing = await prisma.claimToken.findUnique({
      where: { token },
    });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique || !token) {
    throw new Error("Failed to generate unique token after multiple attempts");
  }

  // Calculate expiration time
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  // Create token and link to startups in a transaction
  const claimToken = await prisma.claimToken.create({
    data: {
      token,
      email,
      expiresAt,
      startups: {
        create: startupIds.map((startupId) => ({
          startupId,
        })),
      },
    },
  });

  return claimToken.token;
}

/**
 * Verify and retrieve a claim token
 * @param token - The token to verify
 * @returns Token data with linked startups, or null if invalid/expired/used
 */
export async function verifyClaimToken(token: string) {
  const claimToken = await prisma.claimToken.findUnique({
    where: { token },
    include: {
      startups: {
        include: {
          startup: {
            select: {
              id: true,
              name: true,
              slug: true,
              founderEmail: true,
              claimedBy: true, // Check if already claimed
            },
          },
        },
      },
    },
  });

  if (!claimToken) {
    return null; // Token doesn't exist
  }

  // Check if token has expired
  if (new Date() > claimToken.expiresAt) {
    return null; // Token expired
  }

  // Check if token has already been used
  if (claimToken.usedAt) {
    return null; // Token already used
  }

  // Check if any startups are already claimed
  const alreadyClaimed = claimToken.startups.some(
    (cts) => cts.startup.claimedBy !== null
  );

  if (alreadyClaimed) {
    return null; // One or more startups already claimed
  }

  return claimToken;
}

/**
 * Mark a token as used
 * @param tokenId - The ID of the token to mark as used
 */
export async function markTokenAsUsed(tokenId: string): Promise<void> {
  await prisma.claimToken.update({
    where: { id: tokenId },
    data: {
      usedAt: new Date(),
    },
  });
}

/**
 * Clean up expired tokens (can be run periodically)
 * This is optional but helps keep the database clean
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.claimToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(), // Less than current time = expired
      },
    },
  });

  return result.count;
}
