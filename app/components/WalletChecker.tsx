"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Wallet, Copy, Check, AlertTriangle } from "lucide-react";
import type { Portfolio, TokenHolding } from "@/lib/helius";
import type { Verdict } from "@/lib/verdict";
import type { Insights } from "@/lib/insights";
import InsightsPanel from "./InsightsPanel";
import ShareCard from "./ShareCard";
import { useWatchlist } from "../hooks/useWatchlist";
import { Star } from "lucide-react";

interface Result {
  portfolio: Portfolio;
  verdict: Verdict;
  insights: Insights;
}

const ACCENT: Record<string, string> = {
  red: "text-red-400 border-red-500/40 bg-red-500/10",
  orange: "text-orange-400 border-orange-500/40 bg-orange-500/10",
  yellow: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  emerald: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  cyan: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
  blue: "text-blue-400 border-blue-500/40 bg-blue-500/10",
  slate: "text-slate-400 border-slate-500/40 bg-slate-500/10",
};

const BAR: Record<string, string> = {
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
  blue: "bg-blue-500",
  slate: "bg-slate-500",
};

function usd(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function shortAddr(a: string): string {
  return `${a.slice(0, 4)}...${a.slice(-4)}`;
}

export default function WalletChecker() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const check = useCallback(async () => {
    const addr = input.trim();
    if (!addr) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/check?address=${encodeURIComponent(addr)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something broke. Try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Check your connection and retry.");
    } finally {
      setLoading(false);
    }
  }, [input]);

  const copyAddr = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(result.portfolio.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Input */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="Paste any Solana wallet address"
            spellCheck={false}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-4 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-lime-500/60 focus:ring-2 focus:ring-lime-500/20 font-mono"
          />
        </div>
        <button
          onClick={check}
          disabled={loading || !input.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          {loading ? "Checking" : "Check Bag"}
        </button>
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {result && (
        <Results result={result} copied={copied} onCopy={copyAddr} />
      )}
    </div>
  );
}

function Results({ result, copied, onCopy }: { result: Result; copied: boolean; onCopy: () => void }) {
  const { portfolio, verdict } = result;
  const { add, remove, has } = useWatchlist();
  const watched = has(portfolio.address);
  const accent = ACCENT[verdict.color] ?? ACCENT.slate;
  const bar = BAR[verdict.color] ?? BAR.slate;
  const toggleWatch = () =>
    watched ? remove(portfolio.address) : add(portfolio.address, verdict.archetype);

  return (
    <div className="mt-8 space-y-6">
      {/* Verdict card */}
      <div className={`rounded-2xl border p-6 sm:p-8 ${accent}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-mono uppercase tracking-widest opacity-60">Verdict</p>
            <h2 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight">{verdict.archetype}</h2>
            <p className="mt-2 text-base font-medium opacity-90">{verdict.tagline}</p>
          </div>
          <span className="shrink-0 rounded-lg border border-current/30 px-3 py-1 text-xs font-mono font-bold">
            {verdict.emoji}
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-zinc-300">{verdict.description}</p>

        {/* Cooked meter */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider opacity-70">
            <span>Cooked Meter</span>
            <span>{verdict.score}/100</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div className={`h-full ${bar} transition-all`} style={{ width: `${verdict.score}%` }} />
          </div>
        </div>
      </div>

      {/* Share card actions */}
      <ShareCard portfolio={portfolio} verdict={verdict} />

      {/* Address + total */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-5 py-4">
        <button onClick={onCopy} className="flex items-center gap-2 font-mono text-sm text-zinc-400 hover:text-zinc-200 transition">
          {copied ? <Check className="h-4 w-4 text-lime-400" /> : <Copy className="h-4 w-4" />}
          {shortAddr(portfolio.address)}
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleWatch}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              watched
                ? "border-lime-500/40 bg-lime-500/10 text-lime-400"
                : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${watched ? "fill-lime-400" : ""}`} />
            {watched ? "Watching" : "Watch"}
          </button>
          <div className="text-right">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">Total Value</p>
            <p className="text-2xl font-black text-zinc-100">{usd(portfolio.totalUsd)}</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {verdict.stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 truncate">{s.label}</p>
            <p className="mt-1 text-lg font-bold text-zinc-100 truncate">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Insights — risk signals + composition */}
      <InsightsPanel insights={result.insights} />

      {/* Holdings */}
      <Holdings tokens={portfolio.tokens} solBalance={portfolio.solBalance} solUsd={portfolio.solUsd} />
    </div>
  );
}

function Holdings({ tokens, solBalance, solUsd }: { tokens: TokenHolding[]; solBalance: number; solUsd: number }) {
  const top = tokens.slice(0, 12);
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
      <div className="border-b border-zinc-800 px-5 py-3">
        <h3 className="text-sm font-bold text-zinc-200">Holdings</h3>
      </div>
      <div className="divide-y divide-zinc-800/60">
        {/* SOL row */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-lime-400 to-emerald-600 flex items-center justify-center text-[10px] font-black text-black">SOL</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-100">Solana</p>
              <p className="font-mono text-xs text-zinc-500">{solBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL</p>
            </div>
          </div>
          <p className="text-sm font-bold text-zinc-200">{usd(solUsd)}</p>
        </div>
        {top.map((t) => (
          <div key={t.mint} className="flex items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3 min-w-0">
              {t.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.logo} alt="" className="h-8 w-8 shrink-0 rounded-full bg-zinc-800 object-cover" />
              ) : (
                <div className="h-8 w-8 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">
                  {t.symbol.slice(0, 3)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">{t.symbol}</p>
                <p className="font-mono text-xs text-zinc-500 truncate">
                  {t.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            <p className="shrink-0 text-sm font-bold text-zinc-200">{usd(t.usdValue)}</p>
          </div>
        ))}
        {tokens.length > 12 && (
          <div className="px-5 py-3 text-center text-xs font-mono text-zinc-600">
            + {tokens.length - 12} more tokens
          </div>
        )}
      </div>
    </div>
  );
}
