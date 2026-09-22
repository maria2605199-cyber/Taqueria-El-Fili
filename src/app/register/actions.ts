"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const schema = z.object({
  name: z.string().min(2, "Ingresa tu nombre."),
  email: z.string().email("Correo inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export type RegisterState = { error?: string } | undefined;

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return { error: "Ya existe una cuenta con ese correo." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash },
  });

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: "/dashboard/negocio/nuevo",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "No se pudo iniciar sesión automáticamente. Intenta iniciar sesión." };
    }
    throw error;
  }
}
