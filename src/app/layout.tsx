import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Catálogo Inteligente IA",
    template: "%s · Catálogo Inteligente IA",
  },
  description:
    "Catálogo digital con inteligencia artificial para pequeños y medianos negocios: restaurantes, tiendas, cafeterías, barberías y boutiques.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
