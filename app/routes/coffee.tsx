import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export const loader = () => {
  throw new Response(null,{
    status: 418,
    statusText: "I'm a teapot",
  });
};

export default function Coffee() {
  const error = useRouteError();
  return (
    <h1>
      {isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : error instanceof Error
        ? error.message
        : "Unknown Error"}
    </h1>
  );
}
