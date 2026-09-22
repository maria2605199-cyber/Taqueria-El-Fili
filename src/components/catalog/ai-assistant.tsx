"use client";

import { useRef, useState, useEffect } from "react";
import { Bot, X, Send, Loader2, MessageCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { PublicProduct } from "./types";

interface ChatProductRef {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  imageUrl: string | null;
  available: boolean;
}

interface Message {
  role: "user" | "assistant";
  text: string;
  products?: ChatProductRef[];
}

interface Props {
  slug: string;
  businessName: string;
  onOpenProduct: (product: PublicProduct) => void;
  findProduct: (id: string) => PublicProduct | undefined;
}

export function AIAssistant({ slug, businessName, onOpenProduct, findProduct }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `¡Hola! Soy el asistente de ${businessName}. Pregúntame lo que quieras sobre nuestros productos, por ejemplo "busco algo para regalar" o "qué tienes menor a $200".`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`/api/public/${slug}/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: data.message ?? "No pude procesar tu pregunta, intenta de nuevo.",
          products: data.products,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Ocurrió un error al conectar con el asistente. Intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full gradient-bg px-4 py-3.5 text-sm font-medium text-white shadow-xl shadow-violet-500/30 hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
      >
        <Bot size={20} />
        <span className="hidden sm:inline">Pregúntale a la IA</span>
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center sm:inset-auto sm:bottom-24 sm:right-6">
          <div className="dark-surface flex h-[75vh] w-full max-w-md flex-col rounded-t-3xl shadow-2xl sm:h-[560px] sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <Bot size={20} className="text-violet-400" />
                <span className="font-semibold">Asistente de {businessName}</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm gradient-bg px-4 py-2.5 text-sm text-white"
                        : "max-w-[90%] rounded-2xl rounded-bl-sm bg-white/10 px-4 py-2.5 text-sm text-white"
                    }
                  >
                    <p>{m.text}</p>
                    {m.products && m.products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {m.products.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              const full = findProduct(p.id);
                              if (full) onOpenProduct(full);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl bg-black/20 p-2 text-left hover:bg-black/30"
                          >
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium">{p.name}</p>
                              <p className="text-xs text-white/60">{formatPrice(p.price)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Loader2 size={14} className="animate-spin" /> Pensando...
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 rounded-full bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="gradient-bg rounded-full p-2.5 text-white disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function WhatsappFab({ href, onClick }: { href: string; onClick: () => void }) {
  return (
    <a
      href={href}
      target="_blank"
      onClick={onClick}
      className="fixed bottom-6 left-4 z-40 flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3.5 text-sm font-medium text-white shadow-xl shadow-emerald-500/30 hover:-translate-y-0.5 sm:left-6"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">Hablar por WhatsApp</span>
    </a>
  );
}
