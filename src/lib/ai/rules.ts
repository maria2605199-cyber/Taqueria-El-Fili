import type { GeneratedProductContent, ProductForAI, SearchResult } from "./types";

// Motor de IA "local": funciona sin ninguna API externa y garantiza que
// nunca se invente un precio, producto o disponibilidad, porque todo lo
// que devuelve sale directamente del catálogo real del negocio. Es el
// fallback usado cuando no hay OPENAI_API_KEY configurada, y también el
// mecanismo de seguridad si la llamada al modelo externo falla.

const STOPWORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "para",
  "por", "con", "que", "en", "algo", "quiero", "busco", "tienes", "tiene",
  "cual", "cuál", "es", "son", "más", "mas", "y", "o", "mi", "me", "muestra",
  "muéstrame", "muestrame", "dame", "hay", "tienen", "a", "al",
]);

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function extractPriceCeiling(query: string): number | null {
  const q = normalize(query);
  const numberMatch = q.match(/(\d+)(?!.*\d)/);
  const hasCeilingWord = /(menos de|menor(?:es)? a|menor(?:es)? de|maximo|máximo|hasta|debajo de|por debajo)/.test(
    q
  );
  if (hasCeilingWord && numberMatch) {
    return parseFloat(numberMatch[1]);
  }
  if (/barato|economic|econom/.test(q)) {
    return -1; // señal especial: usar percentil bajo de precios
  }
  return null;
}

function wantsBestSellers(query: string): boolean {
  const q = normalize(query);
  return /mas vendid|más vendid|popular|top ventas|mas pedido|más pedido|mas gustado|favorito/.test(q);
}

export function smartSearch(products: ProductForAI[], query: string): SearchResult {
  const available = products.filter((p) => p.available);
  if (available.length === 0) {
    return { message: "Este negocio aún no tiene productos disponibles.", productIds: [] };
  }

  const priceCeiling = extractPriceCeiling(query);
  const bestSellers = wantsBestSellers(query);
  const queryTokens = tokenize(query);

  let pool = available;
  let priceNote = "";

  if (priceCeiling === -1) {
    const sortedByPrice = [...available].sort((a, b) => a.price - b.price);
    const cutoffIndex = Math.max(1, Math.ceil(sortedByPrice.length * 0.4));
    const cutoff = sortedByPrice[cutoffIndex - 1].price;
    pool = available.filter((p) => p.price <= cutoff);
    priceNote = "las opciones más económicas del catálogo";
  } else if (priceCeiling !== null) {
    pool = available.filter((p) => p.price <= priceCeiling);
    priceNote = `productos de $${priceCeiling} o menos`;
  }

  if (pool.length === 0) {
    pool = available;
    priceNote = "";
  }

  if (bestSellers) {
    const sorted = [...pool].sort(
      (a, b) => b.viewCount + b.whatsappClicks - (a.viewCount + a.whatsappClicks)
    );
    const top = sorted.slice(0, 6);
    return {
      message:
        top.length > 0
          ? `Estos son los productos más consultados de nuestro catálogo${priceNote ? ` dentro de ${priceNote}` : ""}.`
          : "Todavía no tenemos suficientes datos de popularidad, pero aquí tienes nuestro catálogo.",
      productIds: top.map((p) => p.id),
    };
  }

  const scored = pool
    .map((p) => {
      const haystack = tokenize(
        `${p.name} ${p.shortDescription} ${p.description} ${p.tags.join(" ")} ${p.categoryName ?? ""}`
      );
      const haystackSet = new Set(haystack);
      let keywordScore = 0;
      for (const token of queryTokens) {
        if (haystackSet.has(token)) {
          keywordScore += 2;
          continue;
        }
        // Coincidencia parcial (singular/plural, ej. "torta" vs "tortas"):
        // exigimos un mínimo de 4 caracteres en la cadena más corta para
        // no confundir palabras cortas como "res" con una subcadena
        // casual dentro de otra palabra (ej. "menoRES").
        const partial = haystack.some((h) => {
          const shorter = Math.min(h.length, token.length);
          if (shorter < 4) return false;
          return h.includes(token) || token.includes(h);
        });
        if (partial) keywordScore += 1;
      }
      // El bono de "destacado" solo afecta el orden entre resultados ya
      // relevantes; nunca debe hacer que un producto cuente como una
      // coincidencia real de palabras clave (eso rompería búsquedas por
      // precio como "barato", que no tienen ninguna palabra clave).
      const rankScore = keywordScore + (p.featured ? 0.5 : 0);
      return { product: p, keywordScore, rankScore };
    })
    .sort((a, b) => b.rankScore - a.rankScore || a.product.price - b.product.price);

  const hasKeywordMatches = scored.some((s) => s.keywordScore > 0);
  const results = hasKeywordMatches
    ? scored.filter((s) => s.keywordScore > 0).slice(0, 6)
    : scored.slice(0, 6);

  const productIds = results.map((s) => s.product.id);

  let message: string;
  if (hasKeywordMatches && priceNote) {
    message = `Encontré ${priceNote} relacionados con lo que buscas.`;
  } else if (hasKeywordMatches) {
    message = "Encontré estas opciones que coinciden con tu búsqueda.";
  } else if (priceNote) {
    message = `No encontré una coincidencia exacta, pero aquí tienes ${priceNote}.`;
  } else {
    message = "No encontré una coincidencia exacta, pero esto podría interesarte de nuestro catálogo.";
  }

  return { message, productIds };
}

