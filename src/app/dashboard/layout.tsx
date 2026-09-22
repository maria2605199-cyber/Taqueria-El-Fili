import Link from "next/link";
import type { ReactNode } from "react";
import { getCurrentBusiness } from "@/lib/current-business";
import { Providers } from "@/components/providers";
import { LogoutButton } from "@/app/dashboard/logout-button";
import {
  LayoutDashboard,
  Package,
  Store,
  QrCode,
  BarChart3,
  ExternalLink,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/negocio", label: "Mi negocio", icon: Store },
  { href: "/dashboard/qr", label: "QR y NFC", icon: QrCode },
  { href: "/dashboard/estadisticas", label: "Estadísticas", icon: BarChart3 },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const business = await getCurrentBusiness();

  return (
    <Providers>
      <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
        <aside className="hidden border-r border-border-soft bg-surface lg:flex lg:flex-col">
          <div className="p-6">
            <Link href="/" className="text-lg font-bold gradient-text">
              Catálogo IA
            </Link>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/70 hover:bg-surface-muted hover:text-foreground"
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-2 border-t border-border-soft p-3">
            {business && (
              <a
                href={`/negocio/${business.slug}`}
                target="_blank"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-violet-600 hover:bg-violet-500/10"
              >
                <ExternalLink size={18} /> Ver catálogo
              </a>
            )}
            <LogoutButton />
          </div>
        </aside>

        <div className="flex flex-col">
          <header className="flex items-center justify-between border-b border-border-soft bg-surface px-4 py-3 lg:hidden">
            <Link href="/" className="text-lg font-bold gradient-text">
              Catálogo IA
            </Link>
            <LogoutButton />
          </header>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border-soft bg-surface px-3 py-2 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs text-foreground/70 hover:bg-surface-muted"
              >
                <item.icon size={14} />
                {item.label}
              </Link>
            ))}
          </nav>
          <main className="flex-1 bg-background">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
