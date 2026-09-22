"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "./search-bar";
import { ProductCard } from "./product-card";
import { ProductModal } from "./product-modal";
import { AIAssistant, WhatsappFab } from "./ai-assistant";
import { track } from "./track";
import { buildWhatsappLink, productInquiryMessage, generalInquiryMessage } from "@/lib/whatsapp";
import { Sparkles } from "lucide-react";
import type { PublicBusiness, PublicCategory, PublicProduct } from "./types";

interface SearchProductSummary {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  imageUrl: string | null;
  available: boolean;
  categoryName: string | null;
}

export function CatalogApp({
  business,
  products,
  categories,
}: {
  business: PublicBusiness;
  products: PublicProduct[];
  categories: PublicCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<PublicProduct | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProductSummary[]>([]);

  useEffect(() => {
    track(business.slug, "CATALOG_VIEW");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const featured = useMemo(() => products.filter((p) => p.featured), [products]);
  const visibleProducts = useMemo(
    () => (activeCategory ? products.filter((p) => p.categoryId === activeCategory) : products),
    [products, activeCategory]
  );

  function findProduct(id: string) {
    return products.find((p) => p.id === id);
  }

  function openProduct(product: PublicProduct) {
    setModalProduct(product);
    track(business.slug, "PRODUCT_VIEW", product.id);
  }

  function whatsappForProduct(product: { id: string; name: string }) {
    track(business.slug, "WHATSAPP_CLICK", product.id);
    const link = buildWhatsappLink(business.whatsapp, productInquiryMessage(business.name, product.name));
    window.open(link, "_blank");
  }

  async function runSearch(query: string) {
    setSearchLoading(true);
    setSearchActive(true);
    try {
      const res = await fetch(`/api/public/${business.slug}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setSearchMessage(data.message ?? "");
      setSearchResults(data.products ?? []);
    } catch {
      setSearchMessage("Ocurrió un error al buscar. Intenta de nuevo.");
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  function clearSearch() {
    setSearchActive(false);
    setSearchResults([]);
    setSearchMessage("");
  }

  const generalWhatsappLink = buildWhatsappLink(business.whatsapp, generalInquiryMessage(business.name));

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-5xl px-4 py-8">
        <SearchBar onSearch={runSearch} onClear={clearSearch} loading={searchLoading} active={searchActive} />
      </section>

      {searchActive ? (
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="mb-5 flex items-center gap-2 rounded-2xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm">
            <Sparkles size={16} className="shrink-0 text-violet-600" />
            <span>{searchMessage}</span>
          </div>
          {searchResults.length === 0 ? (
            <p className="text-sm text-foreground/50">No encontramos productos para tu búsqueda.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((p) => {
                const full = findProduct(p.id);
                if (!full) return null;
                return (
                  <ProductCard key={p.id} product={full} onOpen={openProduct} onWhatsapp={whatsappForProduct} />
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <>
          {featured.length > 0 && (
            <section className="mx-auto max-w-5xl px-4 pb-10">
              <h2 className="mb-4 text-lg font-semibold">Destacados</h2>
              <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
                {featured.map((p) => (
                  <div key={p.id} className="w-48 shrink-0 sm:w-56">
                    <ProductCard product={p} onOpen={openProduct} onWhatsapp={whatsappForProduct} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mx-auto max-w-5xl px-4 pb-20">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Todos los productos</h2>
            </div>

            {categories.length > 0 && (
              <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={
                    !activeCategory
                      ? "shrink-0 rounded-full gradient-bg px-4 py-1.5 text-sm font-medium text-white"
                      : "shrink-0 rounded-full border border-border-soft px-4 py-1.5 text-sm text-foreground/60 hover:bg-surface-muted"
                  }
                >
                  Todos
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCategory(c.id)}
                    className={
                      activeCategory === c.id
                        ? "shrink-0 rounded-full gradient-bg px-4 py-1.5 text-sm font-medium text-white"
                        : "shrink-0 rounded-full border border-border-soft px-4 py-1.5 text-sm text-foreground/60 hover:bg-surface-muted"
                    }
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {visibleProducts.length === 0 ? (
              <p className="text-sm text-foreground/50">Todavía no hay productos en esta categoría.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={openProduct} onWhatsapp={whatsappForProduct} />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {modalProduct && (
        <ProductModal product={modalProduct} onClose={() => setModalProduct(null)} onWhatsapp={whatsappForProduct} />
      )}

      <WhatsappFab
        href={generalWhatsappLink}
        onClick={() => track(business.slug, "WHATSAPP_CLICK")}
      />
      <AIAssistant
        slug={business.slug}
        businessName={business.name}
        onOpenProduct={openProduct}
        findProduct={findProduct}
      />
    </div>
  );
}
