import { isRouteErrorResponse, Outlet } from "react-router";
import RouteErrorBoundary from "../components/route-error-boundary";
import type { Route } from "./+types/main-layout";
import { pageTitle } from "../lib/page-meta";
import { STATUS_TITLES, DEFAULT_TITLE } from "../lib/error";

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export function meta({ error }: Route.MetaArgs) {
  if (isRouteErrorResponse(error)) {
    return [pageTitle(STATUS_TITLES[error.status] || DEFAULT_TITLE)];
  }
}

export default function MainLayout() {
  return <Outlet />;
}
