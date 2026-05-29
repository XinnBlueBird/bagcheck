"use client";

import { useState, useCallback } from "react";
import { Swords, Loader2, Trophy, AlertTriangle } from "lucide-react";
import type { Portfolio } from "@/lib/helius";
import type { Verdict } from "@/lib/verdict";

interface Side {
  portfolio: Portfolio;
  verdict: Verdict;
}
interface BattleResult {
  a: Side;
  b: Side;
  winner: "a" | "b" | "tie";
}

function usd(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
function shortAddr(a: string): string {
  return `${a.slice(0, 4)}...${a.slice(-4)}`;
}

export default function BattleMode() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BattleResult | null>(null);

  const fight = useCallback(async () => {
    if (!a.trim() || !b.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/battle?a=${encodeURIComponent(a.trim())}&b=${encodeURIComponent(b.trim())}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "Battle failed.");
      else setResult(data);
    } catch {
      setError("Network error. Retry.");
    } finally {
      setLoading(false);
    }
  }, [a, b]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="Wallet A"
          spellCheck={false}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-lime-500/60 font-mono"
        />
        <input
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Wallet B"
          spellCheck={false}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-red-500/60 font-mono"
        />
      </div>
      <button
        onClick={fight}
        disabled={loading || !a.trim() || !b.trim()}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 py-3.5 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Swords className="h-5 w-5" />}
        {loading ? "Fighting" : "Fight"}
      </button>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {result && <BattleResultView result={result} />}
    </div>
  );
}

function BattleResultView({ result }: { result: BattleResult }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      <Fighter side={result.a} won={result.winner === "a"} label="A" />
      <Fighter side={result.b} won={result.winner === "b"} label="B" />
      {result.winner === "tie" && (
        <p className="sm:col-span-2 text-center text-sm font-mono text-zinc-500">
          Dead heat. Both equally cooked.
        </p>
      )}
    </div>
  );
}

function Fighter({ side, won, label }: { side: Side; won: boolean; label: string }) {
  return (
    <div className={`relative rounded-2xl border p-5 ${won ? "border-lime-500/50 bg-lime-500/5" : "border-zinc-800 bg-zinc-950/60"}`}>
      {won && (
        <span className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-lime-400 px-2.5 py-0.5 text-xs font-bold text-black">
          <Trophy className="h-3.5 w-3.5" /> Winner
        </span>
      )}
      <p className="font-mono text-xs text-zinc-500">Wallet {label} · {shortAddr(side.portfolio.address)}</p>
      <h3 className="mt-2 text-2xl font-black text-zinc-100">{side.verdict.archetype}</h3>
      <p className="mt-1 text-sm text-zinc-400">{side.verdict.tagline}</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs font-mono uppercase text-zinc-600">Total</p>
          <p className="text-xl font-black text-zinc-100">{usd(side.portfolio.totalUsd)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono uppercase text-zinc-600">Cooked</p>
          <p className="text-xl font-black text-zinc-100">{side.verdict.score}</p>
        </div>
      </div>
    </div>
  );
}
