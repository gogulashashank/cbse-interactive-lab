import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'

interface Props {
  lang: Lang
}

export function MagnificationDecoderInteractive({ lang }: Props) {
  const [sign, setSign] = useState<'+' | '-'>('-')
  const [magnitude, setMagnitude] = useState(1.5)

  const mValue = sign === '+' ? magnitude : -magnitude
  const isErect = sign === '+'
  const isSameSize = Math.abs(magnitude - 1.0) < 0.05
  const isMagnified = magnitude > 1.05

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1rem' }}>
        {lang === 'hi' ? '🔬 प्रयोग: आवर्धन (m) डिकोडर मशीन' : '🔬 Experiment: Magnification (m) Dual-Code Decoder'}
      </h4>
      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 1rem 0' }}>
        {lang === 'hi'
          ? 'आवर्धन का चिह्न (+/-) और परिमाण |m| बदलकर देखें कि प्रत्येक भाग प्रतिबिंब के बारे में क्या बताता है।'
          : 'Toggle the sign (+/-) and adjust the magnitude |m| to see how each part independently decodes the image.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
          {lang === 'hi' ? 'आवर्धन चिह्न चुनें:' : 'Select Sign of m:'}
        </span>
        <button
          type="button"
          className={`kit-btn ${sign === '-' ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
          onClick={() => setSign('-')}
        >
          {lang === 'hi' ? 'ऋणात्मक (-) → वास्तविक व उल्टा' : 'Negative (-) → Real & Inverted'}
        </button>
        <button
          type="button"
          className={`kit-btn ${sign === '+' ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
          onClick={() => setSign('+')}
        >
          {lang === 'hi' ? 'धनात्मक (+) → आभासी व सीधा' : 'Positive (+) → Virtual & Erect'}
        </button>
      </div>

      <SliderField
        id="md-mag-slider"
        label={lang === 'hi' ? 'आवर्धन का परिमाण |m| = hᵢ / hₒ' : 'Magnification Magnitude |m| = hᵢ / hₒ'}
        value={magnitude}
        min={0.2}
        max={3.0}
        step={0.2}
        unit="×"
        lang={lang}
        onChange={setMagnitude}
      />

      {/* Decoded readout */}
      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>
            {lang === 'hi' ? 'पूर्ण आवर्धन (m)' : 'Combined Magnification (m)'}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
            {mValue > 0 ? `+${mValue.toFixed(1)}` : mValue.toFixed(1)}
          </div>
        </div>

        <div style={{ background: isErect ? '#eff6ff' : '#fef2f2', border: `1px solid ${isErect ? '#bfdbfe' : '#fecaca'}`, borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isErect ? '#1e40af' : '#991b1b' }}>
            {lang === 'hi' ? '1. चिह्न से प्रकृति (Sign)' : '1. Decoded from Sign'}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: isErect ? '#1e3a8a' : '#7f1d1d', marginTop: '0.25rem' }}>
            {isErect
              ? lang === 'hi' ? 'आभासी और सीधा (Virtual & Erect)' : 'Virtual & Erect (Upright)'
              : lang === 'hi' ? 'वास्तविक और उल्टा (Real & Inverted)' : 'Real & Inverted (Upside-down)'}
          </div>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>
            {lang === 'hi' ? '2. परिमाण से आकार (|m|)' : '2. Decoded from Magnitude |m|'}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#14532d', marginTop: '0.25rem' }}>
            {isSameSize
              ? lang === 'hi' ? 'वस्तु के बराबर आकार (Same Size)' : 'Same Size as Object (|m| = 1)'
              : isMagnified
                ? lang === 'hi' ? `आवर्धित / बड़ा (${magnitude.toFixed(1)}×)` : `Magnified / Enlarged (${magnitude.toFixed(1)}×)`
                : lang === 'hi' ? `छोटा / हासित (${magnitude.toFixed(1)}×)` : `Diminished / Smaller (${magnitude.toFixed(1)}×)`}
          </div>
        </div>
      </div>
    </div>
  )
}
