import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, Form } from "react-router";
import { requireAuth } from "~/services/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  return { user };
}

export function meta() {
  return [
    { title: "Since Last Accident - Dashboard" },
    { name: "description", content: "Track and manage development team incidents" },
  ];
}

export default function Home() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Since Last Accident</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.username}!</span>
              <Form action="/logout" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Days Since Last Accident</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">0</div>
                <p className="text-gray-600">Keep up the good work!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">0</div>
                <p className="text-gray-600">Issues logged</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolved Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600">0</div>
                <p className="text-gray-600">Solutions documented</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button className="w-full">
                    Report New Issue
                  </Button>
                  <Button variant="outline" className="w-full">
                    Search Issues
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Categories
                  </Button>
                  <Button variant="outline" className="w-full">
                    Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
