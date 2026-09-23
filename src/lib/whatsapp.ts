/** Builds a wa.me deep link with a prefilled message. Never exposes any secret. */
export function buildWhatsAppLink(phoneDigits: string, message: string) {
  const digits = phoneDigits.replace(/[^0-9]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}

export function productWhatsAppMessage(businessName: string, productName: string) {
  return `Hola ${businessName}, quiero información sobre "${productName}".`;
}

export function generalWhatsAppMessage(businessName: string) {
  return `Hola ${businessName}, vi su catálogo digital y quiero más información.`;
}
