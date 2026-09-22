import OpenAI from "openai";

let client: OpenAI | null = null;

export function isAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

/** Server-only. Never import this file from a client component. */
export function getOpenAIClient(): OpenAI | null {
  if (!isAIConfigured()) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const AI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * Calls the model asking for a strict JSON response and parses it.
 * Returns null on any failure so callers can fall back to the local
 * rule-based engine instead of ever surfacing a raw AI/API error to users.
 */
export async function completeJSON<T>(params: {
  system: string;
  user: string;
  temperature?: number;
}): Promise<T | null> {
  const openai = getOpenAIClient();
  if (!openai) return null;
  try {
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      temperature: params.temperature ?? 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user },
      ],
    });
    const raw = completion.choices[0]?.message?.content;
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error("[ai] completeJSON failed, falling back to local engine:", error);
    return null;
  }
}
