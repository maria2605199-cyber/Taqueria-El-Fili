"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export function CategoryManager({ initial }: { initial: CategoryItem[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "No se pudo crear la categoría");
      return;
    }
    setCategories((c) => [...c, { ...data, productCount: 0 }]);
    setName("");
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar esta categoría? Los productos quedarán sin categoría.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories((c) => c.filter((cat) => cat.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <form onSubmit={add} className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la categoría" />
          <Button type="submit" disabled={saving}>
            <Plus className="h-4 w-4" /> Agregar
          </Button>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </Card>

      <Card className="divide-y divide-ink-900/6">
        {categories.length === 0 ? (
          <p className="p-6 text-center text-sm text-ink-900/50">Aún no tienes categorías.</p>
        ) : (
          categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-ink-900">{c.name}</p>
                <p className="text-xs text-ink-900/45">{c.productCount} producto(s)</p>
              </div>
              <button onClick={() => remove(c.id)} className="rounded-lg p-2 text-ink-900/40 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
