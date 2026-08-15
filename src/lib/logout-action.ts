import { replace } from "react-router";
import { deleteSession } from "../services";

export async function logoutAction() {
  try {
    await deleteSession();
  } catch (error) {
    console.error(error);
    return { error: "No pudimos cerrar sesión." };
  }

  return replace("/");
}
