import type { Business, Category, Product } from "@prisma/client";
import { safeJsonParse } from "@/lib/utils";
import type { BusinessDTO, CategoryDTO, ProductDTO, ProductFAQ, ProductVariant } from "@/types";
import type { Plan } from "@/lib/plans";

export function toProductDTO(
  product: Product & { category?: Category | null }
): ProductDTO {
  return {
    id: product.id,
    businessId: product.businessId,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? null,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    features: safeJsonParse<string[]>(product.features, []),
    tags: safeJsonParse<string[]>(product.tags, []),
    faqs: safeJsonParse<ProductFAQ[]>(product.faqs, []),
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    imageUrl: product.imageUrl,
    images: safeJsonParse<string[]>(product.images, []),
    variants: safeJsonParse<ProductVariant[]>(product.variants, []),
    available: product.available,
    featured: product.featured,
    active: product.active,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function toBusinessDTO(business: Business): BusinessDTO {
  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    description: business.description,
    logoUrl: business.logoUrl,
    coverUrl: business.coverUrl,
    phone: business.phone,
    address: business.address,
    mapUrl: business.mapUrl,
    hours: business.hours,
    instagram: business.instagram,
    facebook: business.facebook,
    tiktok: business.tiktok,
    plan: business.plan as Plan,
    primaryColor: business.primaryColor,
  };
}

export function toCategoryDTO(category: Category): CategoryDTO {
  return { id: category.id, name: category.name, slug: category.slug };
}
