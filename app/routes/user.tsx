import { Outlet } from "@remix-run/react";

export default function UserRoute() {
  return (
    <>
      <nav className="navbar bg-base-100">
        <h1>Ｚ物販</h1>
      </nav>
      <Outlet />
    </>
  );
}
