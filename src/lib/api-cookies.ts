// src/lib/api-cookies.ts (nuevo)
/**
 * ANDAMIAJE TEMPORAL: se borra cuando la aplicación deje de hablar con la API.
 *
 * En el navegador la cookie de sesión viaja sola: el `credentials: "include"`
 * de cada servicio le pide al navegador que la adjunte, y el navegador tiene un
 * cookie jar. **En el servidor no hay cookie jar.** Un `fetch` desde un
 * `loader` sale sin ninguna cookie, así que la API nos ve como un desconocido:
 * responde 401 en `/users/me` y 404 en `/cart`, y como los servicios traducen
 * esos dos códigos a `null`, la aplicación se dibuja como si nadie tuviera
 * sesión, sin un solo error en consola.
 *
 * La regla, entonces, es una sola y tiene dos mitades:
 *
 *   - Un `loader` **manda** la cookie de su petición entrante.
 *   - Un `action` la manda y además **releva** la que la API devuelva, porque
 *     si no, una sesión creada del lado del servidor nunca llega al navegador.
 *
 * Este objeto lleva las dos: `send` es la que va, `received` la que vuelve.
 */
export type ApiCookies = {
  /** El header `Cookie` de la petición entrante, para mandarle a la API. */
  readonly send: string | null;
  /** El `Set-Cookie` que devolvió la API, si devolvió alguno. */
  received: string | null;
};

/** Lo que un `loader` o un `action` crea al principio, desde su `request`. */
export function apiCookies(request: Request): ApiCookies {
  return { send: request.headers.get("Cookie"), received: null };
}

/**
 * Los headers con los que un `action` releva la cookie al navegador:
 *
 * ```ts
 * return replace("/", { headers: setCookieHeaders(cookies) });
 * ```
 */
export function setCookieHeaders(cookies: ApiCookies): HeadersInit | undefined {
  return cookies.received === null
    ? undefined
    : { "Set-Cookie": cookies.received };
}
