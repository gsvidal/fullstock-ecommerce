import type { Category, Product } from "../types";
import { request } from "../lib/api-client";

export function getCategories(): Promise<Category[]> {
  return request<Category[]>("/categories");
}

export function getCategory(slug: string): Promise<Category> {
  return request<Category>(`/categories/${slug}`);
}

export function getCategoryProducts(slug: string): Promise<Product[]> {
  return request<Product[]>(`/categories/${slug}/products`);
}
