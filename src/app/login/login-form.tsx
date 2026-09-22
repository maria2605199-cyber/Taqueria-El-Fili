"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import { Input, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div>
        <FieldLabel>Correo electrónico</FieldLabel>
        <Input type="email" name="email" placeholder="tucorreo@negocio.com" required />
      </div>
      <div>
        <FieldLabel>Contraseña</FieldLabel>
        <Input type="password" name="password" placeholder="••••••••" required minLength={6} />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Ingresando..." : "Iniciar sesión"}
      </Button>
    </form>
  );
}
