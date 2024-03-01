import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Link, Outlet } from "@remix-run/react";
import { getAdmin } from "~/utils/supabase.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
	const adminUser = await getAdmin(context, request);
	if (!adminUser) {
		// return redirect("/user");
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
				<div className="navbar-end mr-4">
					<Link to="/admin" className="btn btn-ghost">
						商品管理
					</Link>
					<Link to="/admin/users" className="btn btn-ghost">
						ユーザー管理
					</Link>
					<Link to="/admin/timeline" className="btn btn-ghost">
						購入ログ
					</Link>
				</div>
			</nav>
			<Outlet />
			<div className="divider" />
			<nav className="navbar bg-base-100 pb-7">
				<div className="navbar-start ml-4">
					<Link to="/user" className="btn btn-ghost text-info">
						ユーザーページ
					</Link>
				</div>
				<div className="navbar-end mr-4">
					<Link to="/logout" className="btn btn-ghost text-error">
						ログアウト
					</Link>
				</div>
			</nav>
		</>
	);
}
