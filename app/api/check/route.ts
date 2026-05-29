import { NextRequest, NextResponse } from "next/server";
import { getPortfolio, isValidSolanaAddress } from "@/lib/helius";
import { computeVerdict } from "@/lib/verdict";
import { computeInsights } from "@/lib/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address")?.trim() ?? "";

  if (!address) {
    return NextResponse.json({ error: "Missing wallet address." }, { status: 400 });
  }
  if (!isValidSolanaAddress(address)) {
    return NextResponse.json(
      { error: "That doesn't look like a valid Solana address." },
      { status: 400 }
    );
  }
  if (!process.env.HELIUS_API_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured: missing RPC key." },
      { status: 500 }
    );
  }

  try {
    const portfolio = await getPortfolio(address);
    const verdict = computeVerdict(portfolio);
    const insights = computeInsights(portfolio);
    return NextResponse.json({ portfolio, verdict, insights });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to read wallet: ${msg}` },
      { status: 502 }
    );
  }
}
