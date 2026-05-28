import { MIDDLEWARE_CONFIG } from '../data/middleware.js'
import { calculateMonthlyCosts } from '../utils/marginCalc.js'
import { formatUSD } from '../utils/formatters.js'

function Toggle({ active, onToggle, id }) {
  return (
    <button
      role="switch"
      aria-checked={active}
      aria-label={`Toggle ${id}`}
      onClick={onToggle}
      style={{
        width:        '36px',
        height:       '20px',
        borderRadius: '10px',
        border:       'none',
        cursor:       'pointer',
        padding:      0,
        flexShrink:   0,
        position:     'relative',
        background:   active ? 'var(--teal)' : 'var(--bg3)',
        transition:   'background 0.15s ease',
        outline:      'none',
      }}
    >
      <span style={{
        position:     'absolute',
        top:          '3px',
        left:         active ? '19px' : '3px',
        width:        '14px',
        height:       '14px',
        borderRadius: '50%',
        background:   active ? '#0a0c10' : 'var(--text3)',
        transition:   'left 0.15s ease, background 0.15s ease',
      }} />
    </button>
  )
}

export default function MiddlewareStack({ chain, volume, activeMiddleware, onToggle }) {
  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap:                 '8px',
    }}>
      {MIDDLEWARE_CONFIG.map(mw => {
        const active = activeMiddleware.includes(mw.id)

        // calculate cost for this middleware in isolation so the card always shows its price
        const result = calculateMonthlyCosts(chain, volume, [mw.id])
        const cost = result.middlewareBreakdown[mw.id]?.total ?? 0

        return (
          <div
            key={mw.id}
            onClick={() => onToggle(mw.id)}
            style={{
              background:   'var(--bg2)',
              border:       `1px solid ${active ? 'var(--teal-border)' : 'var(--border)'}`,
              borderRadius: '10px',
              padding:      '12px 14px',
              cursor:       'pointer',
              transition:   'border-color 0.15s ease',
              userSelect:   'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{
                fontSize:   '13px',
                fontWeight: 500,
                color:      active ? 'var(--text)' : 'var(--text2)',
                transition: 'color 0.15s ease',
              }}>
                {mw.label}
              </span>
              {/* stop propagation so clicking the toggle directly doesn't double-fire */}
              <span onClick={e => e.stopPropagation()}>
                <Toggle active={active} onToggle={() => onToggle(mw.id)} id={mw.id} />
              </span>
            </div>

            <span style={{
              fontSize: '12px',
              color:    active ? 'var(--text2)' : 'var(--text3)',
              transition: 'color 0.15s ease',
            }}>
              {formatUSD(cost)}/mo
            </span>
          </div>
        )
      })}
    </div>
  )
}
