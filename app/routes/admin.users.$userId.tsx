import { type LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { type Dayjs } from "dayjs";
import { useState } from "react";
import { dayjsJP } from "~/utils/dayjs";
import { prismaClient } from "~/utils/prisma.server";
import { getAdmin } from "~/utils/supabase.server";

export const loader = async ({
	context,
	params,
	request,
}: LoaderFunctionArgs) => {
	const adminUser = await getAdmin(context, request);
	if (!adminUser) {
		return redirect("/user");
	}
	const userId = params.userId;
	if (typeof userId !== "string") {
		return redirect("/admin/users");
	}
	const prisma = prismaClient(context);
	const user = await prisma.user.findUnique({
		where: { id: userId },
		include: {
			purchases: {
				where: {
					deletedAt: null,
				},
				include: {
					item: true,
				},
			},
		},
	});
	if (!user) {
		return redirect("/admin/users");
	}
	return { user };
};

export default function AdminUsersDetails() {
	const { user } = useLoaderData<typeof loader>();
	const dayjs = dayjsJP();
	const defaultMonth =
		dayjs().date() < 15 // 15日以降は当月、15日以前は先月を表示
			? dayjs().startOf("month").subtract(1, "month")
			: dayjs().startOf("month");
	const [current, setCurrent] = useState(defaultMonth);
	const goNext = () => setCurrent(current.add(1, "month"));
	const goPrev = () => setCurrent(current.subtract(1, "month"));
	const getYM = (date: Dayjs) => {
		const year = date.year().toString();
		const month = (date.month() + 1).toString().padStart(2, "0");
		return { year, month };
	};
	const prevDate = () => getYM(current.subtract(1, "month"));
	const thisDate = () => getYM(current);
	const nextDate = () => getYM(current.add(1, "month"));
	const thisDatePurchases = () =>
		user.purchases.filter((purchase) =>
			current.isSame(dayjs(purchase.createdAt), "month"),
		);
	return (
		<>
			<div className="w-1/3">
				<div className="p-3 card bg-base-200">
					<div className="p-2">
						<h2 className="card-title">
							{user.name}
							{user.admin && (
								<div className="badge badge-outline badge-primary">管理者</div>
							)}
						</h2>
						<div>{user.email}</div>
						<div className="stat-desc">
							登録日時: {dayjs(user.createdAt).format("YYYY/M/D H:mm")}
						</div>
					</div>
				</div>

				<div className="flex justify-center items-center p-3">
					<div className="join">
						<button
							type="button"
							className="join-item btn btn-sm"
							onClick={goPrev}
						>
							{`≪ ${parseInt(prevDate().month)}月`}
						</button>
						<div className="join-item btn btn-sm">
							{`${thisDate().year}.${thisDate().month}`}
						</div>
						<button
							type="button"
							className="join-item btn btn-sm"
							disabled={current.add(1, "month").toDate() > dayjs().toDate()}
							onClick={goNext}
						>
							{`${parseInt(nextDate().month)}月 ≫`}
						</button>
					</div>
				</div>
				<table className="table table-zebra">
					<thead>
						<tr>
							<th />
							<th>購入日</th>
							<th>商品名</th>
							<th>金額</th>
						</tr>
					</thead>
					<tbody>
						{thisDatePurchases().map((purchase, index) => (
							<tr key={purchase.id}>
								<th>{index + 1}</th>
								<td>{dayjs(purchase.createdAt).format("M/D H:mm")}</td>
								<td>{purchase.item.name}</td>
								<td>{purchase.item.price}</td>
							</tr>
						))}
						{thisDatePurchases().length === 0 && (
							<tr>
								<th />
								<td colSpan={3}>
									{current.year()}.{current.month() + 1}の購入履歴はありません
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
			<div className="w-1/3">
				<div className="card card-bordered shadow-xl w-72 bg-base-200">
					<div className="stat card-body">
						<h2 className="card-title">
							{current.year()} 年 {current.month() + 1} 月
						</h2>
						<p className="stat-value">
							&yen;{" "}
							{thisDatePurchases().reduce(
								(sum, purchase) => sum + purchase.item.price,
								0,
							)}
						</p>
					</div>
				</div>
			</div>
		</>
	);
}
