import { createReadableStreamFromReadable } from "@react-router/node";
import * as Sentry from "@sentry/react-router";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter, type HandleErrorFunction } from "react-router";
import { logError } from "./lib/log-error";

// Sin `SENTRY_DSN` (desarrollo, CI) el SDK no envía nada.
Sentry.init({ dsn: process.env.SENTRY_DSN });

// export default handleRequets() {...}

export default Sentry.createSentryHandleRequest({
  ServerRouter,
  renderToPipeableStream,
  createReadableStreamFromReadable,
});

export const handleError: HandleErrorFunction = (error, { request }) => {
  if (!request.signal.aborted) logError(error);
};
