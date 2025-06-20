import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, redirect, useActionData } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getUser, login, createUserSession } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // If user is already authenticated, redirect to home
  const user = await getUser(request);
  if (user) {
    return redirect("/");
  }
  return { user: null };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    // Validate input
    if (!username || !password) {
      return {
        error: "Username and password are required",
      };
    }

    // Authenticate the user
    const user = await login(username, password);
    return createUserSession(user.id.toString(), "/");
  } catch (error) {
    // Return error message to display in the form
    return {
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}


function LoginForm({
  className,
  error,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { error?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username and password to access the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post">
            <div className="flex flex-col gap-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Login() {
  const actionData = useActionData<typeof action>();

  const error = actionData && "error" in actionData ? actionData.error : undefined;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <LoginForm error={error} />
      </div>
    </div>
  );
}
