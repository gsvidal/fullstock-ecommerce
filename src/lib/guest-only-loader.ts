import { redirect } from "react-router";
import { getCurrentUser } from "../services";

export async function guestOnlyLoader() {
  const user = await getCurrentUser();

  if (user !== null) {
    throw redirect("/");
  }
}
