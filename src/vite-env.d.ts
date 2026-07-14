/// <reference types="vite/client" />

// Sin esto, `import.meta.env.VITE_API_URL` sería `any` y un typo pasaría
// desapercibido hasta que la app pidiera datos a `undefined`.
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
