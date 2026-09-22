import { requireBusiness } from "@/lib/current-business";
import { prisma } from "@/lib/prisma";
import { createProductAction } from "@/app/dashboard/productos/actions";
import { ProductForm } from "@/components/dashboard/product-form";

export default async function NuevoProductoPage() {
  const { business } = await requireBusiness();
  const categories = await prisma.category.findMany({
    where: { businessId: business.id },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Nuevo producto</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Escribe el nombre y usa la IA para generar el resto del contenido.
        </p>
      </div>
      <div className="glass-card rounded-2xl p-6 shadow-xl">
        <ProductForm action={createProductAction} submitLabel="Publicar producto" categories={categories} />
      </div>
    </main>
  );
}
