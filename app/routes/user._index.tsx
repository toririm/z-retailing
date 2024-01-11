import { redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
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
  const items = await prisma.item.findMany({
    where: {
      deletedAt: null,
    },
  });
  dayjs.locale(ja);
  const startOfMonth = dayjs().startOf("month").toDate();
  const endOfMonth = dayjs().startOf("month").add(1, "month").toDate();
  console.log(startOfMonth, endOfMonth);
  const purchases = await prisma.purchase.findMany({
    include: {
      item: true,
    },
    where: {
      userId: user.id,
      createdAt: { // startOfMonth <= createdAt < endOfMonth
        gte: startOfMonth,
        lt: endOfMonth,
      },
      deletedAt: null,
    },
  });
  let total = 0;
  for (const purchase of purchases) {
    total += purchase.item.price;
  }
  console.log({ total, items, purchases });
  return { total, items };
};

export default function Index() {
  const { total, items } = useLoaderData<typeof loader>();
  return (
    <>
      <div className="w-full flex items-center justify-center m-3">
        <div className="stat w-32">
          <h2 className="stat-title">12月の利用料金</h2>
          <p className="stat-value">&yen;{total}</p>
        </div>
      </div>
      <div className="w-full pt-3">
        <ul className="flex flex-wrap gap-8 justify-center">
          {items.map((data) => (
            <li className="card w-64 bg-base-100 shadow-xl" key={data.id}>
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
