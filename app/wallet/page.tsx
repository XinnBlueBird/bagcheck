import WalletChecker from "../components/WalletChecker";

export const metadata = {
  title: "Wallet Checker — BagCheck",
  description: "Paste any Solana wallet for a full portfolio breakdown and a degen verdict.",
};

export default function WalletPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            Wallet Checker
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tighter">
            Paste a wallet. <span className="text-lime-400">Get the verdict.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Holdings, USD value, risk signals, bag composition, and a brutally honest archetype. No connect, no signing.
          </p>
        </div>
        <div className="mt-10">
          <WalletChecker />
        </div>
      </section>
    </main>
  );
}
