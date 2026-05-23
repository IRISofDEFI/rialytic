# Rialytic — Build Checklist

Every step is one focused task. Check it off before moving to the next.
Tweet milestones are marked with  — post when you hit those.

---

## Phase 0 — Project Setup

- [ ] Create GitHub repo named `rialytic` (public)
- [ ] Clone repo locally
- [ ] Copy CLAUDE.md, README.md, TODO.md into repo root
- [ ] Open project in VS Code
- [ ] Open Claude Code in terminal (`claude`)

 **Tweet after this phase:**
> Started building Rialytic — a tool that shows builders the real cost of running a protocol on traditional middleware stacks vs @RialoHQ's integrated architecture.
>
> Based on their published compound marginalization research.
>
> Day 1. Let's go. 

---

## Phase 1 — Scaffold

- [x] **Step 1.1** — Ask Claude Code to scaffold the project:
  ```
  Read CLAUDE.md. Create the project scaffold:
  package.json, vite.config.js, tailwind.config.js,
  postcss.config.js, index.html, src/main.jsx, src/App.jsx,
  src/index.css with all CSS variables defined.
  Do not build any pages yet.
  ```
- [x] **Step 1.2** — Run `npm install`
- [x] **Step 1.3** — Run `npm run dev`
- [x] **Step 1.4** — Confirm blank page loads at localhost:5173 with no errors
- [ ] **Step 1.5** — Confirm Tailwind is working (add a test class, check it applies)
- [ ] **Step 1.6** — Commit: `git commit -m "chore: project scaffold"`

---

## Phase 2 — Utility Functions (The Brain)

These are the calculation engines. Build and verify them before touching any UI.

- [ ] **Step 2.1** — Ask Claude Code:
  ```
  Create src/utils/marginCalc.js exactly as specified in CLAUDE.md.
  Include BASE_EXEC_COSTS, MIDDLEWARE_COSTS, volumeScale function,
  calculateMonthlyCosts function, and PROTOCOL_PRESETS.
  ```
- [ ] **Step 2.2** — Ask Claude Code:
  ```
  Create src/utils/sfsCalc.js exactly as specified in CLAUDE.md.
  Include calculateMonthlyCredits, calculateMonthlyCosts,
  getSustainabilityStatus, calculateBreakEvenStake,
  generateProjection, and routingFractionTable functions.
  ```
- [ ] **Step 2.3** — Ask Claude Code:
  ```
  Create src/utils/formatters.js with formatUSD, formatRLO,
  and formatPct helper functions as specified in CLAUDE.md.
  ```
- [ ] **Step 2.4** — Manually test the calc logic in browser console:
  - Open browser devtools
  - Import marginCalc and run a test calculation for a lending protocol on Solana at 10k txns/month
  - Verify the numbers look reasonable
- [ ] **Step 2.5** — Commit: `git commit -m "feat: calculation utilities"`

 **Tweet after this phase:**
> Day 2 of building Rialytic.
>
> Finished the calculation engine. The math behind it comes directly from @RialoHQ's research:
>
> • Oracle: +200% on base gas
> • Keeper: +300% on base gas
> • Indexer: $4,000/month flat (high-throughput chains)
>
> That's before you've touched the actual product.
> The middleware tax is very real.

---

## Phase 3 — Data Files

- [ ] **Step 3.1** — Ask Claude Code:
  ```
  Create src/data/protocols.js — export PROTOCOL_PRESETS
  as a clean data file (import from marginCalc or define standalone).
  ```
- [ ] **Step 3.2** — Ask Claude Code:
  ```
  Create src/data/middleware.js — export MIDDLEWARE_CONFIG:
  an array of middleware options with id, label, icon (emoji),
  description, and color fields for use in UI toggles.
  ```
- [ ] **Step 3.3** — Commit: `git commit -m "feat: data files"`

---

## Phase 4 — App Shell

- [ ] **Step 4.1** — Ask Claude Code:
  ```
  Build src/components/Navbar.jsx as specified in CLAUDE.md.
  Left: "Rialytic" brand text. Center: nav links to /calc and /sfs
  with active state. Right: "Built on Rialo research" badge.
  Use CSS variables for all colors.
  ```
- [ ] **Step 4.2** — Ask Claude Code:
  ```
  Build src/components/Footer.jsx as specified in CLAUDE.md.
  Single line. Attribution to @Iris_of_Defi and Subzero Labs research.
  Links to rialo.io.
  ```
- [ ] **Step 4.3** — Ask Claude Code:
  ```
  Update src/App.jsx with React Router setup.
  Routes: / (Home), /calc (MarginCalc), /sfs (SfSPlanner).
  Include Navbar and Footer on all routes.
  Create placeholder pages for now — just a div with the page name.
  ```
- [ ] **Step 4.4** — Verify navigation works between placeholder pages
- [ ] **Step 4.5** — Ask Claude Code:
  ```
  Build src/pages/Home.jsx as specified in CLAUDE.md.
  Hero section + two tool cards linking to /calc and /sfs.
  Dark theme. Use CSS variables.
  ```
