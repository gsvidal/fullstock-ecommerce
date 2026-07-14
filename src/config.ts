// La URL de la API sale del entorno: en desarrollo apunta al servidor local, y
// en producción al dominio real, sin tocar el código.
//
// Vite solo expone las variables con prefijo `VITE_`, y con razón: todo lo que
// entra al bundle lo puede leer cualquiera desde las DevTools. Acá nunca va un
// secreto.
export const API_URL = import.meta.env.VITE_API_URL;
