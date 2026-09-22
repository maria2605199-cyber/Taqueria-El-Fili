const clientSteps = ["Escanea el QR o acerca el NFC", "Explora el catálogo", "Pregúntale a la IA", "Elige un producto", "Consulta o compra por WhatsApp"];

const ownerSteps = [
  "Crea tu cuenta",
  "Crea tu negocio",
  "Agrega productos",
  "La IA genera las descripciones",
  "Publica y comparte tu QR",
];

export function Steps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-8 shadow-sm">
          <h3 className="mb-6 text-xl font-semibold">Experiencia del cliente</h3>
          <ol className="space-y-4">
            {clientSteps.map((s, i) => (
              <li key={s} className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-bg text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/70">{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="glass-card rounded-3xl p-8 shadow-sm">
          <h3 className="mb-6 text-xl font-semibold">Experiencia del administrador</h3>
          <ol className="space-y-4">
            {ownerSteps.map((s, i) => (
              <li key={s} className="flex items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-foreground/70">
                  {i + 1}
                </span>
                <span className="text-sm text-foreground/70">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
