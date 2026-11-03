import React, { useState } from 'react'
import { calculateGravityInverse } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'

export interface GravityInverseInteractiveProps {
  lang: 'en' | 'hi'
}

export const GravityInverseInteractive: React.FC<GravityInverseInteractiveProps> = ({ lang }) => {
  const [distanceR, setDistanceR] = useState<number>(1.0)
  const res = calculateGravityInverse(distanceR, 1.0)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: गुरुत्वाकर्षण और व्युत्क्रम-वर्ग नियम' : 'Interactive: Universal Gravitation & Inverse-Square Law'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'दूरी (r) बढ़ाएं और देखें कि गुरुत्वाकर्षण बल (F ∝ 1/r²) कितनी तेज़ी से गिरता है:' : 'Increase distance (r) and watch gravitational pull (F ∝ 1/r²) drop:'}
      </p>

      <SliderField
        id="gravity-inverse-slider"
        label={lang === 'hi' ? 'पिंडों के बीच दूरी (Distance r)' : 'Distance (r)'}
        unit={lang === 'hi' ? 'इकाई' : 'units'}
        value={distanceR}
        min={1.0}
        max={4.0}
        step={0.5}
        lang={lang}
        onChange={setDistanceR}
      />

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10.5rem, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'सापेक्ष दूरी (Distance Factor):' : 'Distance Factor:'}
          </span>
          <strong style={{ fontSize: '1.2rem', color: '#0369a1' }}>
            {formatNumber(res.distanceFactor)}×
          </strong>
        </div>

        <div style={{ padding: '0.75rem', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#991b1b', display: 'block' }}>
            {lang === 'hi' ? 'गुरुत्वाकर्षण बल (F ∝ 1/r²):' : 'Gravitational Force:'}
          </span>
          <strong style={{ fontSize: '1.2rem', color: '#b91c1c' }}>
            {formatNumber(res.forceN)} N
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#991b1b', display: 'block', fontWeight: 700 }}>
            {res.distanceR === 2.0
              ? lang === 'hi'
                ? '★ दूरी 2× पर बल ठीक 1/4 (25 N) रह गया!'
                : '★ Distance 2× ⇒ Force drops to 1/4th (25 N)!'
              : `(${formatNumber(res.forceFactor)}× ${lang === 'hi' ? 'प्रारंभिक' : 'baseline'})`}
          </span>
        </div>
      </div>
    </div>
  )
}