- [ ] **Step 4.6** — Verify Home page looks correct in browser
- [ ] **Step 4.7** — Commit: `git commit -m "feat: app shell, navbar, footer, home page"`

 **Tweet after this phase:**
> Rialytic update — app shell is live.
>
> Two tools coming:
>  Compound Marginalization Calculator
>  Stake-for-Service Sustainability Planner
>
> The first one answers: "what is your protocol actually costing you to run?"
>
> Building this step by step. Next up: the calculator UI.

---

## Phase 5 — Shared Components

- [ ] **Step 5.1** — Ask Claude Code:
  ```
  Build src/components/InputSlider.jsx — a reusable slider component.
  Props: label, min, max, value, onChange, suffix, description.
  Styled with CSS variables. Show current value below slider.
  ```
- [ ] **Step 5.2** — Ask Claude Code:
  ```
  Build src/components/StatCard.jsx — a reusable stat display card.
  Props: label, value, sublabel, color (optional accent color).
  Used for the three big summary numbers.
  ```
- [ ] **Step 5.3** — Commit: `git commit -m "feat: shared input components"`

---

## Phase 6 — Compound Marginalization Calculator

This is the main tool. Build it in pieces.

- [ ] **Step 6.1** — Ask Claude Code:
  ```
  Build src/components/MiddlewareStack.jsx.
  Renders six toggle cards (oracle, keeper, indexer, bridge,
  scheduler, rpc). Each shows: icon, name, estimated monthly cost,
  toggle ON/OFF. Props: chain, volume, activeMiddleware, onToggle.
  Use formatUSD for cost display.
  ```
- [ ] **Step 6.2** — Ask Claude Code:
  ```
  Build src/components/CostComparisonChart.jsx using Recharts.
  Grouped bar chart. Left bar: current stack (stacked by middleware layer,
  each layer a different color as in CLAUDE.md spec).
  Right bar: Rialo execution cost (teal).
  Custom dark-themed tooltip. Responsive container.
  ```
- [ ] **Step 6.3** — Ask Claude Code:
  ```
  Build src/components/ResultSummary.jsx.
  Cost breakdown table (current vs Rialo, row per middleware).
  Three StatCards (current monthly / Rialo monthly / surplus %).
  "What Disappears on Rialo" checklist.
  Research footnote at bottom.
  ```
- [ ] **Step 6.4** — Ask Claude Code:
  ```
  Build src/pages/MarginCalc.jsx.
  Two-column layout (inputs left, results right).
  Left panel: protocol type dropdown (from PROTOCOL_PRESETS),
  chain selector, volume slider, MiddlewareStack component.
  Right panel: CostComparisonChart + ResultSummary.
  Wire all state so results update live on any input change.
  Protocol type selection auto-fills middleware toggles.
  ```
- [ ] **Step 6.5** — Test the calculator thoroughly:
  - Select "Lending Protocol" on Solana — middleware should auto-fill
  - Check numbers look reasonable (total should be much higher than Rialo)
  - Toggle middleware on/off — chart should update live
  - Change chain — costs should change
  - Change volume — costs should scale
- [ ] **Step 6.6** — Commit: `git commit -m "feat: compound marginalization calculator"`

 **Tweet after this phase:**
> The Compound Marginalization Calculator is live locally.
>
> Select your protocol type → it auto-fills your middleware stack →
> shows you the real monthly cost breakdown vs @RialoHQ.
>
> Lending protocol on Solana at 50k txns/month:
> Current stack: ~$14,000/month
> On Rialo: ~$800/month
>
> That difference is why the crypto desert exists.
> [screenshot]

---

## Phase 7 — Stake-for-Service Planner

- [ ] **Step 7.1** — Ask Claude Code:
  ```
  Build src/components/SustainabilityChart.jsx using Recharts.
  Area chart. X-axis: months 1-24. Two area lines:
  Monthly Credits (teal fill) and Monthly Costs (red fill).
  If sustainable: credits area above costs. If not: show crossover point.
  Custom dark tooltip. Responsive container.
  ```
- [ ] **Step 7.2** — Ask Claude Code:
  ```
  Build src/components/RoutingTable.jsx.
  Table showing routing fractions (10%, 20%, 30%... 100%),
  monthly credits at each fraction, whether it covers costs,
  and surplus/shortfall. Highlight the minimum sustainable
  routing fraction in teal.
  ```
- [ ] **Step 7.3** — Ask Claude Code:
  ```
  Build src/components/SustainabilityStatus.jsx.
  The large status indicator card.
  Three states: self-sustaining (green), partial (amber),
  insufficient (red). Shows monthly credits, monthly costs,
  surplus or shortfall, and runway months if not sustainable.
  Dynamic plain-English summary paragraph.
  ```
