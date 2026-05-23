export default function Footer() {
  return (
    <footer style={{
      background:  'var(--bg2)',
      borderTop:   '1px solid var(--border)',
      padding:     '16px 24px',
      textAlign:   'center',
      fontSize:    '12px',
      color:       'var(--text3)',
      marginTop:   'auto',
    }}>
      Built by{' '}
      <a
        href="https://twitter.com/Iris_of_Defi"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--text2)', textDecoration: 'none' }}
      >
        @Iris_of_Defi
      </a>
      {' · '}
      Data from Subzero Labs research
      {' · '}
      Not financial advice
      {' · '}
      <a
        href="https://rialo.io"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'var(--text2)', textDecoration: 'none' }}
      >
        rialo.io
      </a>
    </footer>
  )
}
