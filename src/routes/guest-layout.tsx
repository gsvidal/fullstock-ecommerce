import { Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import { logError } from "../lib/log-error";
import { getCurrentUser } from "../services";
import type { User } from "../types";
import { apiCookies, setCookieHeaders } from "../lib/api-cookies";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = apiCookies(request);
  let user: User | null;
  try {
    user = await getCurrentUser(cookies);
  } catch (error) {
    logError(error);
    return null;
  }

  if (user !== null) {
    throw redirect("/", { headers: setCookieHeaders(cookies) });
  }
}

export default function GuestLayout() {
  return <Outlet />;
}
