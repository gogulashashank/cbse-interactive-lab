import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculatePhIonScaling } from './models'

interface Props {
  lang: Lang
}

const PH_BAND_COLORS = [
  '#dc2626', // 0
  '#ea580c', // 1
  '#f97316', // 2
  '#f59e0b', // 3
  '#eab308', // 4
  '#84cc16', // 5
  '#22c55e', // 6
  '#10b981', // 7 (Neutral)
  '#06b6d4', // 8
  '#0ea5e9', // 9
  '#3b82f6', // 10
  '#6366f1', // 11
  '#8b5cf6', // 12
  '#a855f7', // 13
  '#7e22ce', // 14
]

export function PhScaleExponentialInteractive({ lang }: Props) {
  const [phValue, setPhValue] = useState(2)
  const [referencePh, setReferencePh] = useState(5)

  const res = calculatePhIonScaling(phValue, referencePh)

  // Position marker along x: 35..399 for pH 0..14 (26 px per unit)
  const markerX = 35 + res.phValue * 25
  const refMarkerX = 35 + res.referencePh * 25

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. हाइड्रोजन सांद्रता [H⁺]' : '1. [H⁺] Concentration',
      math: `[H⁺] = 10^(${res.hPlusExponent}) mol/L`,
    },
    {
      kicker: lang === 'hi' ? '2. हाइड्रॉक्साइड सांद्रता [OH⁻]' : '2. [OH⁻] Concentration',
      math: `[OH⁻] = 10^(${res.ohMinusExponent}) mol/L`,
    },
    {
      kicker: lang === 'hi' ? '3. 10-गुना घातांकी अनुपात' : '3. 10^ΔpH Acidity Ratio',
      math: `${res.tenFoldHPlusRatioVsReference}× [H⁺] vs pH ${res.referencePh}`,
    },
    {
      kicker: lang === 'hi' ? '4. दंत इनेमल क्षय (< 5.5)' : '4. Tooth Enamel Threshold',
      math: res.causesToothEnamelDecay ? 'pH < 5.5 → Corrodes ✗' : 'pH ≥ 5.5 → Safe ✓',
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
        {[
          { label: 'Gastric Juice (pH 1.2)', ph: 1.2 },
          { label: 'Lemon Juice (pH 2.2)', ph: 2.2 },
          { label: 'Tooth Decay Limit (pH 5.4)', ph: 5.4 },
          { label: 'Pure Water (pH 7.0)', ph: 7.0 },
          { label: 'Milk of Magnesia (pH 10.0)', ph: 10.0 },
          { label: 'NaOH Solution (pH 14.0)', ph: 14.0 },
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={`nb-QuickChip ${Math.abs(phValue - preset.ph) < 0.05 ? 'is-active' : ''}`}
            onClick={() => setPhValue(preset.ph)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Universal indicator pH scale bench: sample pH ${res.phValue}, [H+] = 10^${res.hPlusExponent} mol/L, ${res.tenFoldHPlusRatioVsReference}x relative to pH ${res.referencePh}`}
        >
          <defs>
            <pattern id="nb-ph-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-ph-grid)" />

          {/* Left Panel: Universal Indicator pH Strip (0 to 14) */}
          <rect x="16" y="16" width="412" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="222" y="36" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            UNIVERSAL INDICATOR pH SPECTRUM (NCERT Fig 2.6)
          </text>

          {/* 15 Color Swatches for pH 0..14 */}
          {PH_BAND_COLORS.map((hex, idx) => (
            <g key={idx} transform={`translate(${24 + idx * 25}, 62)`}>
              <rect x="0" y="0" width="23" height="44" rx="3" fill={hex} />
              <text x="11.5" y="58" textAnchor="middle" fontSize="9" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
                {idx}
              </text>
            </g>
          ))}

          {/* Active Sample Pointer */}
          <circle cx={markerX} cy="52" r="6" fill="#1e293b" stroke="#ffffff" strokeWidth="1.5" />
          <text x={markerX} y="46" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            pH={res.phValue}
          </text>

          {/* Reference Pointer */}
          <circle cx={refMarkerX} cy="130" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
          <text x={refMarkerX} y="146" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1d4ed8" fontFamily="ui-monospace, monospace">
            Ref={res.referencePh}
          </text>

          {/* Inverse H+ vs OH- Summary Banner */}
          <rect x="26" y="156" width="392" height="30" rx="5" fill="#fef3c7" stroke="#f59e0b" />
          <text x="222" y="175" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
            {`Each −1 pH step multiplies [H⁺] by 10×! (ΔpH = ${Number((res.referencePh - res.phValue).toFixed(1))} → ${res.tenFoldHPlusRatioVsReference}× [H⁺])`}
          </text>

          {/* Right Panel: Logarithmic [H+] & Biological Threshold Ledger */}
          <g transform="translate(442, 16)">
            <rect x="0" y="0" width="298" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="149" y="23" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              pH LOGARITHMIC LEDGER (NCERT Ch 2.3)
            </text>

            <rect x="14" y="34" width="270" height="42" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="22" y="50" fontSize="9.5" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              ION CONCENTRATION ([H⁺] = 10⁻ᵖᴴ M):
            </text>
            <text x="22" y="67" fontSize="10.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              [H⁺] = 10^({res.hPlusExponent}) M | [OH⁻] = 10^({res.ohMinusExponent}) M
            </text>

            <rect x="14" y="84" width="270" height="42" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="22" y="100" fontSize="9.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
              NATURE &amp; RATIO VS REF (pH {res.referencePh}):
            </text>
            <text x="22" y="117" fontSize="10" fontWeight="900" fill="#0f172a" fontFamily="ui-monospace, monospace">
              {res.nature.toUpperCase()} ({res.tenFoldHPlusRatioVsReference}× [H⁺])
            </text>

            <rect
              x="14"
              y="134"
              width="270"
              height="36"
              rx="5"
              fill={res.causesToothEnamelDecay ? '#fef2f2' : '#ecfdf5'}
              stroke={res.causesToothEnamelDecay ? '#fca5a5' : '#6ee7b7'}
            />
            <text
              x="149"
              y="156"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="900"
              fill={res.causesToothEnamelDecay ? '#991b1b' : '#065f46'}
              fontFamily="ui-monospace, monospace"
            >
              {res.causesToothEnamelDecay
                ? '⚠️ pH < 5.5: Tooth Enamel Corrodes & Acid Rain!'
                : '✓ pH ≥ 5.5: Tooth Enamel Hydroxyapatite Safe'}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="ph-sample-slider"
          label={lang === 'hi' ? 'विलयन A का pH मान' : 'Sample Solution pH'}
          value={phValue}
          min={0}
          max={14}
          step={0.2}
          unit=""
          lang={lang}
          onChange={setPhValue}
        />
        <SliderField
          id="ph-ref-slider"
          label={lang === 'hi' ? 'तुलनात्मक विलयन B का pH' : 'Comparison Reference pH'}
          value={referencePh}
          min={0}
          max={14}
          step={1}
          unit=""
          lang={lang}
          onChange={setReferencePh}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="pH scale ten-fold hydrogen ion scaling pipeline" />
    </div>
  )
}
