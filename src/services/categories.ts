import type { Category, Product } from "../types";
import { request } from "../lib/api-client";

export function getCategories(): Promise<Category[]> {
  return request<Category[]>("/categories");
}

export function getCategory(slug: string): Promise<Category> {
  return request<Category>(`/categories/${slug}`);
}

export function getCategoryProducts(
  slug: string,
  options?: { minPrice?: number; maxPrice?: number },
): Promise<Product[]> {
  const searchParams = new URLSearchParams();
  if (options?.minPrice !== undefined)
    searchParams.set("minPrice", options.minPrice.toString());
  if (options?.maxPrice !== undefined)
    searchParams.set("maxPrice", options.maxPrice.toString());

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return request<Product[]>(`/categories/${slug}/products${query}`);
}
