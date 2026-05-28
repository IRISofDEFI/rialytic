import { getSustainabilityStatus } from '../utils/sfsCalc.js'
import { formatUSD, formatRLO, formatPct } from '../utils/formatters.js'

const STATUS_META = {
  excellent:    { label: 'SELF-SUSTAINING',     color: 'var(--green)' },
  sustainable:  { label: 'SELF-SUSTAINING',     color: 'var(--green)' },
  partial:      { label: 'PARTIALLY FUNDED',    color: 'var(--amber)' },
  insufficient: { label: 'INSUFFICIENT FUNDING', color: 'var(--red)'  },
}

function StatRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', fontSize: '13px', padding: '4px 0' }}>
      <span style={{ color: 'var(--text3)' }}>{label}</span>
      <span style={{ color: valueColor || 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

function buildSummary({ isSustainable, rloStaked, annualYieldPct, routingFractionPct, rloPrice, monthlyCreditsUSD, totalMonthlyCostUSD, monthlySurplus }) {
  if (isSustainable) {
    return `With ${formatRLO(rloStaked)} staked at ${annualYieldPct}% yield, routing ${routingFractionPct}% to SfS generates ${formatUSD(monthlyCreditsUSD)}/month. Your ${formatUSD(totalMonthlyCostUSD)}/month in operations are fully covered with ${formatUSD(monthlySurplus)}/month surplus.`
  }

  // needed routing: solve monthlyCredits = totalCost for routingFractionPct
  const annualYieldUSD = rloStaked * (annualYieldPct / 100) * rloPrice
  const neededRouting = annualYieldUSD > 0
    ? Math.min(100, Math.ceil((totalMonthlyCostUSD * 12 / annualYieldUSD) * 100))
    : null

  // needed additional stake at current routing fraction
  const creditsPerRLOPerMonth = (annualYieldPct / 100) * (routingFractionPct / 100) * rloPrice / 12
  const neededStake = creditsPerRLOPerMonth > 0
    ? Math.ceil(totalMonthlyCostUSD / creditsPerRLOPerMonth)
    : null
  const additionalStake = neededStake !== null ? Math.max(0, neededStake - rloStaked) : null

  if (neededRouting !== null && neededRouting <= 100 && additionalStake !== null) {
    return `You need ${formatRLO(additionalStake)} more staked, or increase routing from ${routingFractionPct}% to ${neededRouting}% to reach self-sustainability.`
  }
  if (additionalStake !== null) {
    return `At ${routingFractionPct}% routing, you need ${formatRLO(additionalStake)} more RLO staked to cover ${formatUSD(totalMonthlyCostUSD)}/month in costs.`
  }
  return `Increase your stake or routing fraction to reach self-sustainability.`
}

export default function SustainabilityStatus({
  monthlyCreditsUSD,
  totalMonthlyCostUSD,
  rloStaked,
  annualYieldPct,
  routingFractionPct,
  rloPrice,
}) {
  const { isSustainable, status, monthlySurplus, runwayMonths } = getSustainabilityStatus(monthlyCreditsUSD, totalMonthlyCostUSD)
  const meta    = STATUS_META[status] || STATUS_META.insufficient
  const summary = buildSummary({ isSustainable, rloStaked, annualYieldPct, routingFractionPct, rloPrice, monthlyCreditsUSD, totalMonthlyCostUSD, monthlySurplus })

  return (
    <div style={{
      background:   'var(--bg2)',
      border:       '1px solid var(--border)',
      borderLeft:   `3px solid ${meta.color}`,
      borderRadius: '12px',
      padding:      '20px 24px',
      display:      'flex',
      flexDirection: 'column',
      gap:          '16px',
    }}>

      <span style={{
        fontSize:      '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color:         meta.color,
        fontWeight:    600,
      }}>
        {meta.label}
      </span>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
        <StatRow label="Monthly credits" value={formatUSD(monthlyCreditsUSD)} />
        <StatRow label="Monthly costs"   value={formatUSD(totalMonthlyCostUSD)} />
        <StatRow
          label={monthlySurplus >= 0 ? 'Monthly surplus' : 'Monthly shortfall'}
          value={(monthlySurplus >= 0 ? '+' : '') + formatUSD(monthlySurplus)}
          valueColor={monthlySurplus >= 0 ? 'var(--green)' : 'var(--red)'}
        />
        {/* only show runway when the protocol has a finite expiry */}
        {!isSustainable && isFinite(runwayMonths) && (
          <StatRow label="Runway" value={`${runwayMonths} month${runwayMonths !== 1 ? 's' : ''}`} valueColor="var(--amber)" />
        )}
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.65, margin: 0 }}>
        {summary}
      </p>

    </div>
  )
}
