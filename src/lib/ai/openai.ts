import type { GeneratedProductContent, ProductForAI, SearchResult } from "./types";

// Todas las llamadas a OpenAI ocurren aquí, en el servidor. La API key
// nunca se expone al cliente (solo se lee de process.env dentro de
// código que corre en API routes / server actions).

function getConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return { apiKey, model: process.env.OPENAI_MODEL || "gpt-4o-mini" };
}

async function chatJson(system: string, user: string): Promise<Record<string, unknown> | null> {
  const config = getConfig();
  if (!config) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  return JSON.parse(content);
}

export async function openaiSmartSearch(
  products: ProductForAI[],
  query: string
): Promise<SearchResult | null> {
  const config = getConfig();
  if (!config) return null;

  const catalog = products
    .filter((p) => p.available)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.categoryName,
      tags: p.tags,
      shortDescription: p.shortDescription,
    }));

  const system = `Eres el buscador inteligente de un catálogo digital. Se te da la lista COMPLETA de productos disponibles en JSON. Debes responder SOLO con JSON: {"message": string, "productIds": string[]}. Reglas estrictas: solo puedes usar ids que existan en la lista proporcionada, nunca inventes productos, precios o disponibilidad que no estén en la lista, y si nada coincide bien, responde con productIds de las opciones más cercanas o vacío. Máximo 6 ids.`;
  const user = `Catálogo: ${JSON.stringify(catalog)}\n\nPregunta del cliente: "${query}"`;

  const json = await chatJson(system, user);
  if (!json) return null;

  const validIds = new Set(products.map((p) => p.id));
  const productIds = Array.isArray(json.productIds)
    ? (json.productIds as string[]).filter((id) => validIds.has(id)).slice(0, 6)
    : [];

  return {
    message: typeof json.message === "string" ? json.message : "Aquí tienes algunas opciones.",
    productIds,
  };
}

export async function openaiGenerateProductContent(
  name: string
): Promise<GeneratedProductContent | null> {
  const config = getConfig();
  if (!config) return null;

  const system = `Eres un redactor comercial para catálogos digitales de pequeños negocios (restaurantes, tiendas, barberías, boutiques, etc). Recibes SOLO el nombre de un producto. Responde SOLO con JSON: {"shortDescription": string, "description": string, "tags": string[], "suggestedCategory": string, "faqs": [{"q": string, "a": string}]}. Reglas estrictas: NUNCA inventes un precio, nunca afirmes disponibilidad concreta ("disponible ahora", "en stock"), nunca prometas ingredientes o materiales específicos que no te dieron. El texto debe ser atractivo pero honesto y genérico donde falte información.`;
  const user = `Nombre del producto: "${name}"`;

  const json = await chatJson(system, user);
  if (!json) return null;

  return {
    shortDescription: String(json.shortDescription ?? ""),
    description: String(json.description ?? ""),
    tags: Array.isArray(json.tags) ? (json.tags as string[]).slice(0, 8) : [],
    suggestedCategory: String(json.suggestedCategory ?? "General"),
    faqs: Array.isArray(json.faqs)
      ? (json.faqs as { q: string; a: string }[]).slice(0, 4)
      : [],
  };
}
