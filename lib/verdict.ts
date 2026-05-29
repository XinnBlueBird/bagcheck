// Verdict engine — assigns a degen archetype based on portfolio shape.
// Pure function, no external calls. The "brutally honest" core of BagCheck.

import type { Portfolio } from "./helius";

export interface Verdict {
  archetype: string;
  emoji: string;
  tagline: string;
  description: string;
  score: number; // 0-100 "cooked" meter
  color: string; // tailwind accent class suffix
  stats: VerdictStat[];
}

export interface VerdictStat {
  label: string;
  value: string;
}

// Known stable/blue-chip mints — used to gauge how "degen" a bag is.
const BLUECHIP = new Set([
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
  "So11111111111111111111111111111111111111112", // wSOL
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So", // mSOL
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj", // stSOL
  "J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn", // jitoSOL
]);

function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return (part / whole) * 100;
}

export function computeVerdict(p: Portfolio): Verdict {
  const total = p.totalUsd;
  const memeUsd = p.tokens
    .filter((t) => !BLUECHIP.has(t.mint))
    .reduce((s, t) => s + t.usdValue, 0);
  const blueUsd = p.tokens
    .filter((t) => BLUECHIP.has(t.mint))
    .reduce((s, t) => s + t.usdValue, 0);
  const solPct = pct(p.solUsd, total);
  const memePct = pct(memeUsd, total);
  const bluePct = pct(blueUsd + p.solUsd, total);
  const biggest = p.tokens[0];
  const concentration = biggest ? pct(biggest.usdValue, total) : 0;

  const stats: VerdictStat[] = [
    { label: "Total Value", value: `$${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
    { label: "Token Count", value: `${p.tokenCount}` },
    { label: "Meme Exposure", value: `${memePct.toFixed(0)}%` },
    { label: "Top Holding", value: biggest ? `${biggest.symbol} (${concentration.toFixed(0)}%)` : "—" },
  ];

  // Empty / dust wallet.
  if (total < 1) {
    return {
      archetype: "Ghost Wallet",
      emoji: "GHOST",
      tagline: "Nothing here but dust and dreams.",
      description:
        "This wallet is emptier than a Friday-night exchange after a 50% dump. Either freshly made, fully rugged, or the funds left for greener chains.",
      score: 50,
      color: "slate",
      stats,
    };
  }

  // Whale — large total.
  if (total > 100000) {
    return {
      archetype: "Whale",
      emoji: "WHALE",
      tagline: "Moves markets by sneezing.",
      description:
        "Six figures deep. When this wallet buys, charts notice. When it sells, group chats panic. Treat with respect.",
      score: 20,
      color: "cyan",
      stats,
    };
  }

  // Heavy meme concentration.
  if (memePct > 70 && total > 10) {
    if (concentration > 60) {
      return {
        archetype: "All-In Degen",
        emoji: "DICE",
        tagline: "One coin. One destiny.",
        description:
          `${concentration.toFixed(0)}% of the bag sits in ${biggest?.symbol}. This is not a portfolio, it's a prayer. Either generational wealth or generational cope incoming.`,
        score: 95,
        color: "red",
        stats,
      };
    }
    return {
      archetype: "Meme Connoisseur",
      emoji: "CLOWN",
      tagline: "Collects dog coins like Pokemon.",
      description:
        "A diversified zoo of memecoins. Spreads risk across a hundred ways to lose money. Respect the conviction, question the judgment.",
      score: 85,
      color: "orange",
      stats,
    };
  }

  // Mostly bluechip / SOL.
  if (bluePct > 70) {
    return {
      archetype: "Diamond Hands",
      emoji: "DIAMOND",
      tagline: "Boring on purpose. Rich on schedule.",
      description:
        "SOL, stables, liquid staking. This wallet sleeps at night while degens refresh charts at 4am. The tortoise that wins.",
      score: 10,
      color: "emerald",
      stats,
    };
  }

  // Lots of tiny dust tokens.
  if (p.tokenCount > 30 && memePct < 40) {
    return {
      archetype: "Airdrop Farmer",
      emoji: "TRACTOR",
      tagline: "Has more tokens than a Chuck E. Cheese.",
      description:
        `${p.tokenCount} tokens, most worth pennies. A graveyard of failed airdrops and forgotten farms. The hustle is real, the returns are not.`,
      score: 60,
      color: "yellow",
      stats,
    };
  }

  // Balanced.
  return {
    archetype: "Balanced Trader",
    emoji: "SCALE",
    tagline: "Actually knows what they're doing.",
    description:
      "A reasonable mix of SOL, stables, and a few calculated meme bets. Suspiciously sensible for someone checking their bag on a tool called BagCheck.",
    score: 35,
    color: "blue",
    stats,
  };
}
