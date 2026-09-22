import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireBusinessSession } from "@/lib/tenant";
import { toBusinessDTO } from "@/lib/mappers";

const schema = z.object({
  name: z.string().min(2),
  description: z.string().nullable().optional(),
  logoUrl: z.string().nullable().optional(),
  coverUrl: z.string().nullable().optional(),
  phone: z.string().min(8),
  address: z.string().nullable().optional(),
  hours: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  primaryColor: z.string().optional(),
});

export async function GET() {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const business = await prisma.business.findUnique({ where: { id: session.user.businessId } });
  if (!business) return NextResponse.json({ error: "Negocio no encontrado" }, { status: 404 });

  return NextResponse.json(toBusinessDTO(business));
}

export async function PUT(req: Request) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Datos inválidos" }, { status: 400 });
  }
  const data = parsed.data;

  const business = await prisma.business.update({
    where: { id: session.user.businessId },
    data: {
      name: data.name,
      description: data.description || null,
      logoUrl: data.logoUrl || null,
      coverUrl: data.coverUrl || null,
      phone: data.phone.replace(/[^0-9]/g, ""),
      address: data.address || null,
      hours: data.hours || null,
      instagram: data.instagram || null,
      facebook: data.facebook || null,
      tiktok: data.tiktok || null,
      primaryColor: data.primaryColor || "#6c5ce7",
      mapUrl: data.address ? `https://maps.google.com/?q=${encodeURIComponent(data.address)}` : null,
    },
  });

  return NextResponse.json(toBusinessDTO(business));
}
