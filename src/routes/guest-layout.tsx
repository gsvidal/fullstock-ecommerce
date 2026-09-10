import { Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import { getSession } from "../lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const userId = session.get("userId");

  if (userId !== undefined) {
    throw redirect("/");
  }
}

export default function GuestLayout() {
  return <Outlet />;
}
