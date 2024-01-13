import {
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/cloudflare";
import { getUser } from "~/supabase.server";
import { prismaClient } from "~/utils/prisma.server";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import { useLoaderData } from "@remix-run/react";

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
  const [itemsResult, purchasesResult] = await Promise.allSettled([
    itemsPromise,
    purchasesPromise,
  ]);
  if (itemsResult.status === "rejected") {
    throw itemsResult.reason;
  }
  if (purchasesResult.status === "rejected") {
    throw purchasesResult.reason;
  }
  const items = itemsResult.value;
  const purchases = purchasesResult.value;
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
        <div className="card card-bordered w-64 bg-base-100 shadow-xl">
          <div className="stat card-body flex items-center justify-center">
            <h2 className="stat-title">{thisMonth}月の利用料金</h2>
            <p className="stat-value">&yen;{total}</p>
          </div>
        </div>
      </div>
      <div className="w-full pt-3 h-screen">
        <ul className="flex flex-wrap gap-8 justify-center">
          {items.map((data) => (
            <li
              className="card card-bordered w-64 bg-base-100 shadow-xl"
              key={data.id}
            >
              <div className="card-body">
                <div className="card-title">{data.name}</div>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">&yen;{data.price}</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
