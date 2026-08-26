import { redirect } from "react-router";
import { getCurrentUser } from "../services";
import type { User } from "../types";
import { logError } from "./log-error";

export async function guestOnlyLoader() {
  let user: User | null;
  try {
    user = await getCurrentUser();
  } catch (error) {
    logError(error);
    return null;
  }

  if (user !== null) {
    throw redirect("/");
  }
}
