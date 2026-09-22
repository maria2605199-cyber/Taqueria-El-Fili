"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Star, Eye, MessageCircle } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  deleteProductAction,
  toggleProductFieldAction,
} from "@/app/dashboard/productos/actions";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    available: boolean;
    featured: boolean;
    viewCount: number;
    whatsappClicks: number;
    categoryName: string | null;
  };
}

export function ProductRow({ product }: Props) {
  const [isPending, startTransition] = useTransition();

  function toggle(field: "available" | "featured") {
    startTransition(() => {
      toggleProductFieldAction(product.id, field);
    });
  }

  function remove() {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    startTransition(() => {
      deleteProductAction(product.id);
    });
  }

  return (
    <tr className={cn("border-b border-border-soft last:border-0", isPending && "opacity-50")}>
      <td className="py-3 pr-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
            {product.imageUrl ? (
              <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-foreground/30">
                Sin foto
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{product.name}</p>
            <p className="text-xs text-foreground/50">{product.categoryName ?? "Sin categoría"}</p>
          </div>
        </div>
      </td>
      <td className="py-3 pr-3 font-medium">{formatPrice(product.price)}</td>
      <td className="py-3 pr-3">
        <button onClick={() => toggle("available")} disabled={isPending}>
          <Badge tone={product.available ? "success" : "neutral"}>
            {product.available ? "Disponible" : "Inactivo"}
          </Badge>
        </button>
      </td>
      <td className="py-3 pr-3">
        <button onClick={() => toggle("featured")} disabled={isPending}>
          <Star
            size={18}
            className={product.featured ? "fill-amber-400 text-amber-400" : "text-foreground/30"}
          />
        </button>
      </td>
      <td className="py-3 pr-3 text-xs text-foreground/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Eye size={14} /> {product.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={14} /> {product.whatsappClicks}
          </span>
        </div>
      </td>
      <td className="py-3 text-right">
        <div className="flex justify-end gap-3">
          <Link href={`/dashboard/productos/${product.id}`} className="text-foreground/50 hover:text-violet-600">
            <Pencil size={16} />
          </Link>
          <button onClick={remove} className="text-foreground/50 hover:text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
