import { MapPin, Clock, Instagram, Facebook, Music2 } from "lucide-react";
import type { BusinessHours, BusinessSocials } from "@/lib/types";

export function CatalogFooter({
  name,
  address,
  city,
  hours,
  socials,
}: {
  name: string;
  address: string;
  city: string;
  hours: BusinessHours[];
  socials: BusinessSocials;
}) {
  return (
    <footer className="dark-surface mt-16 px-4 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3">
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <MapPin size={16} /> Ubicación
          </h3>
          <p className="text-sm text-white/60">{address}</p>
          <p className="text-sm text-white/60">{city}</p>
        </div>
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-semibold">
            <Clock size={16} /> Horarios
          </h3>
          <ul className="space-y-1 text-sm text-white/60">
            {hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span>{h.closed ? "Cerrado" : `${h.open} - ${h.close}`}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-semibold">Síguenos</h3>
          <div className="flex gap-3">
            {socials.instagram && (
              <a
                href={`https://instagram.com/${socials.instagram.replace("@", "")}`}
                target="_blank"
                className="rounded-full bg-white/10 p-2.5 hover:bg-white/20"
              >
                <Instagram size={18} />
              </a>
            )}
            {socials.facebook && (
              <a
                href={`https://facebook.com/${socials.facebook}`}
                target="_blank"
                className="rounded-full bg-white/10 p-2.5 hover:bg-white/20"
              >
                <Facebook size={18} />
              </a>
            )}
            {socials.tiktok && (
              <a
                href={`https://tiktok.com/@${socials.tiktok.replace("@", "")}`}
                target="_blank"
                className="rounded-full bg-white/10 p-2.5 hover:bg-white/20"
              >
                <Music2 size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-5xl text-center text-xs text-white/30">
        {name} · Catálogo impulsado por{" "}
        <span className="gradient-text font-medium">Catálogo Inteligente IA</span>
      </p>
    </footer>
  );
}
