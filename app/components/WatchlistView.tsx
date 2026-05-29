"use client";

import { useWatchlist } from "../hooks/useWatchlist";
import { Star, Trash2, ExternalLink, Inbox } from "lucide-react";

function shortAddr(a: string): string {
  return `${a.slice(0, 6)}...${a.slice(-6)}`;
}

export default function WatchlistView() {
  const { list, remove } = useWatchlist();

  if (list.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950/60 p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-600">
          <Inbox className="h-7 w-7" />
        </div>
        <p className="mt-4 text-lg font-bold text-zinc-200">No wallets watched yet</p>
        <p className="mt-1 text-sm text-zinc-500">
          Run a wallet through the checker and hit the Watch star to save it here.
        </p>
        <a
          href="/wallet"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-lime-300"
        >
          <Star className="h-4 w-4" /> Check a wallet
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {list.map((w) => (
        <div
          key={w.address}
          className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 px-5 py-4"
        >
          <div className="min-w-0">
            <p className="font-mono text-sm text-zinc-200">{shortAddr(w.address)}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              Last verdict: <span className="text-lime-400">{w.label}</span>
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <a
              href={`/wallet?a=${encodeURIComponent(w.address)}`}
              className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-lime-300"
            >
              Re-check <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              onClick={() => remove(w.address)}
              aria-label="Remove"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-500 transition hover:border-red-500/40 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
