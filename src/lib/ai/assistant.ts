import type { ChatMessage, ProductDTO } from "@/types";
import { completeJSON, isAIConfigured } from "@/lib/ai/client";
import { runCatalogEngine } from "@/lib/ai/catalogEngine";

interface AssistantResponse {
  reply: string;
  productIds: string[];
}

/**
 * Conversational assistant grounded in the same way as searchCatalog: the
 * model may only reference product IDs taken from the business catalog we
 * hand it, and it is instructed never to invent price/availability/stock.
 */
export async function runAssistant(
  businessName: string,
  history: ChatMessage[],
  catalog: ProductDTO[]
): Promise<{ reply: string; products: ProductDTO[] }> {
  const lastUserMessage = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
  const baseline = runCatalogEngine(lastUserMessage, catalog);

  if (!isAIConfigured() || catalog.length === 0) {
    return {
      reply:
        baseline.products.length > 0
          ? baseline.reply
          : `Soy el asistente de ${businessName}. Cuéntame qué buscas (por ejemplo: "algo barato", "para 4 personas", "menos de $300") y te muestro opciones de nuestro catálogo.`,
      products: baseline.products,
    };
  }

  const candidatePool = catalog.filter((p) => p.active).slice(0, 50);
  const catalogContext = candidatePool.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.categoryName,
    available: p.available,
    tags: p.tags,
    shortDescription: p.shortDescription,
  }));

  const conversation = history
    .slice(-8)
    .map((m) => `${m.role === "user" ? "Cliente" : "Asistente"}: ${m.content}`)
    .join("\n");

  const result = await completeJSON<AssistantResponse>({
    system: `Eres el asistente virtual de "${businessName}", un negocio que usa Catálogo Inteligente IA. Ayudas a clientes a encontrar productos conversando de forma amable y breve en español.

REGLAS ESTRICTAS (no las rompas nunca):
1. Solo puedes hablar de productos que existan en el catálogo JSON proporcionado.
2. Nunca inventes precios, nombres de producto, o disponibilidad. Usa exactamente los datos dados.
3. Si no hay un producto que coincida con lo que pide el cliente, dilo honestamente y sugiere alternativas reales del catálogo.
4. Responde en JSON: { "reply": string, "productIds": string[] } donde productIds son IDs reales del catálogo (máximo 6) que mencionas o recomiendas.
5. Sé breve, cálido y natural, como un vendedor experto del negocio.`,
    user: `Catálogo disponible (JSON):\n${JSON.stringify(catalogContext)}\n\nConversación hasta ahora:\n${conversation}\n\nResponde al último mensaje del cliente.`,
    temperature: 0.6,
  });

  if (!result) {
    return { reply: baseline.reply, products: baseline.products };
  }

  const validIds = new Set(candidatePool.map((p) => p.id));
  const products = (result.productIds || [])
    .filter((id) => validIds.has(id))
    .map((id) => catalog.find((p) => p.id === id))
    .filter((p): p is ProductDTO => Boolean(p));

  return {
    reply: result.reply?.trim() || baseline.reply,
    products: products.length > 0 ? products : baseline.products,
  };
}
