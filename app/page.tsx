import WalletChecker from "./components/WalletChecker";
import BattleMode from "./components/BattleMode";
import Features from "./components/Features";
import Tokenomics from "./components/Tokenomics";
import Roadmap from "./components/Roadmap";
import { Wallet, ExternalLink } from "lucide-react";
import { APP, TOKEN } from "@/config/token";

const SAMPLE = "GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG";

const NAV = [
  { label: "Battle", href: "#battle" },
  { label: "Features", href: "#features" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Roadmap", href: "#roadmap" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="BagCheck" className="h-8 w-8" />
            <span className="text-lg font-black tracking-tight">BagCheck</span>
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition">
                {n.label}
              </a>
            ))}
          </div>
          <a
            href={TOKEN.socials.x}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition"
          >
            Follow
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-10 sm:pt-24">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            Solana wallet analyzer · ${TOKEN.symbol} coming soon
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-black tracking-tighter">
            Paste a wallet.
            <br />
            <span className="text-lime-400">Get the verdict.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-zinc-400">
            {APP.description} No connect, no signing. Just paste and judge.
          </p>
        </div>

        <div className="mt-10">
          <WalletChecker />
          <p className="mt-3 text-center text-xs font-mono text-zinc-600">
            No wallet?{" "}
            <span className="text-zinc-500">Try a sample: </span>
            <code className="text-lime-500/80 break-all">{SAMPLE}</code>
          </p>
        </div>
      </section>

      {/* Battle Mode */}
      <section id="battle" className="border-t border-zinc-900 bg-zinc-950/30">
        <div className="mx-auto max-w-5xl px-5 py-20">
          <div className="text-center">
            <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
              Battle Mode
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight">
              Two wallets enter. <span className="text-lime-400">One gets cooked.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Settle the group chat. Paste two wallets and let the bags do the talking.
            </p>
          </div>
          <div className="mt-10">
            <BattleMode />
          </div>
        </div>
      </section>

      <Features />
      <Tokenomics />
      <Roadmap />

      {/* CTA */}
      <section className="border-t border-zinc-900 bg-zinc-950/30">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Check your bag. <span className="text-lime-400">Face the verdict.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-zinc-400">
            ${TOKEN.symbol} launches to the community that built BagCheck. Use the tool, share your verdict, be first in line.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
          >
            <Wallet className="h-5 w-5" />
            Run a check
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <p className="text-sm text-zinc-500">
            BagCheck — read-only wallet analysis. Not financial advice.
          </p>
          <div className="flex items-center gap-4">
            <a href={TOKEN.socials.x} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition">
              Follow on X
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
