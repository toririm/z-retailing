import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { getUser } from "~/utils/supabase.server";
import { prismaClient } from "~/utils/prisma.server";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { modal } from "~/utils/modal.client";

export const meta: MetaFunction = () => {
  return [
    { title: "ホーム | Z物販" },
    { name: "description", content: "Z物販の購入画面です" },
  ];
};

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const user = await getUser(context, request);
  if (!user) {
    return redirect("/login");
  }
  const prisma = prismaClient(context);
  // 以降のDBアクセスは並列化する
  const itemsPromise = prisma.item.findMany({
    where: {
      deletedAt: null,
    },
  });
  dayjs.locale(ja);
  const startOfMonth = dayjs().startOf("month").toDate();
  const endOfMonth = dayjs().startOf("month").add(1, "month").toDate();
  console.log(startOfMonth, endOfMonth);
  const purchasesPromise = prisma.purchase.findMany({
    include: {
      item: true,
    },
    where: {
      userId: user.id,
      createdAt: {
        // startOfMonth <= createdAt < endOfMonth
        gte: startOfMonth,
        lt: endOfMonth,
      },
      deletedAt: null,
    },
  });
  // ここでまとめてawaitする
  const [items, purchases] = await Promise.all([
    itemsPromise,
    purchasesPromise,
  ]);
  let total = 0;
  for (const purchase of purchases) {
    total += purchase.item.price;
  }
  console.log({ total, items, purchases });
  const thisMonth = dayjs().month() + 1;
  return { thisMonth, total, items };
};

export default function Index() {
  const { thisMonth, total, items } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="w-full flex items-center justify-center mt-4 mb-2">
        <Link
          to="/user/history"
          className="card card-bordered w-64 bg-base-100 shadow-xl"
        >
          <div className="stat card-body flex items-center justify-center">
            <h2 className="font-bold">{thisMonth}月の利用料金</h2>
            <p className="stat-value">&yen;{total}</p>
            <p className="stat-desc">クリックして履歴を確認</p>
          </div>
        </Link>
      </div>
      <div className="m-5">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>商品名</th>
              <th>価格</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <th>{index + 1}</th>
                <td>{item.name}</td>
                <td>
                  <button
                    className="btn btn-outline btn-sm btn-info"
                    onClick={() => modal(`modal-${item.id}`).showModal()}
                  >
                    &yen; {item.price}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.map((item) => (
          <dialog key={item.id} className="modal" id={`modal-${item.id}`}>
            <div className="modal-box">
              <h3 className="font-bold text-lg">{item.name}を購入しますか？</h3>
              <p>&yen; {item.price}</p>
              <div className="modal-action">
                <Form method="post" action="purchase">
                  <input type="hidden" name="itemId" value={item.id} />
                  <button
                    className="btn btn-info"
                    type="submit"
                    onClick={() => modal(`modal-${item.id}`).close()}
                  >
                    購入
                  </button>
                </Form>
                <form method="dialog">
                  <button className="btn">キャンセル</button>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        ))}
      </div>
    </>
  );
}
