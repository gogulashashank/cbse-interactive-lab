import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateTrophicChainEnergy } from './models'

interface Props {
  lang: Lang
}

export function TrophicEnergyPyramidInteractive({ lang }: Props) {
  const [sunlightJoules, setSunlightJoules] = useState(1000000)
  const [pesticidePpm, setPesticidePpm] = useState(0.02)

  const state = calculateTrophicChainEnergy(sunlightJoules, pesticidePpm)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. उत्पादक (T₁ · सूर्य का 1%)' : '1. Producers T₁ (1% of Sun)',
      math: `E₁ = ${state.t1ProducerJoules} J | DDT: ${state.t1PesticidePpm} ppm`,
    },
    {
      kicker: lang === 'hi' ? '2. प्राथमिक उपभोक्ता (T₂ · 10%)' : '2. Herbivores T₂ (10% of T₁)',
      math: `E₂ = ${state.t2HerbivoreJoules} J | DDT: ${state.t2PesticidePpm} ppm`,
    },
    {
      kicker: lang === 'hi' ? '3. द्वितीयक उपभोक्ता (T₃ · 10%)' : '3. Small Carnivores T₃ (10%)',
      math: `E₃ = ${state.t3CarnivoreJoules} J | DDT: ${state.t3PesticidePpm} ppm`,
    },
    {
      kicker: lang === 'hi' ? '4. शीर्ष मांसाहारी (T₄ · 10%)' : '4. Top Predator T₄ (10%)',
      math: `E₄ = ${state.t4TopPredatorJoules} J | DDT: ${state.t4TopPredatorPpm} ppm`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Trophic energy pyramid and biomagnification bench: T1 ${state.t1ProducerJoules} J, T2 ${state.t2HerbivoreJoules} J, T3 ${state.t3CarnivoreJoules} J, T4 ${state.t4TopPredatorJoules} J, top predator toxin ${state.t4TopPredatorPpm} ppm`}
        >
          <defs>
            <pattern id="nb-bio13-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-bio13-grid)" />

          {/* Left Panel: Upright 10% Energy Pyramid (Shrinks 10x per step) */}
          <rect x="16" y="16" width="356" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="194" y="34" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            1. 10% TROPHIC ENERGY PYRAMID (Shrinks ÷10 ↑)
          </text>

          {/* T4 Top Predator Tier */}
          <rect x="134" y="44" width="120" height="26" rx="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="1.6" />
          <text x="194" y="61" textAnchor="middle" fontSize="9" fontWeight="900" fill="#991b1b" fontFamily="ui-monospace, monospace">
            T₄ Hawk: {state.t4TopPredatorJoules} J
          </text>

          {/* T3 Secondary Consumer Tier */}
          <rect x="104" y="74" width="180" height="28" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="1.6" />
          <text x="194" y="92" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
            T₃ Snake (10%): {state.t3CarnivoreJoules} J
          </text>

          {/* T2 Primary Consumer Tier */}
          <rect x="74" y="106" width="240" height="28" rx="4" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.6" />
          <text x="194" y="124" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            T₂ Grasshopper (10%): {state.t2HerbivoreJoules} J
          </text>

          {/* T1 Producer Base Tier */}
          <rect x="44" y="138" width="300" height="30" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />
          <text x="194" y="157" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#065f46" fontFamily="ui-monospace, monospace">
            T₁ Green Plants (1% of Sun): {state.t1ProducerJoules} J
          </text>

          <text x="194" y="186" textAnchor="middle" fontSize="8.8" fontWeight="800" fill="#475569" fontFamily="ui-monospace, monospace">
            ☀️ Sunlight = {state.incidentSunlightJoules.toLocaleString()} J (90% lost as heat per step)
          </text>

          {/* Right Panel: Inverted Biomagnification & Thermodynamic Ledger */}
          <g transform="translate(384, 16)">
            <rect x="0" y="0" width="358" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="179" y="22" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              2. BIOMAGNIFICATION vs ENERGY LEDGER (Ch 13.1)
            </text>

            <rect x="14" y="34" width="330" height="44" rx="5" fill="#ecfdf5" stroke="#6ee7b7" />
            <text x="22" y="50" fontSize="9" fontWeight="800" fill="#065f46" fontFamily="ui-monospace, monospace">
              UNIDIRECTIONAL ENERGY FLOW (90% Lost as Heat):
            </text>
            <text x="22" y="67" fontSize="9.5" fontWeight="900" fill="#064e3b" fontFamily="ui-monospace, monospace">
              T₁→T₂ Heat Loss = {state.heatLostT1ToT2Joules} J (Max 3–4 Trophic Levels!)
            </text>

            <rect x="14" y="86" width="330" height="44" rx="5" fill="#fef2f2" stroke="#fca5a5" />
            <text x="22" y="102" fontSize="9" fontWeight="800" fill="#991b1b" fontFamily="ui-monospace, monospace">
              BIOLOGICAL MAGNIFICATION (DDT Concentrates ×10 ↑):
            </text>
            <text x="22" y="119" fontSize="9.5" fontWeight="900" fill="#7f1d1d" fontFamily="ui-monospace, monospace">
              T₁ ({state.t1PesticidePpm} ppm) → T₂ ({state.t2PesticidePpm}) → T₃ ({state.t3PesticidePpm}) → T₄ ({state.t4TopPredatorPpm} ppm!)
            </text>

            <rect x="14" y="138" width="330" height="32" rx="5" fill="#fef3c7" stroke="#fcd34d" />
            <text x="179" y="158" textAnchor="middle" fontSize="8.8" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
              Leaves capture 1% of Sun; Consumers transfer 10% of T_n!
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="tep-sun-slider"
          label={lang === 'hi' ? 'पत्तियों पर आपतित सौर ऊर्जा (J)' : 'Incident Solar Energy on Leaves (J)'}
          value={sunlightJoules}
          min={100000}
          max={2000000}
          step={100000}
          unit=" J"
          lang={lang}
          onChange={setSunlightJoules}
        />
        <SliderField
          id="tep-ppm-slider"
          label={lang === 'hi' ? 'T₁ पर अजैविक कीटनाशक (DDT ppm)' : 'Persistent Pesticide at T₁ (ppm)'}
          value={pesticidePpm}
          min={0.01}
          max={0.2}
          step={0.01}
          unit=" ppm"
          lang={lang}
          onChange={setPesticidePpm}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Lindeman 10% trophic energy law and biomagnification pipeline" />
    </div>
  )
}
