import { completeJSON, isAIConfigured } from "@/lib/ai/client";

export interface GeneratedProduct {
  shortDescription: string;
  description: string;
  features: string[];
  tags: string[];
  suggestedCategory: string;
  faqs: { q: string; a: string }[];
}

function localTemplate(name: string, existingCategories: string[]): GeneratedProduct {
  const suggestedCategory =
    existingCategories.find((c) => name.toLowerCase().includes(c.toLowerCase())) ||
    existingCategories[0] ||
    "General";

  return {
    shortDescription: `${name}, preparado con ingredientes de calidad y mucho cuidado.`,
    description: `${name} es una de nuestras opciones más solicitadas. Elaborado con atención al detalle, pensado para ofrecerte una gran experiencia desde el primer momento. Ideal si buscas algo confiable y con excelente relación calidad-precio.`,
    features: ["Calidad garantizada", "Ingredientes seleccionados", "Preparación cuidadosa"],
    tags: [suggestedCategory.toLowerCase(), "recomendado"],
    suggestedCategory,
    faqs: [
      { q: `¿Qué incluye ${name}?`, a: "Consulta al negocio para conocer todos los detalles y variantes disponibles." },
      { q: "¿Está disponible actualmente?", a: "Revisa la disponibilidad marcada en el catálogo; se actualiza constantemente." },
    ],
  };
}

/**
 * Given only a product name, produces a complete draft listing. Uses
 * OpenAI when configured; otherwise falls back to a deterministic local
 * template so the "AI creates the product" flow works out of the box in
 * demo mode. The admin can edit every field before publishing (per spec).
 */
export async function generateProductDraft(
  name: string,
  existingCategories: string[]
): Promise<GeneratedProduct> {
  if (!isAIConfigured()) {
    return localTemplate(name, existingCategories);
  }

  const result = await completeJSON<GeneratedProduct>({
    system: `Eres un copywriter experto en catálogos de negocios (restaurantes, tiendas, barberías, boutiques). A partir del nombre de un producto, generas una ficha comercial completa y atractiva en español de México. Responde SOLO en JSON con esta forma exacta: { "shortDescription": string (máx 120 caracteres), "description": string (2-4 oraciones, tono comercial y cálido), "features": string[] (3-5 características cortas), "tags": string[] (3-6 etiquetas en minúsculas), "suggestedCategory": string, "faqs": {"q": string, "a": string}[] (2-3 preguntas frecuentes realistas) }. No inventes precios ni disponibilidad, eso no es tu tarea.`,
    user: `Nombre del producto: "${name}"\nCategorías existentes en el negocio: ${
      existingCategories.length ? existingCategories.join(", ") : "(ninguna todavía)"
    }`,
    temperature: 0.7,
  });

  if (!result) {
    return localTemplate(name, existingCategories);
  }

  return {
    shortDescription: result.shortDescription || localTemplate(name, existingCategories).shortDescription,
    description: result.description || localTemplate(name, existingCategories).description,
    features: Array.isArray(result.features) && result.features.length ? result.features : localTemplate(name, existingCategories).features,
    tags: Array.isArray(result.tags) && result.tags.length ? result.tags : localTemplate(name, existingCategories).tags,
    suggestedCategory: result.suggestedCategory || localTemplate(name, existingCategories).suggestedCategory,
    faqs: Array.isArray(result.faqs) && result.faqs.length ? result.faqs : localTemplate(name, existingCategories).faqs,
  };
}
