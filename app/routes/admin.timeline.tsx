import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import { dayjsJP } from "~/utils/dayjs";
import { prismaClient } from "~/utils/prisma.server";
import { getAdmin } from "~/utils/supabase.server";

export const meta = () => [
	{ title: "管理者タイムライン | Z物販" },
	{ name: "description", content: "最新の購入履歴が閲覧できます" },
];

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
	const admin = getAdmin(context, request);
	if (!admin) {
		return redirect("/user");
	}
	const prisma = prismaClient(context);
	const purchases = await prisma.purchase.findMany({
		where: {
			deletedAt: null,
		},
		select: {
			id: true,
			createdAt: true,
			item: {
				select: {
					name: true,
					price: true,
				},
			},
			user: {
				select: {
					id: true,
					name: true,
				},
			},
		},
	});
	const recentPurchases = purchases.slice(0, Math.min(10, purchases.length));
	return { purchases: recentPurchases };
};

export default function Timeline() {
	const loaderData = useLoaderData<typeof loader>();
	const purchases = loaderData.purchases.slice().reverse();
	const dayjs = dayjsJP();
	return (
		<>
			<div className="m-5">
				<table className="table table-zebra">
					<thead>
						<tr>
							<th>日時</th>
							<th>内容</th>
						</tr>
					</thead>
					<tbody>
						{purchases.map((purchase) => (
							<tr key={purchase.id}>
								<td>{dayjs.tz(purchase.createdAt).format("M/D H:mm")}</td>
								<td>
									<Link
										to={`/admin/users/${purchase.user.id}`}
										className="font-bold pr-1"
									>
										{purchase.user.name}
									</Link>
									が<span className="font-bold pl-1">{purchase.item.name}</span>
									<span className="pr-1">（&yen; {purchase.item.price}）</span>
									を購入したよ！
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
