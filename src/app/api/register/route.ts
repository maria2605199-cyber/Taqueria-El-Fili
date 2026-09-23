import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const schema = z.object({
  ownerName: z.string().min(2, "Escribe tu nombre completo"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  businessName: z.string().min(2, "Escribe el nombre de tu negocio"),
  phone: z.string().min(8, "Escribe un número de WhatsApp válido"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }

  const { ownerName, email, password, businessName, phone } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo." }, { status: 409 });
  }

  let baseSlug = slugify(businessName) || "negocio";
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.business.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const business = await prisma.business.create({
    data: {
      slug,
      name: businessName,
      phone: phone.replace(/[^0-9]/g, ""),
      plan: "BASICO",
      users: {
        create: {
          email: normalizedEmail,
          name: ownerName,
          passwordHash,
          role: "OWNER",
        },
      },
    },
  });

  return NextResponse.json({ ok: true, slug: business.slug });
}
