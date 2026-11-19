import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateEyeDefectCorrection, type EyeDefectType } from './models'

interface Props {
  lang: Lang
}

export function EyeDefectCorrectionInteractive({ lang }: Props) {
  const [defectType, setDefectType] = useState<EyeDefectType>('myopia')
  const [defectivePointCm, setDefectivePointCm] = useState(80)
  const [correctionEnabled, setCorrectionEnabled] = useState(true)

  const res = calculateEyeDefectCorrection(defectType, defectivePointCm, correctionEnabled)

  // Eye SVG geometry: spectacle lens at x=165, cornea/eye-lens at x=235, retina back wall at x=365
  const retinaX = 365
  const focusX =
    res.activeFocusSite === 'on-retina'
      ? retinaX
      : res.activeFocusSite === 'in-front-of-retina'
        ? 315
        : 405

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. बिंब दूरी (u)' : '1. Object Distance (u)',
      math: res.defectType === 'myopia' ? 'u = −∞ (Distant)' : 'u = −25 cm (Near Point)',
    },
    {
      kicker: lang === 'hi' ? '2. आभासी प्रतिबिंब लक्ष्य (v)' : '2. Target Virtual Image (v)',
      math: `v = ${res.virtualImageDistanceCm} cm`,
    },
    {
      kicker: lang === 'hi' ? '3. संशोधक फोकस दूरी (f)' : '3. Corrective Focal Length (f)',
      math: `f = ${res.correctiveFocalLengthCm > 0 ? '+' : ''}${res.correctiveFocalLengthCm} cm (${res.requiredLensType.toUpperCase()})`,
    },
    {
      kicker: lang === 'hi' ? '4. चश्मे की क्षमता (P = 100/f)' : '4. Spectacle Power (P)',
      math: `P = ${res.correctivePowerDioptres > 0 ? '+' : ''}${res.correctivePowerDioptres} D`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          type="button"
          className={`nb-QuickChip ${defectType === 'myopia' ? 'is-active' : ''}`}
          aria-pressed={defectType === 'myopia'}
          onClick={() => {
            setDefectType('myopia')
            setDefectivePointCm(80)
          }}
        >
          {lang === 'hi'
            ? 'निकट-दृष्टि दोष (Myopia · अवतल लेंस)'
            : 'Myopia (Near-Sighted · Concave −D)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${defectType === 'hypermetropia' ? 'is-active' : ''}`}
          aria-pressed={defectType === 'hypermetropia'}
          onClick={() => {
            setDefectType('hypermetropia')
            setDefectivePointCm(100)
          }}
        >
          {lang === 'hi'
            ? 'दीर्घ-दृष्टि दोष (Hypermetropia · उत्तल लेंस)'
            : 'Hypermetropia (Far-Sighted · Convex +D)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${correctionEnabled ? 'is-active' : ''}`}
          aria-pressed={correctionEnabled}
          onClick={() => setCorrectionEnabled((v) => !v)}
        >
          {correctionEnabled
            ? lang === 'hi'
              ? '✓ संशोधक चश्मा लगा है (Spectacles ON)'
              : '✓ Corrective Spectacles ON'
            : lang === 'hi'
              ? '✗ बिना चश्मे के (Uncorrected Eye)'
              : '✗ Uncorrected Eye (Spectacles OFF)'}
        </button>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Human eye defect simulator: ${res.defectType}, focus ${res.activeFocusSite}, power ${res.correctivePowerDioptres} D`}
        >
          <defs>
            <pattern id="nb-eye-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-eye-grid)" />

          {/* Principal Optic Axis */}
          <line x1="25" y1="108" x2="430" y2="108" stroke="#64748b" strokeWidth="1.3" strokeDasharray="4 3" />

          {/* Eyeball Cross-Section (Center at x=300, y=108, rx=65, ry=58) */}
          <ellipse
            cx="300"
            cy="108"
            rx={defectType === 'myopia' ? 68 : 60}
            ry="56"
            fill="#fffbeb"
            stroke="#78350f"
            strokeWidth="2.6"
          />
          {/* Retina Highlight Arc at Back Wall */}
          <path
            d={`M ${retinaX - 10} 62 Q ${retinaX + 10} 108 ${retinaX - 10} 154`}
            fill="none"
            stroke="#dc2626"
            strokeWidth="3.5"
          />
          <text x={retinaX - 4} y="48" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#991b1b" fontFamily="ui-monospace, monospace">
            Retina
          </text>

          {/* Eye Crystalline Lens at x=240 */}
          <ellipse cx="240" cy="108" rx="9" ry="34" fill="rgba(56, 189, 248, 0.35)" stroke="#0284c7" strokeWidth="2" />
          <text x="240" y="160" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0369a1" fontFamily="ui-monospace, monospace">
            Eye Lens
          </text>

          {/* Optional Corrective Spectacle Lens at x=165 */}
          {correctionEnabled && (
            <g>
              {res.requiredLensType === 'concave' ? (
                <path
                  d="M 157 66 L 173 66 Q 165 108 173 150 L 157 150 Q 165 108 157 66 Z"
                  fill="rgba(147, 197, 253, 0.45)"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
              ) : (
                <ellipse
                  cx="165"
                  cy="108"
                  rx="8"
                  ry="42"
                  fill="rgba(147, 197, 253, 0.45)"
                  stroke="#1d4ed8"
                  strokeWidth="2"
                />
              )}
              <text x="165" y="54" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
                {res.correctivePowerDioptres > 0 ? `+${res.correctivePowerDioptres} D` : `${res.correctivePowerDioptres} D`}
              </text>
            </g>
          )}

          {/* Incoming Light Rays */}
          {defectType === 'myopia' ? (
            <>
              {/* Parallel rays from infinity */}
              <line x1="35" y1="84" x2="165" y2="84" stroke="#d97706" strokeWidth="2.2" />
              <line x1="35" y1="132" x2="165" y2="132" stroke="#d97706" strokeWidth="2.2" />
              <text x="42" y="74" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
                From ∞ (Parallel)
              </text>
            </>
          ) : (
            <>
              {/* Diverging rays from Near Point N = -25 cm (x=55) */}
              <circle cx="55" cy="108" r="4.5" fill="#d97706" />
              <line x1="55" y1="108" x2="165" y2="84" stroke="#d97706" strokeWidth="2.2" />
              <line x1="55" y1="108" x2="165" y2="132" stroke="#d97706" strokeWidth="2.2" />
              <text x="55" y="95" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
                N (−25cm)
              </text>
            </>
          )}

          {/* Rays between spectacle plane (x=165) and eye lens (x=240) */}
          <line
            x1="165"
            y1="84"
            x2="240"
            y2={correctionEnabled ? (defectType === 'myopia' ? 78 : 88) : 84}
            stroke="#d97706"
            strokeWidth="2.2"
          />
          <line
            x1="165"
            y1="132"
            x2="240"
            y2={correctionEnabled ? (defectType === 'myopia' ? 138 : 128) : 132}
            stroke="#d97706"
            strokeWidth="2.2"
          />

          {/* Refracted Rays inside Eyeball converging at focusX */}
          <line
            x1="240"
            y1={correctionEnabled ? (defectType === 'myopia' ? 78 : 88) : 84}
            x2={focusX}
            y2="108"
            stroke={res.activeFocusSite === 'on-retina' ? '#16a34a' : '#dc2626'}
            strokeWidth="2.5"
          />
          <line
            x1="240"
            y1={correctionEnabled ? (defectType === 'myopia' ? 138 : 128) : 132}
            x2={focusX}
            y2="108"
            stroke={res.activeFocusSite === 'on-retina' ? '#16a34a' : '#dc2626'}
            strokeWidth="2.5"
          />
          <circle
            cx={focusX}
            cy="108"
            r="5.5"
            fill={res.activeFocusSite === 'on-retina' ? '#16a34a' : '#dc2626'}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          <text
            x={focusX}
            y="188"
            textAnchor="middle"
            fontSize="10"
            fontWeight="900"
            fill={res.activeFocusSite === 'on-retina' ? '#065f46' : '#991b1b'}
            fontFamily="ui-monospace, monospace"
          >
            {res.activeFocusSite === 'on-retina'
              ? '✓ Sharp Focus on Retina'
              : res.activeFocusSite === 'in-front-of-retina'
                ? '✗ Focus IN FRONT of Retina (Myopia)'
                : '✗ Focus BEHIND Retina (Hypermetropia)'}
          </text>

          {/* Right-Side Prescription Ledger */}
          <g transform="translate(442, 18)">
            <rect x="0" y="0" width="298" height="178" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="149" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              OPTOMETRIST LEDGER (NCERT Ch 10.2)
            </text>

            <text x="16" y="48" fontSize="10" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
              {defectType === 'myopia'
                ? `Defective Far Point (d_F): ${res.defectivePointCm} cm`
                : `Defective Near Point (d_N): ${res.defectivePointCm} cm`}
            </text>
            <text x="16" y="70" fontSize="10" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              {defectType === 'myopia'
                ? `Lens Formula: 1/f = 1/(−${res.defectivePointCm}) − 1/(−∞)`
                : `Lens Formula: 1/f = 1/(−${res.defectivePointCm}) − 1/(−25)`}
            </text>
            <text x="16" y="92" fontSize="10.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              Required f = {res.correctiveFocalLengthCm > 0 ? '+' : ''}{res.correctiveFocalLengthCm} cm ({res.requiredLensType.toUpperCase()})
            </text>

            <rect
              x="14"
              y="108"
              width="270"
              height="54"
              rx="6"
              fill={res.activeFocusSite === 'on-retina' ? '#ecfdf5' : '#fef2f2'}
              stroke={res.activeFocusSite === 'on-retina' ? '#6ee7b7' : '#fca5a5'}
            />
            <text
              x="149"
              y="130"
              textAnchor="middle"
              fontSize="11"
              fontWeight="900"
              fill={res.activeFocusSite === 'on-retina' ? '#065f46' : '#991b1b'}
              fontFamily="ui-monospace, monospace"
            >
              Rx Power P = {res.correctivePowerDioptres > 0 ? '+' : ''}{res.correctivePowerDioptres} D
            </text>
            <text
              x="149"
              y="149"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill={res.activeFocusSite === 'on-retina' ? '#065f46' : '#991b1b'}
              fontFamily="ui-monospace, monospace"
            >
              {correctionEnabled ? 'Virtual image placed at eye’s clear point ✓' : 'Toggle Spectacles ON to restore retinal focus'}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="edc-point-slider"
          label={
            defectType === 'myopia'
              ? lang === 'hi'
                ? 'दोषपूर्ण दूर बिंदु (Far Point d_F)'
                : 'Myopic Far Point Distance (d_F)'
              : lang === 'hi'
                ? 'दोषपूर्ण निकट बिंदु (Near Point d_N)'
                : 'Hypermetropic Near Point Distance (d_N)'
          }
          value={defectivePointCm}
          min={defectType === 'myopia' ? 25 : 40}
          max={200}
          step={5}
          unit=" cm"
          lang={lang}
          onChange={setDefectivePointCm}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Eye defect corrective lens power calculation pipeline" />
    </div>
  )
}
