import React, { useState } from 'react'
import { calculateStretchingVsComparing } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface StretchingInteractiveProps {
  lang: 'en' | 'hi'
}

export const StretchingInteractive: React.FC<StretchingInteractiveProps> = ({ lang }) => {
  const [multiplier, setMultiplier] = useState<number>(2.0)
  const res = calculateStretchingVsComparing(1.0, 1.0, multiplier)

  const baseLengthPx = 120
  const scaledLengthPx = baseLengthPx * multiplier
  const baseThicknessPx = 32
  const stretchedThicknessPx = Math.max(7, baseThicknessPx / multiplier)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. लंबाई गुणांक (n)' : '1. Length Factor (n)',
      math: `L' = ${formatNumber(multiplier)} × L₀`,
    },
    {
      kicker: lang === 'hi' ? '2. दो अलग तार (A स्थिर)' : '2. New Cut Wire (Fixed A)',
      math: `R_compare = n × R₀ = ${formatNumber(res.comparedResistanceOhm)} Ω`,
    },
    {
      kicker: lang === 'hi' ? '3. एक ही तार खींचना (आयतन स्थिर)' : '3. Stretched Wire (Fixed Vol)',
      math: `A' = A₀ / ${formatNumber(multiplier)} = ${formatNumber(res.stretchedAreaMm2, 2)} A₀`,
    },
    {
      kicker: lang === 'hi' ? '4. खींचे तार का प्रतिरोध (n²)' : '4. Stretched Resistance (n²)',
      math: `R_stretch = n² × R₀ = ${formatNumber(res.stretchedResistanceOhm)} Ω`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 220"
          className="nb-optics-svg"
          role="img"
          aria-label={`Wire stretching vs comparing diagram at n = ${multiplier}x`}
        >
          <defs>
            <pattern id="nb-str-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="220" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="220" fill="url(#nb-str-grid)" />

          {/* Scenario A: Cut a longer wire of same thickness A */}
          <text x="30" y="34" fontSize="11.5" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            {lang === 'hi'
              ? `स्थिति A: समान मोटाई (A₀) का ${formatNumber(multiplier)}× लंबा तार → R = ${formatNumber(res.comparedResistanceOhm)} Ω (${formatNumber(res.comparedFactor)}×)`
              : `Scenario A (Cut New Wire, Fixed A₀): Length = ${formatNumber(multiplier)}L₀ → R = ${formatNumber(res.comparedResistanceOhm)} Ω (${formatNumber(res.comparedFactor)}×)`}
          </text>
          <rect
            x="30"
            y={68 - baseThicknessPx / 2}
            width={scaledLengthPx}
            height={baseThicknessPx}
            rx="6"
            fill="#dbeafe"
            stroke="#2563eb"
            strokeWidth="2.2"
          />
          <text
            x={30 + scaledLengthPx + 14}
            y="72"
            fontSize="11"
            fontWeight="700"
            fill="#1e40af"
            fontFamily="ui-monospace, monospace"
          >
            Area = 1.00 A₀
          </text>

          {/* Scenario B: Stretch the SAME wire (Volume conserved -> Area shrinks to A/n) */}
          <text x="30" y="136" fontSize="11.5" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
            {lang === 'hi'
              ? `स्थिति B: एक ही तार को ${formatNumber(multiplier)}× खींचना (आयतन स्थिर, क्षेत्रफल A₀/${formatNumber(multiplier)}) → R = ${formatNumber(res.stretchedResistanceOhm)} Ω (${formatNumber(res.stretchedFactor)}×!)`
              : `Scenario B (Stretch Same Wire, Fixed Volume): Area drops to A₀/${formatNumber(multiplier)} → R = ${formatNumber(res.stretchedResistanceOhm)} Ω (${formatNumber(res.stretchedFactor)}×!)`}
          </text>
          {/* Ghost original wire */}
          <rect
            x="30"
            y={170 - baseThicknessPx / 2}
            width={baseLengthPx}
            height={baseThicknessPx}
            rx="6"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Stretched thinner wire */}
          <rect
            x="30"
            y={170 - stretchedThicknessPx / 2}
            width={scaledLengthPx}
            height={stretchedThicknessPx}
            rx="4"
            fill="#fed7aa"
            stroke="#c2410c"
            strokeWidth="2.2"
          />
          <text
            x={30 + scaledLengthPx + 14}
            y="174"
            fontSize="11"
            fontWeight="800"
            fill="#9a3412"
            fontFamily="ui-monospace, monospace"
          >
            {`Area = ${formatNumber(res.stretchedAreaMm2, 2)} A₀ (Thinner!)`}
          </text>
        </svg>
      </div>

      <SliderField
        id="stretching-multiplier"
        label={lang === 'hi' ? 'लंबाई गुणांक (Length Multiplier n)' : 'Length Multiplier (n)'}
        unit="×"
        value={multiplier}
        min={1.0}
        max={4.0}
        step={0.5}
        lang={lang}
        onChange={setMultiplier}
      />

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Wire stretching vs comparing pipeline" />
    </div>
  )
}
