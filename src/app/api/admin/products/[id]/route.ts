import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireBusinessSession } from "@/lib/tenant";
import { toProductDTO } from "@/lib/mappers";

const productSchema = z.object({
  name: z.string().min(2),
  categoryId: z.string().nullable().optional(),
  shortDescription: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  price: z.number().nonnegative(),
  compareAtPrice: z.number().nonnegative().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),
  variants: z.array(z.object({ name: z.string(), options: z.array(z.string()) })).optional(),
  available: z.boolean().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

/**
 * Every handler below re-checks `businessId` on the WHERE clause of the
 * lookup (not just after fetching), so a request for another tenant's
 * product id resolves to "not found" rather than leaking or mutating it.
 */
async function findOwnedProduct(id: string, businessId: string) {
  return prisma.product.findFirst({ where: { id, businessId } });
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const product = await prisma.product.findFirst({
    where: { id: params.id, businessId: session.user.businessId },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  return NextResponse.json(toProductDTO(product));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const existing = await findOwnedProduct(params.id, session.user.businessId);
  if (!existing) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const data = parsed.data;

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, businessId: session.user.businessId },
    });
    if (!category) {
      return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
    }
  }

  const updated = await prisma.product.update({
    where: { id: existing.id },
    data: {
      categoryId: data.categoryId || null,
      name: data.name,
      shortDescription: data.shortDescription || null,
      description: data.description || null,
      features: JSON.stringify(data.features || []),
      tags: JSON.stringify(data.tags || []),
      faqs: JSON.stringify(data.faqs || []),
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      imageUrl: data.imageUrl || null,
      images: JSON.stringify(data.images || (data.imageUrl ? [data.imageUrl] : [])),
      variants: JSON.stringify(data.variants || []),
      available: data.available ?? true,
      featured: data.featured ?? false,
      active: data.active ?? true,
    },
    include: { category: true },
  });

  return NextResponse.json(toProductDTO(updated));
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const existing = await findOwnedProduct(params.id, session.user.businessId);
  if (!existing) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, boolean> = {};
  for (const key of ["available", "featured", "active"] as const) {
    if (typeof body[key] === "boolean") patch[key] = body[key];
  }

  const updated = await prisma.product.update({ where: { id: existing.id }, data: patch, include: { category: true } });
  return NextResponse.json(toProductDTO(updated));
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const existing = await findOwnedProduct(params.id, session.user.businessId);
  if (!existing) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });

  await prisma.product.delete({ where: { id: existing.id } });
  return NextResponse.json({ ok: true });
}
