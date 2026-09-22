import type { ProductDTO } from "@/types";

/**
 * 100% local, deterministic catalog reasoning engine. This is the fallback
 * used whenever OPENAI_API_KEY is not configured, and it is also what keeps
 * the AI "grounded": the language model (when enabled) is only ever allowed
 * to choose among the product IDs this engine already considers relevant —
 * it is never allowed to invent a product, price or availability claim.
 */

export interface EngineResult {
  products: ProductDTO[];
  reply: string;
}

const CHEAP_WORDS = ["barato", "económico", "economico", "más barato", "mas barato", "bajo presupuesto"];
const POPULAR_WORDS = ["más vendido", "mas vendido", "popular", "recomendado", "el mejor", "top"];
const AVAILABLE_WORDS = ["disponible", "hay", "tienen"];

function extractMaxPrice(query: string): number | null {
  const normalized = query.toLowerCase();
  const match =
    normalized.match(/menor(?:es)? de \$?\s?(\d+[.,]?\d*)/) ||
    normalized.match(/menos de \$?\s?(\d+[.,]?\d*)/) ||
    normalized.match(/por debajo de \$?\s?(\d+[.,]?\d*)/) ||
    normalized.match(/máximo \$?\s?(\d+[.,]?\d*)/) ||
    normalized.match(/maximo \$?\s?(\d+[.,]?\d*)/) ||
    normalized.match(/\$\s?(\d+[.,]?\d*)/);
  if (!match) return null;
  return parseFloat(match[1].replace(",", ""));
}

function extractMinPrice(query: string): number | null {
  const normalized = query.toLowerCase();
  const match =
    normalized.match(/mayor(?:es)? de \$?\s?(\d+[.,]?\d*)/) ||
    normalized.match(/más de \$?\s?(\d+[.,]?\d*)/) ||
    normalized.match(/mas de \$?\s?(\d+[.,]?\d*)/);
  if (!match) return null;
  return parseFloat(match[1].replace(",", ""));
}

function extractPeopleCount(query: string): number | null {
  const match = query.toLowerCase().match(/(\d+)\s*person/);
  if (!match) return null;
  return parseInt(match[1], 10);
}

function textOf(p: ProductDTO) {
  return [p.name, p.shortDescription, p.description, p.categoryName, ...p.tags, ...p.features]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scoreProduct(p: ProductDTO, query: string): number {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);
  const haystack = textOf(p);
  let score = 0;

  for (const w of words) {
    if (haystack.includes(w)) score += 2;
  }
  if (p.name.toLowerCase().includes(q)) score += 5;
  if (p.categoryName && q.includes(p.categoryName.toLowerCase())) score += 4;
  if (p.featured) score += 1;

  return score;
}

export function runCatalogEngine(query: string, catalog: ProductDTO[]): EngineResult {
  const q = query.toLowerCase().trim();
  let pool = catalog.filter((p) => p.active);

  const maxPrice = extractMaxPrice(q);
  const minPrice = extractMinPrice(q);
  const wantsCheap = CHEAP_WORDS.some((w) => q.includes(w));
  const wantsPopular = POPULAR_WORDS.some((w) => q.includes(w));
  const wantsAvailable = AVAILABLE_WORDS.some((w) => q.includes(w)) || true; // default: only show available
  const people = extractPeopleCount(q);

  if (wantsAvailable) pool = pool.filter((p) => p.available);
  if (maxPrice !== null) pool = pool.filter((p) => p.price <= maxPrice);
  if (minPrice !== null) pool = pool.filter((p) => p.price >= minPrice);

  let ranked: ProductDTO[];

  if (wantsPopular) {
    ranked = [...pool].sort((a, b) => Number(b.featured) - Number(a.featured) || a.price - b.price);
  } else if (wantsCheap) {
    ranked = [...pool].sort((a, b) => a.price - b.price);
  } else if (people) {
    ranked = [...pool].sort((a, b) => scoreProduct(b, q) - scoreProduct(a, q));
  } else if (q.length > 0) {
    ranked = [...pool]
      .map((p) => ({ p, s: scoreProduct(p, q) }))
      .sort((a, b) => b.s - a.s)
      .filter((x, i) => x.s > 0 || i < 6)
      .map((x) => x.p);
  } else {
    ranked = [...pool].sort((a, b) => Number(b.featured) - Number(a.featured));
  }

  const top = ranked.slice(0, 8);

  let reply: string;
  if (top.length === 0) {
    reply =
      maxPrice !== null
        ? `No encontré productos disponibles por menos de $${maxPrice}. ¿Quieres ver todo el catálogo?`
        : "No encontré productos que coincidan. ¿Puedes darme más detalles de lo que buscas?";
  } else if (wantsCheap) {
    reply = `Estas son nuestras opciones más económicas disponibles ahora mismo:`;
  } else if (wantsPopular) {
    reply = `Estos son nuestros productos más destacados y populares:`;
  } else if (people) {
    reply = `Para ${people} persona(s), te recomiendo estas opciones:`;
  } else if (maxPrice !== null) {
    reply = `Encontré estas opciones disponibles por menos de $${maxPrice}:`;
  } else {
    reply = `Encontré estas opciones en nuestro catálogo que podrían interesarte:`;
  }

  return { products: top, reply };
}
