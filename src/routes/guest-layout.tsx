import { data, Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import { commitSession, getSession } from "../lib/session.server";
import { getUserFromSession } from "../lib/session-utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const { user, sessionChanged } = await getUserFromSession(session);

  if (user !== null) {
    throw redirect("/");
  }

  return data(null, {
    headers: sessionChanged
      ? { "Set-Cookie": await commitSession(session) }
      : undefined,
  });
}

export default function GuestLayout() {
  return <Outlet />;
}
