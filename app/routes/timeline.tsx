import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import { prismaClient } from "~/utils/prisma.server";

export const loader = async ({ context }: LoaderFunctionArgs) => {
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
		},
	});
	const recentPurchases = purchases.slice(0, Math.max(10, purchases.length));
	return { purchases: recentPurchases };
};

export default function Timeline() {
	const { purchases } = useLoaderData<typeof loader>();
	return (
		<>
			<nav className="navbar bg-base-100">
				<div className="navbar-start">
					<Link to="/user" className="btn btn-ghost text-xl">
						Ｚ物販
					</Link>
				</div>
				<div className="navbar-end mr-4">
					<Link to="/user" className="btn btn-ghost">
						ホーム
					</Link>
				</div>
			</nav>
			<div className="m-5">
				<div className="table table-zebra">
					<thead>
						<tr>
							<th>日時</th>
							<th>内容</th>
						</tr>
					</thead>
					<tbody>
						{purchases.map((purchase) => (
							<tr key={purchase.id}>
								<td>{dayjs(purchase.createdAt).format("M/D H:mm")}</td>
								<td>
									誰かが
									<span className="font-bold pl-1">{purchase.item.name}</span>
									<span className="pr-1">（&yen; {purchase.item.price}）</span>
									を購入したよ！
								</td>
							</tr>
						))}
					</tbody>
				</div>
			</div>
		</>
	);
}