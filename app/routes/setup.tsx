import { Form, redirect } from "@remix-run/react";
import { badRequest } from "~/utils/request.server";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { supabaseClient } from "~/supabase.server";

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const nickname = form.get("nickname");
  if (typeof nickname !== "string") {
    return badRequest({
      nickname: "",
      errorMsg: "フォームが正しく送信されませんでした",
    });
  }
  // todo: create user record
  return redirect("/user");
}

export default function Setup() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="card bg-base-100 shadow-xl">
        <Form method="post" className="card-body items-center text-center">
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
          <div className="card-actions p-3">
            <button type="submit" className="btn btn-wide btn-info">登録</button>
          </div>
        </Form>
      </div>
    </div>
  );
}
