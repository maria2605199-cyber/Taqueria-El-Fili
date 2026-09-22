import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-bold gradient-text">
            Catálogo Inteligente IA
          </Link>
          <h1 className="mt-4 text-2xl font-semibold">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Publica el catálogo digital de tu negocio en minutos.
          </p>
        </div>
        <div className="glass-card rounded-2xl p-6 shadow-xl">
          <RegisterForm />
        </div>
        <p className="mt-6 text-center text-sm text-foreground/60">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-violet-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
