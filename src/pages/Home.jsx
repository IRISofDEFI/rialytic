import { useState } from 'react'
import { Link } from 'react-router-dom'

function ToolCard({ title, description, to, cta }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   'var(--bg2)',
        border:       `1px solid ${hovered ? 'var(--border2)' : 'var(--border)'}`,
        borderRadius: '12px',
        padding:      '24px',
        display:      'flex',
        flexDirection: 'column',
        gap:          '12px',
        transition:   'border-color 0.15s ease',
      }}
    >
      <h2 style={{
        fontSize:      '16px',
        fontWeight:    600,
        color:         'var(--text)',
        letterSpacing: '-0.02em',
      }}>
        {title}
      </h2>

      <p style={{
        fontSize:   '14px',
        color:      'var(--text2)',
        lineHeight: 1.65,
        flex:       1,
      }}>
        {description}
      </p>

      <Link
        to={to}
        style={{
          display:       'inline-block',
          marginTop:     '8px',
          background:    'var(--teal)',
          color:         '#0a0c10',
          fontWeight:    600,
          borderRadius:  '8px',
          padding:       '10px 20px',
          fontSize:      '14px',
          textDecoration: 'none',
          alignSelf:     'flex-start',
        }}
      >
        {cta}
      </Link>
    </div>
  )
}

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '64px 24px 48px' }}>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize:      '32px',
          fontWeight:    600,
          color:         'var(--text)',
          letterSpacing: '-0.02em',
          marginBottom:  '12px',
        }}>
          Rialytic
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text2)', lineHeight: 1.65 }}>
          Two tools for builders evaluating Rialo. Built on Subzero Labs published research.
        </p>
      </div>

      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap:                 '16px',
        marginBottom:        '24px',
      }}>
        <ToolCard
          title="Margin Calculator"
          description="See what your middleware stack is actually costing you — and what disappears on Rialo."
          to="/calc"
          cta="Open Calculator"
        />
        <ToolCard
          title="SfS Planner"
          description="Calculate how much RLO you need to stake to fund your protocol's operations from yield alone."
          to="/sfs"
          cta="Open Planner"
        />
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text3)' }}>
        Data sourced from Subzero Labs compound marginalization research.
      </p>
    </div>
  )
}
