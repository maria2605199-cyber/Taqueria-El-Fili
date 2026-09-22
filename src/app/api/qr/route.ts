import QRCode from "qrcode";

// Genera el código QR del catálogo público al vuelo, como PNG. Se usa
// tanto en el panel (previsualización + descarga) como potencialmente en
// materiales impresos del negocio.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Falta el parámetro url", { status: 400 });
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Protocolo inválido");
    }
  } catch {
    return new Response("URL inválida", { status: 400 });
  }

  const buffer = await QRCode.toBuffer(url, {
    width: 480,
    margin: 2,
    color: { dark: "#0b0c14", light: "#ffffff" },
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
