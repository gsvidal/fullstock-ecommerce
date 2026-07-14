// La API guarda los precios en céntimos (5990 = S/ 59.90) para no perder
// precisión con los decimales de punto flotante.
const formatter = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
});

export function formatPrice(cents: number) {
  return formatter.format(cents / 100);
}
