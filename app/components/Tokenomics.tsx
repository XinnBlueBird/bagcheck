import { TOKEN, TOKENOMICS } from "@/config/token";
import { Lock, Coins, PieChart } from "lucide-react";

export default function Tokenomics() {
  return (
    <section id="tokenomics" className="border-t border-zinc-900 bg-zinc-950/30">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            ${TOKEN.symbol} Tokenomics
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight">
            Built to reward the community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            ${TOKEN.symbol} aligns the people who use BagCheck with the people who own it. No insider unlocks, no silent dumps.
          </p>
        </div>

        {/* Supply highlights */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-6">
            <Coins className="h-6 w-6 text-lime-400" />
            <p className="mt-3 text-2xl font-black text-zinc-100">{TOKEN.totalSupply}</p>
            <p className="text-sm text-zinc-500">Total Supply</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-6">
            <Lock className="h-6 w-6 text-emerald-400" />
            <p className="mt-3 text-2xl font-black text-zinc-100">Locked</p>
            <p className="text-sm text-zinc-500">LP locked at launch</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-black/40 p-6">
            <PieChart className="h-6 w-6 text-cyan-400" />
            <p className="mt-3 text-2xl font-black text-zinc-100">0% Tax</p>
            <p className="text-sm text-zinc-500">No buy/sell tax</p>
          </div>
        </div>

        {/* Allocation bar */}
        <div className="mt-10 rounded-2xl border border-zinc-800 bg-black/40 p-6 sm:p-8">
          <div className="flex h-4 w-full overflow-hidden rounded-full">
            {TOKENOMICS.map((a) => (
              <div
                key={a.label}
                className={a.color}
                style={{ width: `${a.pct}%` }}
                title={`${a.label} ${a.pct}%`}
              />
            ))}
          </div>

          <div className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {TOKENOMICS.map((a) => (
              <div key={a.label} className="flex items-start gap-3">
                <span className={`mt-1 h-3 w-3 shrink-0 rounded-sm ${a.color}`} />
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-semibold text-zinc-100">{a.label}</p>
                    <p className="font-mono text-sm font-bold text-zinc-300">{a.pct}%</p>
                  </div>
                  <p className="mt-0.5 text-sm text-zinc-500">{a.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
