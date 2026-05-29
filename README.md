<div align="center">

# BagCheck

### Paste a wallet. Get the verdict.

[![Live Demo](https://img.shields.io/badge/Live-Demo-84cc16?style=flat-square)](https://bagcheck.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Solana](https://img.shields.io/badge/Solana-mainnet-9945ff?style=flat-square&logo=solana)](https://solana.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

Live demo · Report bug · Request feature

</div>

---

## What is BagCheck?

BagCheck is a read-only Solana wallet analyzer. Paste any public wallet address and it pulls live holdings straight from the chain, prices them in USD, and hands back a portfolio breakdown plus a blunt one-word verdict on what kind of holder you're dealing with.

No wallet connection. No signing. No permissions. It only reads public on-chain data, so you can check your own bag, a friend's, or that anon who keeps shilling in your group chat.

> The design language is degen-terminal: black canvas, lime accent, monospace numbers. Built to feel like a tool a trader actually keeps open in a tab.

## Why this exists

Every Solana holder has a folder of half-open explorer tabs trying to figure out what's actually in a wallet. Solscan shows raw token accounts with no USD context, most portfolio trackers want you to connect and sign, and none of them tell you the truth: that your bag is 90% one memecoin and you are, in fact, cooked.

BagCheck collapses that into one paste box. It reads the wallet, totals the value, and assigns an archetype — Diamond Hands, All-In Degen, Airdrop Farmer, Whale, Ghost Wallet — with a "cooked meter" from 0 to 100. Honest, fast, shareable.

## Features

- **Zero-connect analysis** — paste a public address, no wallet connection or signature required.
- **Live on-chain holdings** — SOL balance plus every fungible token, priced in USD via Helius DAS.
- **Degen verdict engine** — a pure-function archetype classifier that reads portfolio shape (concentration, meme exposure, bluechip ratio) and returns a verdict with a cooked meter.
- **Holdings table** — top positions sorted by value, with token logos and balances.
- **Launch-ready token slot** — a single config file reserves a `$BAG` token integration so a future launch is a one-variable flip, not a rebuild.

## Architecture

```
┌──────────────┐     paste address      ┌─────────────────────┐
│   Browser    │ ─────────────────────► │  /api/check (Node)  │
│  (React UI)  │                        │                     │
│              │ ◄───────────────────── │  1. validate addr   │
└──────────────┘   portfolio + verdict  │  2. Helius DAS RPC  │
                                        │  3. verdict engine  │
                                        └──────────┬──────────┘
                                                   │ searchAssets
                                                   ▼
                                        ┌─────────────────────┐
                                        │   Helius mainnet     │
                                        │   (DAS + pricing)    │
                                        └─────────────────────┘
```

The API route is the only place the Helius key lives — it never reaches the client. The verdict engine is a pure function with no network calls, so it's deterministic and trivially testable.

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js 16** | App Router, Turbopack, route handlers |
| Language | **TypeScript 5** | Strict mode, ES2018 target |
| Styling | **Tailwind CSS 4** | Utility-first, dark degen theme |
| Icons | **lucide-react** | Tree-shaken SVG icons |
| Chain data | **Helius DAS** | `searchAssets` with native balance + price info |
| Web3 | **@solana/web3.js** | Address validation, future token logic |

## Project Structure

```
bagcheck/
├── app/
│   ├── api/
│   │   └── check/route.ts      # GET ?address= → portfolio + verdict
│   ├── components/
│   │   └── WalletChecker.tsx   # paste box, results, holdings table
│   ├── globals.css             # theme tokens + fonts
│   ├── layout.tsx              # metadata, font wiring
│   └── page.tsx                # hero, how-it-works, footer
├── lib/
│   ├── helius.ts               # DAS client, address validation, types
│   └── verdict.ts              # archetype classifier (pure function)
├── config/
│   └── token.ts                # launch-ready $BAG token slot
└── .env.example                # HELIUS_API_KEY
```

## Quick Start

### Prerequisites

- Node.js 20+
- A free Helius API key from [helius.dev](https://helius.dev)

### Install

```bash
git clone https://github.com/XinnBlueBird/bagcheck.git
cd bagcheck
npm install
```

### Run

```bash
cp .env.example .env.local
# add your HELIUS_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HELIUS_API_KEY` | ✅ Yes | Helius RPC key for DAS asset + pricing queries |

## API Reference

### `GET /api/check`

Query a wallet and return its portfolio plus verdict.

**Request**

```http
GET /api/check?address=GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG
```

**Response** `200 OK`

```json
{
  "portfolio": {
    "address": "GDfn...XmG",
    "solBalance": 165.8,
    "solUsd": 13575.36,
    "tokens": [{ "symbol": "CROWN", "amount": 2017, "usdValue": 0 }],
    "totalUsd": 13575.36,
    "tokenCount": 1
  },
  "verdict": {
    "archetype": "Whale",
    "tagline": "Moves markets by sneezing.",
    "score": 20,
    "stats": []
  }
}
```

**Errors**

| Status | Meaning |
|--------|---------|
| 400 | Missing or invalid Solana address |
| 500 | Server missing RPC key |
| 502 | Upstream RPC failure |

## Verdict Archetypes

| Archetype | Trigger |
|-----------|---------|
| **Ghost Wallet** | Total value under $1 |
| **Whale** | Total value over $100k |
| **All-In Degen** | One token > 60% of bag |
| **Meme Connoisseur** | Meme exposure > 70%, spread out |
| **Diamond Hands** | SOL + stables > 70% |
| **Airdrop Farmer** | 30+ tokens, low meme % |
| **Balanced Trader** | Everything else |

## Deployment

Deployed on Vercel. Set the env var, then deploy:

```bash
vercel env add HELIUS_API_KEY production
vercel --prod
```

## Roadmap

- [ ] Shareable verdict cards (PNG export)
- [ ] Wallet-to-wallet comparison
- [ ] PnL estimation from transaction history
- [ ] `$BAG` token launch + holder-gated premium signals
- [ ] Multi-wallet watchlist

## Contributing

```bash
git checkout -b feature/your-idea
npm run build        # must pass
git commit -m "feat: your idea"
git push -u origin feature/your-idea
# open a PR
```

## License

MIT

<div align="center">

Built solo with Hermes Agent.

</div>
