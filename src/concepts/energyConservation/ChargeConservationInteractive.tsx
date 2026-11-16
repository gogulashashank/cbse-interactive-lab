import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateJunctionConservation } from './models'

interface Props {
  lang: Lang
}

export function ChargeConservationInteractive({ lang }: Props) {
  const [in1, setIn1] = useState(3.0)
  const [in2, setIn2] = useState(2.0)
  const [branch1Ratio, setBranch1Ratio] = useState(0.4)

  const junction = calculateJunctionConservation(in1, in2, branch1Ratio)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. प्रवेश धारा (Σ I_in)' : '1. Total Inflow (I₁ + I₂)',
      math: `${junction.currentIn1} A + ${junction.currentIn2} A = ${junction.totalIn} A`,
    },
    {
      kicker: lang === 'hi' ? '2. संधि नियम (आवेश संरक्षण)' : '2. Junction Charge Rule',
      math: `No charge piles up at node`,
    },
    {
      kicker: lang === 'hi' ? '3. शाखा विभाजन (I₃, I₄)' : '3. Branch Split (I₃, I₄)',
      math: `I₃ = ${junction.currentOut1} A | I₄ = ${junction.currentOut2} A`,
    },
    {
      kicker: lang === 'hi' ? '4. कुल निकास (Σ I_out)' : '4. Total Outflow Verified',
      math: `Σ I_out = ${junction.totalOut} A = Σ I_in`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 210"
          className="nb-optics-svg"
          role="img"
          aria-label={`Junction current conservation: Inflow ${junction.totalIn} A equals Outflow ${junction.totalOut} A`}
        >
          <defs>
            <pattern id="nb-junc-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="210" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="210" fill="url(#nb-junc-grid)" />

          {/* Incoming wires */}
          <line
            x1="90"
            y1="48"
            x2="380"
            y2="105"
            stroke="#2563eb"
            strokeWidth={Math.max(2.5, junction.currentIn1 * 1.4)}
            strokeLinecap="round"
          />
          <line
            x1="90"
            y1="162"
            x2="380"
            y2="105"
            stroke="#2563eb"
            strokeWidth={Math.max(2.5, junction.currentIn2 * 1.4)}
            strokeLinecap="round"
          />

          {/* Outgoing wires */}
          <line
            x1="380"
            y1="105"
            x2="670"
            y2="48"
            stroke="#15803d"
            strokeWidth={Math.max(2.5, junction.currentOut1 * 1.4)}
            strokeLinecap="round"
          />
          <line
            x1="380"
            y1="105"
            x2="670"
            y2="162"
            stroke="#15803d"
            strokeWidth={Math.max(2.5, junction.currentOut2 * 1.4)}
            strokeLinecap="round"
          />

          {/* Central Junction Node */}
          <circle cx="380" cy="105" r="16" fill="#1e293b" stroke="#fbbf24" strokeWidth="3" />
          <rect x="305" y="132" width="150" height="26" rx="5" fill="#fef3c7" stroke="#d97706" />
          <text x="380" y="149" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
            {`Σ I = ${junction.totalIn} C/s`}
          </text>

          {/* Wire Callout Pills */}
          <rect x="70" y="16" width="150" height="24" rx="4" fill="#dbeafe" stroke="#2563eb" />
          <text x="145" y="32" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            {`I₁ (in) = ${junction.currentIn1} A →`}
          </text>

          <rect x="70" y="170" width="150" height="24" rx="4" fill="#dbeafe" stroke="#2563eb" />
          <text x="145" y="186" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            {`I₂ (in) = ${junction.currentIn2} A →`}
          </text>

          <rect x="540" y="16" width="150" height="24" rx="4" fill="#dcfce7" stroke="#16a34a" />
          <text x="615" y="32" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#14532d" fontFamily="ui-monospace, monospace">
            {`→ I₃ (out) = ${junction.currentOut1} A`}
          </text>

          <rect x="540" y="170" width="150" height="24" rx="4" fill="#dcfce7" stroke="#16a34a" />
          <text x="615" y="186" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#14532d" fontFamily="ui-monospace, monospace">
            {`→ I₄ (out) = ${junction.currentOut2} A`}
          </text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="cc-inflow1-slider"
          label={lang === 'hi' ? 'प्रवेश धारा 1 (I₁ in)' : 'Inflow Current 1 (I₁ in)'}
          value={in1}
          min={0.5}
          max={6.0}
          step={0.5}
          unit=" A"
          lang={lang}
          onChange={setIn1}
        />
        <SliderField
          id="cc-inflow2-slider"
          label={lang === 'hi' ? 'प्रवेश धारा 2 (I₂ in)' : 'Inflow Current 2 (I₂ in)'}
          value={in2}
          min={0.0}
          max={6.0}
          step={0.5}
          unit=" A"
          lang={lang}
          onChange={setIn2}
        />
        <SliderField
          id="cc-ratio-slider"
          label={lang === 'hi' ? 'शाखा 1 विभाजन अनुपात' : 'Branch 1 Split Ratio'}
          value={branch1Ratio}
          min={0.1}
          max={0.9}
          step={0.05}
          unit=""
          lang={lang}
          onChange={setBranch1Ratio}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Junction charge conservation pipeline" />
    </div>
  )
}
