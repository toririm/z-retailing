import { createCookieSessionStorage } from "@remix-run/cloudflare";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "z-retailing-supabase-auth",

      httpOnly: true,
      maxAge: 3600,
      path: "/",
      sameSite: "lax",
      secrets: ["thisShouldBeSecureValueButIAmStupidSorry"],
      secure: false,
    },
  });
