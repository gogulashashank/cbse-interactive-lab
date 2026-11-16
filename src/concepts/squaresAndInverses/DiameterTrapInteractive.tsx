import React, { useState } from 'react'
import { calculateDiameterTrap } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface DiameterTrapInteractiveProps {
  lang: 'en' | 'hi'
}

export const DiameterTrapInteractive: React.FC<DiameterTrapInteractiveProps> = ({ lang }) => {
  const [diameterMm, setDiameterMm] = useState<number>(2.0)
  const res = calculateDiameterTrap(diameterMm, 1.0)

  const baseRadiusPx = 22
  const activeRadiusPx = baseRadiusPx * diameterMm

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. व्यास अनुपात (d / d₀)' : '1. Diameter Ratio (d / d₀)',
      math: `d = ${formatNumber(diameterMm, 1)} mm (${formatNumber(res.diameterMm)}×)`,
    },
    {
      kicker: lang === 'hi' ? '2. क्षेत्रफल वर्ग नियम (d²)' : '2. Area Scales as d²',
      math: `A = πd²/4 = ${formatNumber(res.areaMm2, 2)} mm² (${formatNumber(res.areaFactor)}× A₀)`,
    },
    {
      kicker: lang === 'hi' ? '3. प्रतिरोध व्युत्क्रम (1/A)' : '3. Inverse Resistance (1/d²)',
      math: `R = R₀ / (${formatNumber(res.diameterMm)}²) = R₀ / ${formatNumber(res.areaFactor)}`,
    },
    {
      kicker: lang === 'hi' ? '4. नया प्रतिरोध (R)' : '4. Resulting Resistance',
      math: `R = ${formatNumber(res.resistanceOhm, 2)} Ω (${formatNumber(res.resistanceFactor, 2)}× R₀)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 220"
          className="nb-optics-svg"
          role="img"
          aria-label={`Wire cross-section comparison for diameter d = ${diameterMm} mm`}
        >
          <defs>
            <pattern id="nb-dia-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="220" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="220" fill="url(#nb-dia-grid)" />

          {/* Baseline Wire Cross-Section (d0 = 1.0 mm) */}
          <g transform="translate(185, 108)">
            <circle cx="0" cy="0" r={baseRadiusPx} fill="#dbeafe" stroke="#2563eb" strokeWidth="2.4" />
            <line x1={-baseRadiusPx} y1="0" x2={baseRadiusPx} y2="0" stroke="#1e3a8a" strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="0" y="-42" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              Baseline Wire (d₀ = 1.0 mm)
            </text>
            <text x="0" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155" fontFamily="ui-monospace, monospace">
              A₀ = 0.79 mm² | R₀ = 1.00 Ω
            </text>
          </g>

          {/* Active Wire Cross-Section */}
          <g transform="translate(525, 108)">
            <circle cx="0" cy="0" r={activeRadiusPx} fill="#fef3c7" stroke="#d97706" strokeWidth="2.6" />
            {/* Ghost 1.0 mm circle inside for visual area comparison */}
            <circle cx="0" cy="0" r={baseRadiusPx} fill="none" stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 3" />
            <line x1={-activeRadiusPx} y1="0" x2={activeRadiusPx} y2="0" stroke="#92400e" strokeWidth="1.8" />
            <text x="0" y={-Math.max(42, activeRadiusPx + 14)} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
              {`Test Wire: d = ${formatNumber(diameterMm, 1)} mm (${formatNumber(res.diameterMm)}×)`}
            </text>
            <text x="0" y={Math.max(52, activeRadiusPx + 22)} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#b45309" fontFamily="ui-monospace, monospace">
              {`Area = ${formatNumber(res.areaFactor)}× A₀ → R = ${formatNumber(res.resistanceOhm, 2)} Ω`}
            </text>
          </g>
        </svg>
      </div>

      <SliderField
        id="diameter-trap-slider"
        label={lang === 'hi' ? 'तार का व्यास (Diameter d)' : 'Wire Diameter (d)'}
        unit="mm"
        value={diameterMm}
        min={0.5}
        max={3.0}
        step={0.5}
        lang={lang}
        onChange={setDiameterMm}
      />

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Diameter squared resistance scaling pipeline" />
    </div>
  )
}
