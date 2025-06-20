import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { Form, Link, useActionData, useLoaderData } from "react-router";
import { requireUser } from "~/services/auth.server";
import { IssueService } from "~/lib/services";
import { IssueModel, CategoryModel } from "~/lib/models";
import { validateIssueInput } from "~/lib/validators";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireUser(request);
  
  const issueId = Number(params.id);
  if (!issueId) {
    throw new Response("Invalid issue ID", { status: 400 });
  }

  const [issue, categories] = await Promise.all([
    IssueModel.findById(issueId),
    CategoryModel.findAll()
  ]);

  if (!issue) {
    throw new Response("Issue not found", { status: 404 });
  }
  
  return { issue, categories };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const issueId = Number(params.id);
  
  if (!issueId) {
    throw new Response("Invalid issue ID", { status: 400 });
  }

  const formData = await request.formData();
  const issueData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
    severity: formData.get("severity") as "low" | "medium" | "high" | "critical",
    status: formData.get("status") as "open" | "in_progress" | "resolved" | "archived",
    tags: formData.get("tags") as string || null,
  };

  // Validate the input
  const validation = validateIssueInput(issueData);
  if (!validation.isValid) {
    return { 
      error: validation.errors[0]?.message || "Invalid input",
      errors: validation.errors 
    };
  }

  try {
    await IssueService.updateIssue(issueId, issueData, user.id);
    return redirect(`/issues/${issueId}`);
  } catch (error) {
    console.error("Failed to update issue:", error);
    return { 
      error: "Failed to update issue. Please try again." 
    };
  }
}

export default function EditIssue() {
  const { issue, categories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const formatTags = (tags: string | null) => {
    if (!tags) return "";
    try {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed.join(", ") : tags;
    } catch {
      return tags;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/issues" className="hover:text-gray-700">Issues</Link>
          <span>›</span>
          <Link to={`/issues/${issue.id}`} className="hover:text-gray-700">#{issue.id}</Link>
          <span>›</span>
          <span>Edit</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Issue</h1>
        <p className="text-gray-600 mt-2">Update issue details and status</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-6">
            {actionData?.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {actionData.error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={issue.title}
                placeholder="Brief description of the issue"
                className={actionData?.errors?.find((e: any) => e.field === "title") ? "border-red-500" : ""}
              />
              {actionData?.errors?.find((e: any) => e.field === "title") && (
                <p className="text-sm text-red-600">
                  {actionData.errors.find((e: any) => e.field === "title")?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                defaultValue={issue.description}
                placeholder="Detailed description of the issue, steps to reproduce, expected vs actual behavior, etc."
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  actionData?.errors?.find((e: any) => e.field === "description") ? "border-red-500" : "border-gray-300"
                }`}
              />
              {actionData?.errors?.find((e: any) => e.field === "description") && (
                <p className="text-sm text-red-600">
                  {actionData.errors.find((e: any) => e.field === "description")?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <select
                  id="severity"
                  name="severity"
                  defaultValue={issue.severity}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={issue.categoryId || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={issue.status}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                defaultValue={formatTags(issue.tags)}
                placeholder="Comma-separated tags (e.g., bug, frontend, urgent)"
              />
              <p className="text-sm text-gray-500">
                Optional tags to help categorize and search for this issue
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Update Issue</Button>
              <Link to={`/issues/${issue.id}`}>
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}