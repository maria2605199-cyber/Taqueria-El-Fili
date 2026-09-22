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

export async function GET() {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const products = await prisma.product.findMany({
    where: { businessId: session.user.businessId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products.map(toProductDTO));
}

export async function POST(req: Request) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

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

  const product = await prisma.product.create({
    data: {
      businessId: session.user.businessId,
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

  return NextResponse.json(toProductDTO(product), { status: 201 });
}
