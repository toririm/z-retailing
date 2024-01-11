import { redirect } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { getUser } from "~/supabase.server";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { prismaClient } from "~/utils/prisma.server";

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const user = await getUser(context, request);
  if (!user) {
    return redirect("/login");
  }
  const prisma = prismaClient(context);
  const data = await prisma.user.findUnique({
    where: { authId: user.id },
  });
  if (!data) {
    return redirect("/setup");
  }
  console.log(data);
};

export default function UserRoute() {
  return (
    <>
      <nav className="navbar bg-base-100">
        <h1>Ｚ物販</h1>
      </nav>
      <Outlet />
    </>
  );
}
