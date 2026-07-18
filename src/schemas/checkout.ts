import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.email("Ingresa un correo válido"),
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  company: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value)),
  address: z.string().min(1, "La dirección es obligatoria"),
  city: z.string().min(1, "La ciudad es obligatoria"),
  country: z.string().min(1, "Selecciona un país"),
  region: z.string().min(1, "La provincia/estado es obligatorio"),
  zipCode: z.string().min(1, "El código postal es obligatorio"),
  phone: z.string().min(1, "El teléfono es obligatorio"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type CheckoutFormInput = z.input<typeof checkoutSchema>;
