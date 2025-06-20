import { db, runMigrations, setupFullTextSearch } from "./index";
import { users, categories, issues, solutions, accidents } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // Run migrations first
    runMigrations();
    
    // Setup full-text search
    setupFullTextSearch();

    // Clear existing data
    await db.delete(accidents);
    await db.delete(solutions);
    await db.delete(issues);
    await db.delete(categories);
    await db.delete(users);

    console.log("🧹 Cleared existing data");

    // Create users
    const saltRounds = Number(process.env.BCRYPT_ROUNDS) || 12;
    const adminPasswordHash = await bcrypt.hash("admin123", saltRounds);
    const userPasswordHash = await bcrypt.hash("user123", saltRounds);

    const [adminUser] = await db.insert(users).values({
      username: "admin",
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: "admin",
    }).returning();

    const [regularUser] = await db.insert(users).values({
      username: "john.doe",
      email: "john.doe@example.com",
      passwordHash: userPasswordHash,
      role: "user",
    }).returning();

    console.log("👥 Created users");

    // Create categories
    const categoriesData = [
      {
        name: "Build Issues",
        description: "Problems related to build processes, compilation errors, and CI/CD pipeline failures",
        color: "#ef4444", // red
      },
      {
        name: "Deployment",
        description: "Issues with deployment processes, server configuration, and environment setup",
        color: "#f97316", // orange
      },
      {
        name: "Environment",
        description: "Development environment setup, dependency conflicts, and local configuration issues",
        color: "#eab308", // yellow
      },
      {
        name: "Code Quality",
        description: "Code review findings, linting issues, and best practice violations",
        color: "#22c55e", // green
      },
      {
        name: "Performance",
        description: "Performance issues, optimization opportunities, and resource utilization problems",
        color: "#3b82f6", // blue
      },
      {
        name: "Security",
        description: "Security vulnerabilities, authentication issues, and data protection concerns",
        color: "#8b5cf6", // purple
      },
    ];

    const insertedCategories = await db.insert(categories).values(categoriesData).returning();
    console.log("📁 Created categories");

    // Create sample issues
    const issuesData = [
      {
        title: "TypeScript compilation fails after dependency update",
        description: "After updating React Router to v7, TypeScript compilation fails with type errors in route configuration files. The error suggests incompatible type definitions between the old and new versions.",
        categoryId: insertedCategories[0].id, // Build Issues
        severity: "high" as const,
        status: "resolved" as const,
        tags: JSON.stringify(["typescript", "react-router", "compilation", "dependencies"]),
        createdBy: adminUser.id,
        resolvedAt: new Date(Date.now() - 86400 * 1000), // Resolved 1 day ago
      },
      {
        title: "Production deployment fails with Docker build error",
        description: "Docker build process fails on production server with 'npm install' timeout. The issue appears to be related to network connectivity or package registry access in the production environment.",
        categoryId: insertedCategories[1].id, // Deployment
        severity: "critical" as const,
        status: "resolved" as const,
        tags: JSON.stringify(["docker", "deployment", "npm", "production"]),
        createdBy: regularUser.id,
        resolvedAt: new Date(Date.now() - 172800 * 1000), // Resolved 2 days ago
      },
      {
        title: "ESLint configuration conflicts with Prettier",
        description: "New team member reports formatting conflicts between ESLint and Prettier configurations. Code gets reformatted differently by each tool, causing inconsistent code style across the project.",
        categoryId: insertedCategories[3].id, // Code Quality
        severity: "medium" as const,
        status: "in_progress" as const,
        tags: JSON.stringify(["eslint", "prettier", "formatting", "configuration"]),
        createdBy: regularUser.id,
      },
      {
        title: "Database query performance degradation",
        description: "Dashboard loading time has increased significantly over the past week. Investigation shows that several database queries are taking longer than expected, possibly due to missing indexes or data growth.",
        categoryId: insertedCategories[4].id, // Performance
        severity: "high" as const,
        status: "open" as const,
        tags: JSON.stringify(["database", "performance", "queries", "optimization"]),
        createdBy: adminUser.id,
      },
      {
        title: "Local development environment setup fails on M1 Macs",
        description: "New developers with Apple M1 MacBooks are unable to set up the local development environment. The issue seems related to native dependencies that don't have ARM64 builds available.",
        categoryId: insertedCategories[2].id, // Environment
        severity: "medium" as const,
        status: "open" as const,
        tags: JSON.stringify(["m1", "mac", "arm64", "dependencies", "setup"]),
        createdBy: regularUser.id,
      },
    ];

    const insertedIssues = await db.insert(issues).values(issuesData).returning();
    console.log("🐛 Created issues");

    // Create solutions for resolved issues
    const solutionsData = [
      {
        issueId: insertedIssues[0].id,
        description: "Updated TypeScript configuration and route type definitions",
        steps: JSON.stringify([
          "Update tsconfig.json to include new React Router v7 type paths",
          "Install @types/react-router for v7 compatibility",
          "Update route configuration files to use new type definitions",
          "Run npm run typecheck to verify all type errors are resolved",
          "Update CLAUDE.md with new TypeScript configuration notes"
        ]),
        effectivenessRating: 4.5,
        verified: true,
        createdBy: adminUser.id,
      },
      {
        issueId: insertedIssues[1].id,
        description: "Fixed Docker build timeout by optimizing npm install process",
        steps: JSON.stringify([
          "Add .dockerignore file to exclude node_modules and build artifacts",
          "Use npm ci instead of npm install for faster, reproducible builds",
          "Implement multi-stage Docker build to cache dependencies separately",
          "Configure npm registry timeout and retry settings in Dockerfile",
          "Test build process in staging environment before production deployment"
        ]),
        effectivenessRating: 5.0,
        verified: true,
        createdBy: regularUser.id,
      },
    ];

    await db.insert(solutions).values(solutionsData);
    console.log("💡 Created solutions");

    // Create accident records for resolved issues (for dashboard metrics)
    const accidentsData = [
      {
        categoryId: insertedCategories[0].id, // Build Issues
        issueId: insertedIssues[0].id,
        occurredAt: new Date(Date.now() - 90000 * 1000), // ~25 hours ago
      },
      {
        categoryId: insertedCategories[1].id, // Deployment
        issueId: insertedIssues[1].id,
        occurredAt: new Date(Date.now() - 180000 * 1000), // ~50 hours ago
      },
    ];

    await db.insert(accidents).values(accidentsData);
    console.log("📊 Created accident records");

    console.log("✅ Database seeding completed successfully!");
    console.log("\n📋 Seed data summary:");
    console.log(`- Users: ${insertedCategories.length + 1} (1 admin, 1 regular user)`);
    console.log(`- Categories: ${insertedCategories.length}`);
    console.log(`- Issues: ${insertedIssues.length} (2 resolved, 1 in progress, 2 open)`);
    console.log(`- Solutions: ${solutionsData.length}`);
    console.log(`- Accident records: ${accidentsData.length}`);
    console.log("\n🔐 Default login credentials:");
    console.log("Admin: admin / admin123");
    console.log("User: john.doe / user123");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Install bcryptjs if not already installed
async function installBcrypt() {
  try {
    await import("bcryptjs");
  } catch {
    console.log("Installing bcryptjs...");
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);
    await execAsync("npm install bcryptjs @types/bcryptjs");
    console.log("✅ bcryptjs installed");
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  installBcrypt().then(() => seed());
}