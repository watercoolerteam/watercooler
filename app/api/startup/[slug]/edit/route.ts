import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { ValidationError, NotFoundError, handlePrismaError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { sanitizeString, sanitizeUrl, sanitizeEmail } from "@/lib/sanitize";

const editSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  oneLiner: z.string().max(120, "One liner must be 120 characters or less").optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url("Valid website URL is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  founderNames: z.string().min(1, "Founder name(s) is required"),
  founderEmail: z.string().email("Valid email is required"),
  logo: z
    .union([
      z.string().url(),
      z.string().startsWith("/uploads/logos/"),
      z.literal(""),
      z.null(),
    ])
    .optional()
    .transform((val) => (val === "" ? null : val)),
  founderXLink: z.union([z.string().url(), z.literal("")]).optional().transform((val) => (val === "" ? null : val)),
  founderLinkedInLink: z.union([z.string().url(), z.literal("")]).optional().transform((val) => (val === "" ? null : val)),
  founderHighlight: z.string().optional().or(z.literal("")).transform((val) => (val === "" ? null : val)),
  companyStage: z.enum(["IDEA", "BUILDING", "PRIVATE_BETA", "LIVE"]).nullable().optional(),
  financialStage: z.enum(["BOOTSTRAPPED", "NOT_RAISING", "RAISING_SOON", "RAISING", "FUNDED"]).nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = await params;

    if (!slug) {
      throw new ValidationError("Slug is required");
    }

    // Get the startup
    const startup = await prisma.startup.findUnique({
      where: { slug },
    });

    if (!startup) {
      throw new NotFoundError("Startup");
    }

    // Check if user owns this startup
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || startup.claimedBy !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to edit this startup" },
        { status: 403 }
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
      name: sanitizeString(body.name),
      oneLiner: body.oneLiner ? sanitizeString(body.oneLiner) : body.oneLiner,
      description: sanitizeString(body.description),
      website: body.website,
      category: body.category ? sanitizeString(body.category) : body.category,
      location: body.location ? sanitizeString(body.location) : body.location,
      founderNames: body.founderNames ? sanitizeString(body.founderNames) : body.founderNames,
      founderEmail: body.founderEmail ? sanitizeEmail(body.founderEmail) : body.founderEmail,
      founderHighlight: body.founderHighlight ? sanitizeString(body.founderHighlight) : body.founderHighlight,
      founderXLink: body.founderXLink ? sanitizeUrl(body.founderXLink) : body.founderXLink,
      founderLinkedInLink: body.founderLinkedInLink ? sanitizeUrl(body.founderLinkedInLink) : body.founderLinkedInLink,
      logo: body.logo,
      companyStage: body.companyStage,
      financialStage: body.financialStage,
    };

    if (!sanitizedBody.founderEmail) {
      throw new ValidationError("Invalid email address");
    }

    // Process stage fields
    const processedBody: any = {
      ...sanitizedBody,
    };

    if (!processedBody.companyStage || processedBody.companyStage === "") {
      processedBody.companyStage = null;
    }
    if (!processedBody.financialStage || processedBody.financialStage === "") {
      processedBody.financialStage = null;
    }
    if (!processedBody.founderHighlight || processedBody.founderHighlight === "") {
      processedBody.founderHighlight = null;
    }

    // Validate input
    const validatedData = editSchema.parse(processedBody);

    // Update startup (don't update slug, status, views, or claim info)
    const updatedStartup = await prisma.startup.update({
      where: { id: startup.id },
      data: {
        name: validatedData.name,
        oneLiner: validatedData.oneLiner,
        description: validatedData.description,
        website: validatedData.website,
        category: validatedData.category,
        location: validatedData.location,
        founderNames: validatedData.founderNames,
        founderEmail: validatedData.founderEmail,
        founderHighlight: validatedData.founderHighlight,
        founderXLink: validatedData.founderXLink,
        founderLinkedInLink: validatedData.founderLinkedInLink,
        logo: validatedData.logo,
        companyStage: validatedData.companyStage,
        financialStage: validatedData.financialStage,
      },
    });

    return createSuccessResponse({ startup: updatedStartup });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return createErrorResponse(
        new ValidationError(firstError.message),
        "Validation failed"
      );
    }
    return createErrorResponse(error, "Failed to update startup");
  }
}
