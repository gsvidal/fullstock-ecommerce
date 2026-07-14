import type { Product } from "../types";
import { request } from "../lib/api-client";

export function getProduct(slug: string): Promise<Product> {
  return request<Product>(`/products/${slug}`);
}
