import ChatBot from "../components/ChatBot";

export const metadata = {
  title: "AI Assistant — BagCheck",
  description: "Ask anything about Solana, DeFi, and rug safety. Powered by MiMo.",
};

export default function ChatPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            AI Assistant
          </span>
          <h1 className="mt-5 text-3xl sm:text-5xl font-black tracking-tighter">
            Your on-chain <span className="text-lime-400">guide.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Ask about rugs, wallet risk, token safety, or any Solana concept. Honest answers, no price calls.
          </p>
        </div>
        <div className="mt-10">
          <ChatBot />
        </div>
      </section>
    </main>
  );
}
