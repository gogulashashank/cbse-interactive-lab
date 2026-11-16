import React, { useState } from 'react'
import { calculateVoltageSquared } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface VoltageSquaredInteractiveProps {
  lang: 'en' | 'hi'
}

export const VoltageSquaredInteractive: React.FC<VoltageSquaredInteractiveProps> = ({ lang }) => {
  const [voltageV, setVoltageV] = useState<number>(12.0)
  const res = calculateVoltageSquared(voltageV, 6.0, 6.0)

  // Map V in [0..15] to x in [80..500], P in [0..40] to y in [195..30]
  const toX = (v: number) => 80 + (v / 15) * 420
  const toY = (p: number) => 195 - (p / 40) * 165

  const curvePts = [0, 3, 6, 9, 12, 15]
    .map((v) => `${toX(v).toFixed(1)},${toY((v * v) / 6).toFixed(1)}`)
    .join(' ')

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. वोल्टेज अनुपात (V / V₀)' : '1. Voltage Ratio (V / 6 V)',
      math: `V = ${formatNumber(voltageV)} V (${formatNumber(res.voltageV / 6, 2)}×)`,
    },
    {
      kicker: lang === 'hi' ? '2. धारा भी बढ़ती है (I = V/R)' : '2. Current Also Scales (I = V/6)',
      math: `I = ${formatNumber(res.currentA, 2)} A`,
    },
    {
      kicker: lang === 'hi' ? '3. द्विघात नियम (P = V × I = V²/R)' : '3. Quadratic Law (P = V²/R)',
      math: `P = (${formatNumber(voltageV)}²) / 6 = ${formatNumber(res.powerW, 1)} W`,
    },
    {
      kicker: lang === 'hi' ? '4. सापेक्ष शक्ति (P / P₀)' : '4. Power Multiplier',
      math: `${formatNumber(res.powerFactor, 2)}× Baseline Power`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 225"
          className="nb-optics-svg"
          role="img"
          aria-label={`Parabolic power curve P = V^2 / R at V = ${voltageV} V`}
        >
          <defs>
            <pattern id="nb-vsq-grid" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="225" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="225" fill="url(#nb-vsq-grid)" />

          {/* Axes */}
          <line x1="80" y1="195" x2="520" y2="195" stroke="#334155" strokeWidth="2" />
          <line x1="80" y1="195" x2="80" y2="25" stroke="#334155" strokeWidth="2" />
          <text x="300" y="216" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace">
            Voltage V (0 V → 15 V across 6 Ω Heater)
          </text>

          {/* Baseline V0 = 6V marker */}
          <circle cx={toX(6)} cy={toY(6)} r="4.5" fill="#2563eb" />
          <text x={toX(6) + 8} y={toY(6) + 14} fontSize="10.5" fontWeight="700" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            Baseline (6 V → 6 W)
          </text>

          {/* Parabolic Curve P = V^2 / 6 */}
          <polyline fill="none" stroke="#16a34a" strokeWidth="3" points={curvePts} />

          {/* Active Point */}
          <line x1={toX(voltageV)} y1="195" x2={toX(voltageV)} y2={toY(res.powerW)} stroke="#15803d" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx={toX(voltageV)} cy={toY(res.powerW)} r="6" fill="#15803d" stroke="#ffffff" strokeWidth="1.5" />

          {/* Right Callout Box */}
          <g transform="translate(545, 42)">
            <rect x="0" y="0" width="190" height="135" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />
            <text x="14" y="26" fontSize="11" fontWeight="800" fill="#14532d" fontFamily="ui-monospace, monospace">
              WHY V² SCALES BY 4×:
            </text>
            <text x="14" y="50" fontSize="11.5" fontWeight="700" fill="#166534" fontFamily="ui-monospace, monospace">
              V = {formatNumber(voltageV)} V ({formatNumber(voltageV / 6, 2)}×)
            </text>
            <text x="14" y="72" fontSize="11.5" fontWeight="700" fill="#166534" fontFamily="ui-monospace, monospace">
              I = {formatNumber(res.currentA, 2)} A ({formatNumber(res.currentA / 1, 2)}×)
            </text>
            <text x="14" y="100" fontSize="13" fontWeight="900" fill="#14532d" fontFamily="ui-monospace, monospace">
              P = V × I = {formatNumber(res.powerW, 1)} W
            </text>
            <text x="14" y="122" fontSize="11.5" fontWeight="800" fill="#15803d" fontFamily="ui-monospace, monospace">
              ({formatNumber(res.powerFactor, 2)}× Baseline Power)
            </text>
          </g>
        </svg>
      </div>

      <SliderField
        id="voltage-squared-slider"
        label={lang === 'hi' ? 'वोल्टेज (Supply Voltage V)' : 'Supply Voltage (V)'}
        unit="V"
        value={voltageV}
        min={3.0}
        max={15.0}
        step={1.0}
        lang={lang}
        onChange={setVoltageV}
      />

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Voltage squared power scaling pipeline" />
    </div>
  )
}
