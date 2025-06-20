import { redirect } from "react-router";
import { getSession, commitSession, destroySession } from "./session.server";
import { db } from "~/lib/db";
import { users } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { User } from "~/lib/db/schema";

const USER_SESSION_KEY = "user";

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get(USER_SESSION_KEY);
}

export async function getUser(request: Request): Promise<User | null> {
  const userId = await getUserId(request);
  if (!userId) {
    return null;
  }

  try {
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userId)))
      .limit(1);

    return userResult[0] || null;
  } catch {
    throw logout(request);
  }
}

export async function requireUser(request: Request): Promise<User> {
  const user = await getUser(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
}

export async function requireAdmin(request: Request): Promise<User> {
  const user = await requireUser(request);
  if (user.role !== "admin") {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await getSession();
  session.set(USER_SESSION_KEY, userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function login(username: string, password: string) {
  // Validate required fields
  if (!username || !password) {
    throw new Error("Username and password are required");
  }

  // Find user in database
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const user = userResult[0];

  if (!user) {
    throw new Error("Invalid username or password");
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("Invalid username or password");
  }

  // Update last login time
  await db
    .update(users)
    .set({ lastLoginAt: new Date() })
    .where(eq(users.id, user.id));

  return user;
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}