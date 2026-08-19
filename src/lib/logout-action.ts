import { replace } from "react-router";
import { deleteSession } from "../services";
import { logError } from "./log-error";

export async function logoutAction() {
  try {
    await deleteSession();
  } catch (error) {
    logError(error);
    return { error: "No pudimos cerrar sesión." };
  }

  return replace("/");
}
