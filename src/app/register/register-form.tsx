"use client";

import { useActionState } from "react";
import { registerAction } from "./actions";
import { Input, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <FieldLabel>Nombre completo</FieldLabel>
        <Input type="text" name="name" placeholder="Juan Pérez" required />
      </div>
      <div>
        <FieldLabel>Correo electrónico</FieldLabel>
        <Input type="email" name="email" placeholder="tucorreo@negocio.com" required />
      </div>
      <div>
        <FieldLabel hint="mínimo 6 caracteres">Contraseña</FieldLabel>
        <Input type="password" name="password" placeholder="••••••••" required minLength={6} />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creando cuenta..." : "Crear cuenta gratis"}
      </Button>
    </form>
  );
}
