import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCategoryDTO, toProductDTO } from "@/lib/mappers";
import { hasFeature } from "@/lib/plans";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const businessId = session!.user.businessId;
  const plan = session!.user.plan as "BASICO" | "PRO" | "PREMIUM";

  const [product, categories] = await Promise.all([
    prisma.product.findFirst({ where: { id: params.id, businessId }, include: { category: true } }),
    prisma.category.findMany({ where: { businessId }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Editar producto</h1>
        <p className="mt-1 text-sm text-ink-900/55">{product.name}</p>
      </div>
      <ProductForm
        product={toProductDTO(product)}
        categories={categories.map(toCategoryDTO)}
        aiGeneratorEnabled={hasFeature(plan, "aiProductGenerator")}
        aiImageToolsEnabled={hasFeature(plan, "aiImageTools")}
      />
    </div>
  );
}