export function assistantReply(
  products: ProductForAI[],
  message: string
): SearchResult {
  const q = normalize(message);
  if (/hola|buenas|buenos dias|buenas tardes|buenas noches/.test(q) && q.length < 30) {
    const featured = products.filter((p) => p.available && p.featured).slice(0, 4);
    return {
      message:
        "¡Hola! Soy el asistente de este catálogo. Cuéntame qué buscas (por ejemplo, un presupuesto, una ocasión especial o un tipo de producto) y te muestro las mejores opciones disponibles.",
      productIds: featured.map((p) => p.id),
    };
  }
  return smartSearch(products, message);
}

const GENERIC_CATEGORY_HINTS: { keywords: string[]; category: string }[] = [
  { keywords: ["taco", "tacos", "quesadilla", "burrito"], category: "Tacos" },
  { keywords: ["torta", "sandwich", "sándwich"], category: "Tortas" },
  { keywords: ["pizza"], category: "Pizzas" },
  { keywords: ["cafe", "café", "latte", "capuchino", "espresso"], category: "Café" },
  { keywords: ["agua", "refresco", "bebida", "jugo", "malteada", "cerveza"], category: "Bebidas" },
  { keywords: ["postre", "pastel", "flan", "helado", "nieve"], category: "Postres" },
  { keywords: ["corte", "barba", "afeitada", "fade"], category: "Barbería" },
  { keywords: ["vestido", "blusa", "pantalon", "pantalón", "falda", "camisa"], category: "Ropa" },
  { keywords: ["collar", "arete", "anillo", "pulsera"], category: "Accesorios" },
];

function guessCategory(name: string): string {
  const tokens = new Set(tokenize(name));
  for (const hint of GENERIC_CATEGORY_HINTS) {
    if (hint.keywords.some((k) => tokens.has(normalize(k)))) return hint.category;
  }
  return "General";
}

export function generateProductContent(name: string): GeneratedProductContent {
  const trimmed = name.trim();
  const category = guessCategory(trimmed);
  const tags = Array.from(new Set(tokenize(trimmed))).slice(0, 6);
  if (!tags.includes(normalize(category))) tags.push(normalize(category));

  return {
    shortDescription: `${trimmed}: calidad y buena presentación en cada detalle.`,
    description: `${trimmed} es una de las opciones que ofrecemos pensando en la calidad y en la experiencia de nuestros clientes. Preparado/seleccionado con atención al detalle, es una excelente opción si buscas algo confiable y bien presentado. Consulta disponibilidad, variantes y precio actualizado directamente en el catálogo o escríbenos por WhatsApp.`,
    tags,
    suggestedCategory: category,
    faqs: [
      {
        q: `¿${trimmed} tiene variantes disponibles?`,
        a: "Contamos con distintas opciones; revisa las variantes en la ficha del producto o pregúntanos directamente.",
      },
      {
        q: "¿Cuál es el precio actual?",
        a: "El precio mostrado en el catálogo siempre está actualizado. Si tienes dudas, contáctanos por WhatsApp.",
      },
      {
        q: "¿Está disponible en este momento?",
        a: "La disponibilidad se actualiza constantemente; confírmala en el catálogo o escríbenos antes de tu visita.",
      },
    ],
  };
}
