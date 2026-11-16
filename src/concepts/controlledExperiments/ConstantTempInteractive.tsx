import React, { useState } from 'react'
import { calculateConstantTempOhmic } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface ConstantTempInteractiveProps {
  lang: 'en' | 'hi'
}

export const ConstantTempInteractive: React.FC<ConstantTempInteractiveProps> = ({ lang }) => {
  const [voltageV, setVoltageV] = useState<number>(10.0)
  const res = calculateConstantTempOhmic(voltageV, 10.0)

  // Map V in [0..20] to x in [80..520], I in [0..2.2] to y in [205..35]
  const toX = (v: number) => 80 + (v / 20) * 440
  const toY = (i: number) => 205 - (i / 2.2) * 170

  // Non-ohmic filament polyline points
  const filamentPoints = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
    .map((v) => {
      if (v === 0) return `${toX(0)},${toY(0)}`
      const pt = calculateConstantTempOhmic(v, 10.0)
      return `${toX(v).toFixed(1)},${toY(pt.filamentCurrentA).toFixed(1)}`
    })
    .join(' ')

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. लागू वोल्टेज (V)' : '1. Applied Voltage (V)',
      math: `V = ${formatNumber(voltageV)} V`,
    },
    {
      kicker: lang === 'hi' ? '2. ओमीय चालक (स्थिर ताप)' : '2. Ohmic (Constant Temp)',
      math: `R = 10 Ω → I = ${formatNumber(res.ohmicCurrentA, 2)} A`,
    },
    {
      kicker: lang === 'hi' ? '3. गर्म होता फिलामेंट (ताप ↑)' : '3. Glowing Filament (Temp ↑)',
      math: `R(T) rises to ${formatNumber(res.filamentResistanceOhm, 1)} Ω`,
    },
    {
      kicker: lang === 'hi' ? '4. फिलामेंट धारा (कम)' : '4. Non-Ohmic Current',
      math: `I_bulb = ${formatNumber(res.filamentCurrentA, 2)} A (Bends down)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 235"
          className="nb-optics-svg"
          role="img"
          aria-label={`Ohmic straight line vs Non-Ohmic filament curve at V = ${voltageV} V`}
        >
          <defs>
            <pattern id="nb-ohm-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="235" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="235" fill="url(#nb-ohm-grid)" />

          {/* Axes */}
          <line x1="80" y1="205" x2="540" y2="205" stroke="#334155" strokeWidth="2" />
          <line x1="80" y1="205" x2="80" y2="25" stroke="#334155" strokeWidth="2" />
          <text x="310" y="226" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace">
            Voltage V (0 V → 20 V)
          </text>
          <text x="26" y="115" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace" transform="rotate(-90 26 115)">
            Current I (A)
          </text>

          {/* Ohmic Straight Line (Constant R = 10 Ohm) */}
          <line
            x1={toX(0)}
            y1={toY(0)}
            x2={toX(20)}
            y2={toY(2.0)}
            stroke="#16a34a"
            strokeWidth="2.8"
          />

          {/* Non-Ohmic Filament Curve */}
          <polyline
            fill="none"
            stroke="#ea580c"
            strokeWidth="3"
            points={filamentPoints}
          />

          {/* Vertical Active Voltage Guide */}
          <line
            x1={toX(voltageV)}
            y1="30"
            x2={toX(voltageV)}
            y2="205"
            stroke="#64748b"
            strokeWidth="1.3"
            strokeDasharray="4 4"
          />

          {/* Active Operating Points */}
          <circle cx={toX(voltageV)} cy={toY(res.ohmicCurrentA)} r="5.5" fill="#16a34a" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx={toX(voltageV)} cy={toY(res.filamentCurrentA)} r="5.5" fill="#ea580c" stroke="#ffffff" strokeWidth="1.5" />

          {/* Right-Side Live Legend & Glowing Filament Indicator */}
          <g transform="translate(560, 32)">
            <rect x="0" y="0" width="180" height="76" rx="7" fill="#dcfce7" stroke="#16a34a" />
            <text x="12" y="22" fontSize="11" fontWeight="800" fill="#14532d" fontFamily="ui-monospace, monospace">
              Ohmic (Constant T)
            </text>
            <text x="12" y="42" fontSize="12.5" fontWeight="800" fill="#166534" fontFamily="ui-monospace, monospace">
              R = 10.0 Ω
            </text>
            <text x="12" y="62" fontSize="12" fontWeight="800" fill="#14532d" fontFamily="ui-monospace, monospace">
              I = {formatNumber(res.ohmicCurrentA, 2)} A
            </text>
          </g>

          <g transform="translate(560, 120)">
            <rect x="0" y="0" width="180" height="84" rx="7" fill="#ffedd5" stroke="#ea580c" />
            <circle
              cx="152"
              cy="42"
              r={10 + (voltageV / 20) * 14}
              fill={`rgba(251, 146, 60, ${0.2 + (voltageV / 20) * 0.55})`}
            />
            <text x="12" y="22" fontSize="11" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
              Filament Bulb (T ↑)
            </text>
            <text x="12" y="44" fontSize="12.5" fontWeight="800" fill="#c2410c" fontFamily="ui-monospace, monospace">
              R = {formatNumber(res.filamentResistanceOhm, 1)} Ω ↑
            </text>
            <text x="12" y="66" fontSize="12" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
              I = {formatNumber(res.filamentCurrentA, 2)} A
            </text>
          </g>
        </svg>
      </div>

      <SliderField
        id="ohmic-voltage-slider"
        label={lang === 'hi' ? 'लागू वोल्टेज (Voltage V)' : 'Applied Voltage (V)'}
        unit="V"
        value={voltageV}
        min={2.0}
        max={20.0}
        step={2.0}
        lang={lang}
        onChange={setVoltageV}
      />

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Constant temperature vs heating filament pipeline" />
    </div>
  )
}
