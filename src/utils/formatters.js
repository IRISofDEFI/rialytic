export const formatUSD = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  if (!isFinite(amount)) return '$0';
  const sign = amount < 0 ? '-' : '';
  const abs  = Math.abs(amount);
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)    return `${sign}$${(abs / 1_000).toFixed(1)}K`;
  return `${sign}$${Math.round(abs).toLocaleString()}`;
};

export const formatRLO = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  if (!isFinite(amount)) return '—'; // Infinity means "not calculable" — show dash, not a number
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M RLO`;
  if (amount >= 1_000)    return `${Math.round(amount / 1_000)}K RLO`;
  return `${Math.round(amount).toLocaleString()} RLO`;
};

export const formatPct = (pct) => {
  if (pct === null || pct === undefined || isNaN(pct)) return '0%';
  // cap at 99 so the UI never implies a cost is literally zero
  return `${Math.min(pct, 99).toFixed(1)}%`;
};
