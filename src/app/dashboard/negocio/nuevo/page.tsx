import { redirect } from "next/navigation";
import { requireSession } from "@/lib/current-business";
import { prisma } from "@/lib/prisma";
import { createBusinessAction } from "@/app/dashboard/negocio/actions";
import { BusinessForm } from "@/components/dashboard/business-form";

export default async function NuevoNegocioPage() {
  const session = await requireSession();
  const existing = await prisma.business.findFirst({ where: { ownerId: session.user.id } });
  if (existing) redirect("/dashboard");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Crea tu negocio</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Esta información aparecerá en tu catálogo público. Podrás editarla cuando quieras.
        </p>
      </div>
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <BusinessForm action={createBusinessAction} submitLabel="Crear negocio y continuar" />
      </div>
    </main>
  );
}
