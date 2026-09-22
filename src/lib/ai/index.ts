import type { GeneratedProductContent, ProductForAI, SearchResult } from "./types";
import * as rules from "./rules";
import { openaiGenerateProductContent, openaiSmartSearch } from "./openai";

export type { ProductForAI, SearchResult, GeneratedProductContent };

export async function runSmartSearch(
  products: ProductForAI[],
  query: string
): Promise<SearchResult> {
  try {
    const aiResult = await openaiSmartSearch(products, query);
    if (aiResult) return aiResult;
  } catch (err) {
    console.error("OpenAI smart search falló, usando motor local:", err);
  }
  return rules.smartSearch(products, query);
}

export async function runAssistant(
  products: ProductForAI[],
  message: string
): Promise<SearchResult> {
  try {
    const aiResult = await openaiSmartSearch(products, message);
    if (aiResult) return aiResult;
  } catch (err) {
    console.error("OpenAI assistant falló, usando motor local:", err);
  }
  return rules.assistantReply(products, message);
}

export async function runGenerateProductContent(name: string): Promise<GeneratedProductContent> {
  try {
    const aiResult = await openaiGenerateProductContent(name);
    if (aiResult) return aiResult;
  } catch (err) {
    console.error("OpenAI generate content falló, usando motor local:", err);
  }
  return rules.generateProductContent(name);
}
