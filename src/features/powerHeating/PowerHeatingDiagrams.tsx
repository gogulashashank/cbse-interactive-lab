import React from 'react'
import type { HeatingCircuitResult } from './powerHeatingModel'
import { formatHeatingNumber } from './powerHeatingInputValidation'

interface HeatingCircuitSVGProps {
  result: HeatingCircuitResult
}

export const HeatingCircuitSVG: React.FC<HeatingCircuitSVGProps> = ({ result }) => {
  const { supplyVoltageV, elementVoltageV, resistanceOhm, currentA, powerW, switchClosed } = result

  return (
    <div className="el-circuit-svg-wrap" aria-label="DC Heating Circuit Schematic">
      <svg
        viewBox="0 0 760 380"
        className="el-circuit-svg"
        role="img"
        aria-label="Schematic diagram of heating element connected to DC power supply with ammeter, voltmeter, and knife switch"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="ph-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="760" height="380" fill="url(#ph-grid)" rx="8" />

        {/* Outer circuit loop */}
        {/* Top rail: Battery (+) to Switch, Switch to Ammeter, Ammeter to Element */}
        {/* Right side: through Element */}
        {/* Bottom rail: Element back to Battery (-) */}
        <path
          d="M 120 180 L 120 70 L 260 70 M 340 70 L 440 70 M 520 70 L 640 70 L 640 140 M 640 260 L 640 330 L 120 330 L 120 220"
          fill="none"
          stroke="#334155"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Voltmeter parallel bridge across Heating Element */}
        <path
          d="M 640 120 L 720 120 L 720 170 M 720 230 L 720 280 L 640 280"
          fill="none"
          stroke="#0284c7"
          strokeWidth="2.5"
          strokeDasharray="4 4"
        />
        <circle cx="640" cy="120" r="4" fill="#0284c7" />
        <circle cx="640" cy="280" r="4" fill="#0284c7" />

        {/* Voltmeter Gauge Circle */}
        <g transform="translate(720, 200)">
          <circle cx="0" cy="0" r="26" fill="#f0f9ff" stroke="#0284c7" strokeWidth="3" />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#0369a1"
            fontFamily="sans-serif"
          >
            V
          </text>
        </g>
        <rect x="670" y="235" width="100" height="24" rx="4" fill="#e0f2fe" stroke="#38bdf8" />
        <text
          x="720"
          y="251"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill="#0369a1"
          fontFamily="sans-serif"
        >
          {formatHeatingNumber(elementVoltageV)} V
        </text>

        {/* DC Battery Symbol */}
        <g transform="translate(120, 200)">
          {/* Long positive plate */}
          <line x1="-28" y1="-18" x2="28" y2="-18" stroke="#1e293b" strokeWidth="5" />
          <text x="-40" y="-12" fontSize="16" fontWeight="bold" fill="#dc2626">+</text>
          {/* Short negative plate */}
          <line x1="-16" y1="18" x2="16" y2="18" stroke="#1e293b" strokeWidth="7" />
          <text x="-40" y="24" fontSize="18" fontWeight="bold" fill="#1e293b">−</text>

          {/* Supply Badge */}
          <rect x="-65" y="-55" width="130" height="26" rx="5" fill="#f8fafc" stroke="#94a3b8" />
          <text
            x="0"
            y="-38"
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#334155"
            fontFamily="sans-serif"
          >
            Supply: {formatHeatingNumber(supplyVoltageV)} V
          </text>
        </g>

        {/* Switch Symbol */}
        <g transform="translate(300, 70)">
          <circle cx="-40" cy="0" r="5" fill="#1e293b" />
          <circle cx="40" cy="0" r="5" fill="#1e293b" />
          {switchClosed ? (
            <line x1="-40" y1="0" x2="40" y2="0" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" />
          ) : (
            <line x1="-40" y1="0" x2="30" y2="-28" stroke="#dc2626" strokeWidth="5" strokeLinecap="round" />
          )}
          <text
            x="0"
            y="-35"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={switchClosed ? '#15803d' : '#b91c1c'}
            fontFamily="sans-serif"
          >
            Switch: {switchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
          </text>
        </g>

        {/* Ammeter Symbol */}
        <g transform="translate(480, 70)">
          <circle cx="0" cy="0" r="26" fill="#fefce8" stroke="#ca8a04" strokeWidth="3" />
          <text
            x="0"
            y="6"
            textAnchor="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#a16207"
            fontFamily="sans-serif"
          >
            A
          </text>
          <rect x="-45" y="32" width="90" height="22" rx="4" fill="#fef9c3" stroke="#facc15" />
          <text
            x="0"
            y="47"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#854d0e"
            fontFamily="sans-serif"
          >
            {formatHeatingNumber(currentA)} A
          </text>
        </g>

        {/* Heating Element (Coil/Zigzag Resistor) */}
        <g transform="translate(640, 200)">
          {/* Wire lead in */}
          <line x1="0" y1="-60" x2="0" y2="-45" stroke="#334155" strokeWidth="4" />
          {/* Heating Coil Zig-zag */}
          <path
            d="M 0 -45 L -20 -35 L 20 -20 L -20 -5 L 20 10 L -20 25 L 20 40 L 0 50 L 0 60"
            fill="none"
            stroke={switchClosed && currentA > 0 ? '#ea580c' : '#64748b'}
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Heating Element Label & Power Badge */}
          <rect x="-190" y="-30" width="150" height="60" rx="6" fill="#fff7ed" stroke="#fdba74" />
          <text
            x="-115"
            y="-10"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="#9a3412"
            fontFamily="sans-serif"
          >
            Heating Element
          </text>
          <text
            x="-115"
            y="7"
            textAnchor="middle"
            fontSize="12"
            fontWeight="600"
            fill="#431407"
            fontFamily="sans-serif"
          >
            R = {formatHeatingNumber(resistanceOhm)} Ω
          </text>
          <text
            x="-115"
            y="23"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#c2410c"
            fontFamily="sans-serif"
          >
            Power: {formatHeatingNumber(powerW)} W
          </text>
        </g>

        {/* Current Flow Direction Indicator when active */}
        {switchClosed && currentA > 0 && (
          <g fill="#dc2626">
            {/* Top rail arrow going right */}
            <polygon points="380,66 395,70 380,74" />
            <text x="390" y="90" fontSize="11" fontWeight="700" fill="#dc2626" textAnchor="middle">
              Current I →
            </text>
            {/* Bottom rail arrow going left */}
            <polygon points="380,326 365,330 380,334" />
            <text x="375" y="320" fontSize="11" fontWeight="700" fill="#dc2626" textAnchor="middle">
              ← Current I
            </text>
          </g>
        )}

        {/* Safe Model Badge */}
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="230" height="22" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
          <text x="115" y="15" textAnchor="middle" fontSize="10" fontWeight="600" fill="#475569">
            Pure Joule Heating Model: H = P × t
          </text>
        </g>
      </svg>
    </div>
  )
}

