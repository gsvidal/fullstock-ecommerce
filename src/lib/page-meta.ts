const SITE_NAME = "Full Stock";

/**
 * El `<title>` de una página, con el nombre del sitio detrás.
 *
 * En Framework Mode el título es el export `meta` de la ruta y lo resuelve el
 * servidor, así que ya no hace falta el `useDocumentTitle` que lo escribía
 * desde un efecto. El `meta` de una ruta hija reemplaza al de su padre, así que
 * cada página compone su título completo.
 */
export function pageTitle(title: string) {
  return { title: `${title} | ${SITE_NAME}` };
}
