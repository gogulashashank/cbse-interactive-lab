import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { calculateOpticalState } from './models'

interface Props {
  lang: Lang
}

export function RealVirtualCrossoverInteractive({ lang }: Props) {
  const focalLength = 20 // Fixed f = +20 cm
  const [absU, setAbsU] = useState(35)

  const state = calculateOpticalState('convex-lens', absU, focalLength)
  const isInsideFocus = absU < focalLength
  const isAtFocus = absU === focalLength

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1rem' }}>
        {lang === 'hi'
          ? '🔬 प्रयोग: उत्तल लेंस (f = 20 cm) में वास्तविक से आभासी संक्रमण'
          : '🔬 Experiment: Real-to-Virtual Crossover across Focal Point (f = 20 cm)'}
      </h4>
      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 1rem 0' }}>
        {lang === 'hi'
          ? 'वस्तु को 50 cm से धीरे-धीरे लेंस के पास (20 cm फोकस के अंदर) लाएं और देखें कि प्रतिबिंब कब उल्टा से सीधा हो जाता है!'
          : 'Slide the object from 50 cm across the focal point F (20 cm) and watch the image flip from Real & Inverted to Virtual & Erect!'}
      </p>

      <SliderField
        id="rvc-u-slider"
        label={lang === 'hi' ? 'लेंस से वस्तु की दूरी |u|' : 'Object Distance from Lens |u|'}
        value={absU}
        min={8}
        max={50}
        step={2}
        unit=" cm"
        lang={lang}
        onChange={setAbsU}
      />

      {/* Zone indicator banner */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.85rem',
          borderRadius: '8px',
          background: isAtFocus ? '#fef9c3' : isInsideFocus ? '#eff6ff' : '#f0fdf4',
          border: `1.5px solid ${isAtFocus ? '#fde047' : isInsideFocus ? '#93c5fd' : '#86efac'}`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', display: 'block' }}>
              {lang === 'hi' ? 'वर्तमान क्षेत्र (Current Zone):' : 'Current Optical Zone:'}
            </span>
            <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>
              {isAtFocus
                ? lang === 'hi' ? 'मुख्य फोकस F पर (|u| = f = 20 cm)' : 'Exactly at Focus F (|u| = f = 20 cm)'
                : isInsideFocus
                  ? lang === 'hi' ? 'फोकस के भीतर (|u| < 20 cm) — आवर्धक लेंस मोड' : 'Inside Focus (|u| < 20 cm) — Magnifying Glass Mode'
                  : lang === 'hi' ? 'फोकस के बाहर (|u| > 20 cm) — प्रोजेक्टर मोड' : 'Outside Focus (|u| > 20 cm) — Projector Mode'}
            </strong>
          </div>

          <div
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.9rem',
              background: isAtFocus ? '#eab308' : isInsideFocus ? '#2563eb' : '#16a34a',
              color: '#ffffff',
            }}
          >
            {isAtFocus
              ? lang === 'hi' ? 'प्रतिबिंब अनंत (∞) पर' : 'Image at Infinity (∞)'
              : state.isReal
                ? lang === 'hi' ? 'वास्तविक और उल्टा (Real & Inverted)' : 'Real & Inverted'
                : lang === 'hi' ? 'आभासी और सीधा (Virtual & Erect)' : 'Virtual & Erect'}
          </div>
        </div>

        {!isAtFocus && (
          <div style={{ marginTop: '0.6rem', fontSize: '0.84rem', color: '#334155' }}>
            {lang === 'hi'
              ? `प्रतिबिंब स्थिति v = ${state.imageDistanceV > 0 ? `+${state.imageDistanceV}` : state.imageDistanceV} cm | आवर्धन m = ${state.magnificationM > 0 ? `+${state.magnificationM}` : state.magnificationM}×`
              : `Image Position v = ${state.imageDistanceV > 0 ? `+${state.imageDistanceV}` : state.imageDistanceV} cm | Magnification m = ${state.magnificationM > 0 ? `+${state.magnificationM}` : state.magnificationM}×`}
          </div>
        )}
      </div>
    </div>
  )
}
