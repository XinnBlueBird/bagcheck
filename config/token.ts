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
