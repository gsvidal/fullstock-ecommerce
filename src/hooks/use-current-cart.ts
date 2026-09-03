import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

export const useCurrentCart = () => {
  const { cartResult } = useRouteLoaderData<typeof rootLoader>("root")!;

  return cartResult;
};
