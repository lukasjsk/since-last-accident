import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "user"] }).notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
});

// Categories table
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  color: text("color").notNull().default("#6b7280"), // Default gray color
  accidentResetTrigger: integer("accident_reset_trigger", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Issues table
export const issues = sqliteTable("issues", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  severity: text("severity", { enum: ["low", "medium", "high", "critical"] }).notNull().default("medium"),
  status: text("status", { enum: ["open", "in_progress", "resolved", "archived"] }).notNull().default("open"),
  tags: text("tags"), // JSON array of tags
  attachments: text("attachments"), // JSON array of attachment file paths
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  resolvedAt: integer("resolved_at", { mode: "timestamp" }),
});

// Solutions table
export const solutions = sqliteTable("solutions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  issueId: integer("issue_id").references(() => issues.id).notNull(),
  description: text("description").notNull(),
  steps: text("steps").notNull(), // JSON array of step-by-step instructions
  effectivenessRating: real("effectiveness_rating").default(0), // 0-5 scale
  verified: integer("verified", { mode: "boolean" }).notNull().default(false),
  createdBy: integer("created_by").references(() => users.id).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
});

// Accidents table - tracks when incidents occur for dashboard counters
export const accidents = sqliteTable("accidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  categoryId: integer("category_id").references(() => categories.id),
  issueId: integer("issue_id").references(() => issues.id).notNull(),
  occurredAt: integer("occurred_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  resetCounter: integer("reset_counter", { mode: "boolean" }).notNull().default(true),
});

// Full-text search virtual table for issues
export const issuesSearch = sqliteTable("issues_search", {
  rowid: integer("rowid").primaryKey(),
  title: text("title"),
  description: text("description"),
  tags: text("tags"),
});

// Full-text search virtual table for solutions
export const solutionsSearch = sqliteTable("solutions_search", {
  rowid: integer("rowid").primaryKey(),
  description: text("description"),
  steps: text("steps"),
});

// Type exports for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;

export type Solution = typeof solutions.$inferSelect;
export type NewSolution = typeof solutions.$inferInsert;

export type Accident = typeof accidents.$inferSelect;
export type NewAccident = typeof accidents.$inferInsert;