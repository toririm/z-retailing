import { ActionFunctionArgs, redirect } from "@remix-run/cloudflare";
import { prismaClient } from "~/utils/prisma.server";
import { badRequest } from "~/utils/request.server";
import { getUser } from "~/utils/supabase.server";

export const action = async ({ context, request }: ActionFunctionArgs) => {
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
  const form = await request.formData();
  const itemId = form.get("itemId");
  if (typeof itemId !== "string") {
    return badRequest({
      errorMsg: "フォームが正しく送信されませんでした",
    });
  }
  try {
    const result = await prisma.item.update({
      where: {
        id: itemId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    console.log(result);
    return redirect("/admin");
  } catch (e) {
    console.log(e);
    return badRequest({
      errorMsg: "削除に失敗しました",
    });
  }
};
