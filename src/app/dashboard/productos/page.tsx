import Link from "next/link";
import { requireBusiness } from "@/lib/current-business";
import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/button";
import { ProductRow } from "@/components/dashboard/product-row";
import { Plus, PackageSearch } from "lucide-react";

export default async function ProductosPage() {
  const { business } = await requireBusiness();

  const products = await prisma.product.findMany({
    where: { businessId: business.id },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Productos</h1>
          <p className="mt-1 text-sm text-foreground/60">
            {products.length} producto{products.length !== 1 && "s"} en tu catálogo.
          </p>
        </div>
        <div className="flex gap-3">
          <LinkButton href="/dashboard/categorias" variant="secondary">
            Categorías
          </LinkButton>
          <LinkButton href="/dashboard/productos/nuevo">
            <Plus size={16} /> Nuevo producto
          </LinkButton>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl p-16 text-center">
          <PackageSearch size={40} className="text-foreground/30" />
          <p className="text-foreground/60">Aún no tienes productos. Agrega el primero.</p>
          <LinkButton href="/dashboard/productos/nuevo">
            <Plus size={16} /> Agregar producto
          </LinkButton>
        </div>
      ) : (
        <div className="glass-card overflow-x-auto rounded-2xl p-4 shadow-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-soft text-left text-xs uppercase tracking-wide text-foreground/40">
                <th className="pb-3 font-medium">Producto</th>
                <th className="pb-3 font-medium">Precio</th>
                <th className="pb-3 font-medium">Estado</th>
                <th className="pb-3 font-medium">Destacado</th>
                <th className="pb-3 font-medium">Métricas</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <ProductRow
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    imageUrl: p.imageUrl,
                    available: p.available,
                    featured: p.featured,
                    viewCount: p.viewCount,
                    whatsappClicks: p.whatsappClicks,
                    categoryName: p.category?.name ?? null,
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-foreground/40">
        <Link href="/dashboard" className="hover:underline">
          ← Volver al panel
        </Link>
      </p>
    </main>
  );
}
