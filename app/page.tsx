import WalletChecker from "./components/WalletChecker";
import { Wallet, Zap, Shield, ExternalLink } from "lucide-react";
import { APP, TOKEN } from "@/config/token";

const SAMPLE = "GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-100 overflow-x-hidden">
      {/* Nav */}
      <nav className="border-b border-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-black">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-tight">BagCheck</span>
          </div>
          <a
            href={TOKEN.socials.x}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-200 transition"
          >
            Follow updates
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-10 sm:pt-24">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            Solana wallet analyzer
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

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-2xl font-black tracking-tight">How it works</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            { icon: Wallet, title: "Paste address", desc: "Drop any public Solana wallet. No connection, no permissions." },
            { icon: Zap, title: "We read the chain", desc: "Live holdings + USD value pulled straight from on-chain data." },
            { icon: Shield, title: "Get judged", desc: "An archetype verdict and a cooked meter. Brutally honest." },
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{s.desc}</p>
            </div>
          ))}
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
