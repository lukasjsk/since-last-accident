import type { User } from "~/lib/db/schema";
import { requireUser, requireAdmin as requireAdminFromServer, getUser as getUserFromServer } from "./auth.server";

// Utility function to require authentication - redirects to login if not authenticated
export async function requireAuth(request: Request): Promise<User> {
  return await requireUser(request);
}

// Utility function to get the current user without redirecting
export async function getUser(request: Request): Promise<User | null> {
  return await getUserFromServer(request);
}

// Utility function to check if user is admin
export function isAdmin(user: User): boolean {
  return user.role === "admin";
}

// Utility function to check if user has admin access
export async function requireAdmin(request: Request): Promise<User> {
  return await requireAdminFromServer(request);
}