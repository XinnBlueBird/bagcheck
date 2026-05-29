"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, TOKEN } from "@/config/token";

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Lock scroll + close on Escape when drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="BagCheck" className="h-8 w-8" />
          <span className="text-lg font-black tracking-tight">BagCheck</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-zinc-400 transition hover:text-zinc-100">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={TOKEN.socials.x}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-lg bg-lime-400 px-3.5 py-1.5 text-sm font-bold text-black transition hover:bg-lime-300 sm:inline-block"
          >
            Follow
          </a>
          {/* Hamburger (long lines) — opens drawer */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 transition hover:bg-zinc-800 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      </header>

      {/* Drawer overlay — rendered as a header sibling so position:fixed escapes the
          backdrop-filter containing block (was trapping the drawer inside the header). */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            ref={ref}
            className="absolute right-0 top-0 h-full w-72 max-w-[80%] border-l border-zinc-800 bg-zinc-950 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <span className="text-base font-black">Menu</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 transition hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-3">
              {NAV_LINKS.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-lime-400"
                >
                  {n.label}
                </a>
              ))}
              <a
                href={TOKEN.socials.x}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-lime-400 px-4 py-3 text-center text-sm font-bold text-black transition hover:bg-lime-300"
              >
                Follow on X
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
