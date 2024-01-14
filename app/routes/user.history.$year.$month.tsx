import {
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";
import { prismaClient } from "~/utils/prisma.server";
import { getUser } from "~/utils/supabase.server";

export const meta: MetaFunction = ({ params }) => [
  { title: `購入履歴 - ${params.year}年${params.month}月 | Z物販` },
  { name: "description", content: "購入履歴を提供します" },
];

export const loader = async ({
  context,
  request,
  params,
}: LoaderFunctionArgs) => {
  if (typeof params.year !== "string" || typeof params.month !== "string") {
    return redirect("/user/history");
  }
  const year = parseInt(params.year);
  const month = parseInt(params.month);
  if (isNaN(year) || isNaN(month)) {
    return redirect("/user/history");
  }
  if (month < 1 || month > 12) {
    return redirect("/user/history");
  }
  const user = await getUser(context, request);
  if (!user) {
    return redirect("/login");
  }
  dayjs.locale(ja);
  const baseDate = dayjs()
    .year(year)
    .month(month - 1);
  const startOfMonth = baseDate.startOf("month").toDate();
  const endOfMonth = baseDate.add(1, "month").startOf("month").toDate();
  const prisma = prismaClient(context);
  const purchases = await prisma.purchase.findMany({
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
  console.log(purchases);
  return { user, purchases, year, month };
};

export default function UserHistoryYearMonth() {
  const { user, purchases, year, month } = useLoaderData<typeof loader>();
  dayjs.locale(ja);
  const getYM = (date: dayjs.Dayjs) => {
    const year = date.year().toString();
    const month = (date.month() + 1).toString().padStart(2, "0");
    return { year, month };
  };
  const thisDate = dayjs()
    .year(year)
    .month(month - 1);
  const prevDate = getYM(thisDate.subtract(1, "month"));
  const nextDate = getYM(thisDate.add(1, "month"));
  return (
    <>
      <div>
        <div className="ml-8">
          <h1 className="text-2xl font-bold">購入履歴</h1>
          <p className="text-xl">
            {year}年{month}月
          </p>
          <p className="text-xl">{user.name}さん</p>
        </div>
        <div className="mt-3 flex justify-center">
          <div className="join">
            <Link
              to={`/user/history/${prevDate.year}/${prevDate.month}`}
              className="join-item btn btn-sm"
            >
              {`≪ ${parseInt(prevDate.month)}月`}
            </Link>
            <div className="join-item btn btn-sm btn-disabled">
              {`${year}.${month}`}
            </div>
            <Link
              to={`/user/history/${nextDate.year}/${nextDate.month}`}
              className="join-item btn btn-sm"
            >
              {`${parseInt(nextDate.month)}月 ≫`}
            </Link>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto m-5">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>日時</th>
              <th>商品名</th>
              <th>価格</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => (
              <tr key={purchase.id}>
                <th>{index + 1}</th>
                <td>{dayjs(purchase.createdAt).format("M/D HH:mm")}</td>
                <td>{purchase.item.name}</td>
                <td>&yen; {purchase.item.price}</td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td>合計</td>
              <td>
                &yen;{" "}
                {purchases.reduce(
                  (sum, purchase) => sum + purchase.item.price,
                  0,
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
