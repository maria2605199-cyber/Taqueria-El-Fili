import { NextResponse } from "next/server";
import { requireBusinessSession } from "@/lib/tenant";
import { hasFeature } from "@/lib/plans";

/**
 * Integration point for a real image-generation/vision provider (e.g. an
 * image model behind OpenAI's Images API, Remove.bg, Replicate, etc). No
 * such provider is wired up in this build, so this endpoint intentionally
 * does not claim to transform the image — it validates the request and
 * echoes back the original URL so the admin UI's flow (select action →
 * "processing" → result) is fully wired for a real backend to be dropped
 * in later, without pretending to modify a photo it never touched.
 */
export async function POST(req: Request) {
  const session = await requireBusinessSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!hasFeature(session.user.plan as any, "aiImageTools")) {
    return NextResponse.json({ error: "Esta función requiere el plan Premium." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const imageUrl = body?.imageUrl as string | undefined;
  const action = body?.action as string | undefined;
  if (!imageUrl || !action) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  return NextResponse.json({
    url: imageUrl,
    simulated: true,
    message:
      "La mejora de imágenes con IA está preparada en la arquitectura, pero requiere conectar un proveedor de IA de imágenes (variable de entorno de producción). Por ahora se muestra la imagen original.",
  });
}
