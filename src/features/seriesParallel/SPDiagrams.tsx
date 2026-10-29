import { formatOhmNumber } from './spInputValidation'
import type { SPResult } from './spModel'

export function SPCircuitSVG({ result }: { result: SPResult }) {
  const {
    arrangement,
    supplyVoltageV,
    resistance1Ohm,
    resistance2Ohm,
    switchClosed,
    supplyCurrentA,
    resistor1,
    resistor2,
    equivalentResistanceOhm,
  } = result

  const isFlowing = supplyCurrentA > 0
  const speedSec = Math.min(3.5, Math.max(0.3, 1.8 / Math.max(supplyCurrentA, 0.05)))
  const wireClass = `el-wire${isFlowing ? ' is-flowing' : ''}`
  const wireStyle = isFlowing ? { animationDuration: `${speedSec}s` } : undefined

  return (
    <div className="el-diagram-wrap">
      <svg
        viewBox="0 0 760 360"
        className="el-circuit-svg"
        role="img"
        aria-label={`Circuit schematic: ${arrangement} arrangement, supply ${formatOhmNumber(
          supplyVoltageV
        )} V, total current ${formatOhmNumber(supplyCurrentA)} A, equivalent resistance ${formatOhmNumber(
          equivalentResistanceOhm
        )} Ω.`}
      >
        <title>Series and Parallel DC Circuit</title>

        {/* ================= SINGLE RESISTOR MODE ================= */}
        {arrangement === 'single' && (
          <g>
            {/* Wires */}
            <path className={wireClass} style={wireStyle} d="M120 70 H300" />
            <path className={wireClass} style={wireStyle} d="M380 70 H560 V130" />
            <path className={wireClass} style={wireStyle} d="M560 210 V270 H380" />
            <path className={wireClass} style={wireStyle} d="M340 270 H120 V200" />
            <path className={wireClass} style={wireStyle} d="M120 140 V70" />

            {/* Voltmeter jumper across R1 */}
            <path className="el-wire" d="M560 130 H640 V150" />
            <path className="el-wire" d="M640 190 V210 H560" />

            {/* Battery */}
            <line x1="104" y1="180" x2="136" y2="180" stroke="#1e293b" strokeWidth="3" />
            <line x1="112" y1="160" x2="128" y2="160" stroke="#1e293b" strokeWidth="5" />
            <text x="148" y="166" className="el-label">Supply</text>
            <text x="148" y="184" className="el-label el-label-strong">{formatOhmNumber(supplyVoltageV)} V</text>

            {/* Switch */}
            <circle cx="300" cy="70" r="4" fill="#1e293b" />
            <circle cx="380" cy="70" r="4" fill="#1e293b" />
            <line
              x1="300"
              y1="70"
              x2={switchClosed ? 380 : 368}
              y2={switchClosed ? 70 : 40}
              stroke={switchClosed ? '#15803d' : '#b91c1c'}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text x="340" y="98" textAnchor="middle" className="el-label">
              Switch {switchClosed ? 'closed' : 'open'}
            </text>

            {/* Resistor R1 */}
            <polyline
              points="560,130 548,140 572,152 548,164 572,176 548,188 572,200 560,210"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <text x="510" y="165" textAnchor="end" className="el-label">Resistor R₁</text>
            <text x="510" y="183" textAnchor="end" className="el-label el-label-strong">{formatOhmNumber(resistance1Ohm)} Ω</text>

            {/* Supply Ammeter in series */}
            <circle cx="360" cy="270" r="22" fill="#fffbeb" stroke="#1e4fa3" strokeWidth="3" />
            <text x="360" y="277" textAnchor="middle" className="el-meter-letter">A</text>
            <text x="360" y="312" textAnchor="middle" className="el-label el-label-strong">
              Supply Ammeter: {formatOhmNumber(supplyCurrentA)} A
            </text>

            {/* Voltmeter across R1 */}
            <circle cx="640" cy="170" r="22" fill="#fffbeb" stroke="#7c3aed" strokeWidth="3" />
            <text x="640" y="177" textAnchor="middle" className="el-meter-letter">V₁</text>
            <text x="640" y="222" textAnchor="middle" className="el-label el-label-strong">{formatOhmNumber(resistor1.voltageV)} V</text>
            <text x="640" y="238" textAnchor="middle" className="el-label">across R₁</text>
          </g>
        )}

        {/* ================= SERIES RESISTORS MODE ================= */}
        {arrangement === 'series' && resistor2 && (
          <g>
            {/* Wires */}
            <path className={wireClass} style={wireStyle} d="M100 70 H270" />
            <path className={wireClass} style={wireStyle} d="M350 70 H490 V105" />
            {/* Between R1 and R2 */}
            <path className={wireClass} style={wireStyle} d="M490 175 V205" />
            {/* After R2 */}
            <path className={wireClass} style={wireStyle} d="M490 275 V300 H350" />
            <path className={wireClass} style={wireStyle} d="M310 300 H100 V200" />
            <path className={wireClass} style={wireStyle} d="M100 140 V70" />

            {/* Battery */}
            <line x1="84" y1="180" x2="116" y2="180" stroke="#1e293b" strokeWidth="3" />
            <line x1="92" y1="160" x2="108" y2="160" stroke="#1e293b" strokeWidth="5" />
            <text x="128" y="166" className="el-label">Supply</text>
            <text x="128" y="184" className="el-label el-label-strong">{formatOhmNumber(supplyVoltageV)} V</text>

            {/* Switch */}
            <circle cx="270" cy="70" r="4" fill="#1e293b" />
            <circle cx="350" cy="70" r="4" fill="#1e293b" />
            <line
              x1="270"
              y1="70"
              x2={switchClosed ? 350 : 338}
              y2={switchClosed ? 70 : 40}
              stroke={switchClosed ? '#15803d' : '#b91c1c'}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <text x="310" y="98" textAnchor="middle" className="el-label">
              Switch {switchClosed ? 'closed' : 'open'}
            </text>

            {/* Resistor R1 */}
            <polyline
              points="490,105 478,115 502,127 478,139 502,151 478,163 502,171 490,175"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <text x="440" y="135" textAnchor="end" className="el-label">Resistor R₁</text>
            <text x="440" y="153" textAnchor="end" className="el-label el-label-strong">{formatOhmNumber(resistance1Ohm)} Ω</text>
            <text x="440" y="170" textAnchor="end" className="el-label" fill="#15803d">I₁ = {formatOhmNumber(resistor1.currentA)} A</text>

            {/* Voltmeter across R1 */}
            <path className="el-wire" d="M490 105 H570 V122" />
            <path className="el-wire" d="M570 158 V175 H490" />
            <circle cx="570" cy="140" r="18" fill="#fffbeb" stroke="#7c3aed" strokeWidth="2.5" />
            <text x="570" y="146" textAnchor="middle" className="el-meter-letter" fontSize="16">V₁</text>
            <text x="600" y="145" className="el-label el-label-strong">{formatOhmNumber(resistor1.voltageV)} V</text>

            {/* Resistor R2 */}
            <polyline
              points="490,205 478,215 502,227 478,239 502,251 478,263 502,271 490,275"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <text x="440" y="235" textAnchor="end" className="el-label">Resistor R₂</text>
            <text x="440" y="253" textAnchor="end" className="el-label el-label-strong">{formatOhmNumber(resistance2Ohm)} Ω</text>
            <text x="440" y="270" textAnchor="end" className="el-label" fill="#15803d">I₂ = {formatOhmNumber(resistor2.currentA)} A</text>

            {/* Voltmeter across R2 */}
            <path className="el-wire" d="M490 205 H570 V222" />
            <path className="el-wire" d="M570 258 V275 H490" />
            <circle cx="570" cy="240" r="18" fill="#fffbeb" stroke="#7c3aed" strokeWidth="2.5" />
            <text x="570" y="246" textAnchor="middle" className="el-meter-letter" fontSize="16">V₂</text>
            <text x="600" y="245" className="el-label el-label-strong">{formatOhmNumber(resistor2.voltageV)} V</text>

            {/* Total Series Ammeter */}
            <circle cx="330" cy="300" r="20" fill="#fffbeb" stroke="#1e4fa3" strokeWidth="3" />
            <text x="330" y="306" textAnchor="middle" className="el-meter-letter" fontSize="16">A</text>
            <text x="330" y="338" textAnchor="middle" className="el-label el-label-strong">
              I_supply = {formatOhmNumber(supplyCurrentA)} A (same everywhere)
            </text>
          </g>
        )}

        {/* ================= PARALLEL RESISTORS MODE ================= */}
        {arrangement === 'parallel' && resistor2 && (
          <g>
            {/* Main Supply Loop */}
            <path className={wireClass} style={wireStyle} d="M90 60 H260" />
            <path className={wireClass} style={wireStyle} d="M340 60 H480" />

            {/* Battery */}
            <line x1="74" y1="180" x2="106" y2="180" stroke="#1e293b" strokeWidth="3" />
            <line x1="82" y1="160" x2="98" y2="160" stroke="#1e293b" strokeWidth="5" />
            <text x="118" y="166" className="el-label">Supply</text>
            <text x="118" y="184" className="el-label el-label-strong">{formatOhmNumber(supplyVoltageV)} V</text>
            <path className={wireClass} style={wireStyle} d="M90 60 V140" />
            <path className={wireClass} style={wireStyle} d="M90 200 V300 H330" />
            <path className={wireClass} style={wireStyle} d="M370 300 H480" />

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

            {/* Top Junction (Split) at (480, 60) */}
            <circle cx="480" cy="60" r="5" fill="#0f172a" />
            <text x="475" y="48" textAnchor="end" className="el-label" fill="#2563eb" fontWeight="700">Junction (Split)</text>

            {/* Branch 1 (Upper Branch) */}
            <path className={wireClass} style={wireStyle} d="M480 60 V100 H520" />
            {/* Branch 1 Ammeter */}
            <circle cx="540" cy="100" r="16" fill="#fffbeb" stroke="#1e4fa3" strokeWidth="2.5" />
            <text x="540" y="105" textAnchor="middle" className="el-meter-letter" fontSize="13">A₁</text>
            <path className={wireClass} style={wireStyle} d="M556 100 H600" />
            {/* Resistor R1 */}
            <polyline
              points="600,100 610,90 622,110 634,90 646,110 658,90 666,105 670,100"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path className={wireClass} style={wireStyle} d="M670 100 H710 V180" />

            <text x="635" y="80" textAnchor="middle" className="el-label el-label-strong">R₁ = {formatOhmNumber(resistance1Ohm)} Ω</text>
            <text x="635" y="132" textAnchor="middle" className="el-label" fill="#15803d" fontWeight="700">
              I₁ = {formatOhmNumber(resistor1.currentA)} A (V₁ = {formatOhmNumber(resistor1.voltageV)} V)
            </text>

            {/* Branch 2 (Lower Branch) */}
            <path className={wireClass} style={wireStyle} d="M480 60 V240 H520" />
            {/* Branch 2 Ammeter */}
            <circle cx="540" cy="240" r="16" fill="#fffbeb" stroke="#1e4fa3" strokeWidth="2.5" />
            <text x="540" y="245" textAnchor="middle" className="el-meter-letter" fontSize="13">A₂</text>
            <path className={wireClass} style={wireStyle} d="M556 240 H600" />
            {/* Resistor R2 */}
            <polyline
              points="600,240 610,230 622,250 634,230 646,250 658,230 666,245 670,240"
              fill="none"
              stroke="#7c2d12"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path className={wireClass} style={wireStyle} d="M670 240 H710 V180" />

            <text x="635" y="220" textAnchor="middle" className="el-label el-label-strong">R₂ = {formatOhmNumber(resistance2Ohm)} Ω</text>
            <text x="635" y="272" textAnchor="middle" className="el-label" fill="#15803d" fontWeight="700">
              I₂ = {formatOhmNumber(resistor2.currentA)} A (V₂ = {formatOhmNumber(resistor2.voltageV)} V)
            </text>

            {/* Right Junction (Recombine) at (710, 180) */}
            <circle cx="710" cy="180" r="5" fill="#0f172a" />
            <text x="715" y="195" className="el-label" fill="#2563eb" fontWeight="700">Junction (Recombine)</text>

            {/* Return Path to Supply */}
            <path className={wireClass} style={wireStyle} d="M710 180 V300 H480" />

            {/* Total Supply Ammeter */}
            <circle cx="350" cy="300" r="20" fill="#fffbeb" stroke="#1e4fa3" strokeWidth="3" />
            <text x="350" y="306" textAnchor="middle" className="el-meter-letter" fontSize="16">A</text>
            <text x="350" y="338" textAnchor="middle" className="el-label el-label-strong">
              I_total = I₁ + I₂ = {formatOhmNumber(supplyCurrentA)} A
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
