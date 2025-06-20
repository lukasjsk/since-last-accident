// Database model operations using Drizzle ORM
import { db } from "../db";
import { safeDbOperation } from "../errors";
import { issues, solutions, categories, users, accidents } from "../db/schema";
import { eq, desc, asc, and, or, like } from "drizzle-orm";
import type { 
  NewIssue, 
  NewSolution, 
  NewCategory, 
  NewUser,
  NewAccident,
  SearchParams
} from "../types";

// Issue model operations
export const IssueModel = {
  async findAll(params: SearchParams = {}) {
      return safeDbOperation(async () => {
        const conditions = [];
        
        if (params.query) {
          conditions.push(
            or(
              like(issues.title, `%${params.query}%`),
              like(issues.description, `%${params.query}%`)
            )
          );
        }
        
        if (params.category) {
          conditions.push(eq(issues.categoryId, Number(params.category)));
        }
        
        if (params.status) {
          conditions.push(eq(issues.status, params.status));
        }
        
        if (params.severity) {
          conditions.push(eq(issues.severity, params.severity));
        }
        
        if (conditions.length > 0) {
          return await db.select().from(issues)
            .where(and(...conditions))
            .orderBy(desc(issues.createdAt))
            .limit(params.limit || 20)
            .offset(params.offset || 0);
        } else {
          return await db.select().from(issues)
            .orderBy(desc(issues.createdAt))
            .limit(params.limit || 20)
            .offset(params.offset || 0);
        }
      });
    }


,

  async findById(id: number) {
      return safeDbOperation(async () => {
        const result = await db.select().from(issues).where(eq(issues.id, id));
        return result[0] || null;
      });
    }
,

  async create(data: NewIssue) {
      return safeDbOperation(async () => {
        const result = await db.insert(issues).values(data).returning();
        return result[0];
      });
    }
,

  async update(id: number, data: Partial<NewIssue>) {
    const result = await db.update(issues).set(data).where(eq(issues.id, id)).returning();
    return result[0] || null;
  },

  async delete(id: number) {
    const result = await db.delete(issues).where(eq(issues.id, id)).returning();
    return result[0] || null;
  },

  async search(query: string, limit = 20) {
      return safeDbOperation(async () => {
        return await db.select()
          .from(issues)
          .where(
            or(
              like(issues.title, `%${query}%`),
              like(issues.description, `%${query}%`)
            )
          )
          .orderBy(desc(issues.createdAt))
          .limit(limit);
      });
    }

};

// Solution model operations
export const SolutionModel = {
  async findAll(issueId?: number) {
      return safeDbOperation(async () => {
        if (issueId) {
          return await db.select().from(solutions)
            .where(eq(solutions.issueId, issueId))
            .orderBy(desc(solutions.createdAt));
        } else {
          return await db.select().from(solutions)
            .orderBy(desc(solutions.createdAt));
        }
      });
    }

,

  async findById(id: number) {
    const result = await db.select().from(solutions).where(eq(solutions.id, id));
    return result[0] || null;
  },

  async create(data: NewSolution) {
    const result = await db.insert(solutions).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<NewSolution>) {
    const result = await db.update(solutions).set(data).where(eq(solutions.id, id)).returning();
    return result[0] || null;
  },

  async delete(id: number) {
    const result = await db.delete(solutions).where(eq(solutions.id, id)).returning();
    return result[0] || null;
  },

  async findByIssueId(issueId: number) {
    return db.select().from(solutions).where(eq(solutions.issueId, issueId)).orderBy(desc(solutions.createdAt));
  }
};

// Category model operations
export const CategoryModel = {
  async findAll() {
    return db.select().from(categories).orderBy(asc(categories.name));
  },

  async findById(id: number) {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0] || null;
  },

  async create(data: NewCategory) {
    const result = await db.insert(categories).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<NewCategory>) {
    const result = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return result[0] || null;
  },

  async delete(id: number) {
    const result = await db.delete(categories).where(eq(categories.id, id)).returning();
    return result[0] || null;
  },

  async findByName(name: string) {
    const result = await db.select().from(categories).where(eq(categories.name, name));
    return result[0] || null;
  }
};

// User model operations
export const UserModel = {
  async findAll() {
    return db.select({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt
    }).from(users).orderBy(asc(users.username));
  },

  async findById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  },

  async findByUsername(username: string) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0] || null;
  },

  async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  },

  async create(data: NewUser) {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  },

  async update(id: number, data: Partial<NewUser>) {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0] || null;
  },

  async updateLastLogin(id: number) {
    const result = await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] || null;
  }
};

// Accident model operations
export const AccidentModel = {
  async findAll() {
      return safeDbOperation(async () => {
        return await db.select().from(accidents).orderBy(desc(accidents.occurredAt));
      });
    }
,

  async findById(id: number) {
    const result = await db.select().from(accidents).where(eq(accidents.id, id));
    return result[0] || null;
  },

  async create(data: NewAccident) {
    const result = await db.insert(accidents).values(data).returning();
    return result[0];
  },

  async getLastAccident(categoryId?: number) {
      return safeDbOperation(async () => {
        if (categoryId) {
          const result = await db.select().from(accidents)
            .where(eq(accidents.categoryId, categoryId))
            .orderBy(desc(accidents.occurredAt))
            .limit(1);
          return result[0] || null;
        } else {
          const result = await db.select().from(accidents)
            .orderBy(desc(accidents.occurredAt))
            .limit(1);
          return result[0] || null;
        }
      });
    }

,

  async getDaysSinceLastAccident(categoryId?: number) {
    const lastAccident = await this.getLastAccident(categoryId);
    
    if (!lastAccident) {
      return null; // No accidents recorded
    }
    
    const now = new Date();
    const lastAccidentDate = new Date(lastAccident.occurredAt);
    const diffTime = Math.abs(now.getTime() - lastAccidentDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
};