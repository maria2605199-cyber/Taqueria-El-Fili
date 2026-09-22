import type { ProductFaq, ProductVariant } from "@/lib/types";

export interface PublicProduct {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  imageUrl: string | null;
  available: boolean;
  featured: boolean;
  categoryId: string | null;
  categoryName: string | null;
  tags: string[];
  variants: ProductVariant[];
  faqs: ProductFaq[];
}

export interface PublicCategory {
  id: string;
  name: string;
}

export interface PublicBusiness {
  slug: string;
  name: string;
  description: string;
  logoUrl: string | null;
  whatsapp: string;
}
