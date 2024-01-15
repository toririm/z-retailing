import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Link, Outlet } from "@remix-run/react";
import { getAdmin } from "~/utils/supabase.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
	const adminUser = await getAdmin(context, request);
	if (!adminUser) {
		return redirect("/user");
	}
	return {};
};

export default function AdminRoute() {
	return (
		<>
			<nav className="navbar bg-base-100">
				<div className="navbar-start">
					<Link to="/admin" className="btn btn-ghost text-xl">
						Ｚ物販 管理者ページ
					</Link>
				</div>
				<div className="navbar-end">
					<Link to="/user" className="btn btn-ghost">
						ユーザーページ
					</Link>
					<Link to="/logout" className="btn btn-ghost">
						ログアウト
					</Link>
				</div>
			</nav>
			<Outlet />
		</>
	);
}
