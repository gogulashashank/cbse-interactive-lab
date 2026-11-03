import React, { useState } from 'react'
import { calculateStretchingVsComparing } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'

export interface StretchingInteractiveProps {
  lang: 'en' | 'hi'
}

export const StretchingInteractive: React.FC<StretchingInteractiveProps> = ({ lang }) => {
  const [multiplier, setMultiplier] = useState<number>(2.0)
  const res = calculateStretchingVsComparing(1.0, 1.0, multiplier)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: तार खींचना बनाम दो अलग तारों की तुलना' : 'Interactive: Stretching One Wire vs Comparing Two Wires'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'लंबाई गुणांक (n) बदलें और दोनों स्थितियों में प्रतिरोध का फर्क देखें:' : 'Change the length multiplier (n) and contrast the two physical scenarios:'}
      </p>

      <SliderField
        id="stretching-multiplier"
        label={lang === 'hi' ? 'लंबाई गुणांक (Length Multiplier n)' : 'Length Multiplier (n)'}
        unit="×"
        value={multiplier}
        min={1.0}
        max={4.0}
        step={0.5}
        lang={lang}
        onChange={setMultiplier}
      />

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>
            {lang === 'hi' ? 'स्थिति A: दो अलग तारों की तुलना' : 'Scenario A: Comparing 2 Wires'}
          </div>
          <p style={{ margin: '0.2rem 0', fontSize: '0.8rem', color: '#64748b' }}>
            {lang === 'hi' ? 'समान मोटाई (A स्थिर रहता है)' : 'Same thickness (Area A unchanged)'}
          </p>
          <strong style={{ fontSize: '1.25rem', color: '#0f172a' }}>
            {formatNumber(res.comparedResistanceOhm)} Ω
          </strong>
          <span style={{ fontSize: '0.8rem', color: '#0369a1', display: 'block', fontWeight: 600 }}>
            {formatNumber(res.comparedFactor)}× {lang === 'hi' ? 'प्रतिरोध (n गुना)' : 'resistance (n times)'}
          </span>
        </div>

        <div style={{ padding: '0.75rem', background: '#fefce8', border: '1.5px solid #fde047', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
            {lang === 'hi' ? 'स्थिति B: एक ही तार को खींचना (Stretching)' : 'Scenario B: Stretching ONE Wire'}
          </div>
          <p style={{ margin: '0.2rem 0', fontSize: '0.8rem', color: '#854d0e' }}>
            {lang === 'hi' ? 'आयतन स्थिर ⇒ क्षेत्रफल A/n घट जाता है' : 'Volume constant ⇒ Area drops to A/n'}
          </p>
          <strong style={{ fontSize: '1.25rem', color: '#b45309' }}>
            {formatNumber(res.stretchedResistanceOhm)} Ω
          </strong>
          <span style={{ fontSize: '0.8rem', color: '#b45309', display: 'block', fontWeight: 700 }}>
            ★ {formatNumber(res.stretchedFactor)}× {lang === 'hi' ? 'प्रतिरोध (n² गुना!)' : 'resistance (n² times!)'}
          </span>
        </div>
      </div>
    </div>
  )
}
