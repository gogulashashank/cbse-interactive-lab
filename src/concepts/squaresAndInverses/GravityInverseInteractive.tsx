import React, { useState } from 'react'
import { calculateGravityInverse } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface GravityInverseInteractiveProps {
  lang: 'en' | 'hi'
}

export const GravityInverseInteractive: React.FC<GravityInverseInteractiveProps> = ({ lang }) => {
  const [distanceR, setDistanceR] = useState<number>(2.0)
  const res = calculateGravityInverse(distanceR, 1.0)

  const mass1X = 120
  const mass2X = 120 + distanceR * 135
  const arrowLen = Math.max(18, (res.forceN / 100) * 110)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. दूरी अनुपात (r / r₀)' : '1. Separation Ratio (r / r₀)',
      math: `r = ${formatNumber(distanceR, 1)} r₀ (${formatNumber(res.distanceFactor)}×)`,
    },
    {
      kicker: lang === 'hi' ? '2. दूरी का वर्ग (r²)' : '2. Squared Distance (r²)',
      math: `r² = (${formatNumber(distanceR, 1)})² = ${formatNumber(distanceR * distanceR, 2)}`,
    },
    {
      kicker: lang === 'hi' ? '3. व्युत्क्रम-वर्ग नियम (1/r²)' : '3. Inverse-Square Factor',
      math: `F / F₀ = 1 / ${formatNumber(distanceR * distanceR, 2)} = ${formatNumber(res.forceFactor, 2)}×`,
    },
    {
      kicker: lang === 'hi' ? '4. गुरुत्वाकर्षण बल (F)' : '4. Gravitational Pull (F)',
      math: `F = ${formatNumber(res.forceN, 2)} N (Baseline = 100 N)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 205"
          className="nb-optics-svg"
          role="img"
          aria-label={`Gravitational attraction at separation r = ${distanceR} units`}
        >
          <defs>
            <pattern id="nb-grav-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="205" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="205" fill="url(#nb-grav-grid)" />

          {/* Separation Line */}
          <line x1={mass1X} y1="105" x2={mass2X} y2="105" stroke="#64748b" strokeWidth="1.6" strokeDasharray="5 4" />
          <text
            x={(mass1X + mass2X) / 2}
            y="155"
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="800"
            fill="#334155"
            fontFamily="ui-monospace, monospace"
          >
            {`Centre-to-Centre Distance r = ${formatNumber(distanceR, 1)} units`}
          </text>

          {/* Force Vector on Mass 1 */}
          <line x1={mass1X + 28} y1="96" x2={mass1X + 28 + arrowLen} y2="96" stroke="#dc2626" strokeWidth="3.5" />
          {/* Force Vector on Mass 2 */}
          <line x1={mass2X - 28} y1="96" x2={mass2X - 28 - arrowLen} y2="96" stroke="#dc2626" strokeWidth="3.5" />

          {/* Mass 1 */}
          <circle cx={mass1X} cy="105" r="28" fill="#1d4ed8" stroke="#1e3a8a" strokeWidth="2.5" />
          <text x={mass1X} y="109" textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff" fontFamily="ui-monospace, monospace">
            M₁
          </text>

          {/* Mass 2 */}
          <circle cx={mass2X} cy="105" r="22" fill="#0f766e" stroke="#115e59" strokeWidth="2.5" />
          <text x={mass2X} y="109" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#ffffff" fontFamily="ui-monospace, monospace">
            M₂
          </text>

          {/* Top Force Readout Pill */}
          <rect x="240" y="18" width="280" height="32" rx="6" fill="#fee2e2" stroke="#ef4444" />
          <text x="380" y="38" textAnchor="middle" fontSize="12" fontWeight="800" fill="#991b1b" fontFamily="ui-monospace, monospace">
            {`F = 100 / (${formatNumber(distanceR, 1)}²) = ${formatNumber(res.forceN, 2)} N (${formatNumber(res.forceFactor, 2)}×)`}
          </text>
        </svg>
      </div>

      <SliderField
        id="gravity-inverse-slider"
        label={lang === 'hi' ? 'पिंडों के बीच दूरी (Distance r)' : 'Centre-to-Centre Distance (r)'}
        unit={lang === 'hi' ? 'इकाई' : 'units'}
        value={distanceR}
        min={1.0}
        max={4.0}
        step={0.5}
        lang={lang}
        onChange={setDistanceR}
      />

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Inverse square gravitational force pipeline" />
    </div>
  )
}
