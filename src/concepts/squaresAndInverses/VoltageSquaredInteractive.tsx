import React, { useState } from 'react'
import { calculateVoltageSquared } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'

export interface VoltageSquaredInteractiveProps {
  lang: 'en' | 'hi'
}

export const VoltageSquaredInteractive: React.FC<VoltageSquaredInteractiveProps> = ({ lang }) => {
  const [voltageV, setVoltageV] = useState<number>(6.0)
  const res = calculateVoltageSquared(voltageV, 6.0, 6.0)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: वोल्टेज और शक्ति (P = V²/R)' : 'Interactive: Voltage & Power (P = V²/R)'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? '6 Ω के हीटर पर वोल्टेज बदलें और देखें कि शक्ति (Watts) वर्ग (V²) के अनुसार कैसे चौगुनी होती है:' : 'Change voltage on a 6 Ω heater and watch power quadruple with V²:'}
      </p>

      <SliderField
        id="voltage-squared-slider"
        label={lang === 'hi' ? 'वोल्टेज (Supply Voltage V)' : 'Supply Voltage (V)'}
        unit="V"
        value={voltageV}
        min={3.0}
        max={15.0}
        step={1.0}
        lang={lang}
        onChange={setVoltageV}
      />

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10.5rem, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'परिपथ में धारा (I = V/R):' : 'Circuit Current (I):'}
          </span>
          <strong style={{ fontSize: '1.2rem', color: '#0369a1' }}>
            {formatNumber(res.currentA)} A
          </strong>
        </div>

        <div style={{ padding: '0.75rem', background: '#ecfdf5', border: '1.5px solid #86efac', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#166534', display: 'block' }}>
            {lang === 'hi' ? 'उपभुक्त शक्ति (P = V²/R):' : 'Power Dissipated (P):'}
          </span>
          <strong style={{ fontSize: '1.25rem', color: '#14532d' }}>
            {formatNumber(res.powerW)} W
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#166534', display: 'block', fontWeight: 700 }}>
            {res.voltageV === 12.0
              ? lang === 'hi'
                ? '★ वोल्टेज 2× पर शक्ति ठीक 4×!'
                : '★ Voltage 2× ⇒ Power is exactly 4×!'
              : `(${formatNumber(res.powerFactor)}× ${lang === 'hi' ? 'शक्ति' : 'power'})`}
          </span>
        </div>
      </div>
    </div>
  )
}
