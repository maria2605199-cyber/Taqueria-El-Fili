export interface ProductVariant {
  name: string;
  options: string[];
}

export interface ProductFAQ {
  q: string;
  a: string;
}

export interface ProductDTO {
  id: string;
  businessId: string;
  categoryId: string | null;
  categoryName?: string | null;
  name: string;
  shortDescription: string | null;
  description: string | null;
  features: string[];
  tags: string[];
  faqs: ProductFAQ[];
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  images: string[];
  variants: ProductVariant[];
  available: boolean;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessDTO {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  phone: string;
  address: string | null;
  mapUrl: string | null;
  hours: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  plan: "BASICO" | "PRO" | "PREMIUM";
  primaryColor: string;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  products?: ProductDTO[];
}
