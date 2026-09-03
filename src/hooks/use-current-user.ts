import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

export function useCurrentUser() {
  const { user } = useRouteLoaderData<typeof rootLoader>("root")!;

  return user;
}
