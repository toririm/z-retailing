import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => [
  { title: "Z物販トップページ" },
  { name: "description", content: "Z物販のトップページ"}
];

export default function Route() {
  return (
    <>
      <div>
        Z物販
      </div>
    </>
  );
}
