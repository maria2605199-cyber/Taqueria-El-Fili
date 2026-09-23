"use client";

import Image from "next/image";
import { MessageCircle, ImageOff } from "lucide-react";
import type { BusinessDTO, ProductDTO } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink, productWhatsAppMessage } from "@/lib/whatsapp";

export function ProductCard({
  product,
  business,
  onOpen,
  compact = false,
}: {
  product: ProductDTO;
  business: BusinessDTO;
  onOpen: (product: ProductDTO) => void;
  compact?: boolean;
}) {
  async function onConsult(e: React.MouseEvent) {
    e.stopPropagation();
    fetch("/api/public/track/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, productId: product.id, source: "product" }),
    }).catch(() => {});
    const link = buildWhatsAppLink(business.phone, productWhatsAppMessage(business.name, product.name));
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      onClick={() => onOpen(product)}
      className={cn(
        "group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-ink-900/8 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg",
        compact && "min-w-[220px] max-w-[220px]"
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-ink-900/5">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 260px"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-900/20">
            <ImageOff className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {product.featured && <Badge variant="brand">Destacado</Badge>}
          {!product.available && <Badge variant="danger">Agotado</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        {product.categoryName && (
          <span className="mb-1 text-[11px] font-medium uppercase tracking-wide text-brand-600">
            {product.categoryName}
          </span>
        )}
        <h3 className="line-clamp-1 text-sm font-semibold text-ink-900">{product.name}</h3>
        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-xs text-ink-900/55">{product.shortDescription}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-base font-bold text-ink-900">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink-900/35 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        <Button
          size="sm"
          variant="whatsapp"
          className="mt-3 w-full"
          disabled={!product.available}
          onClick={onConsult}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {product.available ? "Consultar" : "No disponible"}
        </Button>
      </div>
    </div>
  );
}
