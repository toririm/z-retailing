import { redirect } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { prismaClient } from "~/utils/prisma.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authUser = await getUser(context, request);
  if (!authUser) {
    return redirect("/login");
  }
  const prisma = prismaClient(context);
  const user = await prisma.user.findUnique({
    where: { authId: authUser.id },
  });
  if (!user) {
    return redirect("/setup");
  }
  console.log(user);
  return { admin: user.admin };
};

export default function UserRoute() {
  const {admin} = useLoaderData<typeof loader>();
  return (
    <>
      <nav className="navbar bg-base-100">
        <div className="navbar-start">
          <h1 className="btn btn-ghost text-xl">Ｚ物販</h1>
        </div>
        <div className="navbar-end">
          {admin ? (
            <Link to="/admin" className="btn btn-ghost">
              管理者ページ
            </Link>
          ) : null}
          <Link to="/logout" className="btn btn-ghost">
            ログアウト
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
