// Datos estáticos del formulario de checkout, separados del componente.

export const COUNTRIES = [
  { code: "AR", name: "Argentina" },
  { code: "BO", name: "Bolivia" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "CR", name: "Costa Rica" },
  { code: "CU", name: "Cuba" },
  { code: "DO", name: "República Dominicana" },
  { code: "EC", name: "Ecuador" },
  { code: "SV", name: "El Salvador" },
  { code: "GT", name: "Guatemala" },
  { code: "HN", name: "Honduras" },
  { code: "MX", name: "México" },
  { code: "NI", name: "Nicaragua" },
  { code: "PA", name: "Panamá" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Perú" },
  { code: "PR", name: "Puerto Rico" },
  { code: "UY", name: "Uruguay" },
  { code: "VE", name: "Venezuela" },
];

// Los campos de envío, en orden. `country` se renderiza como <select>.
export const SHIPPING_FIELDS = [
  {
    name: "firstName",
    label: "Nombre",
    autoComplete: "given-name",
    required: true,
  },
  {
    name: "lastName",
    label: "Apellido",
    autoComplete: "family-name",
    required: true,
  },
  {
    name: "company",
    label: "Compañía",
    autoComplete: "organization",
    required: false,
  },
  {
    name: "address",
    label: "Dirección",
    autoComplete: "street-address",
    required: true,
  },
  {
    name: "city",
    label: "Ciudad",
    autoComplete: "address-level2",
    required: true,
  },
  {
    name: "country",
    label: "País",
    autoComplete: "country",
    required: true,
    type: "select",
  },
  {
    name: "region",
    label: "Provincia/Estado",
    autoComplete: "address-level1",
    required: true,
  },
  {
    name: "zipCode",
    label: "Código Postal",
    autoComplete: "postal-code",
    required: true,
  },
  { name: "phone", label: "Teléfono", autoComplete: "tel", required: true },
] as const;
