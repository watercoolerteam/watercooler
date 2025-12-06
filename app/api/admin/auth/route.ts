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

    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set");
      return createErrorResponse(
        new Error("Admin authentication not configured"),
        "Admin authentication not configured"
      );
    }

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

