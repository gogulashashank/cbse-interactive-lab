import React, { useState } from 'react'
import { calculateBucket } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'

export interface BucketInteractiveProps {
  lang: 'en' | 'hi'
}

export const BucketInteractive: React.FC<BucketInteractiveProps> = ({ lang }) => {
  const [rateLpm, setRateLpm] = useState<number>(5)
  const [minutes, setMinutes] = useState<number>(3)

  const res = calculateBucket(rateLpm, minutes, 20)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: नल का बहाव और बाल्टी' : 'Interactive: Flow Rate & Bucket Filling'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'बहाव की दर और समय बदलें और देखें कि पानी कैसे जमा होता है:' : 'Adjust flow rate and time to see how water accumulates:'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', gap: '0.75rem' }}>
        <SliderField
          id="bucket-rate"
          label={lang === 'hi' ? 'बहाव की दर (Flow Rate)' : 'Flow Rate'}
          unit={lang === 'hi' ? 'लीटर/मिनट' : 'L/min'}
          value={rateLpm}
          min={1}
          max={10}
          step={0.5}
          lang={lang}
          onChange={setRateLpm}
        />
        <SliderField
          id="bucket-time"
          label={lang === 'hi' ? 'समय (Time)' : 'Time'}
          unit={lang === 'hi' ? 'मिनट' : 'min'}
          value={minutes}
          min={0.5}
          max={6}
          step={0.5}
          lang={lang}
          onChange={setMinutes}
        />
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'बाल्टी में कुल पानी (Total Water):' : 'Total Accumulated Water:'}
          </span>
          <strong style={{ fontSize: '1.4rem', color: '#0284c7' }}>
            {formatNumber(res.totalLitres)} {lang === 'hi' ? 'लीटर' : 'Litres'}
          </strong>
        </div>
        <div style={{ width: '10rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{lang === 'hi' ? 'भराव:' : 'Filled:'} {res.fillPercentage}%</span>
            <span>20 L {lang === 'hi' ? 'क्षमता' : 'cap'}</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${res.fillPercentage}%`, height: '100%', background: '#0284c7', transition: 'width 0.2s ease' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
