// Converts staked RLO + yield + routing fraction into a monthly USD credit amount
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
  // guard against zero-cost protocols — treat as infinitely funded
  const coverageRatio = totalMonthlyCostUSD > 0
    ? monthlyCreditsUSD / totalMonthlyCostUSD
    : Infinity;

  const monthlySurplus = monthlyCreditsUSD - totalMonthlyCostUSD;

  // runway: how many months credits cover costs if shortfall is constant
  const runwayMonths = monthlySurplus < 0
    ? Math.max(0, Math.floor(monthlyCreditsUSD / Math.abs(monthlySurplus)))
    : Infinity;

  return {
    isSustainable: coverageRatio >= 1.0,
    coverageRatio,
    monthlySurplus,
    runwayMonths,
    status: coverageRatio >= 1.2 ? 'excellent'
          : coverageRatio >= 1.0 ? 'sustainable'
          : coverageRatio >= 0.7 ? 'partial'
          : 'insufficient',
  };
}

// Answers: "how many RLO do I need to stake to hit a given coverage threshold?"
export function calculateBreakEvenStake(totalMonthlyCostUSD, annualYieldPct, routingFractionPct, rloPrice) {
  const creditsPerRLOPerMonth = (annualYieldPct / 100) * (routingFractionPct / 100) * rloPrice / 12;
  if (creditsPerRLOPerMonth <= 0) return { half: Infinity, halfUSD: Infinity, full: Infinity, fullUSD: Infinity, buffer: Infinity, bufferUSD: Infinity };

  const breakEvenRLO = Math.ceil(totalMonthlyCostUSD / creditsPerRLOPerMonth);
  return {
    half:      Math.ceil(breakEvenRLO * 0.5),
    halfUSD:   Math.ceil(breakEvenRLO * 0.5 * rloPrice),
    full:      breakEvenRLO,
    fullUSD:   Math.ceil(breakEvenRLO * rloPrice),
    buffer:    Math.ceil(breakEvenRLO * 1.2),
    bufferUSD: Math.ceil(breakEvenRLO * 1.2 * rloPrice),
  };
}

// Projects monthly credits vs costs across a 24-month window (both are flat — no compounding)
export function generateProjection(monthlyCreditsUSD, totalMonthlyCostUSD) {
  return Array.from({ length: 24 }, (_, i) => ({
    month:   i + 1,
    credits: parseFloat(monthlyCreditsUSD.toFixed(2)),
    costs:   parseFloat(totalMonthlyCostUSD.toFixed(2)),
  }));
}

// Sensitivity table: shows how credits and sustainability change across routing fractions
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
