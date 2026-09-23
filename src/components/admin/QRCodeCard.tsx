"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function QRCodeCard({ qrDataUrl, catalogUrl, businessName }: { qrDataUrl: string; catalogUrl: string; businessName: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(catalogUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <Card className="flex flex-col items-center gap-5 p-8 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrDataUrl} alt={`Código QR de ${businessName}`} className="h-56 w-56 rounded-2xl border border-ink-900/8" />

      <div>
        <p className="text-sm font-medium text-ink-900">{catalogUrl}</p>
        <p className="mt-1 text-xs text-ink-900/45">Escanea para abrir el catálogo público</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copiado" : "Copiar enlace"}
        </Button>
        <a href={qrDataUrl} download={`qr-${businessName}.png`}>
          <Button size="sm">
            <Download className="h-3.5 w-3.5" /> Descargar QR
          </Button>
        </a>
      </div>
    </Card>
  );
}
