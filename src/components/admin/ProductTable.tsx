"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ImageOff } from "lucide-react";
import type { ProductDTO } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Card";

export function ProductTable({ products }: { products: ProductDTO[] }) {
  const router = useRouter();
  const [items, setItems] = useState(products);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function toggle(id: string, field: "active" | "featured" | "available", value: boolean) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-900/15 p-16 text-center text-sm text-ink-900/50">
        Aún no tienes productos. Crea el primero para comenzar a vender.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-900/8 bg-white">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-ink-900/8 bg-ink-900/[0.02] text-left text-xs uppercase text-ink-900/40">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Disponible</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/6">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-ink-900/[0.015]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-ink-900/5">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt="" fill className="object-cover" sizes="44px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-ink-900/20">
                          <ImageOff className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-ink-900">{p.name}</p>
                      {p.categoryName && <Badge variant="muted">{p.categoryName}</Badge>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-ink-900">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <Switch checked={p.available} onChange={(v) => toggle(p.id, "available", v)} />
                </td>
                <td className="px-4 py-3">
                  <Switch checked={p.featured} onChange={(v) => toggle(p.id, "featured", v)} />
                </td>
                <td className="px-4 py-3">
                  <Switch checked={p.active} onChange={(v) => toggle(p.id, "active", v)} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="rounded-lg p-2 text-ink-900/50 hover:bg-ink-900/5 hover:text-ink-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => remove(p.id)}
                      disabled={deletingId === p.id}
                      className="rounded-lg p-2 text-ink-900/50 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand-500" : "bg-ink-900/15"}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
