import Link from "next/link";
import { LinkButton } from "@/components/ui/button";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border-soft/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold gradient-text">
          Catálogo Inteligente IA
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <LinkButton href="/login" variant="ghost" size="sm">
            Iniciar sesión
          </LinkButton>
          <LinkButton href="/register" size="sm">
            Crear catálogo gratis
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
