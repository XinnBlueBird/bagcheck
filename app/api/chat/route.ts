import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIMO_ENDPOINT = "https://token-plan-sgp.xiaomimimo.com/v1/chat/completions";
const MIMO_MODEL = "mimo-v2.5-pro";

const SYSTEM_PROMPT = `You are the BagCheck AI Assistant, a sharp, no-nonsense Solana and DeFi guide.
You help users understand wallet analysis, token safety, rug signals, and general Solana concepts.
Be concise and practical. Explain risks honestly. Never give financial advice or price predictions.
If asked about a specific token's safety, tell them to run it through the BagCheck Rug Checker.
Keep a slightly degen but trustworthy tone. Use plain text, no markdown headers.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const key = process.env.MIMO_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "AI assistant is not configured yet. Check back soon." },
      { status: 503 }
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = (body.messages ?? []).slice(-10); // cap context
  if (messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  try {
    const upstream = await fetch(MIMO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": key,
      },
      body: JSON.stringify({
        model: MIMO_MODEL,
        max_tokens: 1024,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!upstream.ok) {
      const txt = await upstream.text();
      return NextResponse.json(
        { error: `AI upstream error ${upstream.status}: ${txt.slice(0, 200)}` },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    const choice = data?.choices?.[0]?.message;
    // MiMo reasoning model: content may be empty, reasoning_content holds the answer.
    const reply = choice?.content || choice?.reasoning_content || "";
    if (!reply) {
      return NextResponse.json({ error: "AI returned an empty response." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `AI request failed: ${msg}` }, { status: 502 });
  }
}
