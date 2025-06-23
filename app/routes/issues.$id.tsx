import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { Link, useFetcher, useLoaderData } from "react-router";
import { useState } from "react";
import { requireUser } from "~/services/auth.server";
import { IssueService, SolutionService } from "~/lib/services";
import { IssueModel, CategoryModel, UserModel } from "~/lib/models";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUser(request);
  
  const issueId = Number(params.id);
  if (!issueId) {
    throw new Response("Invalid issue ID", { status: 400 });
  }

  const issueWithSolutions = await IssueService.getIssueWithSolutions(issueId);
  if (!issueWithSolutions) {
    throw new Response("Issue not found", { status: 404 });
  }

  // Get additional data
  const [category, createdByUser] = await Promise.all([
    issueWithSolutions.categoryId ? CategoryModel.findById(issueWithSolutions.categoryId) : null,
    UserModel.findById(issueWithSolutions.createdBy)
  ]);

  return { 
    issue: issueWithSolutions, 
    category,
    createdByUser 
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const issueId = Number(params.id);
  
  if (!issueId) {
    throw new Response("Invalid issue ID", { status: 400 });
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  try {
    if (intent === "delete") {
      await IssueModel.delete(issueId);
      return redirect("/issues");
    }

    if (intent === "update-status") {
      const status = formData.get("status") as string;
      if (!["open", "in_progress", "resolved", "archived"].includes(status)) {
        throw new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
      }
      
      await IssueService.updateIssue(issueId, { status: status as "open" | "in_progress" | "resolved" | "archived" }, user.id);
      return { success: true };
    }

    if (intent === "create-solution") {
      const description = formData.get("description") as string;
      const steps = formData.get("steps") as string;
      const effectivenessRating = formData.get("effectivenessRating");
      
      if (!description || !steps) {
        return { error: "Description and steps are required" };
      }

      await SolutionService.createSolution({
        issueId,
        description,
        steps,
        effectivenessRating: effectivenessRating ? Number(effectivenessRating) : 0,
        verified: false
      } as any, user.id);

      return { success: true };
    }

    if (intent === "update-solution") {
      const solutionId = Number(formData.get("solutionId"));
      const description = formData.get("description") as string;
      const steps = formData.get("steps") as string;
      const effectivenessRating = formData.get("effectivenessRating");
      
      if (!solutionId || !description || !steps) {
        return { error: "Solution ID, description and steps are required" };
      }

      await SolutionService.updateSolution(solutionId, {
        description,
        steps,
        effectivenessRating: effectivenessRating ? Number(effectivenessRating) : 0
      }, user.id);

      return { success: true };
    }

    if (intent === "delete-solution") {
      const solutionId = Number(formData.get("solutionId"));
      
      if (!solutionId) {
        return { error: "Solution ID is required" };
      }

      await SolutionService.deleteSolution(solutionId);
      return { success: true };
    }

    if (intent === "verify-solution") {
      const solutionId = Number(formData.get("solutionId"));
      
      if (!solutionId) {
        return { error: "Solution ID is required" };
      }

      await SolutionService.verifySolution(solutionId, user.id);
      return { success: true };
    }

    throw new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
  } catch (error) {
    console.error("Action failed:", error);
    throw new Response(JSON.stringify({ error: "Action failed. Please try again." }), { status: 500 });
  }
}

function SolutionCard({ solution, fetcher }: { 
  solution: any; 
  fetcher: any; 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    if (rating >= 2) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">
              Solution #{solution.id}
            </h4>
            {solution.verified && (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                Verified
              </span>
            )}
            {solution.effectivenessRating && (
              <span className={`text-sm font-medium ${getRatingColor(solution.effectivenessRating)}`}>
                {solution.effectivenessRating}/5 ★
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mb-2">
            Added {new Date(solution.createdAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs px-2 py-1"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          
          {!solution.verified && (
            <fetcher.Form method="post" style={{ display: 'inline' }}>
              <input type="hidden" name="intent" value="verify-solution" />
              <input type="hidden" name="solutionId" value={solution.id} />
              <Button 
                type="submit" 
                size="sm" 
                variant="outline"
                className="text-xs px-2 py-1 text-green-600 border-green-300 hover:bg-green-50"
              >
                Verify
              </Button>
            </fetcher.Form>
          )}
          
          <fetcher.Form method="post" style={{ display: 'inline' }}>
            <input type="hidden" name="intent" value="delete-solution" />
            <input type="hidden" name="solutionId" value={solution.id} />
            <Button 
              type="submit" 
              size="sm" 
              variant="outline"
              onClick={(e) => {
                if (!confirm('Are you sure you want to delete this solution?')) {
                  e.preventDefault();
                }
              }}
              className="text-xs px-2 py-1 text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete
            </Button>
          </fetcher.Form>
        </div>
      </div>

      {isEditing ? (
        <fetcher.Form method="post" className="space-y-3">
          <input type="hidden" name="intent" value="update-solution" />
          <input type="hidden" name="solutionId" value={solution.id} />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={solution.description}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Steps
            </label>
            <textarea
              name="steps"
              defaultValue={solution.steps}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effectiveness Rating
            </label>
            <select
              name="effectivenessRating"
              defaultValue={solution.effectivenessRating || 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">0 - Not tested</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" size="sm">Save Changes</Button>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </fetcher.Form>
      ) : (
        <div>
          <p className="text-gray-700 text-sm mb-3">{solution.description}</p>
          
          <div className="border-t pt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2"
            >
              <span>{isExpanded ? 'Hide' : 'Show'} Implementation Steps</span>
              <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {isExpanded && (
              <div className="bg-gray-50 p-3 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-700">
                  {solution.steps}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function IssueDetail() {
  const { issue, category, createdByUser } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [showAddSolution, setShowAddSolution] = useState(false);


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

  const formatTags = (tags: string | null) => {
    if (!tags) return [];
    try {
      return JSON.parse(tags);
    } catch {
      return tags.split(",").map((tag: string) => tag.trim()).filter(Boolean);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/issues" className="hover:text-gray-700">Issues</Link>
          <span>›</span>
          <span>#{issue.id}</span>
        </div>
        
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{issue.title}</h1>
            <div className="flex gap-2 items-center flex-wrap">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                {issue.severity}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                {issue.status.replace('_', ' ')}
              </span>
              {category && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {category.name}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Link to={`/issues/${issue.id}/edit`}>
              <Button variant="outline">Edit</Button>
            </Link>
            
            <fetcher.Form method="post" style={{ display: 'inline' }}>
              <input type="hidden" name="intent" value="delete" />
              <Button 
                variant="outline" 
                type="submit"
                onClick={(e) => {
                  if (!confirm("Are you sure you want to delete this issue?")) {
                    e.preventDefault();
                  }
                }}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Delete
              </Button>
            </fetcher.Form>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-gray-700">
                {issue.description}
              </div>
            </CardContent>
          </Card>

          {/* Solutions */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Solutions ({issue.solutions?.length || 0})</CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setShowAddSolution(!showAddSolution)}
                >
                  {showAddSolution ? 'Cancel' : 'Add Solution'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add Solution Form */}
              {showAddSolution && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-3">Add New Solution</h4>
                  <fetcher.Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="create-solution" />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={3}
                        placeholder="Brief description of the solution"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Implementation Steps *
                      </label>
                      <textarea
                        name="steps"
                        required
                        rows={4}
                        placeholder="Step-by-step instructions to implement this solution"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Effectiveness Rating (0-5)
                      </label>
                      <select
                        name="effectivenessRating"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="0">0 - Not tested</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" size="sm">
                        Add Solution
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAddSolution(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </fetcher.Form>
                </div>
              )}

              {/* Solutions List */}
              {issue.solutions && issue.solutions.length > 0 ? (
                <div className="space-y-4">
                  {issue.solutions.map((solution: any) => (
                    <SolutionCard 
                      key={solution.id} 
                      solution={solution} 
                      fetcher={fetcher}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>No solutions yet.</p>
                  <button 
                    onClick={() => setShowAddSolution(true)}
                    className="text-blue-600 hover:text-blue-700 mt-2"
                  >
                    Add the first solution
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <fetcher.Form method="post" className="space-y-3">
                <input type="hidden" name="intent" value="update-status" />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Change Status
                  </label>
                  <select
                    name="status"
                    defaultValue={issue.status}
                    onChange={(e) => {
                      const form = e.target.closest('form');
                      if (form) {
                        fetcher.submit(form);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </fetcher.Form>
            </CardContent>
          </Card>

          {/* Issue Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Created by:</span>
                <p className="text-sm text-gray-600">{createdByUser?.username || "Unknown"}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-700">Created:</span>
                <p className="text-sm text-gray-600">
                  {new Date(issue.createdAt).toLocaleString()}
                </p>
              </div>
              
              {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Last updated:</span>
                  <p className="text-sm text-gray-600">
                    {new Date(issue.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
              
              {issue.resolvedAt && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Resolved:</span>
                  <p className="text-sm text-gray-600">
                    {new Date(issue.resolvedAt).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Tags */}
              {issue.tags && formatTags(issue.tags).length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formatTags(issue.tags).map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}