import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/lib/db/schema.ts",
  out: "./app/lib/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./app/lib/db/sqlite.db",
  },
});