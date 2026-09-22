"use client";

import Image from "next/image";
import { MessageCircle, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { PublicProduct } from "./types";

interface Props {
  product: PublicProduct;
  onOpen: (product: PublicProduct) => void;
  onWhatsapp: (product: PublicProduct) => void;
}

export function ProductCard({ product, onOpen, onWhatsapp }: Props) {
  return (
    <div className="group glass-card flex flex-col overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <button
        onClick={() => onOpen(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 260px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-foreground/30">
            {product.name}
          </div>
        )}
        {product.featured && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-amber-400/95 px-2 py-0.5 text-[11px] font-semibold text-amber-950 shadow">
            <Star size={11} className="fill-current" /> Destacado
          </span>
        )}
        {!product.available && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white">
            No disponible
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <button onClick={() => onOpen(product)} className="text-left font-semibold hover:underline">
            {product.name}
          </button>
          <span className="shrink-0 font-semibold text-violet-600">{formatPrice(product.price)}</span>
        </div>
        {product.categoryName && (
          <Badge tone="neutral" className="mb-2 w-fit">
            {product.categoryName}
          </Badge>
        )}
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-foreground/60">
          {product.shortDescription}
        </p>
        <button
          onClick={() => onWhatsapp(product)}
          className="flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          <MessageCircle size={16} />
          {product.available ? "Consultar" : "Preguntar disponibilidad"}
        </button>
      </div>
    </div>
  );
}
