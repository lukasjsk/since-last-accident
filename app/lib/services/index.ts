// Business logic services
import { IssueModel, SolutionModel, CategoryModel, AccidentModel } from "../models";
import type { NewIssue, NewSolution, IssueStatus } from "../types";

// Issue service with business logic
export const IssueService = {
  async createIssue(data: NewIssue, userId: number) {
    // Set default values
    const issueData = {
      ...data,
      createdBy: userId,
      status: data.status || "open" as IssueStatus,
      severity: data.severity || "medium",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const issue = await IssueModel.create(issueData);

    // If this is a critical issue, create an accident record
    if (data.severity === "critical" && data.categoryId) {
      await AccidentModel.create({
        issueId: issue.id,
        categoryId: data.categoryId,
        occurredAt: new Date()
      });
    }

    return issue;
  },

  async updateIssue(id: number, data: Partial<NewIssue>, _userId: number) {
    const existingIssue = await IssueModel.findById(id);
    if (!existingIssue) {
      throw new Error("Issue not found");
    }

    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    // If status is being changed to resolved, update resolvedAt
    if (data.status === "resolved" && existingIssue.status !== "resolved") {
      updateData.resolvedAt = new Date();
    }

    return IssueModel.update(id, updateData);
  },

  async searchIssues(query: string, filters: any = {}) {
    if (!query.trim()) {
      return IssueModel.findAll(filters);
    }
    return IssueModel.search(query, filters.limit);
  },

  async getIssueWithSolutions(id: number) {
    const issue = await IssueModel.findById(id);
    if (!issue) {
      return null;
    }

    const solutions = await SolutionModel.findByIssueId(id);
    
    return {
      ...issue,
      solutions
    };
  }
};

// Solution service with business logic
export const SolutionService = {
  async findAll(issueId?: number) {
    return SolutionModel.findAll(issueId);
  },

  async findById(id: number) {
    return SolutionModel.findById(id);
  },

  async createSolution(data: NewSolution, userId: number) {
    const solutionData = {
      ...data,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const solution = await SolutionModel.create(solutionData);

    // If solution is marked as effective (4+ rating), consider marking issue as resolved
    if (data.effectivenessRating && data.effectivenessRating >= 4) {
      const issue = await IssueModel.findById(data.issueId);
      if (issue && issue.status !== "resolved") {
        await IssueService.updateIssue(data.issueId, { status: "resolved" }, userId);
      }
    }

    return solution;
  },

  async updateSolution(id: number, data: Partial<NewSolution>, userId: number) {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    const updatedSolution = await SolutionModel.update(id, updateData);

    // If solution effectiveness rating is updated to 4+, consider marking issue as resolved
    if (data.effectivenessRating && data.effectivenessRating >= 4 && updatedSolution) {
      const issue = await IssueModel.findById(updatedSolution.issueId);
      if (issue && issue.status !== "resolved") {
        await IssueService.updateIssue(updatedSolution.issueId, { status: "resolved" }, userId);
      }
    }

    return updatedSolution;
  },

  async deleteSolution(id: number) {
    return SolutionModel.delete(id);
  },

  async findByIssueId(issueId: number) {
    return SolutionModel.findByIssueId(issueId);
  },

  async verifySolution(id: number, userId: number) {
    return this.updateSolution(id, { verified: true }, userId);
  }
};;

// Category service with business logic
export const CategoryService = {
  async getCategoryWithStats(id: number) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      return null;
    }

    // Get issue count for this category
    const issues = await IssueModel.findAll({ category: id.toString() });
    const totalIssues = issues.length;
    const resolvedIssues = issues.filter(issue => issue.status === "resolved").length;

    // Get days since last accident
    const daysSinceLastAccident = await AccidentModel.getDaysSinceLastAccident(id);

    return {
      ...category,
      stats: {
        totalIssues,
        resolvedIssues,
        unresolvedIssues: totalIssues - resolvedIssues,
        daysSinceLastAccident
      }
    };
  },

  async getAllCategoriesWithStats() {
    const categories = await CategoryModel.findAll();
    
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const issues = await IssueModel.findAll({ category: category.id.toString() });
        const totalIssues = issues.length;
        const resolvedIssues = issues.filter(issue => issue.status === "resolved").length;
        const daysSinceLastAccident = await AccidentModel.getDaysSinceLastAccident(category.id);

        return {
          ...category,
          stats: {
            totalIssues,
            resolvedIssues,
            unresolvedIssues: totalIssues - resolvedIssues,
            daysSinceLastAccident
          }
        };
      })
    );

    return categoriesWithStats;
  }
};

// Dashboard service for analytics
export const DashboardService = {
  async getDashboardStats() {
    // Get overall stats
    const allIssues = await IssueModel.findAll();
    const totalIssues = allIssues.length;
    const resolvedIssues = allIssues.filter(issue => issue.status === "resolved").length;
    const openIssues = allIssues.filter(issue => issue.status === "open").length;
    const inProgressIssues = allIssues.filter(issue => issue.status === "in_progress").length;

    // Get days since last accident (overall)
    const daysSinceLastAccident = await AccidentModel.getDaysSinceLastAccident();

    // Get recent issues (last 10)
    const recentIssues = await IssueModel.findAll({ limit: 10 });

    // Get category stats
    const categoriesWithStats = await CategoryService.getAllCategoriesWithStats();

    // Get severity breakdown
    const criticalIssues = allIssues.filter(issue => issue.severity === "critical").length;
    const highIssues = allIssues.filter(issue => issue.severity === "high").length;
    const mediumIssues = allIssues.filter(issue => issue.severity === "medium").length;
    const lowIssues = allIssues.filter(issue => issue.severity === "low").length;

    return {
      overview: {
        totalIssues,
        resolvedIssues,
        openIssues,
        inProgressIssues,
        daysSinceLastAccident
      },
      recentIssues,
      categories: categoriesWithStats,
      severityBreakdown: {
        critical: criticalIssues,
        high: highIssues,
        medium: mediumIssues,
        low: lowIssues
      }
    };
  },

  async getAccidentHistory(_limit = 50) {
    return AccidentModel.findAll();
  }
};