"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-6 flex items-center gap-2 font-semibold text-ink-900">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        Catálogo Inteligente IA
      </div>
      <h1 className="text-xl font-bold text-ink-900">Inicia sesión</h1>
      <p className="mt-1 text-sm text-ink-900/55">Entra al panel administrador de tu negocio.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <Label>Correo electrónico</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@tunegocio.com" />
        </div>
        <div>
          <Label>Contraseña</Label>
          <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesión"}
          {!loading && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <div className="mt-6 rounded-xl bg-ink-900/[0.03] p-3 text-xs text-ink-900/60">
        Demo: <strong>admin@elfili.com</strong> / <strong>elfili2024</strong>
      </div>

      <p className="mt-6 text-center text-sm text-ink-900/60">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-medium text-brand-600 hover:underline">
          Crea tu negocio
        </Link>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-grid-glow bg-ink-950 px-5 py-12">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
