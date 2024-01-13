import { json } from "@remix-run/cloudflare";

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 });
