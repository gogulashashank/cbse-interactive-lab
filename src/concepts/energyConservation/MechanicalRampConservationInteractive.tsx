import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { calculateMechanicalEnergyAtHeight } from './models'

interface Props {
  lang: Lang
}

export function MechanicalRampConservationInteractive({ lang }: Props) {
  const [mass, setMass] = useState(2)
  const initialHeight = 10
  const [currentHeight, setCurrentHeight] = useState(6)

  const state = calculateMechanicalEnergyAtHeight(mass, initialHeight, currentHeight)

  const pePercent = (state.potentialEnergyJoules / state.totalEnergyJoules) * 100
  const kePercent = 100 - pePercent

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1rem' }}>
        {lang === 'hi' ? '🔬 प्रयोग: आनत तल पर यांत्रिक ऊर्जा संरक्षण (PE + KE = स्थिर)' : '🔬 Experiment: Mechanical Energy Conservation on a Ramp (PE + KE = const)'}
      </h4>
      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 1rem 0' }}>
        {lang === 'hi'
          ? 'वस्तु का द्रव्यमान और आनत तल पर उसकी ऊंचाई बदलकर देखें कि स्थितिज ऊर्जा और गतिज ऊर्जा का योग हमेशा स्थिर रहता है।'
          : 'Change the mass and current position along the ramp. Notice how PE transfers into KE while total energy stays fixed.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <SliderField
          id="mrc-mass-slider"
          label={lang === 'hi' ? 'द्रव्यमान (m)' : 'Mass (m)'}
          value={mass}
          min={1}
          max={10}
          step={0.5}
          unit=" kg"
          lang={lang}
          onChange={setMass}
        />
        <SliderField
          id="mrc-height-slider"
          label={lang === 'hi' ? 'वर्तमान ऊंचाई (h)' : 'Current Height (h)'}
          value={currentHeight}
          min={0}
          max={10}
          step={0.5}
          unit=" m"
          lang={lang}
          onChange={setCurrentHeight}
        />
      </div>

      {/* SVG ramp visualization */}
      <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
        <svg viewBox="0 0 400 160" style={{ width: '100%', maxHeight: '160px', display: 'block' }}>
          {/* Ground */}
          <line x1="20" y1="140" x2="380" y2="140" stroke="#94a3b8" strokeWidth="2" />

          {/* Ramp triangle */}
          <polygon points="50,140 50,30 350,140" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />

          {/* Cart position calculation */}
          {(() => {
            const progress = (initialHeight - currentHeight) / initialHeight // 0 at top, 1 at ground
            const cx = 50 + progress * 300
            const cy = 30 + progress * 110
            return (
              <g>
                <circle cx={cx} cy={cy} r="12" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
                <text x={cx} y={cy - 16} textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="700">
                  v = {state.currentVelocityMps} m/s
                </text>
              </g>
            )
          })()}

          {/* Height marker */}
          <line x1="36" y1="140" x2="36" y2="30" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
          <text x="30" y="85" textAnchor="end" fill="#1d4ed8" fontSize="11" fontWeight="700">
            h = {state.heightMeters} m
          </text>
        </svg>

        {/* Energy breakdown bars */}
        <div style={{ marginTop: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            <span style={{ color: '#2563eb' }}>
              {lang === 'hi' ? 'स्थितिज ऊर्जा (PE)' : 'Potential Energy (PE)'}: {state.potentialEnergyJoules} J ({pePercent.toFixed(0)}%)
            </span>
            <span style={{ color: '#dc2626' }}>
              {lang === 'hi' ? 'गतिज ऊर्जा (KE)' : 'Kinetic Energy (KE)'}: {state.kineticEnergyJoules} J ({kePercent.toFixed(0)}%)
            </span>
          </div>

          <div style={{ height: '18px', background: '#e2e8f0', borderRadius: '9px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${pePercent}%`, background: '#3b82f6', transition: 'width 0.2s ease' }} />
            <div style={{ width: `${kePercent}%`, background: '#ef4444', transition: 'width 0.2s ease' }} />
          </div>

          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginTop: '0.4rem' }}>
            {lang === 'hi' ? 'कुल यांत्रिक ऊर्जा (Total E = PE + KE)' : 'Total Mechanical Energy (E = PE + KE)'}: {state.totalEnergyJoules} J
          </div>
        </div>
      </div>

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.6rem 0.8rem', fontSize: '0.82rem', color: '#166534' }}>
        <strong>{lang === 'hi' ? 'यांत्रिक ऊर्जा संरक्षण पुष्टि:' : 'Mechanical Energy Law:'}</strong>{' '}
        {lang === 'hi'
          ? `वस्तु जैसे-जैसे नीचे फिसलती है, स्थितिज ऊर्जा घटती है और गतिज ऊर्जा ठीक उसी दर से बढ़ती है। कुल योग ${state.totalEnergyJoules} J अपरिवर्तित रहता है।`
          : `As the object descends, PE decreases and KE increases by the exact same amount. Total energy remains constant at ${state.totalEnergyJoules} Joules.`}
      </div>
    </div>
  )
}
