import QRCode from "qrcode";

export function getCatalogUrl(slug: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/${slug}`;
}

export async function generateQrDataUrl(text: string) {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 480,
    color: { dark: "#0a0c14", light: "#ffffff" },
  });
}
