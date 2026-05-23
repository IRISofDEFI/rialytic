# Rialytic — CLAUDE.md

## What We Are Building

A polished, two-tool web application called **Rialytic**. It gives blockchain developers two things Rialo's own learn site currently doesn't have:

1. **Compound Marginalization Calculator** — shows a builder the real monthly cost of running their current protocol stack (oracle + keeper + indexer + bridge) versus what the same protocol costs on Rialo's integrated stack. Built on Rialo's own published research data.

2. **Stake-for-Service Sustainability Planner** — shows a builder how much RLO they need to stake (and at what routing fraction) to fund their protocol's gas costs indefinitely from staking yield alone.

This is a **pure frontend app**. No backend. No API calls. All calculations happen in the browser.

---

## Tech Stack

- **Vite** — build tool
- **React 18** — UI framework
- **React Router v6** — routing between the two tools
- **Tailwind CSS** — styling
- **Recharts** — charts (BarChart, AreaChart)
- **No other dependencies**

---

## Design System

Match Rialo's aesthetic from their learn site (learn.rialo.io). Dark, technical, clean.

```css
:root {
  --bg:        #0a0c10;
  --bg2:       #111318;
  --bg3:       #181c24;
  --border:    rgba(255,255,255,0.07);
  --border2:   rgba(255,255,255,0.12);
  --text:      #e8e8e0;
  --text2:     #9a9890;
  --text3:     #5a5855;
  --teal:      #2dd4bf;
  --teal-dim:  rgba(45,212,191,0.12);
  --teal-border: rgba(45,212,191,0.25);
  --red:       #f87171;
  --red-dim:   rgba(248,113,113,0.12);
  --green:     #4ade80;
  --green-dim: rgba(74,222,128,0.12);
  --amber:     #fbbf24;
  --amber-dim: rgba(251,191,36,0.12);
  --purple:    #a78bfa;
  --blue:      #60a5fa;
  --orange:    #fb923c;
  --gray:      #94a3b8;
}
```

**Typography:**
- Font: `system-ui, -apple-system, sans-serif`
- Headings: font-weight 600, letter-spacing -0.02em
- Body: 14-15px, line-height 1.65
- Labels: 11px, uppercase, letter-spacing 0.07em, color var(--text3)

**Component rules:**
- Cards: `background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 24px`
- Inputs: `background: var(--bg3); border: 1px solid var(--border2); border-radius: 8px; padding: 10px 14px; color: var(--text); font-size: 14px`
- Primary button: `background: var(--teal); color: #0a0c10; font-weight: 600; border-radius: 8px; padding: 10px 20px`
- Secondary button: `background: transparent; border: 1px solid var(--border2); color: var(--text2); border-radius: 8px`
- **No box shadows. No gradients. Transitions: 0.15s ease only.**

---

## File Structure

```
rialytic/
├── CLAUDE.md
├── README.md
├── TODO.md
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── pages/
    │   ├── Home.jsx
    │   ├── MarginCalc.jsx
    │   └── SfSPlanner.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── InputSlider.jsx
    │   ├── StatCard.jsx
    │   ├── MiddlewareStack.jsx
    │   ├── CostComparisonChart.jsx
    │   ├── ResultSummary.jsx
    │   ├── SustainabilityChart.jsx
    │   ├── SustainabilityStatus.jsx
    │   ├── BreakEvenPanel.jsx
    │   └── RoutingTable.jsx
    ├── data/
    │   ├── protocols.js
    │   └── middleware.js
    └── utils/
        ├── marginCalc.js
        ├── sfsCalc.js
        └── formatters.js
```

---

## Routing (App.jsx)

```
/        → Home.jsx
/calc    → MarginCalc.jsx
/sfs     → SfSPlanner.jsx
```

Navbar and Footer render on all routes.

---

## Page: Home (/)

Hero section:
- Title: "Rialytic"
- Subtitle: "Two tools for builders evaluating Rialo. Built on Subzero Labs' published research."

Two cards in a row (stack on mobile):

**Card 1 — Compound Marginalization Calculator**
- Icon: 📊
- Title: "Margin Calculator"
- Description: "See what your middleware stack is actually costing you — and what disappears on Rialo."
- Button: "Open Calculator →" → links to /calc

**Card 2 — SfS Sustainability Planner**
- Icon: 💰
- Title: "SfS Planner"
- Description: "Calculate how much RLO you need to stake to fund your protocol's operations from yield alone."
- Button: "Open Planner →" → links to /sfs

Small footnote below both cards:
"Data sourced from Subzero Labs compound marginalization research."

