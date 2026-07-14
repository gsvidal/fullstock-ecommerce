/**
 * Los atributos que conectan un control con su mensaje de error. El color solo
 * lo ve quien ve; estos atributos lo dicen en un canal que la tecnología de
 * asistencia entiende.
 */
export function errorAttributes(id: string, error?: string) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}
