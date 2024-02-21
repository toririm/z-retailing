import type { LinksFunction } from "@remix-run/cloudflare";
import {
	Links,
	// LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useNavigation,
	useRouteError,
} from "@remix-run/react";
import { captureRemixErrorBoundaryError } from "@sentry/remix";
import tailwind from "~/tailwind.css";

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: tailwind },
	{ rel: "icon", href: "/favicon.png", type: "image/png" },
];

export const ErrorBoundary = () => {
	const error = useRouteError();
	captureRemixErrorBoundaryError(error);
	return <div>Something went wrong</div>;
};

export default function App() {
	const navigation = useNavigation();
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
					{navigation.state === "loading" ? (
						<div className="h-screen flex items-center justify-center">
							<span className="loading loading-spinner loading-lg" />
						</div>
					) : (
						<Outlet />
					)}
					<ScrollRestoration />
					<Scripts />
					{
						// <LiveReload />
					}
				</div>
			</body>
		</html>
	);
}
