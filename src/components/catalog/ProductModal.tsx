"use client";

import Image from "next/image";
import { useState } from "react";
import { MessageCircle, ImageOff } from "lucide-react";
import type { BusinessDTO, ProductDTO } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink, productWhatsAppMessage } from "@/lib/whatsapp";

export function ProductModal({
  product,
  business,
  onClose,
}: {
  product: ProductDTO | null;
  business: BusinessDTO;
  onClose: () => void;
}) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  if (!product) return null;

  function onConsult() {
    fetch("/api/public/track/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, productId: product!.id, source: "product" }),
    }).catch(() => {});

    const variantText = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const base = productWhatsAppMessage(business.name, product!.name);
    const link = buildWhatsAppLink(business.phone, variantText ? `${base} (${variantText})` : base);
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <Modal open={Boolean(product)} onClose={onClose} className="!p-0 sm:!p-0">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl bg-ink-900/5 sm:rounded-t-3xl">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="500px" />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-900/20">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium shadow"
        >
          Cerrar
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-1.5">
          {product.categoryName && <Badge variant="brand">{product.categoryName}</Badge>}
          {product.featured && <Badge variant="default">Destacado</Badge>}
          <Badge variant={product.available ? "success" : "danger"}>
            {product.available ? "Disponible" : "No disponible"}
          </Badge>
        </div>

        <h2 className="mt-3 text-2xl font-bold text-ink-900">{product.name}</h2>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-ink-900">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-ink-900/40 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        {product.description && <p className="mt-4 text-sm leading-relaxed text-ink-900/70">{product.description}</p>}

        {product.features.length > 0 && (
          <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-ink-900/70">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {f}
              </li>
            ))}
          </ul>
        )}

        {product.variants.length > 0 && (
          <div className="mt-5 space-y-3">
            {product.variants.map((variant) => (
              <div key={variant.name}>
                <p className="mb-1.5 text-xs font-semibold text-ink-900/60">{variant.name}</p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setSelectedVariants((s) => ({ ...s, [variant.name]: opt }))}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        selectedVariants[variant.name] === opt
                          ? "border-brand-500 bg-brand-500/10 text-brand-700"
                          : "border-ink-900/15 text-ink-900/70 hover:border-ink-900/30"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {product.faqs.length > 0 && (
          <div className="mt-5 space-y-2">
            <p className="text-xs font-semibold text-ink-900/60">Preguntas frecuentes</p>
            {product.faqs.map((f) => (
              <details key={f.q} className="rounded-lg border border-ink-900/8 p-3 text-sm">
                <summary className="cursor-pointer font-medium text-ink-900">{f.q}</summary>
                <p className="mt-1.5 text-ink-900/60">{f.a}</p>
              </details>
            ))}
          </div>
        )}

        <Button variant="whatsapp" className="mt-6 w-full" size="lg" disabled={!product.available} onClick={onConsult}>
          <MessageCircle className="h-4 w-4" />
          {product.available ? "Consultar por WhatsApp" : "No disponible actualmente"}
        </Button>
      </div>
    </Modal>
  );
}
