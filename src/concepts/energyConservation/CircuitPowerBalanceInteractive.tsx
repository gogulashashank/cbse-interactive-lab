import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateParallelPowerBalance } from './models'

interface Props {
  lang: Lang
}

export function CircuitPowerBalanceInteractive({ lang }: Props) {
  const [voltage, setVoltage] = useState(12)
  const [r1, setR1] = useState(6)
  const [r2, setR2] = useState(4)

  const balance = calculateParallelPowerBalance(voltage, r1, r2)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. शाखा 1 शक्ति (P₁ = V²/R₁)' : '1. Branch 1 Load (P₁ = V²/R₁)',
      math: `P₁ = ${voltage}² / ${r1} = ${balance.branch1Power} W`,
    },
    {
      kicker: lang === 'hi' ? '2. शाखा 2 शक्ति (P₂ = V²/R₂)' : '2. Branch 2 Load (P₂ = V²/R₂)',
      math: `P₂ = ${voltage}² / ${r2} = ${balance.branch2Power} W`,
    },
    {
      kicker: lang === 'hi' ? '3. कुल लोड खपत (P₁ + P₂)' : '3. Total Load Dissipation',
      math: `${balance.branch1Power} W + ${balance.branch2Power} W = ${balance.totalDissipatedPower} W`,
    },
    {
      kicker: lang === 'hi' ? '4. बैटरी प्रदाय शक्ति (V × I)' : '4. Battery Power Supplied',
      math: `${voltage} V × ${balance.totalCurrent} A = ${balance.batteryPower} W`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 220"
          className="nb-optics-svg"
          role="img"
          aria-label={`Circuit power balance: Battery supplies ${balance.batteryPower} W, loads dissipate ${balance.totalDissipatedPower} W`}
        >
          <defs>
            <pattern id="nb-cpb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="220" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="220" fill="url(#nb-cpb-grid)" />

          {/* Parallel Circuit Rails */}
          <line x1="130" y1="38" x2="620" y2="38" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="130" y1="182" x2="620" y2="182" stroke="#1e293b" strokeWidth="2.5" />
          <line x1="130" y1="38" x2="130" y2="182" stroke="#1e293b" strokeWidth="2.5" />

          {/* Battery Source Node */}
          <rect x="48" y="72" width="164" height="76" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="2.2" />
          <text x="130" y="96" textAnchor="middle" fontSize="11" fontWeight="800" fill="#14532d" fontFamily="ui-monospace, monospace">
            BATTERY SOURCE ({voltage} V)
          </text>
          <text x="130" y="118" textAnchor="middle" fontSize="14" fontWeight="900" fill="#15803d" fontFamily="ui-monospace, monospace">
            P_in = {balance.batteryPower} W
          </text>
          <text x="130" y="136" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#166534" fontFamily="ui-monospace, monospace">
            I_total = {balance.totalCurrent} A
          </text>

          {/* Branch 1 Load */}
          <line x1="365" y1="38" x2="365" y2="182" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="290" y="76" width="150" height="68" rx="8" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" />
          <text x="365" y="100" textAnchor="middle" fontSize="11" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
            LOAD 1 (R₁ = {r1} Ω)
          </text>
          <text x="365" y="125" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#c2410c" fontFamily="ui-monospace, monospace">
            P₁ = {balance.branch1Power} W
          </text>

          {/* Branch 2 Load */}
          <line x1="575" y1="38" x2="575" y2="182" stroke="#1e293b" strokeWidth="2.5" />
          <rect x="500" y="76" width="150" height="68" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
          <text x="575" y="100" textAnchor="middle" fontSize="11" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
            LOAD 2 (R₂ = {r2} Ω)
          </text>
          <text x="575" y="125" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#b45309" fontFamily="ui-monospace, monospace">
            P₂ = {balance.branch2Power} W
          </text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="cpb-voltage-slider"
          label={lang === 'hi' ? 'बैटरी वोल्टेज (V)' : 'Battery Voltage (V)'}
          value={voltage}
          min={3}
          max={24}
          step={1}
          unit=" V"
          lang={lang}
          onChange={setVoltage}
        />
        <SliderField
          id="cpb-r1-slider"
          label={lang === 'hi' ? 'शाखा 1 प्रतिरोध (R₁)' : 'Branch 1 Resistor (R₁)'}
          value={r1}
          min={1}
          max={20}
          step={1}
          unit=" Ω"
          lang={lang}
          onChange={setR1}
        />
        <SliderField
          id="cpb-r2-slider"
          label={lang === 'hi' ? 'शाखा 2 प्रतिरोध (R₂)' : 'Branch 2 Resistor (R₂)'}
          value={r2}
          min={1}
          max={20}
          step={1}
          unit=" Ω"
          lang={lang}
          onChange={setR2}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Circuit power conservation pipeline" />
    </div>
  )
}
