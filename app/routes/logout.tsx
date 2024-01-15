import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { logout } from "~/utils/supabase.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	return await logout(request, "/login");
};
