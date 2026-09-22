import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { CatalogFooter } from "@/components/catalog/catalog-footer";
import { CatalogApp } from "@/components/catalog/catalog-app";
import type { BusinessHours, BusinessSocials, ProductFaq, ProductVariant } from "@/lib/types";

async function getBusinessData(slug: string) {
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      categories: { orderBy: { name: "asc" } },
      products: { orderBy: { createdAt: "desc" } },
    },
  });
  return business;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessData(slug);
  if (!business) return { title: "Catálogo no encontrado" };
  return {
    title: `${business.name} · Catálogo digital`,
    description: business.description,
  };
}

export default async function NegocioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await getBusinessData(slug);
  if (!business) notFound();

  const hours = safeJsonParse<BusinessHours[]>(business.hours, []);
  const socials = safeJsonParse<BusinessSocials>(business.socials, {});

  const products = business.products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    shortDescription: p.shortDescription,
    description: p.description,
    imageUrl: p.imageUrl,
    available: p.available,
    featured: p.featured,
    categoryId: p.categoryId,
    categoryName: business.categories.find((c) => c.id === p.categoryId)?.name ?? null,
    tags: safeJsonParse<string[]>(p.tags, []),
    variants: safeJsonParse<ProductVariant[]>(p.variants, []),
    faqs: safeJsonParse<ProductFaq[]>(p.faqs, []),
  }));

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader
        name={business.name}
        description={business.description}
        logoUrl={business.logoUrl}
        socials={socials}
      />
      <CatalogApp
        business={{
          slug: business.slug,
          name: business.name,
          description: business.description,
          logoUrl: business.logoUrl,
          whatsapp: business.whatsapp,
        }}
        products={products}
        categories={business.categories.map((c) => ({ id: c.id, name: c.name }))}
      />
      <CatalogFooter
        name={business.name}
        address={business.address}
        city={business.city}
        hours={hours}
        socials={socials}
      />
    </div>
  );
}
