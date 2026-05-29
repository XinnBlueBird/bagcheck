import { AlertTriangle, ShieldCheck, ShieldAlert, Activity } from "lucide-react";
import type { Insights, RiskLevel } from "@/lib/insights";

const RISK_STYLE: Record<RiskLevel, { cls: string; Icon: typeof AlertTriangle }> = {
  high: { cls: "text-red-400 border-red-500/30 bg-red-500/5", Icon: ShieldAlert },
  medium: { cls: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5", Icon: AlertTriangle },
  low: { cls: "text-lime-400 border-lime-500/30 bg-lime-500/5", Icon: ShieldCheck },
};

function usd(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function InsightsPanel({ insights }: { insights: Insights }) {
  return (
    <div className="space-y-6">
      {/* Bag composition */}
      {insights.composition.length > 0 && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200">Bag Composition</h3>
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
              <Activity className="h-3.5 w-3.5" />
              Diversification {insights.diversificationScore}/100
            </div>
          </div>

          <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-zinc-900">
            {insights.composition.map((s) => (
              <div key={s.label} className={s.color} style={{ width: `${s.pct}%` }} title={`${s.label} ${s.pct.toFixed(0)}%`} />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
            {insights.composition.map((s) => (
              <div key={s.label} className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-sm ${s.color}`} />
                  <span className="truncate text-xs text-zinc-400">{s.label}</span>
                </div>
                <p className="mt-1 text-sm font-bold text-zinc-100">{s.pct.toFixed(0)}%</p>
                <p className="font-mono text-xs text-zinc-600">{usd(s.usd)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk signals */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="border-b border-zinc-800 px-5 py-3">
          <h3 className="text-sm font-bold text-zinc-200">Risk Signals</h3>
        </div>
        <div className="space-y-3 p-5">
          {insights.risks.map((r, i) => {
            const s = RISK_STYLE[r.level];
            return (
              <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${s.cls}`}>
                <s.Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold">{r.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{r.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
