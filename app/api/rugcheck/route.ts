import { NextRequest, NextResponse } from "next/server";
import { isValidSolanaAddress } from "@/lib/helius";
import { getRugReport } from "@/lib/rugcheck";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/rugcheck?mint=<address> — scan a token mint for rug signals.
export async function GET(req: NextRequest) {
  const mint = req.nextUrl.searchParams.get("mint")?.trim() ?? "";

  if (!mint) {
    return NextResponse.json({ error: "Token mint address required." }, { status: 400 });
  }
  if (!isValidSolanaAddress(mint)) {
    return NextResponse.json({ error: "That doesn't look like a valid mint address." }, { status: 400 });
  }
  if (!process.env.HELIUS_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured: missing RPC key." }, { status: 500 });
  }

  try {
    const report = await getRugReport(mint);
    return NextResponse.json({ report });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
