import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { calculateLensPower } from './models'

interface Props {
  lang: Lang
}

export function LensPowerInteractive({ lang }: Props) {
  const [lensSign, setLensSign] = useState<'+' | '-'>('+')
  const [absFCm, setAbsFCm] = useState(25)

  const signedFCm = lensSign === '+' ? absFCm : -absFCm
  const res = calculateLensPower(signedFCm)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1rem' }}>
        {lang === 'hi' ? '🔬 प्रयोग: लेंस की क्षमता (P = 100 / f सेमी में) और मीटर रूपांतरण' : '🔬 Experiment: Lens Power (P = 100 / f_cm) & The Centimetre Trap'}
      </h4>
      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 0.75rem 0' }}>
        {lang === 'hi'
          ? 'फोकस दूरी (सेमी में) बदलें और सही डाइऑप्टर मान की तुलना आम बोर्ड परीक्षा गलती (बिना मीटर में बदले भाग देना) से करें।'
          : 'Adjust focal length in cm and compare the true Dioptre power against the common board-exam mistake (forgetting to convert cm to m).'}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`kit-btn ${lensSign === '+' ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
          onClick={() => setLensSign('+')}
        >
          {lang === 'hi' ? 'उत्तल लेंस (+f, अभिसारी / दूर-दृष्टि दोष)' : 'Convex Lens (+f, Converging / Hypermetropia)'}
        </button>
        <button
          type="button"
          className={`kit-btn ${lensSign === '-' ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
          onClick={() => setLensSign('-')}
        >
          {lang === 'hi' ? 'अवतल लेंस (-f, अपसारी / निकट-दृष्टि दोष)' : 'Concave Lens (-f, Diverging / Myopia)'}
        </button>
      </div>

      <SliderField
        id="lp-f-slider"
        label={lang === 'hi' ? 'फोकस दूरी का परिमाण |f| (सेमी में)' : 'Focal Length Magnitude |f| (in cm)'}
        value={absFCm}
        min={10}
        max={100}
        step={5}
        unit=" cm"
        lang={lang}
        onChange={setAbsFCm}
      />

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {/* Correct Power */}
        <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#166534' }}>
            {lang === 'hi' ? '✅ सही क्षमता (मीटर में बदलकर)' : '✅ Correct Power (Converted to Metres)'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#14532d', margin: '0.2rem 0' }}>
            {res.powerDioptres > 0 ? `+${res.powerDioptres}` : res.powerDioptres} D
          </div>
          <div style={{ fontSize: '0.78rem', color: '#15803d' }}>
            f = {res.focalLengthCm} cm = {res.focalLengthMeters} m → P = 1 / ({res.focalLengthMeters} m)
          </div>
        </div>

        {/* Common Exam Trap */}
        <div style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '8px', padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#991b1b' }}>
            {lang === 'hi' ? '❌ आम गलती (सीधे 1/f_cm करना)' : '❌ Common Exam Trap (1 / f_cm)'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7f1d1d', margin: '0.2rem 0', textDecoration: 'line-through' }}>
            {res.wrongCmPower > 0 ? `+${res.wrongCmPower}` : res.wrongCmPower} D
          </div>
          <div style={{ fontSize: '0.78rem', color: '#b91c1c' }}>
            {lang === 'hi' ? 'गलत! डाइऑप्टर केवल मीटर (1/m) के लिए परिभाषित है।' : 'Wrong! 1 D = 1 m⁻¹, never divide 1 by cm directly.'}
          </div>
        </div>
      </div>
    </div>
  )
}
