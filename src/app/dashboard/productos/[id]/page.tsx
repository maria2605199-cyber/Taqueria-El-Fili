import { notFound } from "next/navigation";
import { requireBusiness } from "@/lib/current-business";
import { prisma } from "@/lib/prisma";
import { updateProductAction } from "@/app/dashboard/productos/actions";
import { ProductForm } from "@/components/dashboard/product-form";
import { safeJsonParse } from "@/lib/utils";
import type { ProductFaq, ProductVariant } from "@/lib/types";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { business } = await requireBusiness();

  const [product, categories] = await Promise.all([
    prisma.product.findFirst({ where: { id, businessId: business.id } }),
    prisma.category.findMany({ where: { businessId: business.id }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProductAction.bind(null, product.id);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Editar producto</h1>
        <p className="mt-1 text-sm text-foreground/60">{product.name}</p>
      </div>
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <ProductForm
          action={boundUpdate}
          submitLabel="Guardar cambios"
          categories={categories}
          initial={{
            name: product.name,
            price: product.price,
            shortDescription: product.shortDescription,
            description: product.description,
            categoryId: product.categoryId,
            tags: safeJsonParse<string[]>(product.tags, []),
            variants: safeJsonParse<ProductVariant[]>(product.variants, []),
            faqs: safeJsonParse<ProductFaq[]>(product.faqs, []),
            imageUrl: product.imageUrl ?? "",
            available: product.available,
            featured: product.featured,
          }}
        />
      </div>
    </main>
  );
}
