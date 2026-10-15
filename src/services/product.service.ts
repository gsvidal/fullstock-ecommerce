import type { Product } from "../repositories/product.repository.ts";
import * as productRepository from "../repositories/product.repository.ts";

export async function getProductsByCategory(
  categorySlug: string,
  filters: { minPrice?: number; maxPrice?: number } = {},
): Promise<Product[]> {
  return productRepository.getByCategorySlug(categorySlug, filters);
}

export async function getProduct(slug: string): Promise<Product | null> {
  return productRepository.findBySlug(slug);
}

export async function getProductById(id: number): Promise<Product | null> {
  return productRepository.findById(id);
}
