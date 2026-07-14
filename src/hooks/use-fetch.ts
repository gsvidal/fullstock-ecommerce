import { useEffect, useState, type DependencyList } from "react";

// Un solo objeto de estado en vez de tres sueltos: así los tres datos siempre
// concuerdan y los estados imposibles ("success" sin datos, "error" sin error)
// no se pueden ni escribir.
export type FetchResult<T> =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: unknown };

// Guardamos el resultado junto a las deps con las que se pidió: son su key.
type FetchState<T> = { result: FetchResult<T>; deps: DependencyList };

function depsChanged(a: DependencyList, b: DependencyList) {
  return a.length !== b.length || a.some((dep, i) => !Object.is(dep, b[i]));
}

/**
 * Trae datos y expone `data` + `error` + `status`.
 *
 * `deps` es la "key" del recurso: el fetcher se vuelve a ejecutar cuando alguno
 * de sus valores cambia. Tiene que contener TODO lo que el fetcher lee de fuera
 * (un slug, un id). Nadie lo verifica por ti.
 */
export function useFetch<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList,
): FetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({
    result: { status: "loading", data: null, error: null },
    deps,
  });

  useEffect(() => {
    // La respuesta de una petición vieja no puede pisar la de una nueva.
    let ignore = false;

    async function runEffect() {
      try {
        const data = await fetcher();
        if (ignore) return;
        setState({ result: { status: "success", data, error: null }, deps });
      } catch (error) {
        if (ignore) return;
        setState({ result: { status: "error", data: null, error }, deps });
      }
    }

    runEffect();

    return () => {
      ignore = true;
    };
    // `deps` llega desde afuera: la regla no puede analizarlo desde aquí.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Lo que tenemos guardado responde a las deps de aquel momento. Si las de
  // este render son otras, ese dato no es de esta petición: todavía no hay
  // nada que entregar.
  if (depsChanged(state.deps, deps)) {
    return { status: "loading", data: null, error: null };
  }

  return state.result;
}
