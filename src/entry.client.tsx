import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { logError } from "./lib/log-error";

hydrateRoot(
  document,
  <StrictMode>
    <HydratedRouter onError={logError} />
  </StrictMode>,
);
