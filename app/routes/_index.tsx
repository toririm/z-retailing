import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { supabaseClient } from "~/supabase";

export const meta: MetaFunction = () => [
  { title: "Z物販トップページ" },
  { name: "description", content: "Z物販のトップページ"}
];

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { data } = await supabaseClient(context).from('test').select('*');
  return data;
};

export default function Route() {
  const data = useLoaderData();
  console.log(data);
  return (
    <>
      <div>
        Z物販
      </div>
    </>
  );
}
