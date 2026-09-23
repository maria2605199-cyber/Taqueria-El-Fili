import Link from "next/link";
import { getServerSession } from "next-auth";
import { Package, Eye, MessageCircle, Sparkles, Lock, ArrowRight } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasFeature, PLAN_LABELS } from "@/lib/plans";
import { StatCard } from "@/components/admin/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const businessId = session!.user.businessId;
  const plan = session!.user.plan as "BASICO" | "PRO" | "PREMIUM";

  const [productCount, activeCount, featuredCount, viewCount, whatsappCount, aiCount, topProducts] = await Promise.all([
    prisma.product.count({ where: { businessId } }),
    prisma.product.count({ where: { businessId, active: true } }),
    prisma.product.count({ where: { businessId, featured: true } }),
    prisma.productView.count({ where: { businessId } }),
    prisma.whatsAppClick.count({ where: { businessId } }),
    prisma.aIQueryLog.count({ where: { businessId } }),
    prisma.product.findMany({
      where: { businessId },
      include: { _count: { select: { views: true } } },
      orderBy: { views: { _count: "desc" } },
      take: 5,
    }),
  ]);

  const statsEnabled = hasFeature(plan, "stats");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-900/55">Resumen de tu catálogo — plan {PLAN_LABELS[plan]}.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label="Productos totales" value={productCount} hint={`${activeCount} activos`} />
        <StatCard icon={Sparkles} label="Destacados" value={featuredCount} accent="amber" />
        <StatCard icon={Eye} label="Vistas de producto" value={viewCount} accent="sky" />
        <StatCard icon={MessageCircle} label="Clics a WhatsApp" value={whatsappCount} accent="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-ink-900">Productos más vistos</h2>
          {topProducts.filter((p) => p._count.views > 0).length === 0 ? (
            <p className="text-sm text-ink-900/50">Aún no hay vistas registradas. Comparte tu catálogo para empezar.</p>
          ) : (
            <ul className="space-y-3">
              {topProducts
                .filter((p) => p._count.views > 0)
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-ink-900/80">{p.name}</span>
                    <span className="font-semibold text-ink-900">{p._count.views} vistas</span>
                  </li>
                ))}
            </ul>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 font-semibold text-ink-900">Accesos rápidos</h2>
          <div className="space-y-2">
            <Link href="/admin/productos/nuevo">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4" /> Agregar producto
              </Button>
            </Link>
            <Link href="/admin/qr">
              <Button variant="outline" className="w-full justify-start">
                Generar código QR
              </Button>
            </Link>
            <Link href="/admin/negocio">
              <Button variant="outline" className="w-full justify-start">
                Editar información del negocio
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-ink-900">Consultas a la IA</h2>
          {!statsEnabled && <Lock className="h-4 w-4 text-ink-900/30" />}
        </div>
        {statsEnabled ? (
          <p className="mt-2 text-sm text-ink-900/60">
            Se han registrado <strong>{aiCount}</strong> consultas de clientes a la IA. Ve el detalle en{" "}
            <Link href="/admin/consultas-ia" className="text-brand-600 hover:underline">
              Consultas IA
            </Link>
            .
          </p>
        ) : (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-ink-900/[0.03] p-4">
            <p className="text-sm text-ink-900/60">Disponible en el plan Pro y Premium.</p>
            <Button size="sm" variant="secondary">
              Mejorar plan <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
