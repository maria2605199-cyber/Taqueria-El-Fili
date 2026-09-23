import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { toBusinessDTO, toCategoryDTO, toProductDTO } from "@/lib/mappers";
import { CatalogClient } from "@/components/catalog/CatalogClient";

async function getBusiness(slug: string) {
  const business = await prisma.business.findUnique({ where: { slug } });
  if (!business) return null;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { businessId: business.id }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { businessId: business.id, active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    business: toBusinessDTO(business),
    categories: categories.map(toCategoryDTO),
    products: products.map(toProductDTO),
  };
}

export async function generateMetadata({ params }: { params: { negocio: string } }): Promise<Metadata> {
  const data = await getBusiness(params.negocio);
  if (!data) return { title: "Catálogo no encontrado" };
  return {
    title: `${data.business.name} — Catálogo digital`,
    description: data.business.description || `Catálogo digital de ${data.business.name}`,
  };
}

export default async function BusinessCatalogPage({ params }: { params: { negocio: string } }) {
  const data = await getBusiness(params.negocio);
  if (!data) notFound();

  return <CatalogClient business={data.business} categories={data.categories} products={data.products} />;
}