---

## Page: Compound Marginalization Calculator (/calc)

### Layout
Two columns on desktop (min-width: 768px). Stack vertically on mobile.
Left column: inputs. Right column: results (live-update on any input change).

---

### LEFT PANEL

**Section: Your Protocol**

```
Label: "PROTOCOL TYPE"
<select> with options:
  lending  → "Lending Protocol (Aave, Compound)"
  dex      → "DEX / AMM (Uniswap, Curve)"
  perps    → "Perpetuals Exchange (dYdX, GMX)"
  vault    → "Yield Vault (Yearn, Beefy)"
  rwa      → "RWA Protocol (Ondo, Centrifuge)"
  custom   → "Custom (choose your own)"

Label: "CURRENT CHAIN"
<select> with options:
  solana        → "Solana"
  ethereum      → "Ethereum Mainnet"
  arbitrum      → "Arbitrum / Optimism"
  other_evm     → "Other EVM L2"

Label: "MONTHLY TRANSACTION VOLUME"
InputSlider: min=100, max=500000, default=10000, step=100
Suffix: "txns/month"
```

**Section: Middleware Stack**

Label: "YOUR ACTIVE MIDDLEWARE"
Subtitle (small): "Toggle the services your protocol currently uses"

`<MiddlewareStack>` component — six toggle cards.

---

### RIGHT PANEL

1. `<CostComparisonChart>` — grouped bar chart
2. `<ResultSummary>` — table + stat cards + checklist

---

### MiddlewareStack Component

Six toggle cards in a 2-column grid.

Each card:
```
[icon] [name]              [toggle]
[estimated monthly cost]
```

The six middleware items:
```javascript
{ id: "oracle",    icon: "⛓️",  label: "Price Oracle",       color: "var(--red)" }
{ id: "keeper",    icon: "🤖",  label: "Automation Keeper",   color: "var(--amber)" }
{ id: "indexer",   icon: "📑",  label: "Data Indexer",        color: "var(--purple)" }
{ id: "bridge",    icon: "🌉",  label: "Cross-Chain Bridge",  color: "var(--blue)" }
{ id: "scheduler", icon: "⏰",  label: "Scheduler",           color: "var(--orange)" }
{ id: "rpc",       icon: "🔌",  label: "Private RPC",         color: "var(--gray)" }
```

Estimated cost displayed per card: use `calculateMonthlyCosts` from marginCalc.js and show the individual middleware cost using `formatUSD`.

When protocol type changes → auto-update which toggles are ON.

---

### CostComparisonChart Component

Recharts `<BarChart>` with `<ResponsiveContainer width="100%" height={280}>`.

Two bars per chart (side by side):
- Bar 1: "Your Stack" — stacked bar, each segment is one middleware layer
- Bar 2: "On Rialo" — single teal bar (execution cost only)

Colors per segment:
```javascript
oracle:    "#f87171"   // red
keeper:    "#fbbf24"   // amber
indexer:   "#a78bfa"   // purple
bridge:    "#60a5fa"   // blue
scheduler: "#fb923c"   // orange
rpc:       "#94a3b8"   // gray
execution: "#4ade80"   // green (base exec on current chain)
rialo:     "#2dd4bf"   // teal (rialo execution)
```

Custom tooltip:
- Background: var(--bg3)
- Border: 1px solid var(--border2)
- Show each layer name + cost in formatUSD

X-axis: ["Your Stack", "On Rialo"]
Y-axis: USD, formatted with formatUSD

---

### ResultSummary Component

**Part 1: Cost Breakdown Table**

```
Service              Your Stack      On Rialo
────────────────────────────────────────────
Price Oracle         $X,XXX/mo      Included ✓
Automation Keeper    $X,XXX/mo      Included ✓
Data Indexer         $X,XXX/mo      Included ✓
Cross-Chain Bridge   $X,XXX/mo      Included ✓
Scheduler            $X,XXX/mo      Included ✓
Private RPC          $X,XXX/mo      Included ✓
Base Execution       $XXX/mo        $XXX/mo
────────────────────────────────────────────
TOTAL                $XX,XXX/mo     $X,XXX/mo
```

"Included ✓" rows: color var(--teal), font-weight 500.
Only show rows for active middleware.

**Part 2: Three StatCards in a row**

```
Current Monthly     On Rialo Monthly     Surplus Reclaimed
$XX,XXX             $X,XXX               XX%
```

Surplus color:
- > 70% → var(--green)
- 40–70% → var(--amber)
- < 40% → var(--red)

**Part 3: What Disappears on Rialo**

