import {
  chat,
  toolDefinition,
  type ModelMessage,
  type UIMessage,
} from "@tanstack/ai";
import * as z from "zod";
import { chatModel } from "../lib/chat-model.server";
import { formatPrice } from "../lib/format-price";
import { getProductsBySlugs, searchProducts } from "./product.service";

export type RecommendedProduct = {
  slug: string;
  title: string;
  imgSrc: string;
  price: string;
};

const SYSTEM_PROMPT = `Eres el asistente de compras de Full Stock, una tienda de polos, tazas y stickers para desarrolladores.

Cómo respondes:
1. Busca con search_products lo que pide la persona.
2. Elige los productos que recomiendas y muéstralos llamando a recommend_products con sus slugs. Es obligatorio: un producto que nombras sin pasarlo por recommend_products, la persona no lo puede ver ni abrir.
3. Después escribe dos o tres oraciones que expliquen por qué los elegiste.

Reglas:
- Respondes en español.
- Solo recomiendas productos que encontraste con search_products. Nunca inventes productos ni precios.
- Si no hay nada que calce con lo pedido, dilo y recomienda lo más cercano que sí tengamos, también con recommend_products.
- No escribas enlaces ni URLs: las tarjetas ya los tienen.
- Si te preguntan algo que no tiene que ver con la tienda, responde con amabilidad que solo ayudas a elegir productos.`;

export function chatbotStream(messages: (ModelMessage | UIMessage)[]) {
  const searchProductsToolDefinition = toolDefinition({
    name: "search_products",
    description:
      "Busca productos del catálogo. Todos los filtros son opcionales y se combinan.",
    inputSchema: z.object({
      query: z.string().optional().meta({
        description: "Una palabra del nombre o la descripción del producto",
      }),
      category: z
        .enum(["polos", "tazas", "stickers"])
        .optional()
        .meta({ description: "La categoría del producto" }),
      maxPrice: z
        .number()
        .optional()
        .meta({ description: "El precio máximo, en soles" }),
    }),
  });

  const searchProductsTool = searchProductsToolDefinition.server(
    async ({ query, category, maxPrice }) => {
      const products = await searchProducts({
        query,
        categorySlug: category,
        maxPrice:
          maxPrice === undefined ? undefined : Math.round(maxPrice * 100),
      });

      return products.map((product) => ({
        slug: product.slug,
        title: product.title,
        description: product.description,
        category: product.categorySlug,
        price: formatPrice(product.price),
        features: product.features,
      }));
    },
  );

  const recommendProductsTool = toolDefinition({
    name: "recommend_products",
    description:
      "Le muestra a la persona los productos que le recomiendas, como tarjetas con enlace.",
    inputSchema: z.object({
      slugs: z
        .array(z.string())
        .meta({ description: "Los slugs de los productos que recomiendas" }),
    }),
  }).server(async ({ slugs }): Promise<RecommendedProduct[]> => {
    // Un slug que el modelo inventó no está en la base: no aparece.
    const products = await getProductsBySlugs(slugs);

    return products.map((product) => ({
      slug: product.slug,
      title: product.title,
      imgSrc: product.imgSrc,
      price: formatPrice(product.price),
    }));
  });

  return chat({
    adapter: chatModel(),
    messages,
    systemPrompts: [SYSTEM_PROMPT],
    tools: [searchProductsTool, recommendProductsTool],
  });
}
