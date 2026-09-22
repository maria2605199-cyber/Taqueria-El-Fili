import { requireBusiness } from "@/lib/current-business";
import { prisma } from "@/lib/prisma";
import { BarList } from "@/components/dashboard/bar-list";
import { Sparkles } from "lucide-react";

export default async function EstadisticasPage() {
  const { business } = await requireBusiness();

  const [mostViewed, mostClicked, recentQueries, eventCounts] = await Promise.all([
    prisma.product.findMany({
      where: { businessId: business.id },
      orderBy: { viewCount: "desc" },
      take: 6,
    }),
    prisma.product.findMany({
      where: { businessId: business.id },
      orderBy: { whatsappClicks: "desc" },
      take: 6,
    }),
    prisma.analyticsEvent.findMany({
      where: {
        businessId: business.id,
        type: { in: ["AI_QUERY", "AI_ASSISTANT_MESSAGE"] },
        query: { not: null },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.analyticsEvent.groupBy({
      by: ["type"],
      where: { businessId: business.id },
      _count: true,
    }),
  ]);

  const countsByType = Object.fromEntries(eventCounts.map((e) => [e.type, e._count]));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Estadísticas</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Entiende qué buscan tus clientes y qué productos generan más interés.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-2xl p-5 text-center shadow-sm">
          <p className="text-2xl font-semibold">{countsByType["CATALOG_VIEW"] ?? 0}</p>
          <p className="text-xs text-foreground/50">Visitas al catálogo</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center shadow-sm">
          <p className="text-2xl font-semibold">{countsByType["WHATSAPP_CLICK"] ?? 0}</p>
          <p className="text-xs text-foreground/50">Clics en WhatsApp</p>
        </div>
        <div className="glass-card rounded-2xl p-5 text-center shadow-sm">
          <p className="text-2xl font-semibold">
            {(countsByType["AI_QUERY"] ?? 0) + (countsByType["AI_ASSISTANT_MESSAGE"] ?? 0)}
          </p>
          <p className="text-xs text-foreground/50">Consultas a la IA</p>
        </div>
      </div>

      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Productos más vistos</h2>
          <BarList items={mostViewed.map((p) => ({ label: p.name, value: p.viewCount }))} />
        </div>
        <div className="glass-card rounded-2xl p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Más consultados por WhatsApp</h2>
          <BarList items={mostClicked.map((p) => ({ label: p.name, value: p.whatsappClicks }))} />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-violet-600" />
          <h2 className="font-semibold">Últimas preguntas de clientes a la IA</h2>
        </div>
        {recentQueries.length === 0 ? (
          <p className="text-sm text-foreground/50">
            Aún no hay preguntas registradas. Aparecerán aquí cuando tus clientes usen el buscador
            o el asistente de IA en tu catálogo.
          </p>
        ) : (
          <ul className="divide-y divide-border-soft text-sm">
            {recentQueries.map((q) => (
              <li key={q.id} className="flex items-center justify-between gap-4 py-2.5">
                <span className="italic text-foreground/80">&quot;{q.query}&quot;</span>
                <span className="shrink-0 text-xs text-foreground/40">
                  {new Date(q.createdAt).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
