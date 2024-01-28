import { type LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { prismaClient } from "~/utils/prisma.server";
import { getAdmin } from "~/utils/supabase.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
	const adminUser = await getAdmin(context, request);
	if (!adminUser) {
		return redirect("/user");
	}
	const prisma = prismaClient(context);
	const users = await prisma.user.findMany();
	return { users };
};

export const meta = () => [
	{ title: "ユーザー管理 | Z物販" },
	{ name: "description", content: "管理者ページです" },
];

export default function AdminUsersRoute() {
	const { users } = useLoaderData<typeof loader>();
	return (
		<div className="overflow-x-auto p-4 pl-8">
			<div className="flex space-x-8">
				<ul className="menu bg-base-200 w-56 rounded-box flex-nowrap overflow-y-scroll h-[70svh]">
					{users.map((user) => (
						<li key={user.id}>
							<Link
								to={`/admin/users/${user.id}`}
								className={user.admin ? "text-primary" : ""}
							>
								{user.name}
							</Link>
						</li>
					))}
				</ul>
				<Outlet />
			</div>
		</div>
	);
}
