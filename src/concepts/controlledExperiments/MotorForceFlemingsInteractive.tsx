import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateMotorForceFlemingsRule } from './models'

interface Props {
  lang: Lang
}

export function MotorForceFlemingsInteractive({ lang }: Props) {
  const [magneticFieldT, setMagneticFieldT] = useState(0.5)
  const [currentA, setCurrentA] = useState(4)
  const [angleDeg, setAngleDeg] = useState(90)
  const [currentPol, setCurrentPol] = useState<1 | -1>(1)
  const [fieldPol, setFieldPol] = useState<1 | -1>(1)

  const res = calculateMotorForceFlemingsRule(
    magneticFieldT,
    currentA,
    angleDeg,
    currentPol,
    fieldPol,
    0.2
  )

  const forceArrowLen = Math.round((res.forceMagnitudeN / 1.0) * 52)
  const rodCenterY = 110 - res.forceDirectionSign * Math.min(34, forceArrowLen)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. चुंबकीय क्षेत्र एवं धारा' : '1. Field (B) & Current (I)',
      math: `B = ${res.magneticFieldTesla} T, I = ${res.currentA} A`,
    },
    {
      kicker: lang === 'hi' ? '2. कोण गुणक (sin θ)' : '2. Angle Factor (sin θ)',
      math: `θ = ${res.angleDeg}° → sin θ = ${res.sinTheta}`,
    },
    {
      kicker: lang === 'hi' ? '3. चुंबकीय बल (F = BIL sinθ)' : '3. Magnetic Force (F)',
      math: `F = ${res.forceMagnitudeN} N (L = 0.2 m)`,
    },
    {
      kicker: lang === 'hi' ? '4. फ्लेमिंग वाम-हस्त दिशा' : '4. Fleming Left-Hand Direction',
      math: res.forceDirectionLabel,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          type="button"
          className="nb-QuickChip"
          onClick={() => setCurrentPol((p) => (p === 1 ? -1 : 1))}
        >
          {lang === 'hi'
            ? `धारा दिशा पलटें (Current I: ${currentPol === 1 ? '+X →' : '← −X'})`
            : `Reverse Current I (${currentPol === 1 ? '+X →' : '← −X'})`}
        </button>
        <button
          type="button"
          className="nb-QuickChip"
          onClick={() => setFieldPol((p) => (p === 1 ? -1 : 1))}
        >
          {lang === 'hi'
            ? `चुंबक ध्रुव पलटें (Field B: ${fieldPol === 1 ? 'N → S' : 'S ← N'})`
            : `Reverse Magnetic Field B (${fieldPol === 1 ? 'N → S' : 'S ← N'})`}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${angleDeg === 90 ? 'is-active' : ''}`}
          onClick={() => setAngleDeg(90)}
        >
          {lang === 'hi' ? 'θ = 90° (लंबवत · अधिकतम बल)' : 'θ = 90° (Perpendicular · Max Force)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${angleDeg === 0 ? 'is-active' : ''}`}
          onClick={() => setAngleDeg(0)}
        >
          {lang === 'hi' ? 'θ = 0° (समानांतर · शून्य बल)' : 'θ = 0° (Parallel · Zero Force)'}
        </button>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Fleming's left-hand rule motor force apparatus: B=${res.magneticFieldTesla} T, I=${res.currentA} A, angle=${res.angleDeg} degrees, force=${res.forceMagnitudeN} N ${res.forceDirectionLabel}`}
        >
          <defs>
            <pattern id="nb-motor-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-motor-grid)" />

          {/* Left Panel: Horseshoe Magnet & Suspended Aluminium Rod AB */}
          <rect x="18" y="18" width="405" height="178" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="32" y="38" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            KICKING WIRE APPARATUS (NCERT Activity 12.7 · L = 0.20 m)
          </text>

          {/* Left & Right Magnet Poles */}
          <rect
            x="44"
            y="66"
            width="64"
            height="88"
            rx="6"
            fill={fieldPol === 1 ? '#dc2626' : '#2563eb'}
            stroke="#1e293b"
            strokeWidth="2"
          />
          <text x="76" y="116" textAnchor="middle" fontSize="18" fontWeight="900" fill="#ffffff" fontFamily="ui-monospace, monospace">
            {fieldPol === 1 ? 'N' : 'S'}
          </text>

          <rect
            x="332"
            y="66"
            width="64"
            height="88"
            rx="6"
            fill={fieldPol === 1 ? '#2563eb' : '#dc2626'}
            stroke="#1e293b"
            strokeWidth="2"
          />
          <text x="364" y="116" textAnchor="middle" fontSize="18" fontWeight="900" fill="#ffffff" fontFamily="ui-monospace, monospace">
            {fieldPol === 1 ? 'S' : 'N'}
          </text>

          {/* Magnetic Field Lines B between Poles */}
          <line x1="112" y1="88" x2="328" y2="88" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 3" />
          <line x1="112" y1="132" x2="328" y2="132" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x="220" y="60" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#475569" fontFamily="ui-monospace, monospace">
            {fieldPol === 1 ? 'Magnetic Field B (N → S) →' : '← Magnetic Field B (N ← S)'}
          </text>

          {/* Suspended Conductor Rod AB */}
          <rect
            x="160"
            y={rodCenterY - 9}
            width="120"
            height="18"
            rx="6"
            fill="#d97706"
            stroke="#78350f"
            strokeWidth="2"
          />
          <text x="220" y={rodCenterY + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#ffffff" fontFamily="ui-monospace, monospace">
            {currentPol === 1 ? 'Rod AB (I ⊙ Out)' : 'Rod AB (I ⊗ In)'}
          </text>

          {/* Force Vector Label */}
          <text
            x="220"
            y="180"
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="900"
            fill={res.forceDirectionSign === 0 ? '#991b1b' : '#065f46'}
            fontFamily="ui-monospace, monospace"
          >
            Force F = {res.forceMagnitudeN} N → {res.forceDirectionLabel}
          </text>

          {/* Right Panel: Fleming's Left-Hand Rule Ledger */}
          <g transform="translate(438, 18)">
            <rect x="0" y="0" width="302" height="178" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="151" y="23" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              FLEMING’S LEFT-HAND LEDGER (Ch 12.3)
            </text>

            <rect x="14" y="34" width="274" height="44" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="22" y="50" fontSize="9.5" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              1. Forefinger (Field B): {fieldPol === 1 ? 'N → S (+Y)' : 'S ← N (−Y)'}
            </text>
            <text x="22" y="67" fontSize="9.5" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              2. Middle Finger (Current I): {currentPol === 1 ? '+X (⊙ Out)' : '−X (⊗ In)'}
            </text>

            <rect
              x="14"
              y="86"
              width="274"
              height="44"
              rx="5"
              fill={res.forceDirectionSign === 0 ? '#fef2f2' : '#ecfdf5'}
              stroke={res.forceDirectionSign === 0 ? '#fca5a5' : '#6ee7b7'}
            />
            <text
              x="22"
              y="103"
              fontSize="10"
              fontWeight="900"
              fill={res.forceDirectionSign === 0 ? '#991b1b' : '#065f46'}
              fontFamily="ui-monospace, monospace"
            >
              3. Thumb (Force F): {res.forceDirectionLabel}
            </text>
            <text
              x="22"
              y="120"
              fontSize="10"
              fontWeight="800"
              fill="#334155"
              fontFamily="ui-monospace, monospace"
            >
              F = B·I·L·sin({res.angleDeg}°) = {res.forceMagnitudeN} N
            </text>

            <rect x="14" y="138" width="274" height="28" rx="5" fill="#fef3c7" stroke="#fcd34d" />
            <text x="151" y="156" textAnchor="middle" fontSize="9" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
              Flip 1 (I or B) → F reverses | Flip BOTH → F same!
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="mff-field-slider"
          label={lang === 'hi' ? 'चुंबकीय क्षेत्र (B)' : 'Magnetic Field (B)'}
          value={magneticFieldT}
          min={0.2}
          max={1.5}
          step={0.1}
          unit=" T"
          lang={lang}
          onChange={setMagneticFieldT}
        />
        <SliderField
          id="mff-current-slider"
          label={lang === 'hi' ? 'चालक में धारा (I)' : 'Conductor Current (I)'}
          value={currentA}
          min={1}
          max={10}
          step={0.5}
          unit=" A"
          lang={lang}
          onChange={setCurrentA}
        />
        <SliderField
          id="mff-angle-slider"
          label={lang === 'hi' ? 'कोण (θ: B व I के बीच)' : 'Angle Between B and I (θ)'}
          value={angleDeg}
          min={0}
          max={90}
          step={15}
          unit="°"
          lang={lang}
          onChange={setAngleDeg}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Fleming left-hand rule motor force pipeline" />
    </div>
  )
}
