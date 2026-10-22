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

export async function searchProducts(filters: {
  query?: string;
  categorySlug?: string;
  maxPrice?: number;
}): Promise<(Product & { categorySlug: string })[]> {
  return productRepository.search(filters);
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  return productRepository.findBySlugs(slugs);
}
