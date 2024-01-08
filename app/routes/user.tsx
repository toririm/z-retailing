import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Outlet } from "@remix-run/react";
import { supabaseClient } from "~/supabase";
import { getSession } from "~/utils/session.server";


export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const userSession = await getSession(request.headers.get("Cookie"));
  if (!userSession.has("access_token")) {
    return redirect("/login");
  }
  const {
    data: { user },
    error
  } = await supabaseClient(context).auth.getUser(
    userSession.get("access_token")
  );
  return { user };
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
