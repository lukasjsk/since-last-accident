// Error handling utilities and custom error classes

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 400, true);
    this.field = field;
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, true);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, true);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403, true);
    this.name = "ForbiddenError";
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = "Database operation failed") {
    super(message, 500, true);
    this.name = "DatabaseError";
  }
}

// Error response formatter
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    field?: string;
    statusCode: number;
  };
}

export function formatErrorResponse(error: Error | AppError): ErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.name,
        field: error instanceof ValidationError ? error.field : undefined,
        statusCode: error.statusCode
      }
    };
  }

  // Handle unknown errors
  return {
    success: false,
    error: {
      message: "An unexpected error occurred",
      statusCode: 500
    }
  };
}

// Error handler for React Router actions and loaders
export function handleRouteError(error: unknown): Response {
  console.error("Route error:", error);

  if (error instanceof AppError) {
    return new Response(JSON.stringify(formatErrorResponse(error)), {
      status: error.statusCode,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  // Handle unknown errors
  const errorResponse = formatErrorResponse(new Error("Internal server error"));
  return new Response(JSON.stringify(errorResponse), {
    status: 500,
    headers: {
      "Content-Type": "application/json"
    }
  });
}

// Async error wrapper for route handlers
export function asyncHandler(fn: Function) {
  return async (...args: any[]) => {
    return await fn(...args);
  };
}

// Validation helper
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === "") {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format", "email");
  }
}

export function validateLength(value: string, fieldName: string, min?: number, max?: number): void {
  if (min && value.length < min) {
    throw new ValidationError(`${fieldName} must be at least ${min} characters`, fieldName);
  }
  if (max && value.length > max) {
    throw new ValidationError(`${fieldName} must be no more than ${max} characters`, fieldName);
  }
}

// Database error wrapper
export async function safeDbOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("Database operation failed:", error);
    throw new DatabaseError("Database operation failed");
  }
}

// Logger utility (simple console-based for now)
export const logger = {
  info: (message: string, meta?: any) => {
    console.info(`[INFO] ${new Date().toISOString()}: ${message}`, meta ? meta : "");
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error ? error : "");
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta ? meta : "");
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta ? meta : "");
    }
  }
};