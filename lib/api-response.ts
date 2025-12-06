import { NextResponse } from 'next/server';
import { AppError, getUserFriendlyError, logError } from './errors';

/**
 * Create a standardized API error response
 */
export function createErrorResponse(error: unknown, defaultMessage: string = 'An error occurred') {
  const friendlyError = getUserFriendlyError(error);
  const statusCode = error instanceof AppError ? error.statusCode : 500;

  // Log the error for debugging
  logError(error);

  return NextResponse.json(
    {
      error: friendlyError,
      ...(process.env.NODE_ENV === 'development' && error instanceof Error && {
        details: error.message,
        stack: error.stack,
      }),
    },
    { status: statusCode }
  );
}

/**
 * Create a standardized API success response
 */
export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(
    { success: true, ...data },
    { status }
  );
}

