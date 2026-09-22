import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            Catálogo Inteligente IA
          </Link>
          <h1 className="mt-4 text-2xl font-semibold">Inicia sesión</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Entra al panel de administración de tu negocio.
          </p>
        </div>
        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <LoginForm callbackUrl={callbackUrl || "/dashboard"} />
        </div>
        <div className="mt-6 space-y-2 text-center text-sm text-foreground/60">
          <p>
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="font-medium text-violet-600 hover:underline">
              Crea tu negocio gratis
            </Link>
          </p>
          <p className="text-xs">
            Demo: <span className="font-mono">demo@taqueriaelfili.com</span> /{" "}
            <span className="font-mono">demo1234</span>
          </p>
        </div>
      </div>
    </main>
  );
}
