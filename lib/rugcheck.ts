// Token rug-check engine — reads SPL mint safety signals via Helius RPC.
// Server-side only. Never expose HELIUS_API_KEY to the client.

const HELIUS_KEY = process.env.HELIUS_API_KEY;
const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;

export interface RugFlag {
  level: "safe" | "warn" | "danger";
  title: string;
  detail: string;
}

export interface RugReport {
  mint: string;
  name: string;
  symbol: string;
  logo?: string;
  supply: number;
  decimals: number;
  mintAuthorityActive: boolean;
  freezeAuthorityActive: boolean;
  topHolderPct: number;
  top10Pct: number;
  safetyScore: number; // 0-100, higher = safer
  flags: RugFlag[];
}

async function rpc<T>(method: string, params: unknown): Promise<T> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "rug", method, params }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Helius ${method} HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`Helius ${method}: ${json.error.message}`);
  return json.result as T;
}

interface MintParsed {
  value: {
    data: {
      parsed: {
        info: {
          mintAuthority: string | null;
          freezeAuthority: string | null;
          supply: string;
          decimals: number;
        };
      };
    } | null;
  };
}

interface LargestAccounts {
  value: { amount: string; uiAmount: number | null }[];
}

interface AssetMeta {
  content?: { metadata?: { name?: string; symbol?: string }; links?: { image?: string } };
}

export async function getRugReport(mint: string): Promise<RugReport> {
  const clean = mint.trim();

  // Parsed mint account → authorities, supply, decimals.
  const acct = await rpc<MintParsed>("getAccountInfo", [
    clean,
    { encoding: "jsonParsed" },
  ]);
  const info = acct.value?.data?.parsed?.info;
  if (!info) throw new Error("Not a valid SPL token mint.");

  const decimals = info.decimals ?? 0;
  const rawSupply = Number(info.supply ?? "0");
  const supply = rawSupply / Math.pow(10, decimals);
  const mintAuthorityActive = info.mintAuthority !== null;
  const freezeAuthorityActive = info.freezeAuthority !== null;

  // Top holders → concentration. Non-fatal: huge tokens (USDC etc.) make
  // getTokenLargestAccounts reject with "too many accounts" — degrade gracefully.
  let holders: number[] = [];
  let concentrationAvailable = true;
  try {
    const largest = await rpc<LargestAccounts>("getTokenLargestAccounts", [clean]);
    holders = (largest.value ?? [])
      .map((h) => (h.uiAmount ?? Number(h.amount) / Math.pow(10, decimals)))
      .filter((n) => n > 0)
      .sort((a, b) => b - a);
  } catch {
    concentrationAvailable = false;
  }

  const topHolderPct = supply > 0 && holders[0] ? (holders[0] / supply) * 100 : 0;
  const top10 = holders.slice(0, 10).reduce((s, h) => s + h, 0);
  const top10Pct = supply > 0 ? (top10 / supply) * 100 : 0;

  // Metadata (best-effort).
  let name = "Unknown Token";
  let symbol = "???";
  let logo: string | undefined;
  try {
    const asset = await rpc<AssetMeta>("getAsset", { id: clean });
    name = asset.content?.metadata?.name || name;
    symbol = asset.content?.metadata?.symbol || symbol;
    logo = asset.content?.links?.image;
  } catch {
    /* metadata optional */
  }

  // --- Flags + score ---
  const flags: RugFlag[] = [];
  let score = 100;

  if (mintAuthorityActive) {
    flags.push({
      level: "danger",
      title: "Mint authority active",
      detail: "The creator can mint unlimited new tokens, diluting holders to zero. Major rug vector.",
    });
    score -= 35;
  } else {
    flags.push({
      level: "safe",
      title: "Mint authority renounced",
      detail: "Supply is fixed. No one can mint more tokens.",
    });
  }

  if (freezeAuthorityActive) {
    flags.push({
      level: "danger",
      title: "Freeze authority active",
      detail: "The creator can freeze your tokens, locking you out of selling. Honeypot risk.",
    });
    score -= 30;
  } else {
    flags.push({
      level: "safe",
      title: "Freeze authority renounced",
      detail: "Your tokens can't be frozen. You can always sell.",
    });
  }

  if (topHolderPct > 50) {
    flags.push({
      level: "danger",
      title: `Top holder owns ${topHolderPct.toFixed(0)}%`,
      detail: "A single wallet can dump and crash the price instantly. Extreme concentration.",
    });
    score -= 25;
  } else if (concentrationAvailable && topHolderPct > 20) {
    flags.push({
      level: "warn",
      title: `Top holder owns ${topHolderPct.toFixed(0)}%`,
      detail: "One wallet holds a large share. Watch for dump risk.",
    });
    score -= 12;
  } else if (concentrationAvailable) {
    flags.push({
      level: "safe",
      title: `Top holder owns ${topHolderPct.toFixed(0)}%`,
      detail: "No single wallet dominates supply.",
    });
  } else {
    flags.push({
      level: "warn",
      title: "Holder data unavailable",
      detail: "This token has too many accounts to scan concentration (common for large/established tokens). Authority checks above still apply.",
    });
  }

  if (concentrationAvailable && top10Pct > 80) {
    flags.push({
      level: "warn",
      title: `Top 10 hold ${top10Pct.toFixed(0)}%`,
      detail: "Supply is tightly held by a few wallets. Thin float, easy to manipulate.",
    });
    score -= 10;
  }

  const safetyScore = Math.max(0, Math.min(100, Math.round(score)));

  return {
    mint: clean,
    name,
    symbol,
    logo,
    supply,
    decimals,
    mintAuthorityActive,
    freezeAuthorityActive,
    topHolderPct,
    top10Pct,
    safetyScore,
    flags,
  };
}
