import { useRouteLoaderData } from "react-router";
import { loader as rootLoader } from "../components/root-layout";

export const useCurrentCart = () => {
  const { cartResult } = useRouteLoaderData<typeof rootLoader>("root")!;

  return cartResult;
};
