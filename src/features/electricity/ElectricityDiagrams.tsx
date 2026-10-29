import { fitSlopeOhm, type CircuitResult, type MeasurementPoint } from './ohmModel'
import { formatOhmNumber } from './ohmInputValidation'

/** Circuit schematic driven only by CircuitResult. Current flow is drawn as moving dashes. */
export function CircuitDiagramSVG({ result }: { result: CircuitResult }) {
  const { switchClosed, currentA, supplyVoltageV, resistorVoltageV, resistanceOhm } = result
  const flowing = currentA > 0
  const duration = Math.min(4, Math.max(0.35, 1.6 / Math.max(currentA, 0.01)))
  const wireClass = `el-wire${flowing ? ' is-flowing' : ''}`
  const wireStyle = flowing ? { animationDuration: `${duration}s` } : undefined

  const summary = `Circuit: supply ${formatOhmNumber(supplyVoltageV)} volts, switch ${
    switchClosed ? 'closed' : 'open'
  }, resistor ${formatOhmNumber(resistanceOhm)} ohms. Ammeter reads ${formatOhmNumber(
    currentA
  )} amperes. Voltmeter across the resistor reads ${formatOhmNumber(resistorVoltageV)} volts.`

  return (
    <div className="el-diagram-wrap">
      <svg viewBox="0 0 680 320" className="el-circuit-svg" role="img" aria-label={summary}>
        <title>Ideal DC circuit</title>
        {/* wires */}
        <path className={wireClass} style={wireStyle} d="M120 60 H270" />
        <path className={wireClass} style={wireStyle} d="M350 60 H520 V120" />
        <path className={wireClass} style={wireStyle} d="M520 200 V260 H342" />
        <path className={wireClass} style={wireStyle} d="M298 260 H120 V182" />
        <path className={wireClass} style={wireStyle} d="M120 154 V60" />
        <path className="el-wire" d="M520 120 H600 V138" />
        <path className="el-wire" d="M600 182 V200 H520" />

        {/* battery */}
        <line x1="104" y1="178" x2="136" y2="178" stroke="#1e293b" strokeWidth="3" />
        <line x1="112" y1="166" x2="128" y2="166" stroke="#1e293b" strokeWidth="5" />
        <text x="146" y="164" className="el-label">
          Supply
        </text>
        <text x="146" y="180" className="el-label el-label-strong">
          {formatOhmNumber(supplyVoltageV)} V
        </text>

        {/* switch */}
        <circle cx="270" cy="60" r="4" fill="#1e293b" />
        <circle cx="350" cy="60" r="4" fill="#1e293b" />
        <line
          x1="270"
          y1="60"
          x2={switchClosed ? 350 : 338}
          y2={switchClosed ? 60 : 30}
          stroke={switchClosed ? '#15803d' : '#b91c1c'}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text x="310" y="88" textAnchor="middle" className="el-label">
          Switch {switchClosed ? 'closed' : 'open'}
        </text>

        {/* resistor */}
        <polyline
          points="520,120 508,130 532,142 508,154 532,166 508,178 532,190 520,200"
          fill="none"
          stroke="#7c2d12"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <text x="470" y="164" textAnchor="end" className="el-label">
          Resistor
        </text>
        <text x="470" y="180" textAnchor="end" className="el-label el-label-strong">
          {formatOhmNumber(resistanceOhm)} Ω
        </text>

        {/* ammeter in series */}
        <circle cx="320" cy="260" r="22" fill="#fffbeb" stroke="#1e4fa3" strokeWidth="3" />
        <text x="320" y="267" textAnchor="middle" className="el-meter-letter">
          A
        </text>
        <text x="320" y="302" textAnchor="middle" className="el-label el-label-strong">
          Ammeter: {formatOhmNumber(currentA)} A
        </text>

        {/* voltmeter across resistor */}
        <circle cx="600" cy="160" r="22" fill="#fffbeb" stroke="#7c3aed" strokeWidth="3" />
        <text x="600" y="167" textAnchor="middle" className="el-meter-letter">
          V
        </text>
        <text x="600" y="206" textAnchor="middle" className="el-label" />
        <text x="600" y="226" textAnchor="middle" className="el-label el-label-strong">
          {formatOhmNumber(resistorVoltageV)} V
        </text>
        <text x="600" y="242" textAnchor="middle" className="el-label">
          across R
        </text>
      </svg>
    </div>
  )
}

const PLOT_W = 480
const PLOT_H = 320
const M = { left: 62, right: 18, top: 16, bottom: 52 }

/** V (vertical, volts) against I (horizontal, amperes) for ONE resistance only. */
export function VIPlotSVG({
  points,
  resistanceOhm,
}: {
  points: readonly MeasurementPoint[]
  resistanceOhm: number
}) {
  const vMax = 12
  const iMax = 12 / resistanceOhm
  const x = (i: number) => M.left + (i / iMax) * (PLOT_W - M.left - M.right)
  const y = (v: number) => PLOT_H - M.bottom - (v / vMax) * (PLOT_H - M.top - M.bottom)
  const slope = fitSlopeOhm(points)
  const xTicks = [0, 1, 2, 3, 4].map((k) => (iMax * k) / 4)
  const yTicks = [0, 2, 4, 6, 8, 10, 12]

  let fitLine: { x1: number; y1: number; x2: number; y2: number } | null = null
  if (slope !== null) {
    const first = points[0]
    const last = points[points.length - 1]
    fitLine = { x1: x(first.currentA), y1: y(first.voltageV), x2: x(last.currentA), y2: y(last.voltageV) }
  }

  return (
    <svg
      viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
      className="el-plot-svg"
      role="img"
      aria-label={`Graph of voltage in volts against current in amperes for a ${formatOhmNumber(
        resistanceOhm
      )} ohm resistor with ${points.length} measured points.`}
    >
      <rect x={M.left} y={M.top} width={PLOT_W - M.left - M.right} height={PLOT_H - M.top - M.bottom} fill="#fffdf6" stroke="#cbbba0" />
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={M.left} x2={PLOT_W - M.right} y1={y(v)} y2={y(v)} stroke="#e7dcc3" />
          <text x={M.left - 8} y={y(v) + 4} textAnchor="end" className="el-tick">
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((i) => (
        <g key={`x${i}`}>
          <line x1={x(i)} x2={x(i)} y1={M.top} y2={PLOT_H - M.bottom} stroke="#e7dcc3" />
          <text x={x(i)} y={PLOT_H - M.bottom + 16} textAnchor="middle" className="el-tick">
            {formatOhmNumber(i)}
          </text>
        </g>
      ))}
      <text x={(M.left + PLOT_W - M.right) / 2} y={PLOT_H - 10} textAnchor="middle" className="el-axis-title">
        Current I (A)
      </text>
      <text
        transform={`translate(16, ${(M.top + PLOT_H - M.bottom) / 2}) rotate(-90)`}
        textAnchor="middle"
        className="el-axis-title"
      >
        Voltage V across resistor (V)
      </text>
      {fitLine && (
        <line {...fitLine} stroke="#1e4fa3" strokeWidth="2" strokeDasharray="6 4" />
      )}
      {points.map((p) => (
        <circle key={`${p.voltageV}`} cx={x(p.currentA)} cy={y(p.voltageV)} r="5" fill="#b91c1c" stroke="#fff" strokeWidth="1.5" />
      ))}
    </svg>
  )
}
