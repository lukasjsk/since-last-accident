import { createCookieSessionStorage } from "react-router";

type SessionData = {
  user: string;
};

type SessionFlashData = {
  error: string;
  success: string;
};

// You can add secrets to environment variables
// For development, we'll use a default secret
const secret = process.env.SESSION_SECRET || "dev-secret-change-in-production";

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  // a Cookie from `createCookie` or the CookieOptions to create one
  cookie: {
    name: "__session",
    // all of these are optional
    domain: process.env.NODE_ENV === "production" ? process.env.COOKIE_DOMAIN : undefined,
    expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000), // 30 days
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
    sameSite: "lax",
    secrets: [secret],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;