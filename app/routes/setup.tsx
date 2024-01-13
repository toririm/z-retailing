import { Form, redirect, useActionData } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { supabaseClient } from "~/supabase.server";
import { getSession } from "~/utils/session.server";
import { prismaClient } from "~/utils/prisma.server";

export const meta = () => [
  { title: "ニックネームを入れよう！ | Z物販" },
  { name: "description", content: "ニックネームを入れよう！" },
];

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const nickname = form.get("nickname");
  if (typeof nickname !== "string") {
    return badRequest({
      nickname: "",
      errorMsg: "フォームが正しく送信されませんでした",
    });
  }
  const supabase = supabaseClient(context);
  const session = await getSession(request.headers.get("Cookie"));
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(session.get("access_token"));
  const prisma = prismaClient(context);
  if (!user) {
    return badRequest({
      nickname: "",
      errorMsg: "ログインが失敗しています",
    });
  }
  if (!user.email) {
    return badRequest({
      nickname: "",
      errorMsg: "ログイン不正:メールドレスが登録されていません",
    });
  }
  try {
    const data = await prisma.user.create({
      data: {
        authId: user.id,
        name: nickname,
        email: user.email,
      },
    });
  } catch (e) {
    console.log(e);
    return badRequest({
      nickname: "",
      errorMsg: "既に登録されています",
    });
  }
  return redirect("/user");
};

export default function Setup() {
  const actionData = useActionData<typeof action>();
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="card card-bordered bg-base-100 shadow-xl">
        <Form method="post" className="card-body items-center">
          <h2 className="card-title">ニックネームを入れよう！</h2>
          <label className="from-control">
            <div className="label">
              <span className="label-text">ニックネーム</span>
            </div>
            <input
              name="nickname"
              type="text"
              placeholder="だいだい"
              className="input input-bordered"
              autoComplete="off"
              required
            />
          </label>
          <div className="label">
            {actionData?.errorMsg ? (
              <span className="label-text-alt text-error" role="alert">
                {actionData.errorMsg}
              </span>
            ) : null}
          </div>
          <div className="card-actions p-3">
            <button type="submit" className="btn btn-wide btn-info">
              登録
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
