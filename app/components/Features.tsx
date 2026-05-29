import { Wallet, Zap, Shield, Share2, Swords, Trophy, ScanSearch, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Deep wallet read",
    desc: "Every fungible token plus SOL, priced live in USD. Sorted by value so the real bag shows first.",
  },
  {
    icon: Zap,
    title: "Instant verdict",
    desc: "A degen archetype in under two seconds. Whale, Diamond Hands, All-In Degen, Ghost Wallet, and more.",
  },
  {
    icon: Shield,
    title: "Zero connect",
    desc: "No wallet connection, no signing, no permissions. It only reads public on-chain data. Your keys stay yours.",
  },
  {
    icon: Share2,
    title: "Shareable cards",
    desc: "Export your verdict as a card and flex or roast it on X. Built-in bragging rights.",
  },
  {
    icon: Swords,
    title: "Wallet battles",
    desc: "Put two wallets head to head and let the cooked meter settle the argument in the group chat.",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    desc: "See the most cooked wallets on Solana. A hall of fame nobody wants to be in.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-zinc-900">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            Features
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight">
            More than a balance checker
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            A full read on any wallet, wrapped in a verdict you can actually share.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 transition hover:border-zinc-700">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-zinc-100">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
