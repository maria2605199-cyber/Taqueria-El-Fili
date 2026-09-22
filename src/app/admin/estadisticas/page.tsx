import { getServerSession } from "next-auth";
import Link from "next/link";
import { Lock, Eye, MessageCircle, Sparkles, Package } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasFeature, PLAN_LABELS } from "@/lib/plans";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/admin/StatCard";
import { ActivityChart, TopProductsChart } from "@/components/admin/StatsCharts";

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function StatsPage() {
  const session = await getServerSession(authOptions);
  const businessId = session!.user.businessId;
  const plan = session!.user.plan as "BASICO" | "PRO" | "PREMIUM";

  if (!hasFeature(plan, "stats")) {
    return (
      <Card className="mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900/5">
          <Lock className="h-5 w-5 text-ink-900/40" />
        </div>
        <h1 className="text-lg font-semibold text-ink-900">Estadísticas no disponibles</h1>
        <p className="mt-2 text-sm text-ink-900/55">
          Tu plan actual es {PLAN_LABELS[plan]}. Mejora a Pro o Premium para ver vistas, clics a WhatsApp y consultas a la IA.
        </p>
        <Button className="mt-5">Mejorar plan</Button>
      </Card>
    );
  }

  const since = new Date();
  since.setDate(since.getDate() - 13);
  since.setHours(0, 0, 0, 0);

  const [views, clicks, queries, totalViews, totalClicks, totalQueries, topViewed, topClicked] = await Promise.all([
    prisma.productView.findMany({ where: { businessId, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.whatsAppClick.findMany({ where: { businessId, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.aIQueryLog.findMany({ where: { businessId, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.productView.count({ where: { businessId } }),
    prisma.whatsAppClick.count({ where: { businessId } }),
    prisma.aIQueryLog.count({ where: { businessId } }),
    prisma.product.findMany({
      where: { businessId },
      include: { _count: { select: { views: true } } },
      orderBy: { views: { _count: "desc" } },
      take: 6,
    }),
    prisma.product.findMany({
      where: { businessId },
      include: { _count: { select: { whatsappClicks: true } } },
      orderBy: { whatsappClicks: { _count: "desc" } },
      take: 6,
    }),
  ]);

  const days: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    days.push(dayKey(d));
  }

  const chartData = days.map((day) => ({
    date: day.slice(5),
    views: views.filter((v) => dayKey(v.createdAt) === day).length,
    whatsapp: clicks.filter((c) => dayKey(c.createdAt) === day).length,
    aiQueries: queries.filter((q) => dayKey(q.createdAt) === day).length,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Estadísticas</h1>
        <p className="mt-1 text-sm text-ink-900/55">Actividad de los últimos 14 días.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={Eye} label="Vistas totales" value={totalViews} accent="sky" />
        <StatCard icon={MessageCircle} label="Clics a WhatsApp" value={totalClicks} accent="green" />
        <StatCard icon={Sparkles} label="Consultas a la IA" value={totalQueries} accent="brand" />
      </div>

      <Card className="p-6">
        <h2 className="mb-4 font-semibold text-ink-900">Actividad diaria</h2>
        <ActivityChart data={chartData} />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink-900">
            <Package className="h-4 w-4" /> Productos más vistos
          </h2>
          {topViewed.some((p) => p._count.views > 0) ? (
            <TopProductsChart data={topViewed.map((p) => ({ name: p.name, value: p._count.views }))} />
          ) : (
            <p className="py-10 text-center text-sm text-ink-900/45">Sin datos todavía.</p>
          )}
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-ink-900">
            <MessageCircle className="h-4 w-4" /> Más consultados por WhatsApp
          </h2>
          {topClicked.some((p) => p._count.whatsappClicks > 0) ? (
            <TopProductsChart data={topClicked.map((p) => ({ name: p.name, value: p._count.whatsappClicks }))} />
          ) : (
            <p className="py-10 text-center text-sm text-ink-900/45">Sin datos todavía.</p>
          )}
        </Card>
      </div>

      <p className="text-xs text-ink-900/40">
        ¿Quieres ver el detalle de cada pregunta? Ve a{" "}
        <Link href="/admin/consultas-ia" className="text-brand-600 hover:underline">
          Consultas IA
        </Link>
        .
      </p>
    </div>
  );
}
