import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import path from "path";

// Initialize SQLite database
const sqlite = new Database(path.join(process.cwd(), "app/lib/db/sqlite.db"));

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema });

// Run migrations on startup
export function runMigrations() {
  try {
    migrate(db, { migrationsFolder: path.join(process.cwd(), "app/lib/db/migrations") });
    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    throw error;
  }
}

// Enable WAL mode for better concurrent access
sqlite.pragma("journal_mode = WAL");

// Enable foreign key constraints
sqlite.pragma("foreign_keys = ON");

// Create full-text search triggers
export function setupFullTextSearch() {
  // Create FTS5 tables for search functionality
  sqlite.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS issues_fts USING fts5(
      title, 
      description, 
      tags, 
      content='issues', 
      content_rowid='id'
    );
  `);

  sqlite.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS solutions_fts USING fts5(
      description, 
      steps, 
      content='solutions', 
      content_rowid='id'
    );
  `);

  // Triggers to keep FTS tables in sync
  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS issues_fts_insert AFTER INSERT ON issues BEGIN
      INSERT INTO issues_fts(rowid, title, description, tags) 
      VALUES (new.id, new.title, new.description, new.tags);
    END;
  `);

  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS issues_fts_delete AFTER DELETE ON issues BEGIN
      INSERT INTO issues_fts(issues_fts, rowid, title, description, tags) 
      VALUES('delete', old.id, old.title, old.description, old.tags);
    END;
  `);

  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS issues_fts_update AFTER UPDATE ON issues BEGIN
      INSERT INTO issues_fts(issues_fts, rowid, title, description, tags) 
      VALUES('delete', old.id, old.title, old.description, old.tags);
      INSERT INTO issues_fts(rowid, title, description, tags) 
      VALUES (new.id, new.title, new.description, new.tags);
    END;
  `);

  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS solutions_fts_insert AFTER INSERT ON solutions BEGIN
      INSERT INTO solutions_fts(rowid, description, steps) 
      VALUES (new.id, new.description, new.steps);
    END;
  `);

  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS solutions_fts_delete AFTER DELETE ON solutions BEGIN
      INSERT INTO solutions_fts(solutions_fts, rowid, description, steps) 
      VALUES('delete', old.id, old.description, old.steps);
    END;
  `);

  sqlite.exec(`
    CREATE TRIGGER IF NOT EXISTS solutions_fts_update AFTER UPDATE ON solutions BEGIN
      INSERT INTO solutions_fts(solutions_fts, rowid, description, steps) 
      VALUES('delete', old.id, old.description, old.steps);
      INSERT INTO solutions_fts(rowid, description, steps) 
      VALUES (new.id, new.description, new.steps);
    END;
  `);

  console.log("✅ Full-text search tables and triggers created");
}

// Cleanup function
export function closeDatabase() {
  sqlite.close();
}