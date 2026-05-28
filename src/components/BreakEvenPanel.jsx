import { calculateBreakEvenStake } from '../utils/sfsCalc.js'
import { formatRLO, formatUSD } from '../utils/formatters.js'

const thStyle = {
  fontSize:      '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color:         'var(--text3)',
  fontWeight:    400,
  padding:       '0 0 10px 0',
  textAlign:     'left',
}

export default function BreakEvenPanel({ totalMonthlyCostUSD, annualYieldPct, routingFractionPct, rloPrice }) {
  const be = calculateBreakEvenStake(totalMonthlyCostUSD, annualYieldPct, routingFractionPct, rloPrice)

  const rows = [
    { label: 'Cover 50% of costs',   rlo: be.half,   usd: be.halfUSD,   highlight: false },
    { label: 'Break-even (100%)',     rlo: be.full,   usd: be.fullUSD,   highlight: true  },
    { label: '100% + 20% buffer',     rlo: be.buffer, usd: be.bufferUSD, highlight: false },
  ]

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>Scenario</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>RLO Required</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>USD Value</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr
            key={row.label}
            style={{
              background:  row.highlight ? 'var(--teal-dim)'    : 'transparent',
              outline:     row.highlight ? '1px solid var(--teal-border)' : 'none',
              borderRadius: row.highlight ? '6px' : '0',
            }}
          >
            <td style={{
              fontSize:   '13px',
              color:      row.highlight ? 'var(--text)' : 'var(--text2)',
              fontWeight: row.highlight ? 500 : 400,
              padding:    '8px 10px',
              borderTop:  '1px solid var(--border)',
            }}>
              {row.label}
            </td>
            <td style={{
              fontSize:   '13px',
              color:      row.highlight ? 'var(--teal)' : 'var(--text2)',
              fontWeight: row.highlight ? 500 : 400,
              padding:    '8px 10px',
              textAlign:  'right',
              borderTop:  '1px solid var(--border)',
            }}>
              {formatRLO(row.rlo)}
            </td>
            <td style={{
              fontSize:   '13px',
              color:      row.highlight ? 'var(--text)' : 'var(--text2)',
              padding:    '8px 10px',
              textAlign:  'right',
              borderTop:  '1px solid var(--border)',
            }}>
              ~{formatUSD(row.usd)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
