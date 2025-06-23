import type { LoaderFunctionArgs } from "react-router";
import { Link, useLoaderData } from "react-router";
import { requireUser } from "~/services/auth.server";
import { CategoryService } from "~/lib/services";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUser(request);
  
  const categories = await CategoryService.getAllCategoriesWithStats();
  
  return { categories };
}

export default function CategoriesIndex() {
  const { categories } = useLoaderData<typeof loader>();

  const getCategoryColorClass = (color: string) => {
    // Ensure the color is safe for CSS classes
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage incident categories and track performance</p>
        </div>
        <Link to="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <p>No categories found.</p>
                  <p className="text-sm mt-2">Categories are managed by administrators.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          categories.map((category: any) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-4 h-4 rounded-full ${getCategoryColorClass(category.color)}`}
                    title={`Category color: ${category.color}`}
                  />
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </div>
                {category.description && (
                  <CardDescription className="mt-2 line-clamp-2">
                    {category.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {category.stats.totalIssues}
                    </div>
                    <div className="text-gray-600">Total Issues</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {category.stats.resolvedIssues}
                    </div>
                    <div className="text-gray-600">Resolved</div>
                  </div>
                  
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {category.stats.unresolvedIssues}
                    </div>
                    <div className="text-gray-600">Unresolved</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {category.stats.daysSinceLastAccident ?? "N/A"}
                    </div>
                    <div className="text-gray-600">Days Safe</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link to={`/categories/${category.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Link 
                    to={`/issues?category=${category.id}`} 
                    className="flex-1"
                  >
                    <Button className="w-full">
                      View Issues
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Additional Information */}
      {categories.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Category Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {categories.length}
                  </div>
                  <div className="text-gray-600">Total Categories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {categories.reduce((sum, cat) => sum + cat.stats.totalIssues, 0)}
                  </div>
                  <div className="text-gray-600">Total Issues</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {categories.reduce((sum, cat) => sum + cat.stats.resolvedIssues, 0)}
                  </div>
                  <div className="text-gray-600">Resolved Issues</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}