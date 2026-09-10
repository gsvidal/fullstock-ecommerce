import { redirect, type ActionFunctionArgs } from "react-router";
import { logError } from "../lib/log-error";
import { destroySession, getSession } from "../lib/session.server";

export function loader() {
  return redirect("/");
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);

  let setCookie: string;

  try {
    setCookie = await destroySession(session);
  } catch (error) {
    logError(error);
    return { error: "No pudimos cerrar sesión." };
  }

  return redirect("/", { headers: { "Set-Cookie": setCookie } });
}
