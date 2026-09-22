"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireBusiness, assertOwnsProduct } from "@/lib/current-business";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const productSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio."),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
  shortDescription: z.string().min(3, "Agrega una descripción corta."),
  description: z.string().min(3, "Agrega una descripción."),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  variants: z.string().optional(),
  faqs: z.string().optional(),
  imageUrl: z.string().optional(),
  available: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
});

export type ProductFormState = { error?: string } | undefined;

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId") || undefined,
    tags: formData.get("tags") || "[]",
    variants: formData.get("variants") || "[]",
    faqs: formData.get("faqs") || "[]",
    imageUrl: formData.get("imageUrl") || "",
    available: formData.get("available") === "on",
    featured: formData.get("featured") === "on",
  });
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const { business } = await requireBusiness();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const d = parsed.data;

  await prisma.product.create({
    data: {
      businessId: business.id,
      name: d.name,
      price: d.price,
      shortDescription: d.shortDescription,
      description: d.description,
      categoryId: d.categoryId || null,
      tags: d.tags || "[]",
      variants: d.variants || "[]",
      faqs: d.faqs || "[]",
      imageUrl: d.imageUrl || null,
      available: d.available ?? true,
      featured: d.featured ?? false,
    },
  });

  revalidatePath("/dashboard/productos");
  revalidatePath(`/negocio/${business.slug}`);
  redirect("/dashboard/productos?creado=1");
}

export async function updateProductAction(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const { business } = await requireBusiness();
  await assertOwnsProduct(productId, business.id);

  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos." };
  }
  const d = parsed.data;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: d.name,
      price: d.price,
      shortDescription: d.shortDescription,
      description: d.description,
      categoryId: d.categoryId || null,
      tags: d.tags || "[]",
      variants: d.variants || "[]",
      faqs: d.faqs || "[]",
      imageUrl: d.imageUrl || null,
      available: d.available ?? true,
      featured: d.featured ?? false,
    },
  });

  revalidatePath("/dashboard/productos");
  revalidatePath(`/negocio/${business.slug}`);
  redirect("/dashboard/productos?editado=1");
}

export async function deleteProductAction(productId: string) {
  const { business } = await requireBusiness();
  await assertOwnsProduct(productId, business.id);
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/dashboard/productos");
  revalidatePath(`/negocio/${business.slug}`);
}

export async function toggleProductFieldAction(
  productId: string,
  field: "available" | "featured"
) {
  const { business } = await requireBusiness();
  const product = await assertOwnsProduct(productId, business.id);
  await prisma.product.update({
    where: { id: productId },
    data: { [field]: !product[field] },
  });
  revalidatePath("/dashboard/productos");
  revalidatePath(`/negocio/${business.slug}`);
}

export async function createCategoryAction(formData: FormData) {
  const { business } = await requireBusiness();
  const name = (formData.get("name") as string)?.trim();
  if (!name) return;
  await prisma.category.upsert({
    where: { businessId_name: { businessId: business.id, name } },
    update: {},
    create: { businessId: business.id, name },
  });
  revalidatePath("/dashboard/categorias");
  revalidatePath("/dashboard/productos");
}

export async function deleteCategoryAction(categoryId: string) {
  const { business } = await requireBusiness();
  const category = await prisma.category.findFirst({
    where: { id: categoryId, businessId: business.id },
  });
  if (!category) return;
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/dashboard/categorias");
  revalidatePath("/dashboard/productos");
}
