import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  const businessId = session!.user.businessId;

  const categories = await prisma.category.findMany({
    where: { businessId },
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">Categorías</h1>
        <p className="mt-1 text-sm text-ink-900/55">Organiza tus productos para que sean más fáciles de encontrar.</p>
      </div>
      <CategoryManager
        initial={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, productCount: c._count.products }))}
      />
    </div>
  );
}
