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
import { requireAdmin } from "~/services/auth.server";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import bcrypt from "bcryptjs";

export async function loader({ request }: LoaderFunctionArgs) {
  // Only admins can access the registration page
  await requireAdmin(request);
  return {};
}

export async function action({ request }: ActionFunctionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const role = formData.get("role") as "admin" | "user";

  // Validate required fields
  if (!username || !email || !password || !confirmPassword) {
    return {
      error: "All fields are required",
    };
  }

  // Validate password match
  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    };
  }

  // Validate password length
  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters long",
    };
  }

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
      username,
      email,
      passwordHash,
      role: role || "user",
    });

    return redirect("/");
  } catch (error) {
    // Handle duplicate username/email
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      return {
        error: "Username or email already exists",
      };
    }
    return {
      error: "Failed to create user",
    };
  }
}

function RegisterForm({
  className,
  error,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { error?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New User</CardTitle>
          <CardDescription>
            Create a new user account for the application
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
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="user"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <Button type="submit" className="w-full">
                Create User
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Register() {
  const actionData = useActionData<typeof action>();
  const error = actionData && "error" in actionData ? actionData.error : undefined;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md">
        <RegisterForm error={error} />
      </div>
    </div>
  );
}