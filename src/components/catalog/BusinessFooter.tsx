import { MessageCircle, MapPin, Clock } from "lucide-react";
import type { BusinessDTO } from "@/types";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink, generalWhatsAppMessage } from "@/lib/whatsapp";

export function BusinessFooter({ business }: { business: BusinessDTO }) {
  const link = buildWhatsAppLink(business.phone, generalWhatsAppMessage(business.name));

  return (
    <footer className="mt-16 border-t border-ink-900/8 bg-ink-900/[0.02]">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold text-ink-900">{business.name}</h4>
            {business.description && <p className="mt-2 text-xs text-ink-900/55">{business.description}</p>}
          </div>
          <div className="space-y-2 text-xs text-ink-900/60">
            {business.hours && (
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {business.hours}
              </p>
            )}
            {business.address && (
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {business.address}
              </p>
            )}
          </div>
          <div>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <Button variant="whatsapp" className="w-full sm:w-auto">
                <MessageCircle className="h-4 w-4" />
                Escríbenos por WhatsApp
              </Button>
            </a>
          </div>
        </div>
        <p className="mt-8 text-center text-[11px] text-ink-900/35">
          Catálogo digital impulsado por Catálogo Inteligente IA
        </p>
      </div>
    </footer>
  );
}
