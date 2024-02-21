import * as Sentry from "@sentry/remix";
/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
import isbot from "isbot";
import { renderToReadableStream } from "react-dom/server";

export function handleError(error, { request }) {
	Sentry.captureRemixServerException(error, "remix.server", request);
}

Sentry.init({
	dsn: "https://4f3a551edeb01c445e8f9d2fc6ca19b9@o4506624494665728.ingest.sentry.io/4506654415126528",
	tracesSampleRate: 1,
});

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext,
	// This is ignored so we can keep it in the template for visibility.  Feel
	// free to delete this parameter in your app if you're not using it!
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	loadContext: AppLoadContext,
) {
	const body = await renderToReadableStream(
		<RemixServer context={remixContext} url={request.url} />,
		{
			signal: request.signal,
			onError(error: unknown) {
				// Log streaming rendering errors from inside the shell
				console.error(error);
				responseStatusCode = 500;
			},
		},
	);

	if (isbot(request.headers.get("user-agent"))) {
		await body.allReady;
	}

	responseHeaders.set("Content-Type", "text/html");
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	});
}
