"use client";

import { useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import type { BusinessDTO, CategoryDTO, ProductDTO } from "@/types";
import { BusinessHeader } from "@/components/catalog/BusinessHeader";
import { SearchBar } from "@/components/catalog/SearchBar";
import { CategoryFilter } from "@/components/catalog/CategoryFilter";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ProductModal } from "@/components/catalog/ProductModal";
import { BusinessFooter } from "@/components/catalog/BusinessFooter";
import { AIAssistantWidget } from "@/components/catalog/AIAssistantWidget";

export function CatalogClient({
  business,
  categories,
  products,
}: {
  business: BusinessDTO;
  categories: CategoryDTO[];
  products: ProductDTO[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
  const [aiState, setAiState] = useState<{ query: string; reply: string; products: ProductDTO[]; loading: boolean } | null>(
    null
  );

  const featured = useMemo(() => products.filter((p) => p.featured), [products]);

  const filtered = useMemo(() => {
    if (category === "featured") return featured;
    if (category) return products.filter((p) => p.categoryId === category);
    return products;
  }, [products, category, featured]);

  async function onSearch(query: string) {
    setAiState({ query, reply: "", products: [], loading: true });
    try {
      const res = await fetch("/api/public/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, query }),
      });
      const data = await res.json();
      setAiState({ query, reply: data.reply, products: data.products || [], loading: false });
    } catch {
      setAiState({ query, reply: "No pudimos procesar tu búsqueda, intenta de nuevo.", products: [], loading: false });
    }
  }

  function openProduct(product: ProductDTO) {
    setSelectedProduct(product);
    fetch("/api/public/track/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, productId: product.id }),
    }).catch(() => {});
  }

  return (
    <main className="min-h-screen bg-white pb-20">
      <BusinessHeader business={business} />

      <div className="mx-auto mt-6 max-w-5xl space-y-6 px-5">
        <SearchBar onSearch={onSearch} onClear={() => setAiState(null)} loading={Boolean(aiState?.loading)} active={Boolean(aiState)} />

        {aiState ? (
          <section className="animate-fade-in">
            <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-4">
              <p className="text-sm font-medium text-brand-800">
                {aiState.loading ? "Buscando en el catálogo..." : aiState.reply}
              </p>
            </div>
            {!aiState.loading && (
              <div className="mt-4 grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                {aiState.products.map((p) => (
                  <ProductCard key={p.id} product={p} business={business} onOpen={openProduct} />
                ))}
                {aiState.products.length === 0 && (
                  <p className="col-span-full py-6 text-center text-sm text-ink-900/50">
                    No encontramos resultados para tu búsqueda.
                  </p>
                )}
              </div>
            )}
          </section>
        ) : (
          <>
            <CategoryFilter categories={categories} active={category} onChange={setCategory} />

            {category === null && featured.length > 0 && (
              <section>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-900/50">Destacados</h2>
                <div className="scrollbar-thin flex gap-3.5 overflow-x-auto pb-2">
                  {featured.map((p) => (
                    <ProductCard key={p.id} product={p} business={business} onOpen={openProduct} compact />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-900/50">
                {category === "featured" ? "Destacados" : category ? "Productos" : "Todos los productos"}
              </h2>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} business={business} onOpen={openProduct} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-16 text-ink-900/40">
                  <PackageSearch className="h-10 w-10" />
                  <p className="text-sm">Aún no hay productos en esta categoría.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <BusinessFooter business={business} />

      <ProductModal product={selectedProduct} business={business} onClose={() => setSelectedProduct(null)} />
      <AIAssistantWidget business={business} onOpenProduct={openProduct} />
    </main>
  );
}
