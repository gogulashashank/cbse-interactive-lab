import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateElectricalEnergy } from './models'

interface Props {
  lang: Lang
}

export function ElectricalEnergyInteractive({ lang }: Props) {
  const [voltage, setVoltage] = useState(220)
  const [current, setCurrent] = useState(5)
  const [minutes, setMinutes] = useState(15)

  const seconds = minutes * 60
  const model = calculateElectricalEnergy(voltage, current, seconds)
  const kJ = (model.energyJoules / 1000).toFixed(1)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. विद्युत शक्ति (P = V × I)' : '1. Power Rate (P = V × I)',
      math: `${voltage} V × ${current} A = ${model.powerWatts.toFixed(0)} W`,
    },
    {
      kicker: lang === 'hi' ? '2. सेकंड रूपांतरण (SI Trap)' : '2. Time in Seconds (SI Trap)',
      math: `t = ${minutes} min × 60 = ${seconds} s`,
    },
    {
      kicker: lang === 'hi' ? '3. विद्युत कार्य (W = P × t)' : '3. Electrical Work (W = VIt)',
      math: `W = ${kJ} kJ (${model.energyKWh.toFixed(3)} kWh)`,
    },
    {
      kicker: lang === 'hi' ? '4. उत्पन्न ऊष्मा (H = W)' : '4. Thermal Heat Output (100%)',
      math: `H = ${kJ} kJ (Zero Energy Lost)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 200"
          className="nb-optics-svg"
          role="img"
          aria-label={`Electrical work to thermal heat energy balance: ${kJ} kJ`}
        >
          <defs>
            <pattern id="nb-ee-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="200" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="200" fill="url(#nb-ee-grid)" />

          {/* Left: Electrical Input Box */}
          <g transform="translate(55, 42)">
            <rect x="0" y="0" width="215" height="116" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
            <text x="107" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              ELECTRICAL WORK INPUT
            </text>
            <text x="107" y="58" textAnchor="middle" fontSize="16" fontWeight="900" fill="#1d4ed8" fontFamily="ui-monospace, monospace">
              {`${kJ} kJ`}
            </text>
            <text x="107" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af" fontFamily="ui-monospace, monospace">
              {`P = ${model.powerWatts.toFixed(0)} W × ${seconds} s`}
            </text>
            <text x="107" y="103" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#3b82f6" fontFamily="ui-monospace, monospace">
              {`(${model.energyKWh.toFixed(3)} kWh)`}
            </text>
          </g>

          {/* Center Conservation Flow Pipe */}
          <g transform="translate(270, 74)">
            <rect x="0" y="12" width="220" height="28" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.8" />
            <text x="110" y="30" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
              100% CONSERVED ⟶
            </text>
          </g>

          {/* Right: Thermal Heat Output Box */}
          <g transform="translate(490, 42)">
            <rect x="0" y="0" width="215" height="116" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
            <text x="107" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#991b1b" fontFamily="ui-monospace, monospace">
              THERMAL HEAT DISSIPATED
            </text>
            <text x="107" y="58" textAnchor="middle" fontSize="16" fontWeight="900" fill="#b91c1c" fontFamily="ui-monospace, monospace">
              {`H = ${kJ} kJ`}
            </text>
            <text x="107" y="84" textAnchor="middle" fontSize="11" fontWeight="700" fill="#991b1b" fontFamily="ui-monospace, monospace">
              H = V · I · t = I²Rt
            </text>
            <text x="107" y="103" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#dc2626" fontFamily="ui-monospace, monospace">
              ΔE_loss = 0.0 J
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="ee-voltage-slider"
          label={lang === 'hi' ? 'वोल्टेज (V)' : 'Voltage (V)'}
          value={voltage}
          min={10}
          max={250}
          step={5}
          unit=" V"
          lang={lang}
          onChange={setVoltage}
        />
        <SliderField
          id="ee-current-slider"
          label={lang === 'hi' ? 'विद्युत धारा (I)' : 'Current (I)'}
          value={current}
          min={0.5}
          max={15}
          step={0.5}
          unit=" A"
          lang={lang}
          onChange={setCurrent}
        />
        <SliderField
          id="ee-runtime-slider"
          label={lang === 'hi' ? 'समय (t मिनट में)' : 'Runtime (t in mins)'}
          value={minutes}
          min={1}
          max={60}
          step={1}
          unit={lang === 'hi' ? ' मिनट' : ' mins'}
          lang={lang}
          onChange={setMinutes}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Electrical energy conservation pipeline" />
    </div>
  )
}
