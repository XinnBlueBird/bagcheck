"use client";

import { useState, useEffect, useCallback } from "react";

const KEY = "bagcheck_watchlist";
const MAX = 10;

export interface WatchedWallet {
  address: string;
  label: string; // last verdict archetype, for quick recall
  addedAt: number;
}

export function useWatchlist() {
  const [list, setList] = useState<WatchedWallet[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  const persist = useCallback((next: WatchedWallet[]) => {
    setList(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const add = useCallback(
    (address: string, label: string) => {
      setList((cur) => {
        if (cur.some((w) => w.address === address)) return cur;
        const next = [{ address, label, addedAt: Date.now() }, ...cur].slice(0, MAX);
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  const remove = useCallback(
    (address: string) => {
      setList((cur) => {
        const next = cur.filter((w) => w.address !== address);
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  const has = useCallback((address: string) => list.some((w) => w.address === address), [list]);

  return { list, add, remove, has, persist };
}