interface EnergyAccumulatorGaugeProps {
  energyJ: number
  powerW: number
  elapsedTimeS: number
  maxEnergyJ?: number
}

export const EnergyAccumulatorGauge: React.FC<EnergyAccumulatorGaugeProps> = ({
  energyJ,
  powerW,
  elapsedTimeS,
  maxEnergyJ = 400,
}) => {
  const percentage = Math.min(100, Math.max(0, (energyJ / maxEnergyJ) * 100))

  return (
    <div className="ph-energy-gauge-card" aria-label="Accumulated Heat Energy Transfer">
      <div className="ph-energy-gauge-header">
        <div>
          <span className="ph-gauge-title">Accumulated Heat Energy (H = P × t)</span>
          <p className="ph-gauge-sub">
            Converts electrical work into heat at a rate of {formatHeatingNumber(powerW)} Joules per second ({formatHeatingNumber(powerW)} W).
          </p>
        </div>
        <div className="ph-energy-counter">
          <span className="ph-counter-value">{formatHeatingNumber(energyJ, 1)}</span>
          <span className="ph-counter-unit">Joules (J)</span>
        </div>
      </div>

      <div
        className="ph-gauge-track"
        role="progressbar"
        aria-valuenow={energyJ}
        aria-valuemin={0}
        aria-valuemax={maxEnergyJ}
        aria-label="Accumulated heat energy gauge"
      >
        <div
          className="ph-gauge-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="ph-gauge-footer">
        <span>0 J</span>
        <span className="ph-gauge-status">
          Elapsed: {elapsedTimeS} s · {formatHeatingNumber(energyJ / 1000, 3)} kJ transferred
        </span>
        <span>{maxEnergyJ} J</span>
      </div>
    </div>
  )
}

interface EnergyVsTimeGraphSVGProps {
  history: { timeS: number; energyJ: number }[]
  currentPowerW: number
  targetDurationS: number
}

