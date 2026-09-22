import type { ProductDTO } from "@/types";
import { completeJSON, isAIConfigured } from "@/lib/ai/client";
import { runCatalogEngine, type EngineResult } from "@/lib/ai/catalogEngine";

interface AIRerankResponse {
  productIds: string[];
  reply: string;
}

/**
 * Grounded catalog search: the local engine always computes a candidate
 * pool first. If an LLM is configured, we ask it only to pick/order IDs
 * from that pool and write a short reply — it cannot introduce a product
 * that isn't already in the candidate list, so it can never hallucinate
 * prices, stock or items that don't exist.
 */
export async function searchCatalog(query: string, catalog: ProductDTO[]): Promise<EngineResult> {
  const baseline = runCatalogEngine(query, catalog);

  if (!isAIConfigured() || catalog.length === 0) {
    return baseline;
  }

  const candidatePool = catalog.filter((p) => p.active).slice(0, 40);

  const catalogContext = candidatePool.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.categoryName,
    available: p.available,
    tags: p.tags,
    shortDescription: p.shortDescription,
  }));

  const result = await completeJSON<AIRerankResponse>({
    system: `Eres el motor de búsqueda de un catálogo digital. SOLO puedes recomendar productos que aparezcan en el JSON de catálogo que te da el usuario. Nunca inventes productos, precios o disponibilidad. Responde en JSON con { "productIds": string[], "reply": string }. "productIds" debe ser un subconjunto (máximo 8) de los IDs del catálogo recibido, ordenados del más al menos relevante para la consulta. "reply" es una frase corta y amable en español dirigida al cliente.`,
    user: `Consulta del cliente: "${query}"\n\nCatálogo disponible (JSON):\n${JSON.stringify(catalogContext)}`,
  });

  if (!result || !Array.isArray(result.productIds)) {
    return baseline;
  }

  const validIds = new Set(candidatePool.map((p) => p.id));
  const products = result.productIds
    .filter((id) => validIds.has(id))
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is ProductDTO => Boolean(p));

  if (products.length === 0) {
    return baseline;
  }

  return {
    products,
    reply: result.reply?.trim() || baseline.reply,
  };
}
