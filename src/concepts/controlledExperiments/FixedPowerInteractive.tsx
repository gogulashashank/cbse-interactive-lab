import React, { useState } from 'react'
import { calculateFixedConditionPower } from './models'
import { formatNumber } from '../../kit/format'

export interface FixedPowerInteractiveProps {
  lang: 'en' | 'hi'
}

export const FixedPowerInteractive: React.FC<FixedPowerInteractiveProps> = ({ lang }) => {
  const [mode, setMode] = useState<'fixed-voltage' | 'fixed-current'>('fixed-voltage')
  const r1 = 4.0
  const r2 = 12.0

  // 12 V in fixed-voltage mode, 2 A in fixed-current mode
  const res = calculateFixedConditionPower(mode, r1, r2, mode === 'fixed-voltage' ? 12.0 : 2.0)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: स्थिर वोल्टेज बनाम स्थिर धारा' : 'Interactive: Fixed Voltage vs Fixed Current'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'तय करें कि क्या स्थिर है और देखें कि 4 Ω और 12 Ω में से किसमें ज्यादा शक्ति बनती है:' : 'Switch between fixed conditions to see which resistor dissipates more power:'}
      </p>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          className={`kit-btn ${mode === 'fixed-voltage' ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
          onClick={() => setMode('fixed-voltage')}
        >
          {lang === 'hi' ? '1. स्थिर वोल्टेज (12 V) — घरेलू/समानांतर' : '1. Fixed Voltage (12 V) — Parallel/Mains'}
        </button>
        <button
          type="button"
          className={`kit-btn ${mode === 'fixed-current' ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
          onClick={() => setMode('fixed-current')}
        >
          {lang === 'hi' ? '2. स्थिर धारा (2 A) — श्रेणीक्रम' : '2. Fixed Current (2 A) — Series'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#ffffff', border: res.higherPowerResistor === 'r1' ? '2px solid #0284c7' : '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'प्रतिरोधक R₁ = 4 Ω:' : 'Resistor R₁ = 4 Ω:'}
          </span>
          <strong style={{ fontSize: '1.25rem', color: '#0369a1' }}>
            {formatNumber(res.p1)} W
          </strong>
          {res.higherPowerResistor === 'r1' && (
            <span style={{ fontSize: '0.75rem', color: '#0369a1', display: 'block', fontWeight: 700 }}>
              ★ {lang === 'hi' ? 'अधिक शक्ति (3× ज्यादा)!' : 'Higher Power (3× more)!'}
            </span>
          )}
        </div>

        <div style={{ padding: '0.75rem', background: '#ffffff', border: res.higherPowerResistor === 'r2' ? '2px solid #b45309' : '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'प्रतिरोधक R₂ = 12 Ω:' : 'Resistor R₂ = 12 Ω:'}
          </span>
          <strong style={{ fontSize: '1.25rem', color: '#b45309' }}>
            {formatNumber(res.p2)} W
          </strong>
          {res.higherPowerResistor === 'r2' && (
            <span style={{ fontSize: '0.75rem', color: '#b45309', display: 'block', fontWeight: 700 }}>
              ★ {lang === 'hi' ? 'अधिक शक्ति (3× ज्यादा)!' : 'Higher Power (3× more)!'}
            </span>
          )}
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#334155', background: '#f0f9ff', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
        <strong>{lang === 'hi' ? 'निष्कर्ष:' : 'Key Takeaway:'}</strong>{' '}
        {mode === 'fixed-voltage'
          ? lang === 'hi'
            ? 'स्थिर वोल्टेज में P = V²/R लागू होता है: कम प्रतिरोध (4 Ω) 3 गुना ज्यादा शक्ति (36 W) उत्पन्न करता है।'
            : 'At fixed voltage, P = V²/R applies: smaller resistance (4 Ω) draws more current and gives 3× more power (36 W).'
          : lang === 'hi'
          ? 'स्थिर धारा में P = I²R लागू होता है: अधिक प्रतिरोध (12 Ω) 3 गुना ज्यादा शक्ति (48 W) उत्पन्न करता है।'
            : 'At fixed current, P = I²R applies: larger resistance (12 Ω) drops more voltage and gives 3× more power (48 W).'}
      </div>
    </div>
  )
}
