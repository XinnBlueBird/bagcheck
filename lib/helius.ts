// Helius DAS + RPC client for wallet portfolio data.
// Server-side only — never expose HELIUS_API_KEY to the client.

const HELIUS_KEY = process.env.HELIUS_API_KEY;
const RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`;

export interface TokenHolding {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  usdValue: number;
  pricePerToken: number;
  logo?: string;
}

export interface Portfolio {
  address: string;
  solBalance: number;
  solUsd: number;
  tokens: TokenHolding[];
  totalUsd: number;
  tokenCount: number;
}

interface DasAsset {
  id: string;
  content?: {
    metadata?: { name?: string; symbol?: string };
    links?: { image?: string };
  };
  token_info?: {
    symbol?: string;
    balance?: number;
    decimals?: number;
    price_info?: { total_price?: number; price_per_token?: number };
  };
}

async function rpc<T>(method: string, params: unknown): Promise<T> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "bagcheck", method, params }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Helius ${method} HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(`Helius ${method}: ${json.error.message}`);
  return json.result as T;
}

// Validate a Solana base58 address (32-44 chars, no 0/O/I/l).
export function isValidSolanaAddress(addr: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr.trim());
}

export async function getPortfolio(address: string): Promise<Portfolio> {
  const clean = address.trim();

  // Fetch fungible assets with price info via DAS.
  const assets = await rpc<{ items: DasAsset[]; nativeBalance?: { lamports: number; price_per_sol?: number; total_price?: number } }>(
    "searchAssets",
    {
      ownerAddress: clean,
      tokenType: "fungible",
      displayOptions: { showNativeBalance: true },
      page: 1,
      limit: 1000,
    }
  );

  const solLamports = assets.nativeBalance?.lamports ?? 0;
  const solBalance = solLamports / 1e9;
  const solUsd = assets.nativeBalance?.total_price ?? 0;

  const tokens: TokenHolding[] = (assets.items ?? [])
    .map((a): TokenHolding | null => {
      const ti = a.token_info;
      if (!ti || !ti.balance) return null;
      const decimals = ti.decimals ?? 0;
      const amount = ti.balance / Math.pow(10, decimals);
      const usdValue = ti.price_info?.total_price ?? 0;
      const pricePerToken = ti.price_info?.price_per_token ?? 0;
      return {
        mint: a.id,
        symbol: ti.symbol || a.content?.metadata?.symbol || "???",
        name: a.content?.metadata?.name || ti.symbol || "Unknown",
        amount,
        decimals,
        usdValue,
        pricePerToken,
        logo: a.content?.links?.image,
      };
    })
    .filter((t): t is TokenHolding => t !== null && t.amount > 0)
    .sort((a, b) => b.usdValue - a.usdValue);

  const tokenUsd = tokens.reduce((sum, t) => sum + t.usdValue, 0);

  return {
    address: clean,
    solBalance,
    solUsd,
    tokens,
    totalUsd: solUsd + tokenUsd,
    tokenCount: tokens.length,
  };
}
