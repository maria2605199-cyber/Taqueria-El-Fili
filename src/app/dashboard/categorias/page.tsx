import Link from "next/link";
import { requireBusiness } from "@/lib/current-business";
import { prisma } from "@/lib/prisma";
import { createCategoryAction, deleteCategoryAction } from "@/app/dashboard/productos/actions";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default async function CategoriasPage() {
  const { business } = await requireBusiness();
  const categories = await prisma.category.findMany({
    where: { businessId: business.id },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Categorías</h1>
        <p className="mt-1 text-sm text-foreground/60">
          Organiza tus productos para que sean más fáciles de encontrar en el catálogo.
        </p>
      </div>

      <form action={createCategoryAction} className="glass-card mb-6 flex gap-3 rounded-2xl p-4 shadow-xl">
        <Input name="name" placeholder="Ej. Bebidas" required />
        <Button type="submit">Agregar</Button>
      </form>

      <div className="glass-card divide-y divide-border-soft rounded-2xl shadow-xl">
        {categories.length === 0 && (
          <p className="p-6 text-center text-sm text-foreground/50">Aún no tienes categorías.</p>
        )}
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-foreground/50">
                {c._count.products} producto{c._count.products !== 1 && "s"}
              </p>
            </div>
            <form action={deleteCategoryAction.bind(null, c.id)}>
              <button type="submit" className="text-foreground/40 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </form>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-foreground/40">
        <Link href="/dashboard/productos" className="hover:underline">
          ← Volver a productos
        </Link>
      </p>
    </main>
  );
}
