import { useState } from 'react'
import MiddlewareStack from '../components/MiddlewareStack.jsx'
import CostComparisonChart from '../components/CostComparisonChart.jsx'
import ResultSummary from '../components/ResultSummary.jsx'
import InputSlider from '../components/InputSlider.jsx'
import { calculateMonthlyCosts, PROTOCOL_PRESETS } from '../utils/marginCalc.js'

const selectStyle = {
  width:        '100%',
  background:   'var(--bg3)',
  border:       '1px solid var(--border2)',
  borderRadius: '8px',
  padding:      '10px 14px',
  color:        'var(--text)',
  fontSize:     '14px',
  outline:      'none',
  cursor:       'pointer',
  appearance:   'none',
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235a5855' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
  backgroundRepeat:   'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight:       '32px',
}

const labelStyle = {
  display:       'block',
  fontSize:      '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color:         'var(--text3)',
  marginBottom:  '8px',
}

const sectionStyle = {
  background:   'var(--bg2)',
  border:       '1px solid var(--border)',
  borderRadius: '12px',
  padding:      '24px',
  display:      'flex',
  flexDirection: 'column',
  gap:          '20px',
}

export default function MarginCalc() {
  const [protocol,         setProtocol]         = useState('lending')
  const [chain,            setChain]            = useState('solana')
  const [volume,           setVolume]           = useState(10000)
  const [activeMiddleware, setActiveMiddleware] = useState(PROTOCOL_PRESETS.lending.defaultMiddleware)

  const handleProtocolChange = (e) => {
    const next = e.target.value
    setProtocol(next)
    setActiveMiddleware(PROTOCOL_PRESETS[next].defaultMiddleware)
  }

  const handleToggle = (id) => {
    setActiveMiddleware(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const results = calculateMonthlyCosts(chain, volume, activeMiddleware)

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 64px' }}>

      {/* page header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          Margin Calculator
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.65 }}>
          See what your middleware stack is actually costing you — and what disappears on Rialo.
        </p>
      </div>

      {/* two-column layout */}
      <div className="grid gap-8 md:grid-cols-2" style={{ alignItems: 'start' }}>

        {/* LEFT — inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* protocol + chain + volume */}
          <div style={sectionStyle}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', margin: 0 }}>
              Your Protocol
            </p>

            <div>
              <label style={labelStyle}>Protocol Type</label>
              <select value={protocol} onChange={handleProtocolChange} style={selectStyle}>
                <option value="lending">Lending Protocol (Aave, Compound)</option>
                <option value="dex">DEX / AMM (Uniswap, Curve)</option>
                <option value="perps">Perpetuals Exchange (dYdX, GMX)</option>
                <option value="vault">Yield Vault (Yearn, Beefy)</option>
                <option value="rwa">RWA Protocol (Ondo, Centrifuge)</option>
                <option value="custom">Custom (choose your own)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Current Chain</label>
              <select value={chain} onChange={e => setChain(e.target.value)} style={selectStyle}>
                <option value="solana">Solana</option>
                <option value="ethereum">Ethereum Mainnet</option>
                <option value="arbitrum">Arbitrum / Optimism</option>
                <option value="other_evm">Other EVM L2</option>
              </select>
            </div>

            <InputSlider
              label="Monthly Transaction Volume"
              min={100}
              max={500000}
              step={100}
              value={volume}
              onChange={setVolume}
              suffix="txns/month"
            />
          </div>

          {/* middleware toggles */}
          <div style={sectionStyle}>
            <div>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', margin: '0 0 4px 0' }}>
                Your Active Middleware
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text3)', margin: 0 }}>
                Toggle the services your protocol currently uses
              </p>
            </div>

            <MiddlewareStack
              chain={chain}
              volume={volume}
              activeMiddleware={activeMiddleware}
              onToggle={handleToggle}
            />
          </div>
        </div>

        {/* RIGHT — results, sticky on desktop */}
        <div style={{ position: 'sticky', top: '76px', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={sectionStyle}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', margin: 0 }}>
              Cost Comparison
            </p>
            <CostComparisonChart results={results} activeMiddleware={activeMiddleware} />
          </div>

          <div style={sectionStyle}>
            <ResultSummary results={results} activeMiddleware={activeMiddleware} />
          </div>

        </div>
      </div>
    </div>
  )
}
