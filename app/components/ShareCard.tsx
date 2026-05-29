"use client";

import { useCallback, useState } from "react";
import { Share2, Download, Loader2 } from "lucide-react";
import type { Portfolio } from "@/lib/helius";
import type { Verdict } from "@/lib/verdict";

const COOKED_COLOR: Record<string, string> = {
  red: "#f87171",
  orange: "#fb923c",
  yellow: "#facc15",
  emerald: "#34d399",
  cyan: "#22d3ee",
  blue: "#60a5fa",
  slate: "#94a3b8",
};

function usd(n: number): string {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

// Draw the verdict card onto a canvas and return a PNG blob URL.
function drawCard(portfolio: Portfolio, verdict: Verdict): string {
  const W = 1200;
  const H = 630;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const accent = COOKED_COLOR[verdict.color] ?? "#a3e635";

  // background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, W, H);
  // accent border
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // brand
  ctx.fillStyle = "#a3e635";
  ctx.font = "bold 34px sans-serif";
  ctx.fillText("BagCheck", 64, 96);
  ctx.fillStyle = "#71717a";
  ctx.font = "22px monospace";
  ctx.fillText("bagcheck-pink.vercel.app", 64, 132);

  // verdict label
  ctx.fillStyle = "#71717a";
  ctx.font = "bold 22px monospace";
  ctx.fillText("VERDICT", 64, 240);

  // archetype
  ctx.fillStyle = accent;
  ctx.font = "bold 86px sans-serif";
  ctx.fillText(verdict.archetype, 60, 320);

  // tagline
  ctx.fillStyle = "#e4e4e7";
  ctx.font = "34px sans-serif";
  ctx.fillText(verdict.tagline, 64, 378);

  // stats row
  ctx.fillStyle = "#71717a";
  ctx.font = "bold 22px monospace";
  ctx.fillText("TOTAL VALUE", 64, 500);
  ctx.fillText("COOKED METER", 460, 500);

  ctx.fillStyle = "#fafafa";
  ctx.font = "bold 56px sans-serif";
  ctx.fillText(usd(portfolio.totalUsd), 64, 560);
  ctx.fillText(`${verdict.score}/100`, 460, 560);

  // cooked bar
  const barX = 820;
  const barY = 520;
  const barW = 316;
  ctx.fillStyle = "#27272a";
  ctx.fillRect(barX, barY, barW, 16);
  ctx.fillStyle = accent;
  ctx.fillRect(barX, barY, (barW * verdict.score) / 100, 16);

  return canvas.toDataURL("image/png");
}

export default function ShareCard({ portfolio, verdict }: { portfolio: Portfolio; verdict: Verdict }) {
  const [busy, setBusy] = useState(false);

  const download = useCallback(() => {
    setBusy(true);
    try {
      const url = drawCard(portfolio, verdict);
      if (!url) return;
      const a = document.createElement("a");
      a.href = url;
      a.download = `bagcheck-${verdict.archetype.toLowerCase().replace(/\s+/g, "-")}.png`;
      a.click();
    } finally {
      setBusy(false);
    }
  }, [portfolio, verdict]);

  const shareX = useCallback(() => {
    const text = `My wallet got judged: ${verdict.archetype} — "${verdict.tagline}" Cooked ${verdict.score}/100. Check yours at`;
    const url = "https://bagcheck-pink.vercel.app";
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  }, [verdict]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={download}
        disabled={busy}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Download card
      </button>
      <button
        onClick={shareX}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
      >
        <Share2 className="h-4 w-4" />
        Share on X
      </button>
    </div>
  );
}
