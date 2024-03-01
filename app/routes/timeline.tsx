import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { dayjsJP } from "~/utils/dayjs";
import { prismaClient } from "~/utils/prisma.server";

export const meta = () => [
	{ title: "タイムライン | Z物販" },
	{ name: "description", content: "最新の購入履歴が閲覧できます" },
];

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
	return { purchases: purchases.reverse() };
};

export default function Timeline() {
	const { purchases } = useLoaderData<typeof loader>();
	const dayjs = dayjsJP();
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
			<div className="m-5 overflow-y-scroll h-[85svh]">
				<table className="table table-zebra">
					<thead className="sticky top-0 bg-base-100">
						<tr>
							<th>日時</th>
							<th>内容</th>
						</tr>
					</thead>
					<tbody>
						{purchases.map((purchase) => (
							<tr key={purchase.id}>
								<td>{dayjs(purchase.createdAt).tz().format("M/D H:mm")}</td>
								<td>
									誰かが
									<span className="font-bold pl-1">{purchase.item.name}</span>
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
