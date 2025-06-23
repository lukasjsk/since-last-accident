import type { LoaderFunctionArgs } from "react-router";
import { Link, useFetcher, useLoaderData } from "react-router";
import { requireUser } from "~/services/auth.server";
import { IssueService } from "~/lib/services";
import { validateSearchParams } from "~/lib/validators";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  
  const url = new URL(request.url);
  const searchParams = {
    query: url.searchParams.get("q") || undefined,
    category: url.searchParams.get("category") || undefined,
    status: url.searchParams.get("status") || undefined,
    severity: url.searchParams.get("severity") || undefined,
    limit: Number(url.searchParams.get("limit")) || 20,
    offset: Number(url.searchParams.get("offset")) || 0,
  };

  // Validate search parameters
  const validation = validateSearchParams(searchParams);
  if (!validation.isValid) {
    throw new Response("Invalid search parameters", { status: 400 });
  }

  const issues = await IssueService.searchIssues(searchParams.query || "", searchParams);
  
  return { issues, searchParams };
}

export default function IssuesIndex() {
  const { issues, searchParams } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Issues</h1>
          <p className="text-gray-600 mt-2">Track and manage development team incidents</p>
        </div>
        <Link to="/issues/new">
          <Button>Create Issue</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <fetcher.Form method="get" className="flex gap-4 items-center flex-wrap">
          <input
            type="text"
            name="q"
            placeholder="Search issues..."
            defaultValue={searchParams.query}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[200px]"
          />
          
          <select
            name="status"
            defaultValue={searchParams.status || ""}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="archived">Archived</option>
          </select>

          <select
            name="severity"
            defaultValue={searchParams.severity || ""}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <Button type="submit" variant="outline">Search</Button>
          
          {(searchParams.query || searchParams.status || searchParams.severity) && (
            <Link to="/issues">
              <Button variant="outline">Clear</Button>
            </Link>
          )}
        </fetcher.Form>
      </div>

      {/* Issues List */}
      <div className="grid gap-4">
        {issues.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <p>No issues found.</p>
                <Link to="/issues/new" className="text-blue-600 hover:text-blue-700">
                  Create the first issue
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          issues.map((issue: any) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      <Link 
                        to={`/issues/${issue.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {issue.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {issue.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    Created {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                  {issue.resolvedAt && (
                    <span>
                      Resolved {new Date(issue.resolvedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {issues.length === searchParams.limit && (
        <div className="mt-8 flex justify-center">
          <Link 
            to={`/issues?${new URLSearchParams(
              Object.fromEntries(
                Object.entries({
                  q: searchParams.query,
                  category: searchParams.category,
                  status: searchParams.status,
                  severity: searchParams.severity,
                  limit: String(searchParams.limit),
                  offset: String(searchParams.offset + searchParams.limit)
                }).filter(([, value]) => value !== undefined && value !== null) as [string, string][]
              )
            ).toString()}`}
          >
            <Button variant="outline">Load More</Button>
          </Link>
        </div>
      )}
    </div>
  );
}