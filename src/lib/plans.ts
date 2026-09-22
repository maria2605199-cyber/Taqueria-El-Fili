/// Kept as a local type instead of importing from @prisma/client: SQLite has
/// no native enum support, so Business.plan is a plain String column at the
/// database level (see prisma/schema.prisma) and this union is what
/// constrains it everywhere else.
export type Plan = "BASICO" | "PRO" | "PREMIUM";

/**
 * Central feature-gating table for the subscription tiers described in the
 * product spec. Adding a new gated feature = adding one key here; every
 * caller (UI + API routes) should check through hasFeature() instead of
 * comparing plan strings directly, so the gate logic never drifts.
 */
export const PLAN_FEATURES = {
  BASICO: {
    catalog: true,
    qr: true,
    nfc: true,
    whatsapp: true,
    aiAssistant: false,
    aiSearch: false,
    aiProductGenerator: false,
    stats: false,
    aiImageTools: false,
    automations: false,
    advancedAnalytics: false,
  },
  PRO: {
    catalog: true,
    qr: true,
    nfc: true,
    whatsapp: true,
    aiAssistant: true,
    aiSearch: true,
    aiProductGenerator: true,
    stats: true,
    aiImageTools: false,
    automations: false,
    advancedAnalytics: false,
  },
  PREMIUM: {
    catalog: true,
    qr: true,
    nfc: true,
    whatsapp: true,
    aiAssistant: true,
    aiSearch: true,
    aiProductGenerator: true,
    stats: true,
    aiImageTools: true,
    automations: true,
    advancedAnalytics: true,
  },
} as const satisfies Record<Plan, Record<string, boolean>>;

export type PlanFeature = keyof (typeof PLAN_FEATURES)["BASICO"];

export function hasFeature(plan: Plan, feature: PlanFeature): boolean {
  return PLAN_FEATURES[plan][feature];
}

export const PLAN_LABELS: Record<Plan, string> = {
  BASICO: "Básico",
  PRO: "Pro",
  PREMIUM: "Premium",
};

export const PLAN_PRICING: Record<Plan, { price: string; tagline: string; bullets: string[] }> = {
  BASICO: {
    price: "$299/mes",
    tagline: "Para empezar a vender en línea hoy mismo.",
    bullets: ["Catálogo digital ilimitado", "Código QR y enlace NFC", "Botón de WhatsApp", "Hasta 50 productos"],
  },
  PRO: {
    price: "$699/mes",
    tagline: "Automatiza la atención al cliente con IA.",
    bullets: [
      "Todo lo de Básico",
      "Asistente IA conversacional",
      "Buscador inteligente",
      "Generación automática de descripciones",
      "Estadísticas del catálogo",
    ],
  },
  PREMIUM: {
    price: "$1,499/mes",
    tagline: "IA avanzada y automatización de marketing.",
    bullets: [
      "Todo lo de Pro",
      "Mejora de fotografías con IA",
      "Automatizaciones de marketing",
      "Analítica avanzada",
      "Soporte prioritario",
    ],
  },
};
