export default function InputSlider({ label, min, max, value, onChange, step = 1, suffix, description }) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{
          fontSize:      '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          color:         'var(--text3)',
        }}>
          {label}
        </label>
        <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500 }}>
          {value.toLocaleString()}{suffix ? ` ${suffix}` : ''}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width:      '100%',
          appearance: 'none',
          height:     '4px',
          borderRadius: '2px',
          outline:    'none',
          cursor:     'pointer',
          // two-tone track: teal for the filled portion, bg3 for the remainder
          background: `linear-gradient(to right, var(--teal) ${pct}%, var(--bg3) ${pct}%)`,
        }}
      />

      {description && (
        <p style={{ fontSize: '12px', color: 'var(--text3)', margin: 0 }}>
          {description}
        </p>
      )}
    </div>
  )
}