- [ ] **Step 7.4** — Ask Claude Code:
  ```
  Build src/components/BreakEvenPanel.jsx.
  Three-row table showing minimum stake needed for:
  50% coverage, 100% break-even (highlighted), 100% + 20% buffer.
  Both RLO and USD values.
  ```
- [ ] **Step 7.5** — Ask Claude Code:
  ```
  Build src/pages/SfSPlanner.jsx.
  Two-column layout (inputs left, results right).
  Left: RLO staked input, RLO price input, yield rate slider,
  routing fraction slider (with live credit calculation below it),
  monthly gas cost input (with link to /calc), scheduled ops inputs.
  Right: SustainabilityStatus + SustainabilityChart +
  BreakEvenPanel + RoutingTable.
  Wire all state for live updates.
  ```
- [ ] **Step 7.6** — Test the SfS planner:
  - Default state should show sensible numbers
  - Increase stake — status should eventually flip to "self-sustaining"
  - Adjust routing fraction — table should highlight the minimum green row
  - Increase monthly costs — break-even stake should increase
- [ ] **Step 7.7** — Commit: `git commit -m "feat: stake-for-service planner"`

 **Tweet after this phase:**
> Second tool in Rialytic is done: the SfS Sustainability Planner.
>
> @RialoHQ has a mechanism called Stake-for-Service — staking yield
> gets routed directly to pay for your protocol's gas.
>
> This tool shows you:
> → How much RLO to stake to run your protocol forever
> → The minimum routing fraction to break even
> → A 24-month projection of credits vs costs
>
> Building in public. Getting close to launch.
> [screenshot]

---

## Phase 8 — Polish & Responsive

- [ ] **Step 8.1** — Ask Claude Code:
  ```
  Make both calculator pages fully responsive for mobile (375px).
  Stack columns vertically: inputs on top, results below.
  Reduce padding on mobile. Ensure charts are readable.
  ```
- [ ] **Step 8.2** — Ask Claude Code:
  ```
  Audit all number displays across the app.
  Every monetary value should use formatUSD.
  Every RLO amount should use formatRLO.
  Every percentage should use formatPct.
  No raw numbers displayed anywhere.
  ```
- [ ] **Step 8.3** — Ask Claude Code:
  ```
  Add edge case handling:
  - If no middleware is selected in the calculator, show a
    "Select at least one middleware layer" empty state.
  - If monthly gas cost is 0 in SfS planner, show a helpful prompt.
  - Ensure no NaN or Infinity values appear anywhere.
  - Cap savings percentage display at 99%.
  ```
- [ ] **Step 8.4** — Ask Claude Code:
  ```
  Final design review pass:
  - Confirm all colors use CSS variables (no hardcoded hex in JSX)
  - Confirm font sizes and weights match the spec
  - Confirm card borders, radii, and padding are consistent
  - Confirm navbar active states work correctly
  ```
- [ ] **Step 8.5** — Test on mobile screen size in devtools
- [ ] **Step 8.6** — Commit: `git commit -m "polish: responsive layout, edge cases, formatting"`

---

## Phase 9 — Deploy

- [ ] **Step 9.1** — Run `npm run build` — confirm no build errors
- [ ] **Step 9.2** — Push all commits to GitHub
- [ ] **Step 9.3** — Connect repo to Vercel (vercel.com → Import Project → GitHub)
- [ ] **Step 9.4** — Deploy settings:
  - Framework: Vite
  - Build command: `npm run build`
  - Output directory: `dist`
- [ ] **Step 9.5** — Confirm live URL works
- [ ] **Step 9.6** — Test both tools on the live deployment
- [ ] **Step 9.7** — Update README.md with live URL
- [ ] **Step 9.8** — Final commit: `git commit -m "docs: add live URL to README"`

 **Launch tweet (most important one):**
> Rialytic is live. 
>
> Two tools for builders evaluating @RialoHQ:
>
>  Compound Marginalization Calculator
> See the real monthly cost of your middleware stack vs Rialo's integrated architecture. Based on @SubzeroLabs research.
>
>  SfS Sustainability Planner
> See how much RLO you need to stake to fund your protocol's operations forever from yield alone.
>
> Built this because the research deserves to be interactive, not just a PDF.
>
> → [live link]
>
> [screenshot of both tools]

---

## Phase 10 — After Launch

- [ ] Share in Rialo Discord / developer channels
- [ ] Reply to anyone who engages with context about how the calculations work
- [ ] Write a short article: "How I Built Rialytic and What the Numbers Actually Show"
- [ ] Start planning Build 2 — Self-Sustaining DCA Protocol on DevNet

---

## Notes

- **Never ask Claude Code to "build everything at once."** One step at a time.
- **Always verify in browser before moving to the next step.** If something looks wrong, fix it before building on top of it.
- **Commit after every phase.** If something breaks, you can roll back.
- **When Claude Code asks a clarifying question**, answer it specifically — vague answers produce vague code.
- **If a component looks wrong**, describe exactly what's wrong: "the bar chart bars are too narrow" not "it doesn't look right."