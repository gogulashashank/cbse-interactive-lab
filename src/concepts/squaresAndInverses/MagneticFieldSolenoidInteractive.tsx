import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateMagneticFieldSolenoid } from './models'

interface Props {
  lang: Lang
}

export function MagneticFieldSolenoidInteractive({ lang }: Props) {
  const [currentA, setCurrentA] = useState(4)
  const [radialDistanceCm, setRadialDistanceCm] = useState(2)
  const [solenoidTurnsN, setSolenoidTurnsN] = useState(100)
  const [direction, setDirection] = useState<'upward-or-ccw' | 'downward-or-cw'>('upward-or-ccw')

  const res = calculateMagneticFieldSolenoid(currentA, radialDistanceCm, solenoidTurnsN, direction)

  const probeRadiusPx = 14 + (res.radialDistanceCm / 10) * 52

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. सीधे चालक का क्षेत्र (B ∝ I/r)' : '1. Straight Wire (B ∝ I/r)',
      math: `B_wire = ${res.wireFieldMicroTesla} μT (at r=${res.radialDistanceCm}cm)`,
    },
    {
      kicker: lang === 'hi' ? '2. दक्षिण-हस्त अंगुष्ठ नियम' : '2. Right-Hand Thumb Sense',
      math: res.thumbRuleFieldLoopSense === 'anticlockwise' ? '↺ Anticlockwise' : '↻ Clockwise',
    },
    {
      kicker: lang === 'hi' ? '3. परिनालिका क्रोड क्षेत्र (B ∝ NI)' : '3. Solenoid Core (B ∝ NI)',
      math: `B_core = ${res.solenoidCoreFieldMilliTesla} mT (N=${res.solenoidTurnsN})`,
    },
    {
      kicker: lang === 'hi' ? '4. परिनालिका ध्रुवता (N / S)' : '4. Solenoid Polarity',
      math: `Left: ${res.solenoidLeftPole} | Right: ${res.solenoidRightPole}`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          type="button"
          className={`nb-QuickChip ${direction === 'upward-or-ccw' ? 'is-active' : ''}`}
          aria-pressed={direction === 'upward-or-ccw'}
          onClick={() => setDirection('upward-or-ccw')}
        >
          {lang === 'hi'
            ? '↑ धारा ऊपर की ओर (B वामावर्त ↺ · बायाँ ध्रुव = N)'
            : '↑ Current Upward (Field ↺ Anticlockwise · Left = North)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${direction === 'downward-or-cw' ? 'is-active' : ''}`}
          aria-pressed={direction === 'downward-or-cw'}
          onClick={() => setDirection('downward-or-cw')}
        >
          {lang === 'hi'
            ? '↓ धारा नीचे की ओर (B दक्षिणावर्त ↻ · बायाँ ध्रुव = S)'
            : '↓ Current Downward (Field ↻ Clockwise · Left = South)'}
        </button>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Magnetic field bench: wire field ${res.wireFieldMicroTesla} microTesla at r=${res.radialDistanceCm} cm, solenoid core field ${res.solenoidCoreFieldMilliTesla} milliTesla`}
        >
          <defs>
            <pattern id="nb-mag-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-mag-grid)" />

          {/* Left Panel: Straight Conductor & Concentric Field Rings (B ∝ I/r) */}
          <rect x="18" y="18" width="205" height="178" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="120" y="36" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            1. STRAIGHT WIRE (B ∝ I / r)
          </text>

          {/* Concentric Field Circles */}
          <circle cx="120" cy="112" r="24" fill="none" stroke="#93c5fd" strokeWidth="1.4" strokeDasharray="3 3" />
          <circle cx="120" cy="112" r="44" fill="none" stroke="#93c5fd" strokeWidth="1.4" strokeDasharray="3 3" />
          <circle cx="120" cy="112" r="64" fill="none" stroke="#93c5fd" strokeWidth="1.4" strokeDasharray="3 3" />

          {/* Active Probe Radius Circle */}
          <circle cx="120" cy="112" r={probeRadiusPx} fill="none" stroke="#2563eb" strokeWidth="2.4" />
          <circle cx={120 + probeRadiusPx} cy="112" r="4.5" fill="#dc2626" />

          {/* Central Conductor Wire */}
          <circle cx="120" cy="112" r="8" fill="#b45309" stroke="#78350f" strokeWidth="2" />
          <text x="120" y="116" textAnchor="middle" fontSize="10" fontWeight="900" fill="#ffffff" fontFamily="ui-monospace, monospace">
            {direction === 'upward-or-ccw' ? '⊙' : '⊗'}
          </text>
          <text x="120" y="186" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            r={res.radialDistanceCm}cm → B={res.wireFieldMicroTesla}μT ({res.thumbRuleFieldLoopSense === 'anticlockwise' ? '↺' : '↻'})
          </text>

          {/* Center Panel: Current-Carrying Solenoid (B ∝ N*I) */}
          <rect x="235" y="18" width="215" height="178" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="342" y="36" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            2. SOLENOID CORE (B ∝ N × I)
          </text>

          {/* Uniform Parallel Field Lines Inside Solenoid */}
          <line x1="255" y1="96" x2="430" y2="96" stroke="#2563eb" strokeWidth="2" />
          <line x1="255" y1="112" x2="430" y2="112" stroke="#2563eb" strokeWidth="2.4" />
          <line x1="255" y1="128" x2="430" y2="128" stroke="#2563eb" strokeWidth="2" />

          {/* Solenoid Coil Loops */}
          {[280, 304, 328, 352, 376, 400].map((lx) => (
            <ellipse
              key={lx}
              cx={lx}
              cy="112"
              rx="9"
              ry="32"
              fill="none"
              stroke="#b45309"
              strokeWidth="2.4"
            />
          ))}

          {/* Pole Badges */}
          <rect x="245" y="152" width="44" height="22" rx="4" fill={res.solenoidLeftPole === 'North' ? '#fee2e2' : '#dbeafe'} stroke="#64748b" />
          <text x="267" y="167" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            {res.solenoidLeftPole[0]}-Pole
          </text>
          <rect x="395" y="152" width="44" height="22" rx="4" fill={res.solenoidRightPole === 'North' ? '#fee2e2' : '#dbeafe'} stroke="#64748b" />
          <text x="417" y="167" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            {res.solenoidRightPole[0]}-Pole
          </text>

          {/* Right Panel: Magnetic Scaling Ledger */}
          <g transform="translate(462, 18)">
            <rect x="0" y="0" width="280" height="178" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="140" y="23" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              MAGNETIC LEDGER (NCERT Ch 12.2)
            </text>

            <rect x="12" y="34" width="256" height="42" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="20" y="50" fontSize="9.5" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              INVERSE DISTANCE RULE (B ∝ I / r):
            </text>
            <text x="20" y="66" fontSize="10.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              I={res.currentA}A, r={res.radialDistanceCm}cm → {res.wireFieldMicroTesla} μT
            </text>

            <rect x="12" y="84" width="256" height="42" rx="5" fill="#fef3c7" stroke="#fcd34d" />
            <text x="20" y="100" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
              SOLENOID UNIFORM CORE (B ∝ N × I):
            </text>
            <text x="20" y="116" fontSize="10.5" fontWeight="900" fill="#78350f" fontFamily="ui-monospace, monospace">
              N={res.solenoidTurnsN} turns → B = {res.solenoidCoreFieldMilliTesla} mT
            </text>

            <rect x="12" y="134" width="256" height="32" rx="5" fill="#ecfdf5" stroke="#6ee7b7" />
            <text x="140" y="154" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#065f46" fontFamily="ui-monospace, monospace">
              Inside solenoid: parallel lines = UNIFORM B ✓
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="mfs-current-slider"
          label={lang === 'hi' ? 'विद्युत धारा (I)' : 'Electric Current (I)'}
          value={currentA}
          min={1}
          max={10}
          step={0.5}
          unit=" A"
          lang={lang}
          onChange={setCurrentA}
        />
        <SliderField
          id="mfs-radius-slider"
          label={lang === 'hi' ? 'चालक से दूरी (r)' : 'Radial Distance from Wire (r)'}
          value={radialDistanceCm}
          min={1}
          max={10}
          step={0.5}
          unit=" cm"
          lang={lang}
          onChange={setRadialDistanceCm}
        />
        <SliderField
          id="mfs-turns-slider"
          label={lang === 'hi' ? 'परिनालिका के फेरे (N)' : 'Solenoid Coil Turns (N)'}
          value={solenoidTurnsN}
          min={50}
          max={300}
          step={25}
          unit=" turns"
          lang={lang}
          onChange={setSolenoidTurnsN}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Magnetic field inverse radial scaling and solenoid pipeline" />
    </div>
  )
}
