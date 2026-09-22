"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Ocurrió un error, intenta de nuevo.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (signInRes?.error) {
      router.push(`/login?email=${encodeURIComponent(form.email)}`);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-grid-glow bg-ink-950 px-5 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 flex items-center gap-2 font-semibold text-ink-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          Catálogo Inteligente IA
        </div>
        <h1 className="text-xl font-bold text-ink-900">Crea tu negocio</h1>
        <p className="mt-1 text-sm text-ink-900/55">Empieza gratis con el plan Básico. Puedes mejorar tu plan cuando quieras.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label>Tu nombre</Label>
            <Input required value={form.ownerName} onChange={(e) => update("ownerName", e.target.value)} placeholder="María López" />
          </div>
          <div>
            <Label>Nombre de tu negocio</Label>
            <Input required value={form.businessName} onChange={(e) => update("businessName", e.target.value)} placeholder="Cafetería Aroma" />
          </div>
          <div>
            <Label>Número de WhatsApp (con código de país)</Label>
            <Input required value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="5215512345678" />
          </div>
          <div>
            <Label>Correo electrónico</Label>
            <Input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="tu@negocio.com" />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear mi cuenta"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-900/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </Card>
    </main>
  );
}
