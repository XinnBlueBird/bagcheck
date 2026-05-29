import { Wallet, ShieldCheck, Bot, Star, ArrowRight, Zap, Lock, Share2 } from "lucide-react";
import { APP, TOKEN } from "@/config/token";

const TOOLS = [
  { icon: Wallet, title: "Wallet Checker", desc: "Paste any Solana wallet for a full portfolio breakdown and a brutally honest degen verdict.", href: "/wallet" },
  { icon: ShieldCheck, title: "Rug Checker", desc: "Scan any token mint for mint authority, freeze authority, and holder concentration before you ape in.", href: "/rugcheck" },
  { icon: Bot, title: "AI Assistant", desc: "Ask anything about Solana, DeFi, and rug safety. Your on-chain guide, powered by MiMo.", href: "/chat" },
  { icon: Star, title: "Watchlist", desc: "Star wallets you care about and re-check them in one tap. Saved right in your browser.", href: "/watchlist" },
];

const WHY = [
  { icon: Zap, title: "Instant, no connect", desc: "Read-only analysis. No wallet connection, no signing, no permissions. Ever." },
  { icon: Lock, title: "On-chain truth", desc: "Live data straight from the chain via Helius. No guesswork, no stale snapshots." },
  { icon: Share2, title: "Built to share", desc: "Export your verdict as a card and flex or roast it on X. The degen group chat will thank you." },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-20 pb-16 sm:pt-28 text-center">
        <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
          The Solana wallet toolkit · ${TOKEN.symbol} coming soon
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl font-black tracking-tighter">
          Know any wallet.
          <br />
          <span className="text-lime-400">Trust no token blindly.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-zinc-400">
          BagCheck is a suite of read-only Solana tools. Analyze wallets, scan tokens for rugs, and get on-chain answers from an AI built for degens.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/wallet" className="flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-300">
            <Wallet className="h-5 w-5" /> Check a wallet
          </a>
          <a href="/rugcheck" className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800">
            <ShieldCheck className="h-5 w-5" /> Scan a token
          </a>
        </div>
      </section>

      {/* Tools grid */}
      <section className="border-t border-zinc-900">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">One toolkit, four tools</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">Each tool lives on its own page. Pick what you need.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <a
                key={t.href}
                href={t.href}
                className="group rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 transition hover:border-lime-500/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-zinc-600 transition group-hover:translate-x-1 group-hover:text-lime-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-100">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{t.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="border-t border-zinc-900 bg-zinc-950/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Why BagCheck</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-2xl border border-zinc-800 bg-black/40 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                  <w.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-zinc-100">{w.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-900">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            ${TOKEN.symbol} launches to the <span className="text-lime-400">community that uses it.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            Use the tools, learn the chain, be early. See where the project is headed.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/tokenomics" className="rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-300">
              View tokenomics
            </a>
            <a href="/roadmap" className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800">
              See the roadmap
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
