export default function StatCard({ label, value, sublabel, accentColor }) {
  return (
    <div style={{
      background:   'var(--bg2)',
      border:       '1px solid var(--border)',
      borderRadius: '12px',
      padding:      '20px 24px',
      display:      'flex',
      flexDirection: 'column',
      gap:          '4px',
    }}>
      <span style={{
        fontSize:      '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        color:         'var(--text3)',
      }}>
        {label}
      </span>

      <span style={{
        fontSize:   '24px',
        fontWeight: 600,
        color:      accentColor || 'var(--text)',
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      }}>
        {value}
      </span>

      {sublabel && (
        <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
          {sublabel}
        </span>
      )}
    </div>
  )
}
