export interface ProductForAI {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  description: string;
  tags: string[];
  categoryName: string | null;
  available: boolean;
  featured: boolean;
  viewCount: number;
  whatsappClicks: number;
}

export interface SearchResult {
  message: string;
  productIds: string[];
}

export interface GeneratedProductContent {
  shortDescription: string;
  description: string;
  tags: string[];
  suggestedCategory: string;
  faqs: { q: string; a: string }[];
}
