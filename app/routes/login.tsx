import { Form } from "@remix-run/react";

export default function Login() {
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="card bg-base-100 shadow-xl">
        <Form method="post" className="card-body items-center text-center">
          <h2 className="card-title">Z物販 ログイン</h2>
          <label className="from-control">
            <div className="label">
              <span className="label-text">大学メールアドレス</span>
            </div>
            <input
              name="email"
              type="email"
              placeholder="s9999999@u.tsukuba.ac.jp"
              className="input input-bordered"
            />
          </label>
          <div className="card-actions mt-3">
            <button type="submit" className="btn btn-wide btn-info">ログイン</button>
          </div>
        </Form>
      </div>
    </div>
  );
}
