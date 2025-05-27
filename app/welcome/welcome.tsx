import { AlertCircle, FileText, ArrowUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export function Welcome() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 pt-16 pb-4">
      <div className="container mx-auto flex flex-col items-center gap-16 px-4 transition-opacity duration-700 opacity-100">
        <header className="flex flex-col items-center gap-9">
          <h1 className="text-5xl font-bold text-center text-gray-900 dark:text-gray-100 tracking-tight">
            Since Last Accident
          </h1>
          <p className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-[800px] px-4 leading-relaxed">
            Your centralized knowledge base for tracking, documenting, and
            solving development issues across all your software projects
          </p>
        </header>

        <div className="max-w-[900px] w-full space-y-10 px-4">
          <Card className="rounded-3xl border border-gray-200 bg-white dark:bg-gray-800/50 dark:border-gray-700 shadow-lg p-10 space-y-8 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-4 p-0">
              <CardTitle className="text-3xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                Never Let The Same Bug Bite Twice
              </CardTitle>
              <CardDescription className="text-lg text-gray-700 dark:text-gray-300 text-center leading-relaxed max-w-[700px] mx-auto">
                "Since Last Accident" is your team's ultimate tool for capturing
                development challenges, sharing solutions, and reducing downtime.
                Document issues as they arise, create permanent records of fixes,
                and build a collective knowledge base that grows with your
                projects.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 pt-6">
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm">
                  <div className="mx-auto p-3 bg-red-100 dark:bg-red-900/30 rounded-full mt-6">
                    <AlertCircle className="h-10 w-10 text-red-500" />
                  </div>
                  <CardHeader>
                    <CardTitle>
                      Capture Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      Document bugs, errors, and unexpected behaviors as they occur
                      in your development process.
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm">
                  <div className="mx-auto p-3 bg-green-100 dark:bg-green-900/30 rounded-full mt-6">
                    <FileText className="h-10 w-10 text-green-500" />
                  </div>
                  <CardHeader>
                    <CardTitle>
                      Share Solutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      Create reusable solutions that your entire team can access,
                      search, and apply across all your projects.
                    </p>
                  </CardContent>
                </Card>

                <Card className="flex flex-col rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-sm">
                  <div className="mx-auto p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-6">
                    <ArrowUp className="h-10 w-10 text-blue-500" />
                  </div>
                  <CardHeader>
                    <CardTitle>
                      Reduce Downtime
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      Minimize repeat issues with a centralized knowledge base that
                      grows smarter with every solved problem.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8 opacity-80 hover:opacity-100 transition-opacity">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Start building your team's knowledge repository today
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
