import React, { useState } from 'react'
import { calculateCharge } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber, formatScientific } from '../../kit/format'

export interface ChargeInteractiveProps {
  lang: 'en' | 'hi'
}

export const ChargeInteractive: React.FC<ChargeInteractiveProps> = ({ lang }) => {
  const [currentA, setCurrentA] = useState<number>(2)
  const [timeS, setTimeS] = useState<number>(5)

  const res = calculateCharge(currentA, timeS)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: विद्युत धारा एवं बहने वाला आवेश' : 'Interactive: Electric Current & Charge Flow'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'धारा और समय बदलें और देखें कि तार से कितना आवेश (कूलॉम) गुजरा:' : 'Adjust current and time to see how much charge (Coulombs) passes through:'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', gap: '0.75rem' }}>
        <SliderField
          id="charge-i"
          label={lang === 'hi' ? 'विद्युत धारा (Current I)' : 'Current (I)'}
          unit="A"
          value={currentA}
          min={0.5}
          max={5}
          step={0.5}
          lang={lang}
          onChange={setCurrentA}
        />
        <SliderField
          id="charge-t"
          label={lang === 'hi' ? 'समय (Time t)' : 'Time (t)'}
          unit={lang === 'hi' ? 'सेकंड' : 's'}
          value={timeS}
          min={1}
          max={20}
          step={1}
          lang={lang}
          onChange={setTimeS}
        />
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'कुल प्रवाहित आवेश (Q = I × t):' : 'Total Charge Passed (Q = I × t):'}
          </span>
          <strong style={{ fontSize: '1.4rem', color: '#b45309' }}>
            {formatNumber(res.chargeCoulombs)} {lang === 'hi' ? 'कूलॉम (C)' : 'Coulombs (C)'}
          </strong>
        </div>
        <div style={{ fontSize: '0.82rem', color: '#475569', background: '#fef3c7', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
          ≈ <strong>{formatScientific(res.electronsApprox)}</strong> {lang === 'hi' ? 'इलेक्ट्रॉन गुजरे' : 'electrons passed'}
        </div>
      </div>
    </div>
  )
}
