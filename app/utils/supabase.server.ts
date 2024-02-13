import { type User } from "@prisma/client";
import { type AppLoadContext, redirect } from "@remix-run/cloudflare";
import { type User as AuthUser, createClient } from "@supabase/supabase-js";
import { Env } from "~/env";
import { prismaClient } from "./prisma.server";
import { commitSession, destroySession, getSession } from "./session.server";

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
): Promise<AuthUser | null> => {
	const supabase = supabaseClient(context);
	const userSession = await getSession(request.headers.get("Cookie"));
	if (!userSession.has("access_token")) {
		return null;
	}
	const {
		data: { user },
	} = await supabase.auth.getUser(userSession.get("access_token"));
	if (!user) {
		if (userSession.has("refresh_token")) {
			const {
				data: { session: supabaseSession },
			} = await supabase.auth.refreshSession({
				refresh_token: userSession.get("refresh_token"),
			});
			if (supabaseSession) {
				userSession.set("access_token", supabaseSession.access_token);
				userSession.set("refresh_token", supabaseSession.refresh_token);
				await commitSession(userSession);
			}
		} else {
			return null;
		}
		const {
			data: { user: refreshedUser },
		} = await supabase.auth.getUser(userSession.get("access_token"));
		return refreshedUser;
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

export const getAdmin = async (
	context: AppLoadContext,
	request: Request,
): Promise<User | null> => {
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

export const getUser = async (
	context: AppLoadContext,
	request: Request,
): Promise<User | null> => {
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