Only show items for active middleware:
```
✓ No more oracle subscription fees
✓ No more keeper/bot maintenance
✓ No more indexer monthly bills
✓ No more bridge overhead
✓ No more scheduler costs
✓ Single unified fee. One system.
```

Style: teal checkmark, text color var(--text2).

**Part 4: Research footnote**
```
<p style="font-size: 11px; color: var(--text3); margin-top: 20px">
  Cost estimates based on Subzero Labs compound marginalization research.
  Oracle costs assume 200% markup on base gas. Automation assumes 300% markup.
  Indexer costs: $4,000/month baseline (high-throughput), $1,500/month (EVM L2).
  Actual costs vary by usage, provider, and tier.
</p>
```

---

## Page: SfS Sustainability Planner (/sfs)

### Layout
Two columns desktop. Single column mobile.
Left: inputs. Right: live results.

---

### LEFT PANEL

```
Label: "RLO STAKED"
<input type="number"> min=1000, default=100000
Suffix: "RLO"

Label: "RLO PRICE (USD)"
<input type="number"> min=0.01, default=1.00, step=0.01
Small note: "(illustrative — adjust to current price)"

Label: "ANNUAL STAKING YIELD"
InputSlider: min=4, max=20, default=8, step=0.5
Suffix: "%"
Below: "Typical PoS range: 6–12%"

Label: "ROUTING FRACTION"
InputSlider: min=1, max=100, default=30, step=1
Suffix: "%"
Below (live): "→ $[X]/month in service credits"
Color the live value: teal if sustainable, amber if not

Label: "MONTHLY GAS COST (USD)"
<input type="number"> min=0, default=500
Below: small link → "Not sure? Use the Margin Calculator →" (routes to /calc)

Label: "SCHEDULED OPS / DAY"
<input type="number"> min=0, default=100

Label: "COST PER OP (USD)"
<input type="number"> min=0.001, default=0.05, step=0.001
```

---

### RIGHT PANEL

**1. SustainabilityStatus card** — large status indicator

If `isSustainable`:
```
🟢  SELF-SUSTAINING
    Monthly credits:    $XXX
    Monthly costs:      $XXX
    Monthly surplus:    +$XXX
    [dynamic summary paragraph]
```

If not:
```
🟡  PARTIALLY FUNDED      (if coverageRatio >= 0.7)
🔴  INSUFFICIENT FUNDING  (if coverageRatio < 0.7)
    Monthly credits:    $XXX
    Monthly costs:      $XXX
    Monthly shortfall:  -$XXX
    Runway:             X months
    [dynamic summary paragraph]
```

Dynamic summary examples:
- Sustainable: "With [X RLO] staked at [Y%] yield, routing [Z%] to SfS generates $[credits]/month. Your $[costs]/month in operations are fully covered with $[surplus]/month surplus."
- Not sustainable: "You need [X more RLO] staked, or increase routing from [Z%] to [W%] to reach self-sustainability."

**2. SustainabilityChart** — Recharts AreaChart

```
X: months 1–24
Y: USD

Two areas:
- "Monthly Credits" → fill: rgba(45,212,191,0.15), stroke: var(--teal)
- "Monthly Costs"   → fill: rgba(248,113,113,0.15), stroke: var(--red)
```

If sustainable: teal area above red area.
If not: show where they cross with a small annotation.
Custom dark tooltip.

**3. BreakEvenPanel** — table

```
Scenario               RLO Required       USD Value
──────────────────────────────────────────────────
Cover 50% of costs     XX,XXX RLO        ~$XX,XXX
Break-even (100%)      XX,XXX RLO        ~$XX,XXX  ← highlight teal
100% + 20% buffer      XX,XXX RLO        ~$XX,XXX
```

**4. RoutingTable** — sensitivity table

```
Routing %   Monthly Credits   Covers Costs?   Surplus/Shortfall
─────────────────────────────────────────────────────────────
10%         $XXX             ✗               -$XXX
20%         $XXX             ✗               -$XXX
30%         $XXX             ✓               +$XXX   ← highlight (current)
50%         $XXX             ✓               +$XXX
75%         $XXX             ✓               +$XXX
100%        $XXX             ✓               +$XXX
```

First row where `isSustainable` = true → highlight with teal background tint.
Current routing fraction row → highlight with teal border.

---

## Utility Functions

### src/utils/marginCalc.js

