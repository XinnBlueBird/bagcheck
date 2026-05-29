import RugCheck from "../components/RugCheck";

export const metadata = {
  title: "Rug Checker — BagCheck",
  description: "Scan any Solana token mint for rug signals before you buy.",
};

export default function RugCheckPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            Token Rug Checker
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tighter">
            Check before you <span className="text-lime-400">ape in.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Paste any Solana token mint. We scan mint authority, freeze authority, and holder concentration for rug signals.
          </p>
        </div>
        <div className="mt-10">
          <RugCheck />
        </div>
      </section>
    </main>
  );
}
