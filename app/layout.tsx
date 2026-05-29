import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.variable} ${mono.variable} antialiased`}>{children}</body>
    </html>
  );
}
