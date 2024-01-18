import type { LinksFunction } from "@remix-run/cloudflare";
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";

import tailwind from "~/tailwind.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: tailwind },
	{ rel: "icon", href: "/favicon.png", type: "image/png" },
];

export default function App() {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<div role="application">
					<Outlet />
					<ScrollRestoration />
					<Scripts />
					{/* <LiveReload /> */}
				</div>
			</body>
		</html>
	);
}
