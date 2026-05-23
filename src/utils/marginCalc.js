// USD per month at 10,000 txns/month baseline — Solana is cheap because fees are near-zero
export const BASE_EXEC_COSTS = {
  solana:    8,
  ethereum:  2400,
  arbitrum:  120,
  other_evm: 100,
};

// multiplier applies to baseExec (variable cost); fixed is a flat monthly service fee
export const MIDDLEWARE_COSTS = {
  oracle: {
    multiplier: 2.0, // 200% markup on base gas per Subzero Labs research
    fixed: { solana: 800, ethereum: 1200, arbitrum: 600, other_evm: 500 },
  },
  keeper: {
    multiplier: 3.0, // 300% markup — automation bots are the most expensive layer
    fixed: { solana: 1200, ethereum: 1500, arbitrum: 700, other_evm: 600 },
  },
  indexer: {
    multiplier: 0, // indexers charge flat SaaS rates regardless of tx volume
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
    multiplier: 0, // private RPC is also flat-rate; volume discount kicks in at enterprise tier
    fixed: { solana: 600, ethereum: 500, arbitrum: 300, other_evm: 250 },
  },
};

// sub-linear scale: 30% of cost is fixed overhead, 70% is truly variable
export function volumeScale(baseCost, volumePerMonth) {
  const baseline = 10000;
  const ratio = volumePerMonth / baseline;
  return baseCost * (0.3 + 0.7 * ratio);
}

export function calculateMonthlyCosts(chain, volumePerMonth, activeMiddleware) {
  const baseExec = volumeScale(BASE_EXEC_COSTS[chain] || 100, volumePerMonth);
  const middlewareBreakdown = {};
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
  // Rialo charges 1.15x base execution — the integrated stack replaces all middleware
  const rialoExecCost = baseExec * 1.15;
  const savings = totalCurrentCost - rialoExecCost;
  // cap at 99 so the UI never shows "100% savings" which would look like a rounding error
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
  lending: { label: 'Lending Protocol',       defaultMiddleware: ['oracle', 'keeper', 'indexer'] },
  dex:     { label: 'DEX / AMM',              defaultMiddleware: ['oracle', 'indexer'] },
  perps:   { label: 'Perpetuals Exchange',    defaultMiddleware: ['oracle', 'keeper', 'indexer', 'scheduler'] },
  vault:   { label: 'Yield Vault',            defaultMiddleware: ['keeper', 'scheduler'] },
  rwa:     { label: 'RWA Protocol',           defaultMiddleware: ['oracle', 'keeper', 'indexer', 'bridge'] },
  custom:  { label: 'Custom Protocol',        defaultMiddleware: [] },
};
