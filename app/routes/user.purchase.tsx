import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { prismaClient } from "~/utils/prisma.server";
import { badRequest } from "~/utils/request.server";
import { getUser } from "~/utils/supabase.server";

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const user = await getUser(context, request);
  if (!user) {
    return redirect("/login");
  }
  const form = await request.formData();
  const itemId = form.get("itemId");
  if (typeof itemId !== "string") {
    return badRequest({
      errorMsg: "フォームが正しく送信されませんでした",
    });
  }
  const prisma = prismaClient(context);
  try {
    await prisma.purchase.create({
      data: {
        userId: user.id,
        itemId,
      },
    });
    return redirect("/user");
  } catch (e) {
    console.log(e);
    return badRequest({
      errorMsg: "購入に失敗しました",
    });
  }
};
