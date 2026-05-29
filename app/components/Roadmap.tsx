import { ROADMAP } from "@/config/token";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const STATUS = {
  done: { label: "Shipped", cls: "text-lime-400 border-lime-500/40 bg-lime-500/10", Icon: CheckCircle2 },
  active: { label: "In Progress", cls: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10", Icon: Loader2 },
  upcoming: { label: "Planned", cls: "text-zinc-500 border-zinc-700 bg-zinc-800/40", Icon: Circle },
} as const;

export default function Roadmap() {
  return (
    <section id="roadmap" className="border-t border-zinc-900">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <div className="text-center">
          <span className="inline-block rounded-full border border-lime-500/30 bg-lime-500/10 px-3 py-1 text-xs font-mono font-semibold text-lime-400">
            Roadmap
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight">
            Tool first. Token second. Platform last.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            BagCheck ships value before it asks for any. Each phase builds on a product people already use.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {ROADMAP.map((phase) => {
            const s = STATUS[phase.status];
            return (
              <div
                key={phase.id}
                className={`rounded-2xl border bg-black/40 p-6 ${
                  phase.status === "active" ? "border-cyan-500/30" : "border-zinc-800"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-sm font-bold text-zinc-600">{phase.id}</span>
                    <h3 className="text-lg font-bold text-zinc-100 truncate">{phase.title}</h3>
                  </div>
                  <span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono font-semibold ${s.cls}`}>
                    <s.Icon className={`h-3.5 w-3.5 ${phase.status === "active" ? "animate-spin" : ""}`} />
                    {s.label}
                  </span>
                </div>
                <ul className="mt-5 space-y-2.5">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                        phase.status === "done" ? "bg-lime-400" : phase.status === "active" ? "bg-cyan-400" : "bg-zinc-600"
                      }`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
