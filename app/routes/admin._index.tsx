import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	redirect,
} from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import { useState } from "react";
import { modal } from "~/utils/modal.client";
import { prismaClient } from "~/utils/prisma.server";
import { badRequest } from "~/utils/request.server";
import { getAdmin } from "~/utils/supabase.server";

export const meta = () => [
	{ title: "管理者ページ | Z物販" },
	{ name: "description", content: "管理者ページです" },
];

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
	const adminUserPromise = getAdmin(context, request);
	const prisma = prismaClient(context);
	const itemsPromise = await prisma.item.findMany({
		include: {
			purchases: {
				where: {
					deletedAt: null,
				},
			},
		},
		where: {
			deletedAt: null,
		},
	});
	const [adminUser, items] = await Promise.all([
		adminUserPromise,
		itemsPromise,
	]);
	if (!adminUser) {
		return redirect("/user");
	}
	console.log(items);
	return { items };
};

export const action = async ({ context, request }: ActionFunctionArgs) => {
	const adminUser = await getAdmin(context, request);
	if (!adminUser) {
		return redirect("/user");
	}
	const form = await request.formData();
	const name = form.get("name");
	const price = form.get("price");
	if (typeof name !== "string" || typeof price !== "string") {
		return badRequest({
			errorMsg: "フォームが正しく送信されませんでした",
		});
	}
	if (name.length === 0) {
		return badRequest({
			errorMsg: "商品名を入力してください",
		});
	}
	const priceNum = parseInt(price);
	if (Number.isNaN(priceNum)) {
		return badRequest({
			errorMsg: "価格の値が不正です",
		});
	}
	const prisma = prismaClient(context);
	try {
		const result = await prisma.item.create({
			data: {
				name,
				price: priceNum,
			},
		});
		console.log(result);
		return {
			errorMsg: null,
		};
	} catch (e) {
		console.log(e);
		return badRequest({
			errorMsg: "登録に失敗しました",
		});
	}
};

export default function Admin() {
	const { items } = useLoaderData<typeof loader>();
	const createItemResult = useActionData<typeof action>();
	const [inputItem, setInputItem] = useState({
		name: "",
		price: "",
	});
	const handleSubmit = () => {
		setInputItem({
			name: "",
			price: "",
		});
	};
	dayjs.locale(ja);
	return (
		<>
			<div className="overflow-x-auto m-5">
				<table className="table">
					<thead>
						<tr>
							<th />
							<th>商品名</th>
							<th>価格</th>
							<th>販売数</th>
							<th>登録日時</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{items.map((item, index) => (
							<tr key={item.id}>
								<th>{index + 1}</th>
								<td>{item.name}</td>
								<td>&yen; {item.price}</td>
								<td>{item.purchases.length}</td>
								<td>{dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}</td>
								<td>
									<button
										type="button"
										className="btn btn-xs btn-outline btn-error"
										onClick={() => modal(`modal-${item.id}`).showModal()}
									>
										削除
									</button>
								</td>
							</tr>
						))}
						<tr>
							<th>{items.length + 1}</th>
							<td>
								<input
									type="text"
									className="input input-sm input-bordered"
									placeholder="商品名"
									value={inputItem.name}
									onChange={(e) =>
										setInputItem({ ...inputItem, name: e.target.value })
									}
								/>
							</td>
							<td>
								&yen;{" "}
								<input
									type="text"
									className="input input-sm input-bordered"
									placeholder="120"
									value={inputItem.price}
									onChange={(e) =>
										setInputItem({
											...inputItem,
											price: e.target.value,
										})
									}
								/>
							</td>
							<td />
							<td />
							<td>
								<button
									type="button"
									className="btn btn-outline btn-xs btn-success"
									onClick={() => modal("modal-add").showModal()}
								>
									追加
								</button>
							</td>
						</tr>
					</tbody>
				</table>
				{createItemResult?.errorMsg ? (
					<div role="alert" className="alert alert-error">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<title>エラー</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{createItemResult?.errorMsg}</span>
					</div>
				) : null}
				<dialog className="modal" id="modal-add">
					<div className="modal-box">
						<h3 className="font-bold text-lg">商品を追加しますか？</h3>
						<p>商品名「{inputItem.name}」</p>
						<p>価　格「&yen; {inputItem.price}」</p>
						<div className="modal-action">
							<Form method="post" onSubmit={handleSubmit}>
								<input
									type="hidden"
									name="name"
									value={inputItem.name}
									onChange={(e) =>
										setInputItem({ ...inputItem, name: e.target.value })
									}
								/>
								<input
									type="hidden"
									name="price"
									value={inputItem.price}
									onChange={(e) =>
										setInputItem({
											...inputItem,
											price: e.target.value,
										})
									}
								/>
								<button
									className="btn btn-success"
									type="submit"
									onClick={() => modal("modal-add").close()}
								>
									追加
								</button>
							</Form>
							<form method="dialog">
								<button type="submit" className="btn">
									キャンセル
								</button>
							</form>
						</div>
					</div>
					<form method="dialog" className="modal-backdrop">
						<button type="submit">close</button>
					</form>
				</dialog>
				{items.map((item) => (
					<dialog key={item.id} className="modal" id={`modal-${item.id}`}>
						<div className="modal-box">
							<h3 className="font-bold text-lg">商品を削除しますか？</h3>
							<p>{item.name}</p>
							<p>&yen; {item.price}</p>
							<div className="modal-action">
								<Form method="post" action="delete">
									<input type="hidden" name="itemId" value={item.id} />
									<button
										className="btn btn-error"
										type="submit"
										onClick={() => modal(`modal-${item.id}`).close()}
									>
										削除
									</button>
								</Form>
								<form method="dialog">
									<button type="submit" className="btn">
										キャンセル
									</button>
								</form>
							</div>
						</div>
						<form method="dialog" className="modal-backdrop">
							<button type="submit">close</button>
						</form>
					</dialog>
				))}
			</div>
		</>
	);
}
