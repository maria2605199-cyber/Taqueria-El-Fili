import { NextResponse } from "next/server";
import { getBusinessForApi } from "@/lib/current-business";
import { runGenerateProductContent } from "@/lib/ai";

export async function POST(req: Request) {
  const ctx = await getBusinessForApi();
  if (!ctx) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const name = body?.name as string | undefined;
  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "Escribe un nombre de producto válido." }, { status: 400 });
  }

  const content = await runGenerateProductContent(name.trim());
  return NextResponse.json(content);
}
