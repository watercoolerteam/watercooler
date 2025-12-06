import { NextRequest, NextResponse } from "next/server";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import { ValidationError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      throw new ValidationError("Password is required");
    }

    // Hardcoded admin password
    const adminPassword = "admin123123";

    if (password === adminPassword) {
      return createSuccessResponse({ authenticated: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }
  } catch (error) {
    return createErrorResponse(error, "Authentication failed");
  }
}

