import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { generateProjection } from '../utils/sfsCalc.js'
import { formatUSD } from '../utils/formatters.js'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  return (
    <div style={{
      background:   'var(--bg3)',
      border:       '1px solid var(--border2)',
      borderRadius: '8px',
      padding:      '10px 14px',
      minWidth:     '160px',
    }}>
      <p style={{
        fontSize:      '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color:         'var(--text3)',
        marginBottom:  '8px',
      }}>
        Month {label}
      </p>
      {payload.map(entry => (
        <div
          key={entry.dataKey}
          style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', fontSize: '12px', marginBottom: '4px' }}
        >
          <span style={{ color: entry.stroke }}>{entry.name}</span>
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>{formatUSD(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function SustainabilityChart({ monthlyCreditsUSD, totalMonthlyCostUSD }) {
  const data = generateProjection(monthlyCreditsUSD, totalMonthlyCostUSD)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--text2)', fontSize: 11 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
          label={{ value: 'Month', position: 'insideBottomRight', offset: -8, fontSize: 11, fill: 'var(--text3)' }}
        />
        <YAxis
          tickFormatter={formatUSD}
          tick={{ fill: 'var(--text2)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={64}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'var(--border2)', strokeWidth: 1 }}
        />

        <Area
          type="monotone"
          dataKey="credits"
          name="Monthly Credits"
          stroke="var(--teal)"
          fill="rgba(45,212,191,0.15)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: 'var(--teal)', strokeWidth: 0 }}
          isAnimationActive={false}
        />
        <Area
          type="monotone"
          dataKey="costs"
          name="Monthly Costs"
          stroke="var(--red)"
          fill="rgba(248,113,113,0.15)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: 'var(--red)', strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
