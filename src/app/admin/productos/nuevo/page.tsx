import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCategoryDTO } from "@/lib/mappers";
import { hasFeature } from "@/lib/plans";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  const businessId = session!.user.businessId;
  const plan = session!.user.plan as "BASICO" | "PRO" | "PREMIUM";

  const categories = await prisma.category.findMany({ where: { businessId }, orderBy: { name: "asc" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Nuevo producto</h1>
        <p className="mt-1 text-sm text-ink-900/55">
          Escribe solo el nombre y deja que la IA genere la descripción, o completa todo manualmente.
        </p>
      </div>
      <ProductForm
        categories={categories.map(toCategoryDTO)}
        aiGeneratorEnabled={hasFeature(plan, "aiProductGenerator")}
        aiImageToolsEnabled={hasFeature(plan, "aiImageTools")}
      />
    </div>
  );
}
