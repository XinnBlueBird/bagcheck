"use client";

import { useState, useEffect, useRef } from "react";
import { MoreVertical, X } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
}

export default function MobileNav({ items, social }: { items: NavItem[]; social: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800"
      >
        {open ? <X className="h-5 w-5" /> : <MoreVertical className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 backdrop-blur shadow-2xl">
          <nav className="flex flex-col py-1">
            {items.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-lime-400"
              >
                {n.label}
              </a>
            ))}
            <a
              href={social}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="border-t border-zinc-800 px-4 py-3 text-sm font-semibold text-lime-400 transition hover:bg-zinc-900"
            >
              Follow on X
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
