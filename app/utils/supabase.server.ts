import { AppLoadContext, redirect } from "@remix-run/cloudflare";
import { createClient } from "@supabase/supabase-js";
import { destroySession, getSession } from "./session.server";
import { Env } from "~/env";
import { prismaClient } from "./prisma.server";

export const supabaseClient = (context: AppLoadContext) => {
  const env = context.env as Env;
  return createClient(
    env.SUPABASE_URL as string,
    env.SUPABASE_ANON_KEY as string,
    {
      global: {
        fetch: (...args) => fetch(...args),
      },
    },
  );
};

export const getAuthUser = async (
  context: AppLoadContext,
  request: Request,
) => {
  const supabase = supabaseClient(context);
  const userSession = await getSession(request.headers.get("Cookie"));
  if (!userSession.has("access_token")) {
    return null;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser(userSession.get("access_token"));
  if (!user) {
    return null;
  }
  return user;
};

export const logout = async (request: Request, redirectUrl: string) => {
  const userSession = await getSession(request.headers.get("Cookie"));
  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await destroySession(userSession),
    },
  });
};

export const getAdmin = async (context: AppLoadContext, request: Request) => {
  const authUser = await getAuthUser(context, request);
  if (!authUser) {
    return null;
  }
  const prisma = prismaClient(context);
  const adminUser = await prisma.user.findUnique({
    where: {
      authId: authUser.id,
      admin: true,
    },
  });
  return adminUser;
};

export const getUser = async (context: AppLoadContext, request: Request) => {
  const authUser = await getAuthUser(context, request);
  if (!authUser) {
    return null;
  }
  const prisma = prismaClient(context);
  const user = await prisma.user.findUnique({
    where: {
      authId: authUser.id,
    },
  });
  return user;
};
