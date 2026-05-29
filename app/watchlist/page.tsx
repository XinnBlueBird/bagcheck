import WatchlistView from "../components/WatchlistView";

export const metadata = {
  title: "Watchlist — BagCheck",
  description: "Wallets you're keeping an eye on. Saved in your browser.",
};

export default function WatchlistPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            Watchlist
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tighter">
            Wallets you're <span className="text-lime-400">watching.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Saved right in your browser. No account needed. Re-check any wallet in one tap.
          </p>
        </div>
        <div className="mt-10">
          <WatchlistView />
        </div>
      </section>
    </main>
  );
}
