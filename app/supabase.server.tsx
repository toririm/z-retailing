import { AppLoadContext } from "@remix-run/cloudflare";
import { createClient } from "@supabase/supabase-js";

export const supabaseClient = (context: AppLoadContext) => {
  const env = context.env as Env;
  return createClient(env.SUPABASE_URL as string, env.SUPABASE_ANON_KEY as string, {
    global: {
      fetch: (...args) => fetch(...args),
    },
  });
};
