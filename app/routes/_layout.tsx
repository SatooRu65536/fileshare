import { Outlet } from "@remix-run/react";
import { Header } from "~/components/header";

export default function Index() {
  return (
    <>
      <Header />
      <main className="mt-16 py-10 px-5">
        <Outlet />
      </main>
    </>
  );
}
