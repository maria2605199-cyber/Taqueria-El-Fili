import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border-soft px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-foreground/50 sm:flex-row">
        <span className="font-semibold gradient-text">Catálogo Inteligente IA</span>
        <div className="flex gap-6">
          <Link href="/register" className="hover:text-foreground">
            Crear cuenta
          </Link>
          <Link href="/login" className="hover:text-foreground">
            Iniciar sesión
          </Link>
          <Link href="/negocio/taqueria-el-fili" className="hover:text-foreground">
            Ver demo
          </Link>
        </div>
        <span>© {new Date().getFullYear()} Catálogo Inteligente IA</span>
      </div>
    </footer>
  );
}
