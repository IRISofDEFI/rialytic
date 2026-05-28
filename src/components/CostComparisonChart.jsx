import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { formatUSD } from '../utils/formatters.js'

const SEGMENT_COLORS = {
  oracle:    '#f87171',
  keeper:    '#fbbf24',
  indexer:   '#a78bfa',
  bridge:    '#60a5fa',
  scheduler: '#fb923c',
  rpc:       '#94a3b8',
  execution: '#4ade80',
  rialo:     '#2dd4bf',
}

const SEGMENT_LABELS = {
  oracle:    'Price Oracle',
  keeper:    'Automation Keeper',
  indexer:   'Data Indexer',
  bridge:    'Cross-Chain Bridge',
  scheduler: 'Scheduler',
  rpc:       'Private RPC',
  execution: 'Base Execution',
  rialo:     'Rialo Execution',
}

const MIDDLEWARE_KEYS = ['oracle', 'keeper', 'indexer', 'bridge', 'scheduler', 'rpc']

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null

  const visible = payload.filter(p => p.value > 0)
  if (!visible.length) return null

  return (
    <div style={{
      background:   'var(--bg3)',
      border:       '1px solid var(--border2)',
      borderRadius: '8px',
      padding:      '10px 14px',
      minWidth:     '180px',
    }}>
      <p style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      {visible.map(entry => (
        <div
          key={entry.dataKey}
          style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '12px', marginBottom: '4px' }}
        >
          <span style={{ color: entry.fill }}>
            {SEGMENT_LABELS[entry.dataKey] || entry.dataKey}
          </span>
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>
            {formatUSD(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function CostComparisonChart({ results, activeMiddleware }) {
  const { baseExecCost, middlewareBreakdown, rialoExecCost } = results

  const yourStack = { name: 'Your Stack', execution: baseExecCost, rialo: 0 }
  const onRialo   = { name: 'On Rialo',   execution: 0,            rialo: rialoExecCost }

  MIDDLEWARE_KEYS.forEach(mw => {
    yourStack[mw] = activeMiddleware.includes(mw) ? (middlewareBreakdown[mw]?.total ?? 0) : 0
    onRialo[mw]   = 0
  })

  const data = [yourStack, onRialo]

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barCategoryGap="35%" barGap={4}>
        <XAxis
          dataKey="name"
          tick={{ fill: 'var(--text2)', fontSize: 12 }}
          axisLine={{ stroke: 'var(--border)' }}
          tickLine={false}
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
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />

        {/* base execution is always the bottom segment of "Your Stack" */}
        <Bar dataKey="execution" stackId="a" fill={SEGMENT_COLORS.execution} isAnimationActive={false} />

        {/* middleware segments — zero for "On Rialo", active value for "Your Stack" */}
        {MIDDLEWARE_KEYS.map(mw => (
          <Bar key={mw} dataKey={mw} stackId="a" fill={SEGMENT_COLORS[mw]} isAnimationActive={false} />
        ))}

        {/* rialo is the only segment for "On Rialo"; zero for "Your Stack" */}
        <Bar dataKey="rialo" stackId="a" fill={SEGMENT_COLORS.rialo} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}
