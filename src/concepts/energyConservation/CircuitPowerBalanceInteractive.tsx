import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { calculateParallelPowerBalance } from './models'

interface Props {
  lang: Lang
}

export function CircuitPowerBalanceInteractive({ lang }: Props) {
  const [voltage, setVoltage] = useState(12)
  const [r1, setR1] = useState(6)
  const [r2, setR2] = useState(4)

  const balance = calculateParallelPowerBalance(voltage, r1, r2)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1rem' }}>
        {lang === 'hi' ? '🔬 प्रयोग: संपूर्ण परिपथ में शक्ति संतुलन (P_बैटरी = P₁ + P₂)' : '🔬 Experiment: Complete Circuit Power Balance (P_source = P₁ + P₂)'}
      </h4>
      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 1rem 0' }}>
        {lang === 'hi'
          ? 'बैटरी वोल्टेज और दोनों लोड का प्रतिरोध बदलें। देखें कि बैटरी द्वारा दी गई कुल वाट-शक्ति दोनों लोड के योग के ठीक बराबर होती है।'
          : 'Adjust battery voltage and resistor loads. Observe how source power always exactly balances total dissipated power.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <SliderField
          id="cpb-voltage-slider"
          label={lang === 'hi' ? 'बैटरी वोल्टेज (V)' : 'Battery Voltage (V)'}
          value={voltage}
          min={3}
          max={24}
          step={1}
          unit=" V"
          lang={lang}
          onChange={setVoltage}
        />
        <SliderField
          id="cpb-r1-slider"
          label={lang === 'hi' ? 'शाखा 1 प्रतिरोध (R₁)' : 'Branch 1 Resistor (R₁)'}
          value={r1}
          min={1}
          max={20}
          step={1}
          unit=" Ω"
          lang={lang}
          onChange={setR1}
        />
        <SliderField
          id="cpb-r2-slider"
          label={lang === 'hi' ? 'शाखा 2 प्रतिरोध (R₂)' : 'Branch 2 Resistor (R₂)'}
          value={r2}
          min={1}
          max={20}
          step={1}
          unit=" Ω"
          lang={lang}
          onChange={setR2}
        />
      </div>

      {/* Side-by-side power ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Source Power */}
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#166534' }}>
            {lang === 'hi' ? 'स्रोत द्वारा प्रदाय शक्ति (Supplied)' : 'Power Supplied by Battery'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d', margin: '0.25rem 0' }}>
            {balance.batteryPower} W
          </div>
          <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
            P_source = V × I_total = {balance.batteryVoltage} V × {balance.totalCurrent} A
          </div>
        </div>

        {/* Load Dissipation */}
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '8px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#991b1b' }}>
            {lang === 'hi' ? 'उपकरणों द्वारा खर्च शक्ति (Dissipated)' : 'Power Dissipated in Loads'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7f1d1d', margin: '0.25rem 0' }}>
            {balance.totalDissipatedPower} W
          </div>
          <div style={{ fontSize: '0.8rem', color: '#b91c1c' }}>
            P₁ ({balance.branch1Power} W) + P₂ ({balance.branch2Power} W)
          </div>
        </div>
      </div>

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '0.6rem 0.8rem', fontSize: '0.82rem', color: '#1e40af' }}>
        <strong>{lang === 'hi' ? 'ऊर्जा संतुलन पुष्टि:' : 'Energy Balance Ledger:'}</strong>{' '}
        {lang === 'hi'
          ? `बैटरी शक्ति (${balance.batteryPower} W) = लोड 1 (${balance.branch1Power} W) + लोड 2 (${balance.branch2Power} W)। शक्ति अंतर: ${balance.powerDifference} W।`
          : `Battery Power (${balance.batteryPower} W) = Load 1 (${balance.branch1Power} W) + Load 2 (${balance.branch2Power} W). Difference: ${balance.powerDifference} W.`}
      </div>
    </div>
  )
}
