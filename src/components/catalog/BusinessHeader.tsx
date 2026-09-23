"use client";

import Image from "next/image";
import { MessageCircle, MapPin, Clock, Instagram, Facebook } from "lucide-react";
import type { BusinessDTO } from "@/types";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink, generalWhatsAppMessage } from "@/lib/whatsapp";

export function BusinessHeader({ business }: { business: BusinessDTO }) {
  function onWhatsApp() {
    fetch("/api/public/track/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId: business.id, source: "general" }),
    }).catch(() => {});
    window.open(buildWhatsAppLink(business.phone, generalWhatsAppMessage(business.name)), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="relative">
      <div className="relative h-40 w-full overflow-hidden bg-ink-900 sm:h-56">
        {business.coverUrl && (
          <Image src={business.coverUrl} alt="" fill priority className="object-cover opacity-80" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-black/20" />
      </div>

      <div className="mx-auto -mt-12 max-w-5xl px-5">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg">
            {business.logoUrl ? (
              <Image src={business.logoUrl} alt={business.name} width={96} height={96} className="h-full w-full object-cover" />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: business.primaryColor }}
              >
                {business.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 pb-1">
            <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{business.name}</h1>
            {business.description && (
              <p className="mt-1 max-w-xl text-sm text-ink-900/60">{business.description}</p>
            )}
          </div>

          <Button variant="whatsapp" size="lg" onClick={onWhatsApp} className="shrink-0">
            <MessageCircle className="h-4 w-4" />
            Hablar por WhatsApp
          </Button>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-ink-900/8 pt-4 text-xs text-ink-900/60 sm:justify-start">
          {business.hours && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {business.hours}
            </span>
          )}
          {business.address && (
            <a
              href={business.mapUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-brand-600"
            >
              <MapPin className="h-3.5 w-3.5" /> {business.address}
            </a>
          )}
          {business.instagram && (
            <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-600">
              <Instagram className="h-3.5 w-3.5" /> Instagram
            </a>
          )}
          {business.facebook && (
            <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-600">
              <Facebook className="h-3.5 w-3.5" /> Facebook
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
