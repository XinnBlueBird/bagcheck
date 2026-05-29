// Insights engine — risk signals + bag composition.
// Pure functions over Portfolio. No network calls.

import type { Portfolio } from "./helius";

const STABLES = new Set([
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
]);

const LIQUID_SOL = new Set([
  "So11111111111111111111111111111111111111112", // wSOL
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // mSOL
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", // stSOL
  "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", // jitoSOL
]);

export type RiskLevel = "low" | "medium" | "high";

export interface RiskSignal {
  level: RiskLevel;
  title: string;
  detail: string;
}

export interface CompositionSlice {
  label: string;
  usd: number;
  pct: number;
  color: string; // tailwind bg class
}

export interface Insights {
  risks: RiskSignal[];
  composition: CompositionSlice[];
  spamCount: number;
  diversificationScore: number; // 0-100
}

function pct(part: number, whole: number): number {
  return whole > 0 ? (part / whole) * 100 : 0;
}

export function computeInsights(p: Portfolio): Insights {
  const total = p.totalUsd;

  // --- Composition buckets ---
  let stableUsd = 0;
  let memeUsd = 0;
  let solUsd = p.solUsd;
  let dustUsd = 0;
  let spamCount = 0;

  for (const t of p.tokens) {
    if (STABLES.has(t.mint)) {
      stableUsd += t.usdValue;
    } else if (LIQUID_SOL.has(t.mint)) {
      solUsd += t.usdValue;
    } else if (t.usdValue === 0) {
      spamCount += 1; // no price feed = illiquid / spam / dead
    } else if (t.usdValue < 1) {
      dustUsd += t.usdValue;
    } else {
      memeUsd += t.usdValue;
    }
  }

  const composition: CompositionSlice[] = [
    { label: "SOL & LSTs", usd: solUsd, pct: pct(solUsd, total), color: "bg-lime-400" },
    { label: "Stablecoins", usd: stableUsd, pct: pct(stableUsd, total), color: "bg-emerald-400" },
    { label: "Memes & Alts", usd: memeUsd, pct: pct(memeUsd, total), color: "bg-orange-400" },
    { label: "Dust", usd: dustUsd, pct: pct(dustUsd, total), color: "bg-zinc-600" },
  ].filter((s) => s.usd > 0);

  // --- Risk signals ---
  const risks: RiskSignal[] = [];
  const priced = p.tokens.filter((t) => t.usdValue > 0);
  const biggest = priced[0];
  const concentration = biggest ? pct(biggest.usdValue, total) : 0;

  if (spamCount >= 5) {
    risks.push({
      level: "high",
      title: `${spamCount} unpriced tokens`,
      detail: "Tokens with no liquidity or price feed. Often spam airdrops, dead projects, or honeypots. Don't try to sell blindly.",
    });
  } else if (spamCount > 0) {
    risks.push({
      level: "medium",
      title: `${spamCount} unpriced token${spamCount > 1 ? "s" : ""}`,
      detail: "Some holdings have no price feed. Likely illiquid or spam. Verify before interacting.",
    });
  }

  if (concentration > 70 && biggest) {
    risks.push({
      level: "high",
      title: `${concentration.toFixed(0)}% in ${biggest.symbol}`,
      detail: "Extreme concentration. One bad day for this token wrecks the whole bag. No diversification cushion.",
    });
  } else if (concentration > 45 && biggest) {
    risks.push({
      level: "medium",
      title: `${concentration.toFixed(0)}% in ${biggest.symbol}`,
      detail: "Heavy single-token weight. Consider whether the conviction matches the risk.",
    });
  }

  const memePct = pct(memeUsd, total);
  if (memePct > 60) {
    risks.push({
      level: "medium",
      title: `${memePct.toFixed(0)}% in memes & alts`,
      detail: "Most of the bag sits in volatile, non-bluechip tokens. High upside, high rug surface.",
    });
  }

  if (risks.length === 0 && total >= 1) {
    risks.push({
      level: "low",
      title: "No major red flags",
      detail: "Balanced exposure, no extreme concentration, minimal spam. A clean bag by degen standards.",
    });
  }

  // --- Diversification score (0-100) ---
  // Penalize concentration + spam, reward spread of priced holdings.
  let score = 100;
  score -= Math.max(0, concentration - 25) * 0.8;
  score -= spamCount * 3;
  if (priced.length <= 1) score -= 25;
  const diversificationScore = Math.max(0, Math.min(100, Math.round(score)));

  return { risks, composition, spamCount, diversificationScore };
}
