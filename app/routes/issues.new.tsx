import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { Form, Link, useActionData, useLoaderData } from "react-router";
import { requireUser } from "~/services/auth.server";
import { IssueService } from "~/lib/services";
import { CategoryModel } from "~/lib/models";
import { validateIssueInput } from "~/lib/validators";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  
  // Get categories for the form
  const categories = await CategoryModel.findAll();
  
  return { categories };
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  const formData = await request.formData();
  const issueData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
    severity: formData.get("severity") as "low" | "medium" | "high" | "critical",
    status: (formData.get("status") as "open" | "in_progress" | "resolved" | "archived") || "open",
    tags: formData.get("tags") as string || null,
    createdBy: user.id,
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
    const issue = await IssueService.createIssue(issueData, user.id);
    return redirect(`/issues/${issue.id}`);
  } catch (error) {
    console.error("Failed to create issue:", error);
    return { 
      error: "Failed to create issue. Please try again." 
    };
  }
}

export default function NewIssue() {
  const { categories } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Issue</h1>
        <p className="text-gray-600 mt-2">Report a new incident or problem</p>
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
                  defaultValue="medium"
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
                defaultValue="open"
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
                placeholder="Comma-separated tags (e.g., bug, frontend, urgent)"
              />
              <p className="text-sm text-gray-500">
                Optional tags to help categorize and search for this issue
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit">Create Issue</Button>
              <Link to="/issues">
                <Button variant="outline">Cancel</Button>
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}