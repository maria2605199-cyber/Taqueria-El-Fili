"use client";

import Image from "next/image";
import { X, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { PublicProduct } from "./types";

interface Props {
  product: PublicProduct;
  onClose: () => void;
  onWhatsapp: (product: PublicProduct) => void;
}

export function ProductModal({ product, onClose, onWhatsapp }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="glass-card dark-surface max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-[4/3] w-full bg-surface-muted">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="512px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-foreground/30">
              {product.name}
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <span className="shrink-0 text-xl font-semibold text-violet-500">
              {formatPrice(product.price)}
            </span>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {product.categoryName && <Badge tone="brand">{product.categoryName}</Badge>}
            <Badge tone={product.available ? "success" : "danger"}>
              {product.available ? "Disponible" : "No disponible"}
            </Badge>
            {product.tags.slice(0, 4).map((t) => (
              <Badge key={t} tone="neutral">
                {t}
              </Badge>
            ))}
          </div>

          <p className="mb-5 text-sm leading-relaxed text-foreground/70">{product.description}</p>

          {product.variants.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-2 text-sm font-semibold">Variantes</h3>
              <div className="space-y-2">
                {product.variants.map((v, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium">{v.name}: </span>
                    <span className="text-foreground/60">{v.options.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.faqs.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-semibold">Preguntas frecuentes</h3>
              <div className="space-y-3">
                {product.faqs.map((f, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-medium">{f.q}</p>
                    <p className="text-foreground/60">{f.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => onWhatsapp(product)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-3 font-medium text-white hover:bg-emerald-600"
          >
            <MessageCircle size={18} />
            {product.available ? "Consultar por WhatsApp" : "Preguntar disponibilidad"}
          </button>
        </div>
      </div>
    </div>
  );
}
