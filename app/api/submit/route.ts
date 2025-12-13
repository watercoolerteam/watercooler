import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import slugify from "slugify";
import { z } from "zod";
import { ValidationError, handlePrismaError } from "@/lib/errors";
import { createErrorResponse, createSuccessResponse } from "@/lib/api-response";
import { sendSubmissionConfirmationEmail } from "@/lib/email";
import { Prisma } from "@prisma/client";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { sanitizeString, sanitizeUrl, sanitizeEmail } from "@/lib/sanitize";

const founderSchema = z.object({
  name: z.string().min(1, "Founder name is required"),
  email: z.string().email("Valid email is required").nullable().optional(),
  highlight: z.string().nullable().optional(),
  xLink: z.union([z.string().url(), z.literal("")]).nullable().optional().transform((val) => (val === "" ? null : val)),
  linkedInLink: z.union([z.string().url(), z.literal("")]).nullable().optional().transform((val) => (val === "" ? null : val)),
});

const submitSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  oneLiner: z.string().max(120, "One liner must be 120 characters or less").optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  website: z.string().url("Valid website URL is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  founderNames: z.string().min(1, "Founder name(s) is required"), // For backwards compatibility
  founderEmail: z.string().email("Valid email is required"), // For backwards compatibility
  founders: z.array(founderSchema).optional(), // New multiple founders support
  // Logo can be: full URL, relative path starting with /uploads/logos/, empty string, or null
  logo: z
    .union([
      z.string().url(), // Full URL (for backwards compatibility)
      z.string().startsWith("/uploads/logos/"), // Relative path from upload
      z.literal(""), // Empty string
      z.null(), // Null value
    ])
    .optional()
    .transform((val) => (val === "" ? null : val)), // Convert empty strings to null
  founderXLink: z.union([z.string().url(), z.literal("")]).optional().transform((val) => (val === "" ? null : val)),
  founderLinkedInLink: z.union([z.string().url(), z.literal("")]).optional().transform((val) => (val === "" ? null : val)),
  founderHighlight: z.string().optional().or(z.literal("")).transform((val) => (val === "" ? null : val)),
  companyStage: z.enum(["IDEA", "BUILDING", "PRIVATE_BETA", "LIVE"]).nullable().optional(),
  financialStage: z.enum(["BOOTSTRAPPED", "NOT_RAISING", "RAISING_SOON", "RAISING", "FUNDED"]).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 5 submissions per hour per IP
    const clientIP = getClientIP(request);
    const rateLimit = checkRateLimit(clientIP, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 5,
    });

    if (!rateLimit.allowed) {
      return createErrorResponse(
        new ValidationError(
          `Too many submissions. Please try again after ${new Date(rateLimit.resetAt).toLocaleTimeString()}`
        ),
        "Rate limit exceeded"
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError("Invalid JSON in request body");
    }

    // Sanitize string inputs to prevent XSS
    const sanitizedBody: any = {
      name: body.name ? sanitizeString(body.name) : body.name,
      oneLiner: body.oneLiner ? sanitizeString(body.oneLiner) : body.oneLiner,
      description: body.description ? sanitizeString(body.description) : body.description,
      website: body.website ? sanitizeUrl(body.website) : body.website,
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

    // Validate email was sanitized correctly
    if (!sanitizedBody.founderEmail) {
      throw new ValidationError("Invalid email address");
    }

    // Pre-process: ensure stage fields and optional text fields are either valid enum values or explicitly null
    const processedBody: any = {
      ...sanitizedBody,
    };
    
    // Handle stage fields - convert empty strings, undefined, or null to null explicitly
    if (!processedBody.companyStage || processedBody.companyStage === "") {
      processedBody.companyStage = null;
    }
    if (!processedBody.financialStage || processedBody.financialStage === "") {
      processedBody.financialStage = null;
    }
    if (!processedBody.founderHighlight || processedBody.founderHighlight === "") {
      processedBody.founderHighlight = null;
    }

    console.log("=== SUBMIT REQUEST ===");
    console.log("Raw body keys:", Object.keys(body));
    console.log("Processed body:", JSON.stringify(processedBody, null, 2));
    console.log("CompanyStage:", processedBody.companyStage, "Type:", typeof processedBody.companyStage);
    console.log("FinancialStage:", processedBody.financialStage, "Type:", typeof processedBody.financialStage);

    // Validate input
    let validatedData;
    try {
      validatedData = submitSchema.parse(processedBody);
      console.log("✅ Validation passed");
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("=== VALIDATION ERROR ===");
        console.error("All errors:", JSON.stringify(error.errors, null, 2));
        console.error("Processed body:", JSON.stringify(processedBody, null, 2));
        
        // Get the first error with more context
        const firstError = error.errors[0];
        const errorMessage = `${firstError.path.join('.')}: ${firstError.message}`;
        console.error("First error:", errorMessage);
        throw new ValidationError(errorMessage);
      }
      throw error;
    }

    // Generate unique slug
    const baseSlug = slugify(validatedData.name, { lower: true, strict: true });
    if (!baseSlug) {
      throw new ValidationError("Company name must contain valid characters for URL");
    }

    let slug = baseSlug;
    let counter = 1;
    const maxAttempts = 100; // Prevent infinite loop

    while (counter < maxAttempts) {
      const existing = await prisma.startup.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    if (counter >= maxAttempts) {
      throw new ValidationError("Unable to generate unique URL. Please try a different company name.");
    }

    // Check for duplicate submissions (same email + similar name)
    // This prevents the same person from submitting the same startup multiple times
    const existingByEmail = await prisma.startup.findFirst({
      where: {
        founderEmail: validatedData.founderEmail,
        name: {
          equals: validatedData.name,
          mode: "insensitive",
        },
      },
    });

    if (existingByEmail) {
      if (existingByEmail.status === "PENDING") {
        throw new ValidationError(
          "You already have a pending submission for this startup. Please wait for approval."
        );
      } else if (existingByEmail.status === "APPROVED") {
        throw new ValidationError(
          "This startup has already been submitted and approved. If you need to make changes, please claim your startup page."
        );
      }
    }

    // Also check for similar names (fuzzy duplicate detection)
    // This catches cases where someone tries to submit "My Startup" and "My Startup Inc"
    const similarName = await prisma.startup.findFirst({
      where: {
        name: {
          contains: validatedData.name.substring(0, Math.min(20, validatedData.name.length)),
          mode: "insensitive",
        },
        founderEmail: validatedData.founderEmail,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
    });

    if (similarName && similarName.id) {
      // Only flag if names are very similar (more than 80% match)
      const name1 = validatedData.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const name2 = similarName.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const similarity = name1.length > 0 && name2.length > 0 
        ? (name1.includes(name2.substring(0, Math.min(10, name2.length))) || 
           name2.includes(name1.substring(0, Math.min(10, name1.length))))
        : false;

      if (similarity) {
        throw new ValidationError(
          "A similar startup has already been submitted with this email. Please check your existing submissions."
        );
      }
    }

    // Create startup
    try {
      // Build Prisma data object - use validatedData directly with minimal transformation
      // Prisma will validate the types match the schema
      const prismaData: Prisma.StartupCreateInput = {
        name: validatedData.name,
        slug: slug,
        description: validatedData.description,
        founderNames: validatedData.founderNames,
        founderEmail: validatedData.founderEmail,
        status: "PENDING",
        oneLiner: validatedData.oneLiner ?? null,
        website: validatedData.website ?? null,
        category: validatedData.category ?? null,
        location: validatedData.location ?? null,
        founderHighlight: validatedData.founderHighlight ?? null,
        logo: validatedData.logo ?? null,
        founderXLink: validatedData.founderXLink ?? null,
        founderLinkedInLink: validatedData.founderLinkedInLink ?? null,
        companyStage: validatedData.companyStage ?? null,
        financialStage: validatedData.financialStage ?? null,
      };
      
      // Add founders if provided
      if (validatedData.founders && validatedData.founders.length > 0) {
        prismaData.founders = {
          create: validatedData.founders.map((founder, index) => ({
            name: sanitizeString(founder.name),
            email: founder.email ? sanitizeEmail(founder.email) : null,
            highlight: founder.highlight ? sanitizeString(founder.highlight) : null,
            xLink: founder.xLink ? sanitizeUrl(founder.xLink) : null,
            linkedInLink: founder.linkedInLink ? sanitizeUrl(founder.linkedInLink) : null,
            order: index,
          })),
        };
      }
      
      console.log("=== PRISMA CREATE DATA ===");
      console.log(JSON.stringify(prismaData, null, 2));
      console.log("Data types:", {
        name: typeof prismaData.name,
        slug: typeof prismaData.slug,
        oneLiner: typeof prismaData.oneLiner,
        description: typeof prismaData.description,
        website: typeof prismaData.website,
        category: typeof prismaData.category,
        location: typeof prismaData.location,
        founderNames: typeof prismaData.founderNames,
        founderEmail: typeof prismaData.founderEmail,
        founderHighlight: typeof prismaData.founderHighlight,
        logo: typeof prismaData.logo,
        founderXLink: typeof prismaData.founderXLink,
        founderLinkedInLink: typeof prismaData.founderLinkedInLink,
        companyStage: typeof prismaData.companyStage,
        financialStage: typeof prismaData.financialStage,
        status: typeof prismaData.status,
      });
      
      // Remove any undefined values before sending to Prisma (Prisma doesn't accept undefined)
      const cleanData = Object.fromEntries(
        Object.entries(prismaData).filter(([_, value]) => value !== undefined)
      ) as Prisma.StartupCreateInput;
      
      console.log("=== CLEANED PRISMA DATA (no undefined values) ===");
      console.log(JSON.stringify(cleanData, null, 2));
      
      const startup = await prisma.startup.create({
        data: cleanData,
        include: {
          founders: true,
        },
      });
      
      console.log("✅ Startup created successfully:", startup.id);
      console.log(`✅ Created ${startup.founders.length} founder(s)`);

      // Send confirmation email
      console.log(`Sending submission confirmation email to ${startup.founderEmail}`);
      const emailResult = await sendSubmissionConfirmationEmail(
        startup.founderEmail,
        startup.founderNames,
        startup.name
      );
      
      if (!emailResult.success) {
        console.error("Failed to send submission confirmation email:", emailResult.error);
        // Don't fail the request if email fails - submission was successful
      } else {
        console.log("Submission confirmation email sent successfully:", emailResult.id);
      }

      return createSuccessResponse({ id: startup.id }, 201);
    } catch (error) {
      console.error("=== PRISMA ERROR ===");
      console.error("Error type:", error?.constructor?.name);
      console.error("Error name:", error instanceof Error ? error.name : 'Unknown');
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      
      // Log the full error with all properties
      if (error instanceof Error) {
        console.error("Error stack:", error.stack);
        // Try to get Prisma-specific error details
        if ('code' in error) {
          console.error("Prisma error code:", (error as any).code);
        }
        if ('meta' in error) {
          console.error("Prisma meta:", JSON.stringify((error as any).meta, null, 2));
        }
        if ('clientVersion' in error) {
          console.error("Prisma client version:", (error as any).clientVersion);
        }
      }
      
      console.error("Full error object:", error);
      throw handlePrismaError(error);
    }
  } catch (error) {
    return createErrorResponse(error, "Failed to submit startup");
  }
}
