import { NextRequest, NextResponse } from "next/server";
import { getPortfolio, isValidSolanaAddress } from "@/lib/helius";
import { computeVerdict } from "@/lib/verdict";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/battle?a=<addr>&b=<addr> — fetch two wallets in parallel and compare.
export async function GET(req: NextRequest) {
  const a = req.nextUrl.searchParams.get("a")?.trim() ?? "";
  const b = req.nextUrl.searchParams.get("b")?.trim() ?? "";

  if (!a || !b) {
    return NextResponse.json({ error: "Two wallet addresses required." }, { status: 400 });
  }
  if (!isValidSolanaAddress(a) || !isValidSolanaAddress(b)) {
    return NextResponse.json({ error: "One or both addresses are invalid." }, { status: 400 });
  }
  if (a === b) {
    return NextResponse.json({ error: "Pick two different wallets." }, { status: 400 });
  }
  if (!process.env.HELIUS_API_KEY) {
    return NextResponse.json({ error: "Server misconfigured: missing RPC key." }, { status: 500 });
  }

  try {
    const [pa, pb] = await Promise.all([getPortfolio(a), getPortfolio(b)]);
    const va = computeVerdict(pa);
    const vb = computeVerdict(pb);

    // Winner: higher total value wins. Tie-break: lower cooked score (more disciplined).
    let winner: "a" | "b" | "tie" = "tie";
    if (pa.totalUsd !== pb.totalUsd) {
      winner = pa.totalUsd > pb.totalUsd ? "a" : "b";
    } else if (va.score !== vb.score) {
      winner = va.score < vb.score ? "a" : "b";
    }

    return NextResponse.json({
      a: { portfolio: pa, verdict: va },
      b: { portfolio: pb, verdict: vb },
      winner,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Battle failed: ${msg}` }, { status: 502 });
  }
}
