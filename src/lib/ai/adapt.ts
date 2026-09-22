import { safeJsonParse } from "@/lib/utils";
import type { ProductForAI } from "./types";

interface ProductLike {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  tags: string;
  available: boolean;
  featured: boolean;
  viewCount: number;
  whatsappClicks: number;
  category?: { name: string } | null;
}

export function toProductForAI(product: ProductLike): ProductForAI {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    shortDescription: product.shortDescription,
    description: product.description,
    tags: safeJsonParse<string[]>(product.tags, []),
    categoryName: product.category?.name ?? null,
    available: product.available,
    featured: product.featured,
    viewCount: product.viewCount,
    whatsappClicks: product.whatsappClicks,
  };
}
