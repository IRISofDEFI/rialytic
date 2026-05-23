import { NavLink } from 'react-router-dom'

const navLinkStyle = ({ isActive }) => ({
  color:         isActive ? 'var(--text)'  : 'var(--text2)',
  borderBottom:  isActive ? '2px solid var(--teal)' : '2px solid transparent',
  paddingBottom: '4px',
  textDecoration: 'none',
  fontSize:      '14px',
  fontWeight:    isActive ? 500 : 400,
  transition:    'color 0.15s ease, border-color 0.15s ease',
})

export default function Navbar() {
  return (
    <nav style={{
      background:    'var(--bg2)',
      borderBottom:  '1px solid var(--border)',
      height:        '56px',
      position:      'fixed',
      top:           0,
      left:          0,
      right:         0,
      zIndex:        100,
      display:       'flex',
      alignItems:    'center',
      padding:       '0 24px',
    }}>
      <div style={{ flex: 1 }}>
        <span style={{
          color:      'var(--text)',
          fontWeight: 600,
          fontSize:   '18px',
          letterSpacing: '-0.02em',
        }}>
          Rialytic
        </span>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <NavLink to="/calc" style={navLinkStyle}>Margin Calculator</NavLink>
        <NavLink to="/sfs"  style={navLinkStyle}>SfS Planner</NavLink>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <span style={{
          background:   'var(--teal-dim)',
          color:        'var(--teal)',
          border:       '1px solid var(--teal-border)',
          borderRadius: '20px',
          padding:      '4px 10px',
          fontSize:     '11px',
          letterSpacing: '0.02em',
        }}>
          Built on Rialo research
        </span>
      </div>
    </nav>
  )
}
