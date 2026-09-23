import Link from "next/link";
import { getServerSession } from "next-auth";
import { Plus } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/mappers";
import { Button } from "@/components/ui/Button";
import { ProductTable } from "@/components/admin/ProductTable";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  const businessId = session!.user.businessId;

  const products = await prisma.product.findMany({
    where: { businessId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Productos</h1>
          <p className="mt-1 text-sm text-ink-900/55">{products.length} producto(s) en tu catálogo.</p>
        </div>
        <Link href="/admin/productos/nuevo">
          <Button>
            <Plus className="h-4 w-4" /> Agregar producto
          </Button>
        </Link>
      </div>

      <ProductTable products={products.map(toProductDTO)} />
    </div>
  );
}
