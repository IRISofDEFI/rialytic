import StatCard from './StatCard.jsx'
import { formatUSD, formatPct } from '../utils/formatters.js'
import { MIDDLEWARE_CONFIG } from '../data/middleware.js'

const MW_LABEL = Object.fromEntries(MIDDLEWARE_CONFIG.map(m => [m.id, m.label]))

const DISAPPEARS = {
  oracle:    'No more oracle subscription fees',
  keeper:    'No more keeper/bot maintenance',
  indexer:   'No more indexer monthly bills',
  bridge:    'No more bridge overhead',
  scheduler: 'No more scheduler costs',
  rpc:       'No more private RPC bills',
}

function surplusColor(pct) {
  if (pct > 70)  return 'var(--green)'
  if (pct >= 40) return 'var(--amber)'
  return 'var(--red)'
}

const th = {
  fontSize:      '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color:         'var(--text3)',
  fontWeight:    400,
  padding:       '0 0 10px 0',
  textAlign:     'left',
}

const td = (align = 'left') => ({
  fontSize:   '13px',
  color:      'var(--text2)',
  padding:    '7px 0',
  textAlign:  align,
  borderTop:  '1px solid var(--border)',
})

export default function ResultSummary({ results, activeMiddleware }) {
  const {
    baseExecCost,
    middlewareBreakdown,
    totalCurrentCost,
    rialoExecCost,
    savingsPercent,
  } = results

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* 1. Cost breakdown table */}
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>Service</th>
              <th style={{ ...th, textAlign: 'right' }}>Your Stack</th>
              <th style={{ ...th, textAlign: 'right' }}>On Rialo</th>
            </tr>
          </thead>
          <tbody>
            {activeMiddleware.map(id => (
              <tr key={id}>
                <td style={td()}>{MW_LABEL[id] || id}</td>
                <td style={td('right')}>{formatUSD(middlewareBreakdown[id]?.total ?? 0)}/mo</td>
                <td style={{ ...td('right'), color: 'var(--teal)', fontWeight: 500 }}>
                  Included
                </td>
              </tr>
            ))}

            <tr>
              <td style={td()}>Base Execution</td>
              <td style={td('right')}>{formatUSD(baseExecCost)}/mo</td>
              <td style={td('right')}>{formatUSD(rialoExecCost)}/mo</td>
            </tr>

            {/* total row */}
            <tr>
              <td style={{ ...td(), borderTop: '1px solid var(--border2)', color: 'var(--text)', fontWeight: 600, paddingTop: '10px' }}>
                Total
              </td>
              <td style={{ ...td('right'), borderTop: '1px solid var(--border2)', color: 'var(--text)', fontWeight: 600, paddingTop: '10px' }}>
                {formatUSD(totalCurrentCost)}/mo
              </td>
              <td style={{ ...td('right'), borderTop: '1px solid var(--border2)', color: 'var(--teal)', fontWeight: 600, paddingTop: '10px' }}>
                {formatUSD(rialoExecCost)}/mo
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. Three stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <StatCard
          label="Current Monthly"
          value={formatUSD(totalCurrentCost)}
          sublabel="your stack"
        />
        <StatCard
          label="On Rialo"
          value={formatUSD(rialoExecCost)}
          sublabel="execution only"
          accentColor="var(--teal)"
        />
        <StatCard
          label="Surplus Reclaimed"
          value={formatPct(savingsPercent)}
          sublabel="cost reduction"
          accentColor={surplusColor(savingsPercent)}
        />
      </div>

      {/* 3. What disappears checklist */}
      {activeMiddleware.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: '4px' }}>
            What disappears on Rialo
          </p>
          {activeMiddleware.map(id => DISAPPEARS[id] && (
            <div key={id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px' }}>
              <span style={{ color: 'var(--teal)', flexShrink: 0, lineHeight: 1.65 }}>+</span>
              <span style={{ color: 'var(--text2)' }}>{DISAPPEARS[id]}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '13px' }}>
            <span style={{ color: 'var(--teal)', flexShrink: 0, lineHeight: 1.65 }}>+</span>
            <span style={{ color: 'var(--text2)' }}>Single unified fee. One system.</span>
          </div>
        </div>
      )}

      {/* 4. Research footnote */}
      <p style={{ fontSize: '11px', color: 'var(--text3)', lineHeight: 1.65, marginTop: '4px' }}>
        Cost estimates based on Subzero Labs compound marginalization research.
        Oracle costs assume 200% markup on base gas. Automation assumes 300% markup.
        Indexer costs: $4,000/month baseline (high-throughput), $1,500/month (EVM L2).
        Actual costs vary by usage, provider, and tier.
      </p>

    </div>
  )
}
