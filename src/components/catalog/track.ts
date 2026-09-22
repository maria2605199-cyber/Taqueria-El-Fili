export function track(
  slug: string,
  type: "PRODUCT_VIEW" | "WHATSAPP_CLICK" | "CATALOG_VIEW",
  productId?: string
) {
  fetch(`/api/public/${slug}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, productId }),
    keepalive: true,
  }).catch(() => {
    // el tracking nunca debe romper la experiencia del cliente
  });
}
