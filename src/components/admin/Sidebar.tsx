"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Package,
  Tags,
  Store,
  QrCode,
  Nfc,
  BarChart3,
  MessageSquareText,
  LogOut,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tags },
  { href: "/admin/negocio", label: "Mi negocio", icon: Store },
  { href: "/admin/qr", label: "Código QR", icon: QrCode },
  { href: "/admin/nfc", label: "Configurar NFC", icon: Nfc },
  { href: "/admin/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/admin/consultas-ia", label: "Consultas IA", icon: MessageSquareText },
];

export function Sidebar({ businessName, businessSlug }: { businessName: string; businessSlug: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col border-r border-white/5 bg-ink-950 text-white">
      <div className="flex items-center gap-2 px-5 py-5 font-semibold">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="text-sm">Catálogo IA</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active ? "bg-brand-500/15 text-brand-300" : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/5 p-4">
        <a
          href={`/${businessSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Ver catálogo público
        </a>
        <div className="truncate px-3 text-xs text-white/40">{businessName}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/50 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-3.5 w-3.5" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
