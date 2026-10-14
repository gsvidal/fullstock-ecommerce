import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { logError } from "./lib/log-error";
import * as Sentry from "@sentry/react-router";

Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN });

hydrateRoot(
  document,
  <StrictMode>
    <HydratedRouter onError={logError} />
  </StrictMode>,
);
