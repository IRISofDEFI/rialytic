import { routingFractionTable } from '../utils/sfsCalc.js'
import { formatUSD } from '../utils/formatters.js'

const thStyle = {
  fontSize:      '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color:         'var(--text3)',
  fontWeight:    400,
  padding:       '0 0 10px 0',
  textAlign:     'left',
}

export default function RoutingTable({ rloStaked, annualYieldPct, totalMonthlyCostUSD, rloPrice, currentRoutingFraction }) {
  const rows = routingFractionTable(rloStaked, annualYieldPct, totalMonthlyCostUSD, rloPrice)
  const firstSustainableIdx = rows.findIndex(r => r.isSustainable)

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={thStyle}>Routing %</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Credits</th>
          <th style={{ ...thStyle, textAlign: 'center' }}>Covers Costs?</th>
          <th style={{ ...thStyle, textAlign: 'right' }}>Surplus / Shortfall</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const isCurrent   = row.fraction === currentRoutingFraction
          const isFirstGreen = idx === firstSustainableIdx

          return (
            <tr
              key={row.fraction}
              style={{
                background: isFirstGreen ? 'var(--teal-dim)' : 'transparent',
                borderLeft: isCurrent ? '2px solid var(--teal)' : '2px solid transparent',
              }}
            >
              <td style={{
                fontSize:   '13px',
                color:      isCurrent ? 'var(--teal)' : 'var(--text2)',
                fontWeight: isCurrent ? 600 : 400,
                padding:    '7px 10px',
                borderTop:  '1px solid var(--border)',
              }}>
                {row.fraction}%
              </td>
              <td style={{
                fontSize:  '13px',
                color:     'var(--text)',
                padding:   '7px 10px',
                textAlign: 'right',
                borderTop: '1px solid var(--border)',
              }}>
                {formatUSD(row.monthlyCreditsUSD)}
              </td>
              <td style={{
                fontSize:   '13px',
                color:      row.isSustainable ? 'var(--teal)' : 'var(--red)',
                fontWeight: 500,
                padding:    '7px 10px',
                textAlign:  'center',
                borderTop:  '1px solid var(--border)',
              }}>
                {row.isSustainable ? 'Yes' : 'No'}
              </td>
              <td style={{
                fontSize:  '13px',
                color:     row.surplus >= 0 ? 'var(--green)' : 'var(--red)',
                padding:   '7px 10px',
                textAlign: 'right',
                borderTop: '1px solid var(--border)',
              }}>
                {row.surplus >= 0 ? '+' : ''}{formatUSD(row.surplus)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
