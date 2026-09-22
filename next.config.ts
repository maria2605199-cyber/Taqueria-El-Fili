import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    // Cada negocio sube fotos a servicios de hosting externos distintos,
    // así que aceptamos cualquier host https en vez de una lista fija.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // Los únicos SVG que servimos son los placeholders locales de la demo
    // (/public/demo). Se sirven con CSP restrictiva para que, aunque en el
    // futuro se acepten SVG subidos por un negocio, nunca puedan ejecutar
    // script embebido.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
