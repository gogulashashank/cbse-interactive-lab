import React, { useState } from 'react'
import { calculateCircuitFailure } from './models'

export interface CircuitFailureInteractiveProps {
  lang: 'en' | 'hi'
}

export const CircuitFailureInteractive: React.FC<CircuitFailureInteractiveProps> = ({ lang }) => {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series')
  const [brokenIndex, setBrokenIndex] = useState<number | null>(null)

  const res = calculateCircuitFailure(circuitType, 3, brokenIndex)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: परिपथ में घटक टूटने का प्रभाव' : 'Interactive: Component Failure in Series vs Parallel'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'परिपथ का प्रकार चुनें और किसी भी बल्ब को "फ्यूज" करके देखें कि बाकी बल्बों पर क्या असर होता है:' : 'Choose circuit type and click any bulb to fuse it, observing what happens to the others:'}
      </p>

      {/* Circuit Type Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          className={`kit-btn ${circuitType === 'series' ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
          onClick={() => {
            setCircuitType('series')
            setBrokenIndex(null)
          }}
        >
          {lang === 'hi' ? '1. श्रेणीक्रम (दिवाली लड़ी)' : '1. Series Circuit (Fairy Lights)'}
        </button>
        <button
          type="button"
          className={`kit-btn ${circuitType === 'parallel' ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '6px 12px' }}
          onClick={() => {
            setCircuitType('parallel')
            setBrokenIndex(null)
          }}
        >
          {lang === 'hi' ? '2. पार्श्वक्रम (घरेलू वायरिंग)' : '2. Parallel Circuit (Home Wiring)'}
        </button>
      </div>

      {/* Bulbs Display */}
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-around', margin: '1rem 0' }}>
        {[0, 1, 2].map((idx) => {
          const isThisBroken = brokenIndex === idx
          const isLit = circuitType === 'series' ? brokenIndex === null : !isThisBroken

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                cursor: 'pointer',
                minWidth: '6.5rem',
              }}
              onClick={() => setBrokenIndex(brokenIndex === idx ? null : idx)}
            >
              <span style={{ fontSize: '2rem', filter: isLit ? 'drop-shadow(0 0 8px #facc15)' : 'grayscale(100%) opacity(40%)' }}>
                💡
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', marginTop: '0.25rem' }}>
                {lang === 'hi' ? `बल्ब ${idx + 1}` : `Bulb ${idx + 1}`}
              </span>
              <span style={{ fontSize: '0.75rem', color: isThisBroken ? '#b91c1c' : isLit ? '#15803d' : '#64748b', fontWeight: 700 }}>
                {isThisBroken
                  ? lang === 'hi'
                    ? '⚡ फ्यूज!'
                    : '⚡ Blown!'
                  : isLit
                  ? lang === 'hi'
                    ? 'जल रहा है'
                    : 'Lit (ON)'
                  : lang === 'hi'
                  ? 'बुझ गया'
                  : 'Dark (OFF)'}
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <button
          type="button"
          className="kit-btn kit-btn-secondary"
          style={{ minHeight: '32px', padding: '2px 10px', fontSize: '0.8rem' }}
          onClick={() => setBrokenIndex(null)}
        >
          ↺ {lang === 'hi' ? 'सभी बल्ब रीसेट करें' : 'Reset All Bulbs'}
        </button>
      </div>

      {/* Outcome Banner */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderRadius: '6px',
          background: res.isWholeCircuitDark ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${res.isWholeCircuitDark ? '#fecaca' : '#bbf7d0'}`,
          fontSize: '0.88rem',
          color: res.isWholeCircuitDark ? '#991b1b' : '#166534',
        }}
      >
        <strong>{lang === 'hi' ? 'परिणाम:' : 'Result:'}</strong>{' '}
        {res.isWholeCircuitDark
          ? lang === 'hi'
            ? 'श्रेणीक्रम में एक बल्ब टूटने से पूरा परिपथ खुल गया (Open Circuit)! सभी बल्ब बुझ गए।'
            : 'In series, one broken bulb opens the entire single path! The whole circuit goes dark.'
          : brokenIndex !== null
          ? lang === 'hi'
            ? 'पार्श्वक्रम में केवल खराब बल्ब बुझा; शेष दोनों बल्बों को अपनी स्वतंत्र शाखा से पूरा 220 V मिलता रहेगा!'
            : 'In parallel, only the broken bulb goes off; remaining bulbs continue receiving full voltage through independent branches!'
          : lang === 'hi'
          ? 'सभी बल्ब सामान्य रूप से जल रहे हैं। किसी भी बल्ब पर क्लिक करके उसे फ्यूज करें।'
          : 'All bulbs are lit. Click on any bulb above to simulate a burnt filament.'}
      </div>
    </div>
  )
}
