"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Loader2, Sparkles } from "lucide-react";
import type { BusinessDTO, ChatMessage, ProductDTO } from "@/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/catalog/ProductCard";

export function AIAssistantWidget({
  business,
  onOpenProduct,
}: {
  business: BusinessDTO;
  onOpenProduct: (product: ProductDTO) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hola 👋 Soy el asistente de ${business.name}. Cuéntame qué buscas y te muestro opciones de nuestro catálogo.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const nextHistory = [...messages, { role: "user" as const, content: text }];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/public/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: business.id, history: nextHistory }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply, products: data.products || [] }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Tuve un problema para responder. ¿Puedes intentar de nuevo?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-600",
          open && "hidden"
        )}
      >
        <Bot className="h-5 w-5" />
        Pregúntale a la IA
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/40 backdrop-blur-sm animate-fade-in sm:items-end sm:justify-end sm:bg-transparent sm:backdrop-blur-none">
          <div className="flex h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-fade-up sm:m-5 sm:h-[600px] sm:rounded-3xl">
            <div className="flex items-center justify-between bg-ink-900 px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Asistente IA</p>
                  <p className="text-[11px] text-white/50">{business.name}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto bg-ink-900/[0.02] p-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex flex-col", m.role === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                      m.role === "user" ? "bg-brand-500 text-white" : "bg-white text-ink-900 shadow-sm"
                    )}
                  >
                    {m.content}
                  </div>
                  {m.products && m.products.length > 0 && (
                    <div className="scrollbar-thin mt-2 flex w-full gap-3 overflow-x-auto pb-1">
                      {m.products.map((p) => (
                        <ProductCard key={p.id} product={p} business={business} onOpen={onOpenProduct} compact />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-ink-900/50">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Pensando...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 border-t border-ink-900/8 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="h-11 flex-1 rounded-xl border border-ink-900/10 bg-white px-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
