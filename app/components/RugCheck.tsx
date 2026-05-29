"use client";

import { useState, useCallback } from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, Loader2, Scan } from "lucide-react";

interface RugFlag {
  level: "safe" | "warn" | "danger";
  title: string;
  detail: string;
}
interface RugReport {
  mint: string;
  name: string;
  symbol: string;
  logo?: string;
  supply: number;
  mintAuthorityActive: boolean;
  freezeAuthorityActive: boolean;
  topHolderPct: number;
  top10Pct: number;
  safetyScore: number;
  flags: RugFlag[];
}

const SAMPLE = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC

const FLAG_STYLE: Record<RugFlag["level"], { cls: string; Icon: typeof ShieldCheck }> = {
  danger: { cls: "text-red-400 border-red-500/30 bg-red-500/5", Icon: ShieldAlert },
  warn: { cls: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5", Icon: AlertTriangle },
  safe: { cls: "text-lime-400 border-lime-500/30 bg-lime-500/5", Icon: ShieldCheck },
};

function scoreColor(score: number): string {
  if (score >= 70) return "text-lime-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}
function scoreBar(score: number): string {
  if (score >= 70) return "bg-lime-400";
  if (score >= 40) return "bg-yellow-400";
  return "bg-red-400";
}
function scoreLabel(score: number): string {
  if (score >= 70) return "Looks Safe";
  if (score >= 40) return "Caution";
  return "High Risk";
}

export default function RugCheck() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<RugReport | null>(null);

  const scan = useCallback(async () => {
    const mint = input.trim();
    if (!mint) return;
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const res = await fetch(`/api/rugcheck?mint=${encodeURIComponent(mint)}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "Scan failed.");
      else setReport(data.report);
    } catch {
      setError("Network error. Retry.");
    } finally {
      setLoading(false);
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Scan className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && scan()}
            placeholder="Paste a token mint address"
            spellCheck={false}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 py-4 pl-12 pr-4 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-lime-500/60 focus:ring-2 focus:ring-lime-500/20 font-mono"
          />
        </div>
        <button
          onClick={scan}
          disabled={loading || !input.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-4 text-sm font-bold text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Scan className="h-5 w-5" />}
          {loading ? "Scanning" : "Scan Token"}
        </button>
      </div>

      <p className="mt-3 text-center text-xs font-mono text-zinc-600">
        <span className="text-zinc-500">Try a sample (USDC): </span>
        <button onClick={() => setInput(SAMPLE)} className="text-lime-500/80 break-all hover:text-lime-400">
          {SAMPLE}
        </button>
      </p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {report && <RugResult report={report} />}
    </div>
  );
}

function RugResult({ report }: { report: RugReport }) {
  return (
    <div className="mt-8 space-y-6">
      {/* Score header */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {report.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={report.logo} alt="" className="h-11 w-11 shrink-0 rounded-full bg-zinc-800 object-cover" />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                {report.symbol.slice(0, 3)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-zinc-100">{report.name}</p>
              <p className="font-mono text-xs text-zinc-500">{report.symbol}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-4xl font-black ${scoreColor(report.safetyScore)}`}>{report.safetyScore}</p>
            <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">{scoreLabel(report.safetyScore)}</p>
          </div>
        </div>
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className={`h-full ${scoreBar(report.safetyScore)} transition-all`} style={{ width: `${report.safetyScore}%` }} />
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Mint Auth" value={report.mintAuthorityActive ? "Active" : "Renounced"} bad={report.mintAuthorityActive} />
        <Stat label="Freeze Auth" value={report.freezeAuthorityActive ? "Active" : "Renounced"} bad={report.freezeAuthorityActive} />
        <Stat label="Top Holder" value={`${report.topHolderPct.toFixed(0)}%`} bad={report.topHolderPct > 50} />
        <Stat label="Top 10" value={`${report.top10Pct.toFixed(0)}%`} bad={report.top10Pct > 80} />
      </div>

      {/* Flags */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="border-b border-zinc-800 px-5 py-3">
          <h3 className="text-sm font-bold text-zinc-200">Safety Signals</h3>
        </div>
        <div className="space-y-3 p-5">
          {report.flags.map((f, i) => {
            const s = FLAG_STYLE[f.level];
            return (
              <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${s.cls}`}>
                <s.Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{f.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs font-mono text-zinc-600">
        On-chain signals only. Not financial advice. Always DYOR.
      </p>
    </div>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3">
      <p className="text-xs font-mono uppercase tracking-wider text-zinc-500 truncate">{label}</p>
      <p className={`mt-1 text-lg font-bold ${bad ? "text-red-400" : "text-lime-400"}`}>{value}</p>
    </div>
  );
}
