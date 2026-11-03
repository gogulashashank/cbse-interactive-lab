import React, { useState } from 'react'
import { calculateInverseArea } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'

export interface InverseAreaInteractiveProps {
  lang: 'en' | 'hi'
}

export const InverseAreaInteractive: React.FC<InverseAreaInteractiveProps> = ({ lang }) => {
  const [areaMm2, setAreaMm2] = useState<number>(1.0)
  const res = calculateInverseArea(areaMm2, 1.0)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: तार का क्षेत्रफल और प्रतिरोध' : 'Interactive: Wire Area & Resistance'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'क्षेत्रफल (A) बढ़ाएं और देखें कि प्रतिरोध (R) कैसे घटता है:' : 'Increase area (A) and watch electrical resistance (R) decrease:'}
      </p>

      <SliderField
        id="inverse-area-slider"
        label={lang === 'hi' ? 'अनुप्रस्थ काट क्षेत्रफल (Area A)' : 'Cross-Sectional Area (A)'}
        unit="mm²"
        value={areaMm2}
        min={0.5}
        max={4.0}
        step={0.5}
        lang={lang}
        onChange={setAreaMm2}
      />

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'सापेक्ष क्षेत्रफल (A₂ / A₁):' : 'Relative Area:'}
          </span>
          <strong style={{ fontSize: '1.25rem', color: '#0369a1' }}>
            {formatNumber(res.relativeArea)}×
          </strong>
        </div>

        <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'तार का प्रतिरोध (R ∝ 1/A):' : 'Resistance (R = 1/A):'}
          </span>
          <strong style={{ fontSize: '1.25rem', color: '#b45309' }}>
            {formatNumber(res.resistanceOhm)} Ω
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>
            ({formatNumber(res.relativeResistance)}× {lang === 'hi' ? 'प्रारंभिक' : 'baseline'})
          </span>
        </div>
      </div>
    </div>
  )
}
