export function buildWhatsappLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function productInquiryMessage(businessName: string, productName: string): string {
  return `Hola ${businessName}, quiero información sobre "${productName}".`;
}

export function generalInquiryMessage(businessName: string): string {
  return `Hola ${businessName}, me gustaría más información sobre sus productos.`;
}
