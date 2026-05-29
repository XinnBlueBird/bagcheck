import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "./components/SiteNav";
import { TOKEN } from "@/config/token";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "BagCheck — Paste a wallet. Get the verdict.",
  description:
    "Instant Solana wallet portfolio breakdown with a brutally honest degen verdict. Holdings, USD value, and your archetype in one click.",
  keywords: ["solana", "wallet", "portfolio", "crypto", "memecoin", "bagcheck"],
  openGraph: {
    title: "BagCheck — Paste a wallet. Get the verdict.",
    description: "Instant Solana wallet breakdown with a brutally honest degen verdict.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} antialiased bg-black text-zinc-100`}>
        <SiteNav />
        {children}
        <footer className="border-t border-zinc-900">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
            <p className="text-sm text-zinc-500">
              BagCheck — read-only on-chain analysis. Not financial advice.
            </p>
            <a href={TOKEN.socials.x} target="_blank" rel="noreferrer" className="text-sm text-zinc-500 transition hover:text-zinc-300">
              Follow on X
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
