# Rialytic

**Two tools for builders evaluating Rialo.**

Rialytic helps blockchain developers understand the real economics of building on Rialo versus traditional multi-middleware stacks. Built on Subzero Labs' published compound marginalization research.

---

## Tools

### 1. Compound Marginalization Calculator
Input your current protocol stack — oracle, keeper, indexer, bridge, scheduler. See your real monthly operational cost broken down by middleware layer. Compare it side-by-side against what the same protocol costs on Rialo's integrated stack.

### 2. Stake-for-Service Sustainability Planner
Input your RLO staking position, yield rate, and routing fraction. See whether your protocol can fund itself indefinitely from staking yield alone — and what the minimum staking amount is to reach self-sustainability.

---

## Background

Most serious onchain protocols don't just pay the base chain for execution. They pay a stack of middleware providers — oracle, keeper, indexer, bridge — each pricing independently, each optimizing for their own margins.

Subzero Labs (Rialo's core dev team) published research naming this **compound marginalization**: when multiple monopolistic middlemen sit in the same supply chain, the combined cost can erase up to 90% of total economic surplus for certain operations.

Rialytic makes that research interactive. Enter your stack. See the numbers.

---

## Tech Stack

- Vite + React 18
- React Router v6
- Tailwind CSS
- Recharts

---

## Running Locally

```bash
git clone https://github.com/[your-handle]/rialytic
cd rialytic
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Data Sources

Cost estimates are based on:
- [Subzero Labs compound marginalization research](https://rialo.io/posts)
- [Rialo Foundations I: Double Marginalization in Crypto](https://rialo.io/posts)
- [Supermodularity and System Welfare](https://rialo.io/posts)
- [Stake-for-Service documentation](https://rialo.io/posts)

Individual middleware costs are estimates based on public pricing from Chainlink, Gelato, The Graph, LayerZero, and Alchemy. Actual costs vary by usage, chain, and provider tier.

---

## Built By

[@Iris_of_Defi](https://x.com/Iris_of_Defi) — blockchain developer and DeFi analyst building at the intersection of decentralized tech, law, and finance.

---

## Disclaimer

This tool is for informational and planning purposes only. Not financial advice. Cost estimates are illustrative based on published research and public pricing.