import * as Sentry from "@sentry/react-router";

export function logError(error: unknown) {
  console.error("Error de aplicación:", error);
  Sentry.captureException(error);
}
