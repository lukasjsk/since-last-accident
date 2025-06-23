import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { requireUser } from "~/services/auth.server";
import { CategoryService } from "~/lib/services";
import { IssueModel } from "~/lib/models";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUser(request);
  
  const categoryId = Number(params.id);
  if (!categoryId) {
    throw new Response("Invalid category ID", { status: 400 });
  }

  const categoryWithStats = await CategoryService.getCategoryWithStats(categoryId);
  if (!categoryWithStats) {
    throw new Response("Category not found", { status: 404 });
  }

  // Get recent issues for this category
  const recentIssues = await IssueModel.findAll({ category: categoryId.toString() });

  return { 
    category: categoryWithStats,
    recentIssues: recentIssues.slice(0, 10) // Show latest 10 issues
  };
}

export default function CategoryDetail() {
  const { category, recentIssues } = useLoaderData<typeof loader>();

  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      indigo: "bg-indigo-500",
      gray: "bg-gray-500",
      orange: "bg-orange-500",
    };
    
    return colorMap[color] || "bg-gray-500";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-blue-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/categories" className="hover:text-gray-700">Categories</Link>
          <span>›</span>
          <span>{category.name}</span>
        </div>
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-6 h-6 rounded-full ${getCategoryColorClass(category.color)}`} />
              <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            </div>
            {category.description && (
              <p className="text-gray-600 text-lg">{category.description}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Link to="/categories">
              <Button variant="outline">Back to Categories</Button>
            </Link>
            <Link to={`/issues?category=${category.id}`}>
              <Button>View All Issues</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{category.stats.totalIssues}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Resolved Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{category.stats.resolvedIssues}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Unresolved Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{category.stats.unresolvedIssues}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Days Since Last Accident</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {category.stats.daysSinceLastAccident !== null 
                ? category.stats.daysSinceLastAccident 
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Issues</CardTitle>
            {recentIssues.length > 0 && (
              <Link to={`/issues?category=${category.id}`}>
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {recentIssues.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No issues found for this category.</p>
              <p className="text-sm mt-2">Issues will appear here once they are created.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentIssues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link 
                        to={`/issues/${issue.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 text-lg"
                      >
                        #{issue.id} {issue.title}
                      </Link>
                      {issue.description && (
                        <p className="text-gray-600 mt-1 line-clamp-2">{issue.description}</p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 ml-4">
                      <div>Created: {new Date(issue.createdAt).toLocaleDateString()}</div>
                      {issue.updatedAt !== issue.createdAt && (
                        <div>Updated: {new Date(issue.updatedAt).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}