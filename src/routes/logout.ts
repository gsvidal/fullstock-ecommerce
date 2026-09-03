import { redirect, replace, type ActionFunctionArgs } from "react-router";
import { logError } from "../lib/log-error";
import { deleteSession } from "../services";
import { apiCookies, setCookieHeaders } from "../lib/api-cookies";

export function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  const cookies = apiCookies(request);
  try {
    await deleteSession(cookies);
  } catch (error) {
    logError(error);
    return { error: "No pudimos cerrar sesión." };
  }

  return replace("/", { headers: setCookieHeaders(cookies) });
}
