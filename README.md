# Full Stock

Tienda en línea (SPA) de merchandising para desarrolladores: polos, tazas y stickers. Construida con **React 19**, **TypeScript** y **Vite**, consume una API REST externa para el catálogo, el carrito, las órdenes y la autenticación.

## Funcionalidades

- **Catálogo por categorías**: página de inicio con hero, categorías destacadas y beneficios; páginas de categoría con filtro por precio (persistido en la URL con search params) y páginas de detalle de producto.
- **Carrito de compras**: agregar, actualizar cantidades y eliminar ítems, con estado global compartido vía Context.
- **Checkout y confirmación de orden**: formulario de datos de envío con validación por campo y pantalla de confirmación con el resumen de la orden.
- **Autenticación**: registro e inicio de sesión con cookies de sesión (`credentials: "include"`); las rutas de login/signup son solo para invitados (`GuestRoute`).
- **Tema claro/oscuro**: respeta la preferencia del sistema, se puede alternar manualmente y se aplica antes de que React monte para evitar el parpadeo (FOUC).
- **Manejo de errores**: error boundaries (con `react-error-boundary`) y errores de API tipados (`ApiError`), incluyendo errores de validación por campo.

## Stack

| Herramienta                                                             | Uso                                                        |
| ----------------------------------------------------------------------- | ---------------------------------------------------------- |
| [React 19](https://react.dev)                                           | UI                                                         |
| [React Router 8](https://reactrouter.com)                               | Ruteo en modo declarativo (`BrowserRouter`)                |
| [TypeScript 6](https://www.typescriptlang.org)                          | Tipado estático                                            |
| [Vite 8](https://vite.dev)                                              | Dev server y build                                         |
| CSS Modules                                                             | Estilos por componente, con design tokens en `src/styles/` |
| [react-error-boundary](https://github.com/bvaughn/react-error-boundary) | Error boundaries                                           |

## Requisitos

- Node.js (versión LTS reciente)
- Una instancia de la **API de Full Stock** corriendo (por defecto en `http://localhost:3000/api`)

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar el entorno
cp .env.example .env   # ajusta VITE_API_URL si tu API no corre en el puerto 3000

# 3. Levantar el servidor de desarrollo
npm run dev
```

### Scripts disponibles

| Script                 | Descripción                                             |
| ---------------------- | ------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con HMR                          |
| `npm run build`        | Chequeo de tipos (`tsc -b`) + build de producción       |
| `npm run preview`      | Sirve el build de producción localmente                 |
| `npm run lint`         | Corre ESLint                                            |
| `npm run format`       | Formatea todo el proyecto con Prettier                  |
| `npm run format:check` | Verifica el formato sin modificar archivos (útil en CI) |

El proyecto usa la configuración por defecto de Prettier, declarada en `.prettierrc`. El archivo existe (aunque esté vacío) para que los editores del equipo detecten el proyecto como "formateado con Prettier" y no apliquen configuraciones personales.

### Variables de entorno

| Variable       | Descripción                                             |
| -------------- | ------------------------------------------------------- |
| `VITE_API_URL` | URL base de la API (p. ej. `http://localhost:3000/api`) |

Vite solo expone al navegador las variables con prefijo `VITE_`. Todo lo que entra al bundle es público: aquí nunca va un secreto.

## Estructura del proyecto

```
src/
├── app.tsx              # Definición de rutas
├── main.tsx             # Punto de entrada: providers + error boundary
├── config.ts            # Configuración (API_URL desde el entorno)
├── types.ts             # Tipos del dominio (Product, Cart, Order, User…)
├── components/          # Componentes de la app (header, hero, product-card…)
│   └── ui/              # Primitivos reutilizables (Button, FormField, Spinner…)
├── pages/               # Una carpeta por página/ruta
├── providers/           # Estado global con Context (auth y carrito)
├── hooks/               # Hooks propios (useFetch, useDocumentTitle)
├── services/            # Llamadas a la API por recurso (auth, cart, orders…)
├── lib/                 # Utilidades (api-client, ApiError, formato de precios)
└── styles/              # Reset, tokens de color, tipografía y estilos globales
```

### Rutas

| Ruta                           | Página                                             |
| ------------------------------ | -------------------------------------------------- |
| `/`                            | Inicio                                             |
| `/categories/:slug`            | Productos de una categoría (con filtro por precio) |
| `/products/:slug`              | Detalle de producto                                |
| `/cart`                        | Carrito                                            |
| `/checkout`                    | Checkout                                           |
| `/order-confirmation`          | Confirmación de orden                              |
| `/login`, `/signup`            | Autenticación (solo invitados)                     |
| `/about`, `/terms`, `/privacy` | Páginas informativas                               |
| `*`                            | 404                                                |

## Decisiones de arquitectura

- **`useFetch`** (`src/hooks/use-fetch.ts`): hook propio para data fetching. Modela el resultado como una unión discriminada (`loading` / `success` / `error`) para que los estados imposibles no se puedan representar, y descarta respuestas de peticiones viejas para evitar race conditions.
- **`request`** (`src/lib/api-client.ts`): cliente HTTP único que desenvuelve el sobre `{ data }` de la API y convierte las respuestas fallidas en `ApiError`, con soporte para errores de validación por campo.
- **Providers**: `AuthProvider` carga el usuario de la sesión al iniciar; `CartProvider` depende de él y recarga el carrito cuando cambia el usuario.
- **Error boundaries**: una barrera global en `main.tsx` (con opción de recargar la página) además del manejo de errores por página vía el estado de `useFetch`.
