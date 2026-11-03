import React, { useState } from 'react'
import { calculateDiameterTrap } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'

export interface DiameterTrapInteractiveProps {
  lang: 'en' | 'hi'
}

export const DiameterTrapInteractive: React.FC<DiameterTrapInteractiveProps> = ({ lang }) => {
  const [diameterMm, setDiameterMm] = useState<number>(1.0)
  const res = calculateDiameterTrap(diameterMm, 1.0)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: तार का व्यास (d) और 1/4 प्रतिरोध प्रभाव' : 'Interactive: Wire Diameter (d) & The 1/4th Resistance Trap'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'व्यास बदलें और देखें कि क्षेत्रफल वर्ग (d²) के अनुसार कैसे बढ़ता है:' : 'Adjust diameter and see how area scales quadratically with d²:'}
      </p>

      <SliderField
        id="diameter-trap-slider"
        label={lang === 'hi' ? 'तार का व्यास (Diameter d)' : 'Diameter (d)'}
        unit="mm"
        value={diameterMm}
        min={0.5}
        max={3.0}
        step={0.5}
        lang={lang}
        onChange={setDiameterMm}
      />

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10.5rem, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'क्षेत्रफल (A = πd²/4):' : 'Cross-Section Area:'}
          </span>
          <strong style={{ fontSize: '1.2rem', color: '#0369a1' }}>
            {formatNumber(res.areaMm2, 2)} mm²
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#0369a1', display: 'block', fontWeight: 600 }}>
            ({formatNumber(res.areaFactor)}× {lang === 'hi' ? 'क्षेत्रफल' : 'area'})
          </span>
        </div>

        <div style={{ padding: '0.75rem', background: '#fefce8', border: '1.5px solid #fde047', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#854d0e', display: 'block' }}>
            {lang === 'hi' ? 'नया प्रतिरोध (R ∝ 1/d²):' : 'New Resistance:'}
          </span>
          <strong style={{ fontSize: '1.2rem', color: '#b45309' }}>
            {formatNumber(res.resistanceOhm)} Ω
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#9a3412', display: 'block', fontWeight: 700 }}>
            {res.resistanceFactor === 0.25
              ? lang === 'hi'
                ? '★ ठीक 1/4 रह गया!'
                : '★ Exactly 1/4th (Quartered)!'
              : `(${formatNumber(res.resistanceFactor)}×)`}
          </span>
        </div>
      </div>
    </div>
  )
}
