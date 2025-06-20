// Validation utilities for form data and API inputs
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Issue validation
export function validateIssueInput(data: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" });
  } else if (data.title.trim().length > 200) {
    errors.push({ field: "title", message: "Title must be less than 200 characters" });
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length === 0) {
    errors.push({ field: "description", message: "Description is required" });
  } else if (data.description.trim().length > 5000) {
    errors.push({ field: "description", message: "Description must be less than 5000 characters" });
  }

  if (data.severity && !["low", "medium", "high", "critical"].includes(data.severity)) {
    errors.push({ field: "severity", message: "Invalid severity level" });
  }

  if (data.status && !["open", "in_progress", "resolved", "archived"].includes(data.status)) {
    errors.push({ field: "status", message: "Invalid status" });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Solution validation
export function validateSolutionInput(data: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.title || typeof data.title !== "string" || data.title.trim().length === 0) {
    errors.push({ field: "title", message: "Solution title is required" });
  } else if (data.title.trim().length > 200) {
    errors.push({ field: "title", message: "Title must be less than 200 characters" });
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length === 0) {
    errors.push({ field: "description", message: "Solution description is required" });
  } else if (data.description.trim().length > 5000) {
    errors.push({ field: "description", message: "Description must be less than 5000 characters" });
  }

  if (!data.issueId || typeof data.issueId !== "number") {
    errors.push({ field: "issueId", message: "Valid issue ID is required" });
  }

  if (data.effectiveness !== undefined) {
    const eff = Number(data.effectiveness);
    if (isNaN(eff) || eff < 1 || eff > 5) {
      errors.push({ field: "effectiveness", message: "Effectiveness must be a number between 1 and 5" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Category validation
export function validateCategoryInput(data: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push({ field: "name", message: "Category name is required" });
  } else if (data.name.trim().length > 100) {
    errors.push({ field: "name", message: "Name must be less than 100 characters" });
  }

  if (data.description && typeof data.description === "string" && data.description.length > 500) {
    errors.push({ field: "description", message: "Description must be less than 500 characters" });
  }

  if (data.color && (typeof data.color !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(data.color))) {
    errors.push({ field: "color", message: "Color must be a valid hex color code" });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// User validation
export function validateUserInput(data: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.username || typeof data.username !== "string" || data.username.trim().length === 0) {
    errors.push({ field: "username", message: "Username is required" });
  } else if (data.username.trim().length < 3) {
    errors.push({ field: "username", message: "Username must be at least 3 characters" });
  } else if (data.username.trim().length > 50) {
    errors.push({ field: "username", message: "Username must be less than 50 characters" });
  } else if (!/^[a-zA-Z0-9._-]+$/.test(data.username.trim())) {
    errors.push({ field: "username", message: "Username can only contain letters, numbers, dots, hyphens, and underscores" });
  }

  if (!data.email || typeof data.email !== "string" || data.email.trim().length === 0) {
    errors.push({ field: "email", message: "Email is required" });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.push({ field: "email", message: "Please enter a valid email address" });
  }

  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    errors.push({ field: "password", message: "Password must be at least 6 characters" });
  }

  if (data.role && !["admin", "user"].includes(data.role)) {
    errors.push({ field: "role", message: "Invalid role" });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Search validation
export function validateSearchParams(data: any): ValidationResult {
  const errors: ValidationError[] = [];

  if (data.limit !== undefined) {
    const limit = Number(data.limit);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      errors.push({ field: "limit", message: "Limit must be a number between 1 and 100" });
    }
  }

  if (data.offset !== undefined) {
    const offset = Number(data.offset);
    if (isNaN(offset) || offset < 0) {
      errors.push({ field: "offset", message: "Offset must be a non-negative number" });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}