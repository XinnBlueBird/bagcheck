import { TOKEN } from "@/config/token";

export const metadata = {
  title: "FAQ — BagCheck",
  description: "Common questions about BagCheck, wallet analysis, rug checking, and $BAG.",
};

const FAQS = [
  {
    q: "Is BagCheck safe to use? Do I connect my wallet?",
    a: "No connection, ever. BagCheck is fully read-only. You paste a public address and we read on-chain data. No wallet connection, no signing, no permissions. Your keys never touch this site.",
  },
  {
    q: "Where does the data come from?",
    a: "Live from the Solana blockchain via the Helius RPC and DAS APIs. Holdings, prices, token authorities, and holder data are pulled in real time, not from a stale snapshot.",
  },
  {
    q: "What does the Rug Checker actually check?",
    a: "Mint authority (can the creator print more tokens?), freeze authority (can they freeze your tokens so you can't sell?), and holder concentration (does one wallet hold enough to dump and crash it?). It combines these into a 0-100 safety score.",
  },
  {
    q: "A token scored low. Is it definitely a scam?",
    a: "Not necessarily. Some legitimate tokens keep mint or freeze authority for valid reasons (USDC, for example). The score flags risk vectors, not guilt. Always do your own research. BagCheck gives you signals, not verdicts on intent.",
  },
  {
    q: "What is the AI Assistant and what powers it?",
    a: "An on-chain guide that answers questions about Solana, DeFi, rug safety, and how to read BagCheck's tools. It runs on the MiMo language model on the backend. It won't give price predictions or financial advice.",
  },
  {
    q: "Is my watchlist private?",
    a: "Yes. Your watchlist is stored only in your browser's local storage. It never leaves your device and there's no account or server-side record.",
  },
  {
    q: `What is $${TOKEN.symbol} and is it live?`,
    a: `$${TOKEN.symbol} is the planned community token for BagCheck. It is not live yet. The plan is a fair launch to the community that actually uses the tools, with liquidity locked and contract renounced. See the Roadmap and Tokenomics pages for details.`,
  },
  {
    q: "Is any of this financial advice?",
    a: "No. BagCheck is an analysis tool. Everything here is on-chain data and risk signals for informational purposes. Always do your own research before buying, selling, or holding anything.",
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="mx-auto max-w-3xl px-5 pt-16 pb-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            FAQ
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tighter">
            Questions, <span className="text-lime-400">answered.</span>
          </h1>
        </div>

        <div className="mt-12 space-y-4">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 transition open:border-lime-500/30"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-zinc-100">
                {f.q}
                <span className="shrink-0 text-2xl font-light text-zinc-500 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
