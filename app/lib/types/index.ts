export type { User, NewUser } from "../db/schema";
export type { Issue, NewIssue } from "../db/schema";
export type { Solution, NewSolution } from "../db/schema";
export type { Category, NewCategory } from "../db/schema";
export type { Accident, NewAccident } from "../db/schema";

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Search and filtering types
export interface SearchParams {
  query?: string;
  category?: string;
  status?: IssueStatus;
  severity?: IssueSeverity;
  limit?: number;
  offset?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Enums
export enum IssueStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress", 
  RESOLVED = "resolved",
  ARCHIVED = "archived"
}

export enum IssueSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user"
}