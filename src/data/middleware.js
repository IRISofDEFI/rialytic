export const MIDDLEWARE_CONFIG = [
  {
    id:          'oracle',
    label:       'Price Oracle',
    description: 'On-chain price feeds for assets; typically sourced from Chainlink, Pyth, or custom aggregators.',
    color:       'var(--red)',
  },
  {
    id:          'keeper',
    label:       'Automation Keeper',
    description: 'Off-chain bots that trigger on-chain actions — liquidations, rebalances, vault harvests.',
    color:       'var(--amber)',
  },
  {
    id:          'indexer',
    label:       'Data Indexer',
    description: 'Indexed event history for queries and dashboards; typically The Graph or a self-hosted subgraph.',
    color:       'var(--purple)',
  },
  {
    id:          'bridge',
    label:       'Cross-Chain Bridge',
    description: 'Token and message passing between chains; adds latency, fee overhead, and security surface.',
    color:       'var(--blue)',
  },
  {
    id:          'scheduler',
    label:       'Scheduler',
    description: 'Time-based transaction dispatch — epoch rollovers, periodic fee sweeps, cron-style protocol ops.',
    color:       'var(--orange)',
  },
  {
    id:          'rpc',
    label:       'Private RPC',
    description: 'Dedicated RPC endpoints for reliable read/write access; avoids public rate limits and MEV exposure.',
    color:       'var(--gray)',
  },
];
