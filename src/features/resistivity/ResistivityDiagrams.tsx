import { formatWireNumber } from './resistivityInputValidation'
import type { WireResult } from './resistivityModel'

export function WireSpecimenSVG({ result }: { result: WireResult }) {
  const {
    material,
    lengthM,
    areaMm2,
    diameterMm,
    supplyVoltageV,
    switchClosed,
    resistanceOhm,
    currentA,
    resistorVoltageV,
  } = result

  const isFlowing = currentA > 0
  const speedSec = Math.min(3.5, Math.max(0.3, 1.8 / Math.max(currentA, 0.05)))
  const wireClass = `el-wire${isFlowing ? ' is-flowing' : ''}`
  const wireStyle = isFlowing ? { animationDuration: `${speedSec}s` } : undefined

  // Visual scaling of the specimen wire inside the SVG:
  // lengthM: 0.2 m to 10 m -> maps to visual width 100px to 320px
  const minL = 0.2
  const maxL = 10.0
  const normL = Math.max(0, Math.min(1, (lengthM - minL) / (maxL - minL)))
  const specimenWidthPx = 100 + normL * 220

  // areaMm2: 0.05 to 2.0 mm² -> visual thickness 6px to 34px
  const minA = 0.05
  const maxA = 2.0
  const normA = Math.max(0, Math.min(1, (areaMm2 - minA) / (maxA - minA)))
  const specimenHeightPx = 6 + normA * 28

  const benchStartX = 410
  const benchY = 160
  const specimenEndX = benchStartX + specimenWidthPx

  return (
    <div className="el-diagram-wrap">
      <svg
        viewBox="0 0 760 360"
        className="el-circuit-svg"
        role="img"
        aria-label={`Wire test bench: ${material.name} wire, length ${formatWireNumber(
          lengthM
        )} m, area ${formatWireNumber(areaMm2)} mm², resistance ${formatWireNumber(
          resistanceOhm
        )} Ω, current ${formatWireNumber(currentA)} A.`}
      >
        <title>Wire Resistance &amp; Resistivity Test Bench</title>

        {/* ================= CIRCUIT CONNECTING LEADS ================= */}
        {/* Left supply loop */}
        <path className={wireClass} style={wireStyle} d="M100 60 H260" />
        <path className={wireClass} style={wireStyle} d="M340 60 H410 V160" />

        {/* Battery */}
        <line x1="84" y1="180" x2="116" y2="180" stroke="#1e293b" strokeWidth="3" />
        <line x1="92" y1="160" x2="108" y2="160" stroke="#1e293b" strokeWidth="5" />
        <text x="128" y="166" className="el-label">Supply</text>
        <text x="128" y="184" className="el-label el-label-strong">{formatWireNumber(supplyVoltageV)} V</text>
        <path className={wireClass} style={wireStyle} d="M100 60 V140" />
        <path className={wireClass} style={wireStyle} d="M100 200 V300 H320" />
        <path className={wireClass} style={wireStyle} d="M360 300 H730 V160" />

        {/* Switch */}
        <circle cx="260" cy="60" r="4" fill="#1e293b" />
        <circle cx="340" cy="60" r="4" fill="#1e293b" />
        <line
          x1="260"
          y1="60"
          x2={switchClosed ? 340 : 328}
          y2={switchClosed ? 60 : 32}
          stroke={switchClosed ? '#15803d' : '#b91c1c'}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text x="300" y="86" textAnchor="middle" className="el-label">
          Switch {switchClosed ? 'closed' : 'open'}
        </text>

        {/* Supply Ammeter in series */}
        <circle cx="340" cy="300" r="22" fill="#fffbeb" stroke="#1e4fa3" strokeWidth="3" />
        <text x="340" y="307" textAnchor="middle" className="el-meter-letter">A</text>
        <text x="340" y="342" textAnchor="middle" className="el-label el-label-strong">
          Ammeter: {formatWireNumber(currentA)} A
        </text>

        {/* Right lead connecting specimen end to circuit */}
        <path className={wireClass} style={wireStyle} d={`M${specimenEndX} 160 H730`} />

        {/* ================= SPECIMEN MOUNT & CLAMPS ================= */}
        {/* Test Specimen Material Pill Badge */}
        <g transform="translate(420, 50)">
          <rect
            x="0"
            y="0"
            width="300"
            height="30"
            rx="6"
            fill="#fffbeb"
            stroke="#cbd5e1"
            strokeWidth="1.2"
          />
          <circle cx="16" cy="15" r="5" fill={material.colorHex} />
          <text x="30" y="20" className="el-label el-label-strong" fill={material.colorHex}>
            Specimen: {material.name} (ρ = {formatWireNumber(material.resistivityOhmMeter)} Ω·m)
          </text>
        </g>

        {/* Terminal A clamp */}
        <rect x="398" y="140" width="16" height="40" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        <circle cx="406" cy="160" r="4" fill="#0f172a" />
        <text x="406" y="130" textAnchor="middle" className="el-label" fontWeight="700">Clamp A</text>

        {/* Terminal B clamp */}
        <rect x={specimenEndX - 4} y="140" width="16" height="40" rx="3" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        <circle cx={specimenEndX + 4} cy="160" r="4" fill="#0f172a" />
        <text x={specimenEndX + 4} y="130" textAnchor="middle" className="el-label" fontWeight="700">Clamp B</text>

        {/* THE TEST WIRE SPECIMEN (Cylinder with thickness & material color) */}
        <g>
          {/* Wire body */}
          <rect
            x={benchStartX}
            y={benchY - specimenHeightPx / 2}
            width={specimenWidthPx}
            height={specimenHeightPx}
            rx={specimenHeightPx / 4}
            fill={material.colorHex}
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          {/* Cylindrical highlight */}
          <rect
            x={benchStartX}
            y={benchY - specimenHeightPx / 2 + 1}
            width={specimenWidthPx}
            height={Math.max(2, specimenHeightPx / 3)}
            rx="1"
            fill="#ffffff"
            opacity="0.35"
          />
        </g>

        {/* Dimension Callout Under Specimen */}
        <g>
          <line
            x1={benchStartX}
            y1={benchY + specimenHeightPx / 2 + 14}
            x2={specimenEndX}
            y2={benchY + specimenHeightPx / 2 + 14}
            stroke="#475569"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text
            x={benchStartX + specimenWidthPx / 2}
            y={benchY + specimenHeightPx / 2 + 28}
            textAnchor="middle"
            className="el-label"
            fontWeight="600"
          >
            L = {formatWireNumber(lengthM)} m · A = {formatWireNumber(areaMm2)} mm² (d ≈ {formatWireNumber(diameterMm, 2)} mm)
          </text>
        </g>

        {/* Voltmeter across specimen clamps */}
        <path className="el-wire" d={`M406 180 V240 H${benchStartX + specimenWidthPx / 2 - 20}`} />
        <path className="el-wire" d={`M${specimenEndX + 4} 180 V240 H${benchStartX + specimenWidthPx / 2 + 20}`} />
        <circle
          cx={benchStartX + specimenWidthPx / 2}
          cy="240"
          r="19"
          fill="#fffbeb"
          stroke="#7c3aed"
          strokeWidth="2.5"
        />
        <text
          x={benchStartX + specimenWidthPx / 2}
          y="246"
          textAnchor="middle"
          className="el-meter-letter"
          fontSize="15"
        >
          V
        </text>
        <text
          x={benchStartX + specimenWidthPx / 2}
          y="274"
          textAnchor="middle"
          className="el-label el-label-strong"
        >
          Voltmeter: {formatWireNumber(resistorVoltageV)} V
        </text>
      </svg>
    </div>
  )
}
