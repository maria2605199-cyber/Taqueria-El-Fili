import Link from "next/link";
import { requireBusiness } from "@/lib/current-business";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PLAN_INFO } from "@/lib/types";
import { Package, MessageCircle, Sparkles, Eye, Plus, QrCode } from "lucide-react";

export default async function DashboardHomePage({
  searchParams,
}: {
  searchParams: Promise<{ bienvenida?: string }>;
}) {
  const { business } = await requireBusiness();
  const { bienvenida } = await searchParams;

  const [productCount, whatsappClicks, aiQueries, totalViews, topProducts] = await Promise.all([
    prisma.product.count({ where: { businessId: business.id } }),
    prisma.analyticsEvent.count({
      where: { businessId: business.id, type: "WHATSAPP_CLICK" },
    }),
    prisma.analyticsEvent.count({
      where: { businessId: business.id, type: { in: ["AI_QUERY", "AI_ASSISTANT_MESSAGE"] } },
    }),
    prisma.analyticsEvent.count({
      where: { businessId: business.id, type: "PRODUCT_VIEW" },
    }),
    prisma.product.findMany({
      where: { businessId: business.id },
      orderBy: { viewCount: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Productos", value: productCount, icon: Package },
    { label: "Clics en WhatsApp", value: whatsappClicks, icon: MessageCircle },
    { label: "Consultas a la IA", value: aiQueries, icon: Sparkles },
    { label: "Vistas de producto", value: totalViews, icon: Eye },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {bienvenida && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          ¡Tu negocio fue creado! Ahora agrega productos para publicar tu catálogo.
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Hola, {business.name}</h1>
            <Badge tone="brand">{PLAN_INFO[business.plan].label}</Badge>
          </div>
          <p className="mt-1 text-sm text-foreground/60">
            Tu catálogo:{" "}
            <a
              href={`/negocio/${business.slug}`}
              target="_blank"
              className="font-mono text-violet-600 hover:underline"
            >
              /negocio/{business.slug}
            </a>
          </p>
        </div>
        <div className="flex gap-3">
          <LinkButton href="/dashboard/qr" variant="secondary">
            <QrCode size={16} /> QR / NFC
          </LinkButton>
          <LinkButton href="/dashboard/productos/nuevo">
            <Plus size={16} /> Nuevo producto
          </LinkButton>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-5 shadow-sm">
            <s.icon size={20} className="mb-3 text-violet-600" />
            <p className="text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-foreground/50">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 shadow-sm">
        <h2 className="mb-4 font-semibold">Productos más vistos</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-foreground/50">
            Aún no hay datos. Comparte tu catálogo para empezar a recibir visitas.
          </p>
        ) : (
          <ul className="divide-y divide-border-soft">
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-3 text-sm">
                <Link href={`/dashboard/productos/${p.id}`} className="hover:underline">
                  {p.name}
                </Link>
                <span className="text-foreground/50">{p.viewCount} vistas</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
