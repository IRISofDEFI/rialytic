import { useState } from 'react'
import { Link } from 'react-router-dom'
import SustainabilityStatus from '../components/SustainabilityStatus.jsx'
import SustainabilityChart  from '../components/SustainabilityChart.jsx'
import BreakEvenPanel       from '../components/BreakEvenPanel.jsx'
import RoutingTable         from '../components/RoutingTable.jsx'
import InputSlider          from '../components/InputSlider.jsx'
import { calculateMonthlyCredits, calculateTotalMonthlyCost } from '../utils/sfsCalc.js'
import { formatUSD } from '../utils/formatters.js'

const labelStyle = {
  display:       'block',
  fontSize:      '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color:         'var(--text3)',
  marginBottom:  '8px',
}

const numberInputStyle = {
  width:        '100%',
  background:   'var(--bg3)',
  border:       '1px solid var(--border2)',
  borderRadius: '8px',
  padding:      '10px 14px',
  color:        'var(--text)',
  fontSize:     '14px',
  outline:      'none',
}

const sectionStyle = {
  background:    'var(--bg2)',
  border:        '1px solid var(--border)',
  borderRadius:  '12px',
  padding:       '24px',
  display:       'flex',
  flexDirection: 'column',
  gap:           '20px',
}

const sectionLabel = {
  fontSize:      '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  color:         'var(--text3)',
  margin:        0,
}

function NumberInput({ label, value, onChange, min, step, note }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) onChange(v) }}
        style={numberInputStyle}
      />
      {note && <p style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '5px' }}>{note}</p>}
    </div>
  )
}

export default function SfSPlanner() {
  const [rloStaked,          setRloStaked]          = useState(100000)
  const [rloPrice,           setRloPrice]           = useState(1.00)
  const [annualYieldPct,     setAnnualYieldPct]     = useState(8)
  const [routingFractionPct, setRoutingFractionPct] = useState(30)
  const [baseGasCost,        setBaseGasCost]        = useState(500)
  const [scheduledOpsPerDay, setScheduledOpsPerDay] = useState(100)
  const [costPerOp,          setCostPerOp]          = useState(0.05)

  const { monthlyCreditsUSD } = calculateMonthlyCredits(rloStaked, annualYieldPct, routingFractionPct, rloPrice)
  const { total: totalMonthlyCostUSD } = calculateTotalMonthlyCost(baseGasCost, scheduledOpsPerDay, costPerOp)
  const isSustainable = monthlyCreditsUSD >= totalMonthlyCostUSD

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 64px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          SfS Planner
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.65 }}>
          Calculate how much RLO to stake to fund your protocol's operations from yield alone.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2" style={{ alignItems: 'start' }}>

        {/* LEFT — inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* stake + price */}
          <div style={sectionStyle}>
            <p style={sectionLabel}>Stake Parameters</p>

            <NumberInput
              label="RLO Staked"
              value={rloStaked}
              onChange={setRloStaked}
              min={1000}
              step={1000}
            />

            <NumberInput
              label="RLO Price (USD)"
              value={rloPrice}
              onChange={setRloPrice}
              min={0.01}
              step={0.01}
              note="(illustrative — adjust to current price)"
            />

            <InputSlider
              label="Annual Staking Yield"
              min={4}
              max={20}
              step={0.5}
              value={annualYieldPct}
              onChange={setAnnualYieldPct}
              suffix="%"
              description="Typical PoS range: 6–12%"
            />

            <div>
              <InputSlider
                label="Routing Fraction"
                min={1}
                max={100}
                step={1}
                value={routingFractionPct}
                onChange={setRoutingFractionPct}
                suffix="%"
              />
              <p style={{ fontSize: '13px', marginTop: '8px', color: isSustainable ? 'var(--teal)' : 'var(--amber)' }}>
                → {formatUSD(monthlyCreditsUSD)}/month in service credits
              </p>
            </div>
          </div>

          {/* protocol costs */}
          <div style={sectionStyle}>
            <p style={sectionLabel}>Protocol Costs</p>

            <div>
              <label style={labelStyle}>Monthly Gas Cost (USD)</label>
              <input
                type="number"
                min={0}
                value={baseGasCost}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v)) setBaseGasCost(v) }}
                style={numberInputStyle}
              />
              <p style={{ fontSize: '12px', marginTop: '6px', color: 'var(--text3)' }}>
                Not sure?{' '}
                <Link to="/calc" style={{ color: 'var(--teal)', textDecoration: 'none' }}>
                  Use the Margin Calculator
                </Link>
              </p>
            </div>

            <NumberInput
              label="Scheduled Ops / Day"
              value={scheduledOpsPerDay}
              onChange={setScheduledOpsPerDay}
              min={0}
              step={1}
            />

            <NumberInput
              label="Cost Per Op (USD)"
              value={costPerOp}
              onChange={setCostPerOp}
              min={0.001}
              step={0.001}
            />
          </div>
        </div>

        {/* RIGHT — results, sticky on desktop */}
        <div style={{ position: 'sticky', top: '76px', alignSelf: 'start', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <SustainabilityStatus
            monthlyCreditsUSD={monthlyCreditsUSD}
            totalMonthlyCostUSD={totalMonthlyCostUSD}
            rloStaked={rloStaked}
            annualYieldPct={annualYieldPct}
            routingFractionPct={routingFractionPct}
            rloPrice={rloPrice}
          />

          <div style={sectionStyle}>
            <p style={sectionLabel}>24-Month Projection</p>
            <SustainabilityChart
              monthlyCreditsUSD={monthlyCreditsUSD}
              totalMonthlyCostUSD={totalMonthlyCostUSD}
            />
          </div>

          <div style={sectionStyle}>
            <p style={sectionLabel}>Break-Even Stake</p>
            <BreakEvenPanel
              totalMonthlyCostUSD={totalMonthlyCostUSD}
              annualYieldPct={annualYieldPct}
              routingFractionPct={routingFractionPct}
              rloPrice={rloPrice}
            />
          </div>

          <div style={sectionStyle}>
            <p style={sectionLabel}>Routing Sensitivity</p>
            <RoutingTable
              rloStaked={rloStaked}
              annualYieldPct={annualYieldPct}
              totalMonthlyCostUSD={totalMonthlyCostUSD}
              rloPrice={rloPrice}
              currentRoutingFraction={routingFractionPct}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
