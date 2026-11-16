import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
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

  const progress = (initialHeight - currentHeight) / initialHeight
  const cartX = 95 + progress * 350
  const cartY = 40 + progress * 135

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. स्थितिज ऊर्जा (PE = mgh)' : '1. Potential Energy (mgh)',
      math: `PE = ${state.potentialEnergyJoules} J (${pePercent.toFixed(0)}%)`,
    },
    {
      kicker: lang === 'hi' ? '2. गतिज ऊर्जा (KE = ½mv²)' : '2. Kinetic Energy (½mv²)',
      math: `KE = ${state.kineticEnergyJoules} J (${kePercent.toFixed(0)}%)`,
    },
    {
      kicker: lang === 'hi' ? '3. तात्कालिक वेग (v)' : '3. Instantaneous Speed (v)',
      math: `v = √(2gΔh) = ${state.currentVelocityMps} m/s`,
    },
    {
      kicker: lang === 'hi' ? '4. कुल यांत्रिक ऊर्जा (E)' : '4. Total Energy (PE + KE)',
      math: `E_total = ${state.totalEnergyJoules} J (Constant)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Inclined ramp energy conservation: PE = ${state.potentialEnergyJoules} J, KE = ${state.kineticEnergyJoules} J`}
        >
          <defs>
            <pattern id="nb-ramp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-ramp-grid)" />

          {/* Ground & Ramp Triangle */}
          <line x1="40" y1="175" x2="480" y2="175" stroke="#475569" strokeWidth="2.2" />
          <polygon points="95,175 95,40 445,175" fill="#efe4ce" stroke="#78350f" strokeWidth="2.2" />

          {/* Height Dimension Marker */}
          <line x1="68" y1="175" x2="68" y2="40" stroke="#2563eb" strokeWidth="1.8" strokeDasharray="4 3" />
          <text x="60" y="112" textAnchor="end" fontSize="11" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            H₀=10m
          </text>

          {/* Cart on Ramp */}
          <circle cx={cartX} cy={cartY} r="13" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
          <rect x={cartX - 58} y={cartY - 34} width="116" height="20" rx="4" fill="#fef3c7" stroke="#d97706" />
          <text x={cartX} y={cartY - 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
            {`h=${state.heightMeters}m | v=${state.currentVelocityMps}m/s`}
          </text>

          {/* Right-Side Live Stacked Energy Bar Ledger */}
          <g transform="translate(510, 28)">
            <rect x="0" y="0" width="220" height="155" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="110" y="24" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace">
              ENERGY LEDGER (E = {state.totalEnergyJoules} J)
            </text>

            {/* PE Bar */}
            <text x="16" y="52" fontSize="11" fontWeight="800" fill="#1d4ed8" fontFamily="ui-monospace, monospace">
              PE: {state.potentialEnergyJoules} J ({pePercent.toFixed(0)}%)
            </text>
            <rect x="16" y="60" width="188" height="16" rx="4" fill="#e2e8f0" />
            <rect x="16" y="60" width={(188 * pePercent) / 100} height="16" rx="4" fill="#2563eb" />

            {/* KE Bar */}
            <text x="16" y="100" fontSize="11" fontWeight="800" fill="#b91c1c" fontFamily="ui-monospace, monospace">
              KE: {state.kineticEnergyJoules} J ({kePercent.toFixed(0)}%)
            </text>
            <rect x="16" y="108" width="188" height="16" rx="4" fill="#e2e8f0" />
            <rect x="16" y="108" width={(188 * kePercent) / 100} height="16" rx="4" fill="#dc2626" />

            <text x="110" y="144" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#15803d" fontFamily="ui-monospace, monospace">
              PE + KE = {state.totalEnergyJoules} J ✓
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="mrc-mass-slider"
          label={lang === 'hi' ? 'द्रव्यमान (m)' : 'Cart Mass (m)'}
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
          label={lang === 'hi' ? 'वर्तमान ऊंचाई (h)' : 'Current Ramp Height (h)'}
          value={currentHeight}
          min={0}
          max={10}
          step={0.5}
          unit=" m"
          lang={lang}
          onChange={setCurrentHeight}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Mechanical ramp energy conservation pipeline" />
    </div>
  )
}
