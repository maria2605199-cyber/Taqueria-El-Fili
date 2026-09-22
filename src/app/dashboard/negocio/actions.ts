"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/current-business";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  description: z.string().min(5, "Agrega una descripción corta."),
  whatsapp: z.string().min(8, "Ingresa un número de WhatsApp válido."),
  address: z.string().min(3, "Ingresa la dirección."),
  city: z.string().min(2, "Ingresa la ciudad."),
  logoUrl: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  tiktok: z.string().optional(),
  hours: z.string(), // JSON string ya armado por el cliente
});

export type BusinessFormState = { error?: string; success?: boolean } | undefined;

function parseBusinessForm(formData: FormData) {
  return schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    whatsapp: formData.get("whatsapp"),
    address: formData.get("address"),
    city: formData.get("city"),
    logoUrl: formData.get("logoUrl") || "",
    instagram: formData.get("instagram") || "",
    facebook: formData.get("facebook") || "",
    tiktok: formData.get("tiktok") || "",
    hours: formData.get("hours") || "[]",
  });
}

async function uniqueSlugFrom(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "negocio";
  let candidate = base;
  let i = 1;
  while (true) {
    const existing = await prisma.business.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    i += 1;
    candidate = `${base}-${i}`;
  }
}

export async function createBusinessAction(
  _prevState: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const session = await requireSession();
  const parsed = parseBusinessForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const existingBusiness = await prisma.business.findFirst({
    where: { ownerId: session.user.id },
  });
  if (existingBusiness) {
    redirect("/dashboard/negocio");
  }

  const data = parsed.data;
  const slug = await uniqueSlugFrom(data.name);

  const business = await prisma.business.create({
    data: {
      ownerId: session.user.id,
      slug,
      name: data.name,
      description: data.description,
      whatsapp: data.whatsapp,
      address: data.address,
      city: data.city,
      logoUrl: data.logoUrl || null,
      hours: data.hours,
      socials: JSON.stringify({
        instagram: data.instagram,
        facebook: data.facebook,
        tiktok: data.tiktok,
      }),
    },
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard?bienvenida=1&slug=${business.slug}`);
}

export async function updateBusinessAction(
  _prevState: BusinessFormState,
  formData: FormData
): Promise<BusinessFormState> {
  const session = await requireSession();
  const business = await prisma.business.findFirst({ where: { ownerId: session.user.id } });
  if (!business) redirect("/dashboard/negocio/nuevo");

  const parsed = parseBusinessForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const data = parsed.data;

  await prisma.business.update({
    where: { id: business.id },
    data: {
      name: data.name,
      description: data.description,
      whatsapp: data.whatsapp,
      address: data.address,
      city: data.city,
      logoUrl: data.logoUrl || null,
      hours: data.hours,
      socials: JSON.stringify({
        instagram: data.instagram,
        facebook: data.facebook,
        tiktok: data.tiktok,
      }),
    },
  });

  revalidatePath("/dashboard/negocio");
  revalidatePath(`/negocio/${business.slug}`);
  return { success: true };
}
