import { redirect } from "@remix-run/cloudflare";
import { supabaseClient } from "~/utils/supabase.server";
import { badRequest } from "~/utils/request.server";
import { commitSession, getSession } from "~/utils/session.server";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";

// this route is for handling the callback from the email magic link

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  if (typeof token_hash !== "string") {
    return badRequest({
      message: "Invalid query. If you're not happy with it, try again.",
    });
  }
  const {
    data: { session: supabaseSession },
    error,
  } = await supabaseClient(context).auth.verifyOtp({
    token_hash,
    type: "email",
  });
  console.log(error);
  if (!supabaseSession) {
    return redirect("/login");
  }
  const userSession = await getSession(request.headers.get("Cookie"));
  userSession.set("access_token", supabaseSession.access_token);
  return redirect("/user", {
    headers: {
      "Set-Cookie": await commitSession(userSession),
    },
  });
};
