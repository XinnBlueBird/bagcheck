// BagCheck token config — launch-ready slot.
// When the $BAG token launches, fill these in and flip `launched` to true.
// Nothing else in the app needs to change.

export const TOKEN = {
  launched: false,
  symbol: "BAG",
  name: "BagCheck",
  // Solana mint address — leave empty until launch.
  mint: "",
  // Swap source: "jupiter" | "pumpfun" | "raydium" — decided at launch time.
  swapSource: "jupiter" as "jupiter" | "pumpfun" | "raydium",
  totalSupply: "1,000,000,000",
  // Optional: holder-gated premium tier once token is live.
  gating: {
    enabled: false,
    minHold: 0,
  },
  socials: {
    x: "https://x.com/Xinnsky",
    telegram: "",
    website: "",
  },
} as const;

export const APP = {
  name: "BagCheck",
  tagline: "Paste a wallet. Get the verdict.",
  description:
    "Instant Solana wallet portfolio breakdown with a brutally honest degen verdict.",
} as const;

// Tokenomics — $BAG allocation. Percentages must total 100.
export interface Allocation {
  label: string;
  pct: number;
  color: string; // tailwind bg class
  note: string;
}

export const TOKENOMICS: Allocation[] = [
  { label: "Liquidity Pool", pct: 40, color: "bg-lime-400", note: "Locked at launch, paired with SOL" },
  { label: "Community & Airdrops", pct: 25, color: "bg-emerald-400", note: "Early users, verdict-card sharers, holders" },
  { label: "Treasury", pct: 15, color: "bg-cyan-400", note: "Development, RPC costs, future features" },
  { label: "Team", pct: 10, color: "bg-blue-400", note: "Vested over 12 months, no early unlock" },
  { label: "Marketing", pct: 10, color: "bg-violet-400", note: "Partnerships, KOLs, growth campaigns" },
];

// Roadmap — phased delivery. `status`: done | active | upcoming.
export interface Phase {
  id: string;
  title: string;
  status: "done" | "active" | "upcoming";
  items: string[];
}

export const ROADMAP: Phase[] = [
  {
    id: "01",
    title: "Phase 1 — The Tool",
    status: "done",
    items: [
      "Read-only Solana wallet analyzer live",
      "Verdict engine with 7 degen archetypes",
      "Live USD holdings via Helius DAS",
      "Mobile-first, zero-connect UX",
    ],
  },
  {
    id: "02",
    title: "Phase 2 — Virality",
    status: "active",
    items: [
      "Shareable verdict cards (PNG export to X)",
      "Wallet vs wallet comparison battles",
      "Leaderboard of most-cooked wallets",
      "Embeddable verdict widget",
    ],
  },
  {
    id: "03",
    title: "Phase 3 — $BAG Launch",
    status: "upcoming",
    items: [
      "Fair launch on Solana",
      "Liquidity locked, contract renounced",
      "Holder-gated premium signals tier",
      "Airdrop to early users & card-sharers",
    ],
  },
  {
    id: "04",
    title: "Phase 4 — The Platform",
    status: "upcoming",
    items: [
      "PnL estimation from full tx history",
      "Real-time rug & risk scoring",
      "Multi-wallet watchlist + alerts",
      "Public verdict API for builders",
    ],
  },
];
