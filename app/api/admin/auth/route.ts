import { NextRequest } from "next/server";
import { createSuccessResponse } from "@/lib/api-response";

// Simple auth - no password required for now
export async function POST(request: NextRequest) {
  // Always return authenticated - no password check
  return createSuccessResponse({ authenticated: true });
}

