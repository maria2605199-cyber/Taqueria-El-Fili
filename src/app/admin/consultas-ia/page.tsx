import { getServerSession } from "next-auth";
import { Lock, MessageSquareText, Search, Bot } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasFeature, PLAN_LABELS } from "@/lib/plans";
import { Card, Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function AIQueriesPage() {
  const session = await getServerSession(authOptions);
  const businessId = session!.user.businessId;
  const plan = session!.user.plan as "BASICO" | "PRO" | "PREMIUM";

  if (!hasFeature(plan, "stats")) {
    return (
      <Card className="mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900/5">
          <Lock className="h-5 w-5 text-ink-900/40" />
        </div>
        <h1 className="text-lg font-semibold text-ink-900">No disponible en tu plan</h1>
        <p className="mt-2 text-sm text-ink-900/55">
          Tu plan actual es {PLAN_LABELS[plan]}. Mejora a Pro o Premium para ver las consultas de tus clientes a la IA.
        </p>
        <Button className="mt-5">Mejorar plan</Button>
      </Card>
    );
  }

  const queries = await prisma.aIQueryLog.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Consultas a la IA</h1>
        <p className="mt-1 text-sm text-ink-900/55">Lo que tus clientes le preguntan al buscador y al asistente.</p>
      </div>

      <Card className="divide-y divide-ink-900/6">
        {queries.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-16 text-ink-900/40">
            <MessageSquareText className="h-8 w-8" />
            <p className="text-sm">Aún no hay consultas registradas.</p>
          </div>
        ) : (
          queries.map((q) => (
            <div key={q.id} className="flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900/5 text-ink-900/50">
                  {q.mode === "assistant" ? <Bot className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                </div>
                <div>
                  <p className="text-sm text-ink-900">{q.query || "(mensaje vacío)"}</p>
                  <p className="text-xs text-ink-900/40">{new Date(q.createdAt).toLocaleString("es-MX")}</p>
                </div>
              </div>
              <Badge variant={q.resultCount > 0 ? "success" : "muted"}>{q.resultCount} resultado(s)</Badge>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
