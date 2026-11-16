import React, { useState } from 'react'
import { calculateInverseArea } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface InverseAreaInteractiveProps {
  lang: 'en' | 'hi'
}

export const InverseAreaInteractive: React.FC<InverseAreaInteractiveProps> = ({ lang }) => {
  const [areaMm2, setAreaMm2] = useState<number>(2.0)
  const res = calculateInverseArea(areaMm2, 1.0)

  const channelHeightPx = 28 * areaMm2

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. अनुप्रस्थ काट क्षेत्रफल (A)' : '1. Cross-Section Area (A)',
      math: `A = ${formatNumber(areaMm2, 1)} mm² (${formatNumber(res.relativeArea)}× A₀)`,
    },
    {
      kicker: lang === 'hi' ? '2. इलेक्ट्रॉन प्रवाह पथ' : '2. Parallel Conducting Lanes',
      math: `${formatNumber(res.relativeArea)}× wider corridor for charge`,
    },
    {
      kicker: lang === 'hi' ? '3. व्युत्क्रम नियम (R ∝ 1/A)' : '3. Inverse Law (R ∝ 1/A)',
      math: `R = R₀ / ${formatNumber(res.relativeArea)}`,
    },
    {
      kicker: lang === 'hi' ? '4. परिणामी प्रतिरोध (R)' : '4. Resulting Resistance',
      math: `R = ${formatNumber(res.resistanceOhm, 2)} Ω (${formatNumber(res.relativeResistance, 2)}×)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 210"
          className="nb-optics-svg"
          role="img"
          aria-label={`Conductor cross-sectional area A = ${areaMm2} mm^2`}
        >
          <defs>
            <pattern id="nb-inv-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="210" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="210" fill="url(#nb-inv-grid)" />

          {/* Ghost baseline 1.0 mm^2 conductor */}
          <rect
            x="90"
            y={105 - 14}
            width="420"
            height="28"
            rx="6"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Active Conductor Channel */}
          <rect
            x="90"
            y={105 - channelHeightPx / 2}
            width="420"
            height={channelHeightPx}
            rx="8"
            fill="rgba(56, 189, 248, 0.22)"
            stroke="#0284c7"
            strokeWidth="2.4"
          />

          <text x="300" y="30" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#0369a1" fontFamily="ui-monospace, monospace">
            {`Conductor Area A = ${formatNumber(areaMm2, 1)} mm² (${formatNumber(res.relativeArea)}× Corridor Width)`}
          </text>

          {/* Right Readout Card */}
          <g transform="translate(540, 52)">
            <rect x="0" y="0" width="190" height="106" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
            <text x="14" y="28" fontSize="11" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
              INVERSE SCALING (R ∝ 1/A)
            </text>
            <text x="14" y="56" fontSize="14" fontWeight="900" fill="#b45309" fontFamily="ui-monospace, monospace">
              R = {formatNumber(res.resistanceOhm, 2)} Ω
            </text>
            <text x="14" y="82" fontSize="11.5" fontWeight="700" fill="#78350f" fontFamily="ui-monospace, monospace">
              {`${formatNumber(res.relativeResistance, 2)}× of baseline 1.0 Ω`}
            </text>
          </g>
        </svg>
      </div>

      <SliderField
        id="inverse-area-slider"
        label={lang === 'hi' ? 'अनुप्रस्थ काट क्षेत्रफल (Area A)' : 'Cross-Sectional Area (A)'}
        unit="mm²"
        value={areaMm2}
        min={0.5}
        max={4.0}
        step={0.5}
        lang={lang}
        onChange={setAreaMm2}
      />

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Inverse area resistance pipeline" />
    </div>
  )
}