export const EnergyVsTimeGraphSVG: React.FC<EnergyVsTimeGraphSVGProps> = ({
  history,
  currentPowerW,
  targetDurationS,
}) => {
  // Chart dimensions
  const width = 640
  const height = 300
  const margin = { top: 30, right: 40, bottom: 50, left: 65 }
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom

  const maxT = Math.max(targetDurationS, history[history.length - 1]?.timeS ?? 10, 10)
  const maxH = Math.max(
    currentPowerW * maxT,
    ...history.map((p) => p.energyJ),
    60
  )

  const scaleX = (t: number) => margin.left + (t / maxT) * plotWidth
  const scaleY = (h: number) => margin.top + plotHeight - (h / maxH) * plotHeight

  // Generate SVG path for history
  const pathD = history.reduce((acc, point, index) => {
    const x = scaleX(point.timeS)
    const y = scaleY(point.energyJ)
    return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
  }, '')

  // Theoretical projection line across the full duration
  const theoreticalX2 = scaleX(maxT)
  const theoreticalY2 = scaleY(currentPowerW * maxT)

  // Axis tick marks
  const xTicks = [0, maxT * 0.25, maxT * 0.5, maxT * 0.75, maxT].map((t) => Math.round(t))
  const yTicks = [0, maxH * 0.25, maxH * 0.5, maxH * 0.75, maxH].map((h) => Math.round(h))

  return (
    <div className="ph-graph-wrapper" aria-label="Energy versus Time Graph">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="ph-graph-svg"
        role="img"
        aria-label="Line graph plotting heat energy in Joules against elapsed time in seconds. The slope equals the power in Watts."
      >
        {/* Background */}
        <rect width={width} height={height} fill="#ffffff" rx="6" />

        {/* Grid lines */}
        {xTicks.map((tick) => (
          <line
            key={`grid-x-${tick}`}
            x1={scaleX(tick)}
            y1={margin.top}
            x2={scaleX(tick)}
            y2={margin.top + plotHeight}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}
        {yTicks.map((tick) => (
          <line
            key={`grid-y-${tick}`}
            x1={margin.left}
            y1={scaleY(tick)}
            x2={margin.left + plotWidth}
            y2={scaleY(tick)}
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        <line
          x1={margin.left}
          y1={margin.top + plotHeight}
          x2={margin.left + plotWidth}
          y2={margin.top + plotHeight}
          stroke="#475569"
          strokeWidth="2"
        />
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + plotHeight}
          stroke="#475569"
          strokeWidth="2"
        />

        {/* X Ticks & Labels */}
        {xTicks.map((tick) => (
          <g key={`xtick-${tick}`} transform={`translate(${scaleX(tick)}, ${margin.top + plotHeight})`}>
            <line y2="6" stroke="#475569" strokeWidth="1.5" />
            <text y="20" textAnchor="middle" fontSize="11" fill="#475569">
              {tick}s
            </text>
          </g>
        ))}
        <text
          x={margin.left + plotWidth / 2}
          y={height - 10}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#1e293b"
        >
          Time t (seconds)
        </text>

        {/* Y Ticks & Labels */}
        {yTicks.map((tick) => (
          <g key={`ytick-${tick}`} transform={`translate(${margin.left}, ${scaleY(tick)})`}>
            <line x2="-6" stroke="#475569" strokeWidth="1.5" />
            <text x="-10" y="4" textAnchor="end" fontSize="11" fill="#475569">
              {tick} J
            </text>
          </g>
        ))}
        <text
          transform={`rotate(-90)`}
          x={-(margin.top + plotHeight / 2)}
          y={18}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill="#1e293b"
        >
          Energy Transferred H (Joules)
        </text>

        {/* Theoretical projection dashed line */}
        <line
          x1={scaleX(0)}
          y1={scaleY(0)}
          x2={theoreticalX2}
          y2={theoreticalY2}
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Recorded History Line */}
        {history.length > 1 && (
          <path d={pathD} fill="none" stroke="#ea580c" strokeWidth="3.5" strokeLinecap="round" />
        )}

        {/* Data points */}
        {history.map((pt, idx) => (
          <circle
            key={`pt-${idx}`}
            cx={scaleX(pt.timeS)}
            cy={scaleY(pt.energyJ)}
            r="4.5"
            fill="#c2410c"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        ))}

        {/* Slope Callout Pill */}
        <g transform={`translate(${margin.left + 15}, ${margin.top + 25})`}>
          <rect x="0" y="0" width="220" height="42" rx="5" fill="#fff7ed" stroke="#fdba74" />
          <text x="10" y="18" fontSize="11" fontWeight="700" fill="#9a3412">
            Slope = ΔH / Δt = Power P
          </text>
          <text x="10" y="33" fontSize="11" fontWeight="600" fill="#c2410c">
            P = {formatHeatingNumber(currentPowerW)} W ({formatHeatingNumber(currentPowerW)} J/s)
          </text>
        </g>
      </svg>
    </div>
  )
}