```javascript
export const BASE_EXEC_COSTS = {
  solana:    8,
  ethereum:  2400,
  arbitrum:  120,
  other_evm: 100,
};
// Units: USD per month at 10,000 txns/month baseline

export const MIDDLEWARE_COSTS = {
  oracle: {
    multiplier: 2.0,
    fixed: { solana: 800, ethereum: 1200, arbitrum: 600, other_evm: 500 },
  },
  keeper: {
    multiplier: 3.0,
    fixed: { solana: 1200, ethereum: 1500, arbitrum: 700, other_evm: 600 },
  },
  indexer: {
    multiplier: 0,
    fixed: { solana: 4000, ethereum: 2000, arbitrum: 1500, other_evm: 1200 },
  },
  bridge: {
    multiplier: 0.5,
    fixed: { solana: 400, ethereum: 800, arbitrum: 300, other_evm: 250 },
  },
  scheduler: {
    multiplier: 1.0,
    fixed: { solana: 300, ethereum: 400, arbitrum: 200, other_evm: 180 },
  },
  rpc: {
    multiplier: 0,
    fixed: { solana: 600, ethereum: 500, arbitrum: 300, other_evm: 250 },
  },
};

export function volumeScale(baseCost, volumePerMonth) {
  const baseline = 10000;
  const ratio = volumePerMonth / baseline;
  return baseCost * (0.3 + 0.7 * ratio);
}

export function calculateMonthlyCosts(chain, volumePerMonth, activeMiddleware) {
  const baseExec = volumeScale(BASE_EXEC_COSTS[chain] || 100, volumePerMonth);
  let middlewareBreakdown = {};
  let totalMiddlewareCost = 0;

  activeMiddleware.forEach(mw => {
    const config = MIDDLEWARE_COSTS[mw];
    if (!config) return;
    const variableCost = baseExec * config.multiplier;
    const fixedCost = config.fixed[chain] || 0;
    const total = variableCost + fixedCost;
    middlewareBreakdown[mw] = { variable: variableCost, fixed: fixedCost, total };
    totalMiddlewareCost += total;
  });

  const totalCurrentCost = baseExec + totalMiddlewareCost;
  const rialoExecCost = baseExec * 1.15;
  const savings = totalCurrentCost - rialoExecCost;
  const savingsPercent = Math.min(((savings / totalCurrentCost) * 100), 99);

  return {
    baseExecCost: baseExec,
    middlewareBreakdown,
    totalMiddlewareCost,
    totalCurrentCost,
    rialoExecCost,
    savings,
    savingsPercent,
  };
}

export const PROTOCOL_PRESETS = {
  lending:  { label: "Lending Protocol",         defaultMiddleware: ["oracle","keeper","indexer"] },
  dex:      { label: "DEX / AMM",                defaultMiddleware: ["oracle","indexer"] },
  perps:    { label: "Perpetuals Exchange",       defaultMiddleware: ["oracle","keeper","indexer","scheduler"] },
  vault:    { label: "Yield Vault",               defaultMiddleware: ["keeper","scheduler"] },
  rwa:      { label: "RWA Protocol",              defaultMiddleware: ["oracle","keeper","indexer","bridge"] },
  custom:   { label: "Custom Protocol",           defaultMiddleware: [] },
};
```

---

### src/utils/sfsCalc.js

