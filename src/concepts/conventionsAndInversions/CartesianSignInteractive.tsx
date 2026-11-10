import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { calculateOpticalState, type OpticalDeviceType } from './models'

interface Props {
  lang: Lang
}

export function CartesianSignInteractive({ lang }: Props) {
  const [device, setDevice] = useState<OpticalDeviceType>('convex-lens')
  const [absU, setAbsU] = useState(30)
  const [absF, setAbsF] = useState(15)

  const state = calculateOpticalState(device, absU, absF)

  const formatSigned = (n: number) => (n === Infinity ? '∞' : n > 0 ? `+${n}` : `${n}`)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1rem' }}>
        {lang === 'hi' ? '🔬 प्रयोग: कार्तीय चिह्न परिपाटी (+/-) जांचें' : '🔬 Experiment: New Cartesian Sign Convention (+/-) Explorer'}
      </h4>
      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>
        {lang === 'hi'
          ? 'लेंस या दर्पण चुनें और देखें कि u, f और v के चिह्न (+/-) कैसे बदलते हैं।'
          : 'Select an optical device and observe how the signs (+/-) of u, f, and v automatically follow the Cartesian rules.'}
      </p>

      {/* Device selector buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {(
          [
            { id: 'convex-lens', en: 'Convex Lens (+f)', hi: 'उत्तल लेंस (+f)' },
            { id: 'concave-lens', en: 'Concave Lens (-f)', hi: 'अवतल लेंस (-f)' },
            { id: 'concave-mirror', en: 'Concave Mirror (-f)', hi: 'अवतल दर्पण (-f)' },
            { id: 'convex-mirror', en: 'Convex Mirror (+f)', hi: 'उत्तल दर्पण (+f)' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            className={`kit-btn ${device === item.id ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '6px 10px' }}
            onClick={() => setDevice(item.id)}
          >
            {lang === 'hi' ? item.hi : item.en}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <SliderField
          id="cs-u-slider"
          label={lang === 'hi' ? 'बिंब की दूरी |u| (बाईं ओर)' : 'Object Distance |u| (Left of O)'}
          value={absU}
          min={5}
          max={60}
          step={5}
          unit=" cm"
          lang={lang}
          onChange={setAbsU}
        />
        <SliderField
          id="cs-f-slider"
          label={lang === 'hi' ? 'फोकस दूरी का परिमाण |f|' : 'Focal Length Magnitude |f|'}
          value={absF}
          min={10}
          max={30}
          step={5}
          unit=" cm"
          lang={lang}
          onChange={setAbsF}
        />
      </div>

      {/* Signed ledger cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#1e40af' }}>
            {lang === 'hi' ? 'बिंब दूरी (u)' : 'Object Distance (u)'}
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1d4ed8', margin: '0.2rem 0' }}>
            {formatSigned(state.objectDistanceU)} cm
          </div>
          <div style={{ fontSize: '0.72rem', color: '#3b82f6' }}>
            {lang === 'hi' ? 'सदैव ऋणात्मक (-)' : 'Always Negative (-)'}
          </div>
        </div>

        <div
          style={{
            background: state.focalLengthF > 0 ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${state.focalLengthF > 0 ? '#86efac' : '#fecaca'}`,
            borderRadius: '8px',
            padding: '0.75rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: state.focalLengthF > 0 ? '#166534' : '#991b1b' }}>
            {lang === 'hi' ? 'फोकस दूरी (f)' : 'Focal Length (f)'}
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: state.focalLengthF > 0 ? '#14532d' : '#7f1d1d', margin: '0.2rem 0' }}>
            {formatSigned(state.focalLengthF)} cm
          </div>
          <div style={{ fontSize: '0.72rem', color: state.focalLengthF > 0 ? '#15803d' : '#dc2626' }}>
            {state.focalLengthF > 0
              ? lang === 'hi' ? 'उत्तल = धनात्मक (+)' : 'Convex = Positive (+)'
              : lang === 'hi' ? 'अवतल = ऋणात्मक (-)' : 'Concave = Negative (-)'}
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#334155' }}>
            {lang === 'hi' ? 'प्रतिबिंब दूरी (v)' : 'Image Distance (v)'}
          </div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
            {formatSigned(state.imageDistanceV)} {state.imageDistanceV === Infinity ? '' : 'cm'}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
            {state.isReal
              ? lang === 'hi' ? 'वास्तविक व उल्टा' : 'Real & Inverted'
              : lang === 'hi' ? 'आभासी व सीधा' : 'Virtual & Erect'}
          </div>
        </div>
      </div>
    </div>
  )
}
