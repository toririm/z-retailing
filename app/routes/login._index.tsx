import { redirect } from "@remix-run/cloudflare";
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { badRequest } from "~/utils/request.server";
import { supabaseClient } from "~/utils/supabase.server";

export const meta = () => [
	{ title: "ログイン | Z物販" },
	{ name: "description", content: "Z物販のログインページ" },
];

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const form = await request.formData();
	const email = form.get("email");
	const accept = /^s\d{7}@u\.tsukuba\.ac\.jp$/;
	if (typeof email !== "string") {
		const errorMsg = "フォームが正しく送信されませんでした";
		return badRequest({
			email: "",
			errorMsg,
		});
	}
	if (!accept.test(email)) {
		const errorMsg = "メールアドレスの形式が正しくありません";
		return badRequest({
			email,
			errorMsg,
		});
	}
	const { data, error } = await supabaseClient(context).auth.signInWithOtp({
		email,
	});
	return redirect("/login/wait", 303);
};

export default function Login() {
	const actionData = useActionData<typeof action>();
	const navigation = useNavigation();
	const [fullEmail, setFullEmail] = useState(false);
	const [emailnum, setEmailnum] = useState("");
	return (
		<div className="h-screen flex justify-center items-center">
			<div className="card card-bordered bg-base-100 shadow-xl">
				<Form method="post" className="card-body items-center text-center">
					<h2 className="card-title">Z物販 ログイン</h2>
					<label className="from-control">
						<div className="label">
							<span className="label-text">大学メールアドレス</span>
						</div>
						<div hidden={fullEmail}>
							<span className="pr-0.5">s</span>
							<input
								type="text"
								className={`input input-bordered w-24 ${
									actionData?.errorMsg ? "input-error" : ""
								}`}
								onChange={(e) => setEmailnum(e.target.value)}
								autoComplete="off"
								value={emailnum}
							/>
							<span className="pl-0.5">@u.tsukuba.ac.jp</span>
						</div>
						<input
							name="email"
							type="email"
							placeholder="s9999999@u.tsukuba.ac.jp"
							className={`input input-bordered ${
								actionData?.errorMsg ? "input-error" : ""
							}`}
							value={
								fullEmail
									? actionData?.email
									: emailnum !== ""
									  ? `s${emailnum}@u.tsukuba.ac.jp`
									  : ""
							}
							autoComplete="off"
							hidden={!fullEmail}
						/>
						<div className="label">
							{actionData?.errorMsg ? (
								<span className="label-text-alt text-error" role="alert">
									{actionData.errorMsg}
								</span>
							) : null}
						</div>
						<div className="label">
							<input
								type="checkbox"
								className="toggle toggle-xs"
								onChange={(e) => setFullEmail(e.target.checked)}
							/>
							<span className="label-text-alt">
								メールアドレス全体を入力する
							</span>
						</div>
					</label>
					<div className="card-actions">
						<button
							type="submit"
							className="btn btn-wide btn-info"
							disabled={navigation.state !== "idle"}
						>
							{navigation.state !== "idle" ? (
								<span className="loading loading-dots loading-md" />
							) : (
								"ログイン"
							)}
						</button>
					</div>
				</Form>
			</div>
		</div>
	);
}
