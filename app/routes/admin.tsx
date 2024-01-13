import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { getUser } from "~/utils/supabase.server";
import { prismaClient } from "~/utils/prisma.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const authUser = await getUser(context, request);
  if (!authUser) {
    return redirect("/login");
  }
  const prisma = prismaClient(context);
  const user = await prisma.user.findUnique({
    where: {
      authId: authUser.id,
      admin: true,
    },
  });
  if (!user) {
    return redirect("/user");
  }
  return user;
};

export default function AdminRoute() {
  return (
    <>
      <nav className="navbar bg-base-100">
        <h1 className="btn btn-ghost text-xl">Ｚ物販 管理者ページ</h1>
      </nav>
      <Outlet />
    </>
  );
}
