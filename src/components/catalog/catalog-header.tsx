import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";
import type { BusinessSocials } from "@/lib/types";

export function CatalogHeader({
  name,
  description,
  logoUrl,
  socials,
}: {
  name: string;
  description: string;
  logoUrl: string | null;
  socials: BusinessSocials;
}) {
  return (
    <header className="dark-surface relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 gradient-bg blur-3xl" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-14 text-center">
        <div className="animate-float relative h-20 w-20 overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl">
          {logoUrl ? (
            <Image src={logoUrl} alt={name} fill className="object-cover" sizes="80px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">{name}</h1>
        <p className="max-w-xl text-sm text-white/70 sm:text-base">{description}</p>

        {(socials.instagram || socials.facebook) && (
          <div className="flex gap-3 pt-1">
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
          </div>
        )}
      </div>
    </header>
  );
}
