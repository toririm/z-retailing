import { redirect } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { getUser } from "~/supabase.server";
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
  return user;
};

export default function UserRoute() {
  return (
    <>
      <nav className="navbar bg-base-100">
        <h1 className="btn btn-ghost text-xl">Ｚ物販</h1>
      </nav>
      <Outlet />
    </>
  );
}
