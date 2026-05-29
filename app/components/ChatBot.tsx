"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2, Bot, User } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "What makes a Solana token a rug?",
  "How do I read a wallet's risk signals?",
  "What is mint authority and why does it matter?",
  "Explain diversification score.",
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;
      const next = [...messages, { role: "user" as const, content }];
      setMessages(next);
      setInput("");
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Chat failed.");
        } else {
          setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
        }
      } catch {
        setError("Network error. Retry.");
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  return (
    <div className="mx-auto flex h-[70vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-800 bg-zinc-950/60">
      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
              <Bot className="h-7 w-7" />
            </div>
            <p className="mt-4 text-lg font-bold text-zinc-200">Ask the BagCheck AI</p>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Your Solana and DeFi guide. Ask about rugs, wallet risk, token safety, or anything on-chain.
            </p>
            <div className="mt-6 grid w-full max-w-md gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2.5 text-left text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-lime-400"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              m.role === "user" ? "bg-zinc-800 text-zinc-300" : "bg-lime-400/10 text-lime-400"
            }`}>
              {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user" ? "bg-lime-400 text-black" : "bg-zinc-900 text-zinc-200"
            }`}>
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask anything about Solana, DeFi, or rug safety"
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-lime-500/60"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center rounded-xl bg-lime-400 px-5 text-black transition hover:bg-lime-300 disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
