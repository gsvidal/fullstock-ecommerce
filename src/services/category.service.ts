import type { Category } from "../repositories/category.repository.ts";
import * as categoryRepository from "../repositories/category.repository.ts";

export async function getCategories(): Promise<Category[]> {
  return categoryRepository.getAll();
}

export async function getCategory(slug: string): Promise<Category | null> {
  return categoryRepository.findBySlug(slug);
}
