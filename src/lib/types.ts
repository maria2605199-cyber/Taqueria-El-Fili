export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface BusinessSocials {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
}

export interface ProductVariant {
  name: string;
  options: string[];
}

export interface ProductFaq {
  q: string;
  a: string;
}

export const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export const PLAN_INFO = {
  BASICO: {
    label: "Básico",
    price: 299,
    features: ["Catálogo digital", "Código QR", "Configuración NFC", "Botón de WhatsApp"],
  },
  PRO: {
    label: "Pro",
    price: 599,
    features: [
      "Todo lo del plan Básico",
      "Asistente de IA para clientes",
      "Buscador inteligente",
      "Generación automática de descripciones",
      "Estadísticas del catálogo",
    ],
  },
  PREMIUM: {
    label: "Premium",
    price: 999,
    features: [
      "Todo lo del plan Pro",
      "IA avanzada de fotografía",
      "Automatizaciones de marketing",
      "Analítica avanzada",
      "Soporte prioritario",
    ],
  },
} as const;
