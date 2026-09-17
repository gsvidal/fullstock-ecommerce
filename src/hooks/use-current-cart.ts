import { useRouteLoaderData } from "react-router";
import type { loader as rootLoader } from "../root";

export const useCurrentCart = () => {
  const { cart } = useRouteLoaderData<typeof rootLoader>("root")!;

  return cart;
};