```javascript
export function calculateMonthlyCredits(rloStaked, annualYieldPct, routingFractionPct, rloPrice) {
  const annualYieldRLO = rloStaked * (annualYieldPct / 100);
  const routedAnnualRLO = annualYieldRLO * (routingFractionPct / 100);
  const monthlyCreditsRLO = routedAnnualRLO / 12;
  const monthlyCreditsUSD = monthlyCreditsRLO * rloPrice;
  return { annualYieldRLO, routedAnnualRLO, monthlyCreditsRLO, monthlyCreditsUSD };
}

export function calculateTotalMonthlyCost(baseGasCost, scheduledOpsPerDay, costPerOp) {
  const schedulerMonthlyCost = scheduledOpsPerDay * costPerOp * 30;
  return { baseGasCost, schedulerMonthlyCost, total: baseGasCost + schedulerMonthlyCost };
}

export function getSustainabilityStatus(monthlyCreditsUSD, totalMonthlyCostUSD) {
  const coverageRatio = totalMonthlyCostUSD > 0
    ? monthlyCreditsUSD / totalMonthlyCostUSD
    : Infinity;
  const monthlySurplus = monthlyCreditsUSD - totalMonthlyCostUSD;
  const runwayMonths = monthlySurplus < 0
    ? Math.max(0, Math.floor(monthlyCreditsUSD / Math.abs(monthlySurplus)))
    : Infinity;
  return {
    isSustainable: coverageRatio >= 1.0,
    coverageRatio,
    monthlySurplus,
    runwayMonths,
    status: coverageRatio >= 1.2 ? "excellent"
          : coverageRatio >= 1.0 ? "sustainable"
          : coverageRatio >= 0.7 ? "partial"
          : "insufficient",
  };
}

export function calculateBreakEvenStake(totalMonthlyCostUSD, annualYieldPct, routingFractionPct, rloPrice) {
  const creditsPerRLOPerMonth = (annualYieldPct / 100) * (routingFractionPct / 100) * rloPrice / 12;
  if (creditsPerRLOPerMonth <= 0) return { breakEvenRLO: Infinity, breakEvenUSD: Infinity };
  const breakEvenRLO = Math.ceil(totalMonthlyCostUSD / creditsPerRLOPerMonth);
  return {
    half:   Math.ceil(breakEvenRLO * 0.5),
    halfUSD: Math.ceil(breakEvenRLO * 0.5 * rloPrice),
    full:   breakEvenRLO,
    fullUSD: Math.ceil(breakEvenRLO * rloPrice),
    buffer: Math.ceil(breakEvenRLO * 1.2),
    bufferUSD: Math.ceil(breakEvenRLO * 1.2 * rloPrice),
  };
}

export function generateProjection(monthlyCreditsUSD, totalMonthlyCostUSD) {
  return Array.from({ length: 24 }, (_, i) => ({
    month: i + 1,
    credits: parseFloat(monthlyCreditsUSD.toFixed(2)),
    costs: parseFloat(totalMonthlyCostUSD.toFixed(2)),
  }));
}

export function routingFractionTable(rloStaked, annualYieldPct, totalMonthlyCostUSD, rloPrice) {
  return [10, 20, 30, 40, 50, 60, 75, 100].map(fraction => {
    const { monthlyCreditsUSD } = calculateMonthlyCredits(rloStaked, annualYieldPct, fraction, rloPrice);
    return {
      fraction,
      monthlyCreditsUSD,
      isSustainable: monthlyCreditsUSD >= totalMonthlyCostUSD,
      surplus: monthlyCreditsUSD - totalMonthlyCostUSD,
    };
  });
}
```

---

### src/utils/formatters.js

```javascript
export const formatUSD = (amount) => {
  if (!amount || isNaN(amount)) return "$0";
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000)    return `$${(amount / 1000).toFixed(1)}K`;
  return `$${Math.round(amount).toLocaleString()}`;
};

export const formatRLO = (amount) => {
  if (!amount || isNaN(amount) || !isFinite(amount)) return "—";
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)}M RLO`;
  if (amount >= 1000)    return `${Math.round(amount / 1000)}K RLO`;
  return `${Math.round(amount).toLocaleString()} RLO`;
};

export const formatPct = (pct) => {
  if (!pct || isNaN(pct)) return "0%";
  return `${Math.min(pct, 99).toFixed(1)}%`;
};
```

---

## Navbar

```
Left:   "Rialytic" (white, font-weight 600, 18px)
Center: Nav links → "Margin Calculator" (/calc) | "SfS Planner" (/sfs)
        Active state: border-bottom: 2px solid var(--teal); color: var(--text)
        Inactive: color: var(--text2)
Right:  Badge: "Built on Rialo research"
        Style: background var(--teal-dim); color var(--teal);
               border: 1px solid var(--teal-border);
               border-radius: 20px; padding: 4px 10px; font-size: 11px
```

Background: var(--bg2). Border-bottom: 1px solid var(--border). Height: 56px. Sticky top.

---

## Footer

Single line, centered:
"Built by @Iris_of_Defi · Data from Subzero Labs research · Not financial advice"

Links: rialo.io | blog

Style: background var(--bg2), border-top 1px solid var(--border), padding 16px, font-size 12px, color var(--text3).

---

## Quality Checklist

- [ ] All colors use CSS variables — no hardcoded hex in JSX
- [ ] All monetary values use formatUSD
- [ ] All RLO amounts use formatRLO
- [ ] All percentages use formatPct
- [ ] No NaN, Infinity, or undefined values displayed anywhere
- [ ] Protocol preset auto-fills middleware toggles correctly
- [ ] Results update live on every input change (no Calculate button)
- [ ] Charts render with custom dark tooltips
- [ ] Mobile layout works at 375px (columns stack, charts readable)
- [ ] Both nav links have correct active states
- [ ] Footer has @Iris_of_Defi attribution
- [ ] Research footnote present on MarginCalc page
- [ ] SfS planner links to /calc under monthly gas cost input
- [ ] Build runs without errors (`npm run build`)~