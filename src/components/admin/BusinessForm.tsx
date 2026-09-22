"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Check } from "lucide-react";
import type { BusinessDTO } from "@/types";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ImageUpload } from "@/components/admin/ImageUpload";

export function BusinessForm({ business }: { business: BusinessDTO }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: business.name,
    description: business.description ?? "",
    logoUrl: business.logoUrl ?? "",
    coverUrl: business.coverUrl ?? "",
    phone: business.phone,
    address: business.address ?? "",
    hours: business.hours ?? "",
    instagram: business.instagram ?? "",
    facebook: business.facebook ?? "",
    tiktok: business.tiktok ?? "",
    primaryColor: business.primaryColor,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    const res = await fetch("/api/admin/business", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "No se pudo guardar");
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="space-y-4 p-6">
        <div>
          <Label>Nombre del negocio</Label>
          <Input required value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <Label>Descripción corta</Label>
          <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Logo</Label>
            <ImageUpload value={form.logoUrl || null} onChange={(url) => set("logoUrl", url)} aiImageToolsEnabled={false} />
          </div>
          <div>
            <Label>Imagen de portada</Label>
            <ImageUpload value={form.coverUrl || null} onChange={(url) => set("coverUrl", url)} aiImageToolsEnabled={false} />
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <div>
          <Label>WhatsApp (con código de país, solo números)</Label>
          <Input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="5215512345678" />
        </div>
        <div>
          <Label>Dirección</Label>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
        </div>
        <div>
          <Label>Horarios</Label>
          <Input value={form.hours} onChange={(e) => set("hours", e.target.value)} placeholder="Lun-Sáb 9:00-21:00" />
        </div>
      </Card>

      <Card className="space-y-4 p-6">
        <div>
          <Label>Instagram (URL)</Label>
          <Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="https://instagram.com/tunegocio" />
        </div>
        <div>
          <Label>Facebook (URL)</Label>
          <Input value={form.facebook} onChange={(e) => set("facebook", e.target.value)} placeholder="https://facebook.com/tunegocio" />
        </div>
        <div>
          <Label>TikTok (URL)</Label>
          <Input value={form.tiktok} onChange={(e) => set("tiktok", e.target.value)} placeholder="https://tiktok.com/@tunegocio" />
        </div>
        <div>
          <Label>Color principal</Label>
          <input
            type="color"
            value={form.primaryColor}
            onChange={(e) => set("primaryColor", e.target.value)}
            className="h-11 w-20 cursor-pointer rounded-lg border border-ink-900/15"
          />
        </div>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <Check className="h-4 w-4" /> Guardado
          </span>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
