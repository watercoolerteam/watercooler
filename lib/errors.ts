import { Prisma } from '@prisma/client';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

/**
 * Handle Prisma errors and convert them to user-friendly messages
 */
export function handlePrismaError(error: unknown): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const target = (error.meta?.target as string[]) || [];
        return new ValidationError(
          `A record with this ${target.join(', ')} already exists`
        );
      case 'P2025':
        // Record not found
        return new NotFoundError('Record');
      case 'P2003':
        // Foreign key constraint
        return new ValidationError('Invalid reference');
      default:
        console.error('Prisma error:', error);
        return new DatabaseError('Database operation failed');
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error('Prisma validation error:', error.message);
    console.error('Full Prisma error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    // Try to extract more details from the error message
    const errorMessage = error.message || 'Invalid data provided';
    // Extract the most useful part of the error - usually mentions the field name
    const lines = errorMessage.split('\n');
    const usefulLine = lines.find(line => 
      line.includes('Argument') || 
      line.includes('Unknown argument') ||
      line.includes('Invalid value')
    ) || lines[0] || errorMessage;
    return new ValidationError(`Validation failed: ${usefulLine.substring(0, 300)}`);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error('Prisma initialization error:', error);
    return new DatabaseError('Database connection failed');
  }

  // Unknown Prisma error
  console.error('Unknown Prisma error:', error);
  return new DatabaseError('Database operation failed');
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, any>) {
  const errorInfo = {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    context,
    timestamp: new Date().toISOString(),
  };

  // In production, send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // TODO: Integrate with Sentry or similar
    console.error('Error logged:', errorInfo);
  } else {
    console.error('Error:', errorInfo);
  }

  return errorInfo;
}

/**
 * Create user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Don't expose internal error messages in production
    if (process.env.NODE_ENV === 'production') {
      return 'An unexpected error occurred. Please try again.';
    }
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

