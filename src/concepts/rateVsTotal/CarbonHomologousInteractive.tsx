import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateHomologousMember, type HomologousFamilyId } from './models'

interface Props {
  lang: Lang
}

export function CarbonHomologousInteractive({ lang }: Props) {
  const [family, setFamily] = useState<HomologousFamilyId>('alkane')
  const [carbonN, setCarbonN] = useState(3)

  const res = calculateHomologousMember(family, carbonN)

  // Carbon chain coordinates inside left SVG box
  const chainStartX = 56
  const chainStepX = 54

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. सामान्य सूत्र' : '1. General Formula',
      math: `${res.generalFormula} (n = ${res.carbonCountN})`,
    },
    {
      kicker: lang === 'hi' ? '2. IUPAC नाम व सूत्र' : '2. IUPAC Name & Formula',
      math: `${res.iupacName}: ${res.molecularFormula}`,
    },
    {
      kicker: lang === 'hi' ? '3. आणविक द्रव्यमान (u)' : '3. Molecular Mass',
      math: `M = ${res.molecularMassU} u`,
    },
    {
      kicker: lang === 'hi' ? '4. अगला समजात (+CH₂)' : '4. Next Homologue (+14 u)',
      math: `${res.nextHomologueFormula} (${res.nextHomologueMassU} u)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
        {(
          [
            { id: 'alkane', label: 'Alkanes (CₙH₂ₙ₊₂ · Single C−C)' },
            { id: 'alkene', label: 'Alkenes (CₙH₂ₙ · Double C=C)' },
            { id: 'alkyne', label: 'Alkynes (CₙH₂ₙ₋₂ · Triple C≡C)' },
            { id: 'alcohol', label: 'Alcohols (CₙH₂ₙ₊₁OH · −OH Group)' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nb-QuickChip ${family === item.id ? 'is-active' : ''}`}
            onClick={() => {
              setFamily(item.id)
              if ((item.id === 'alkene' || item.id === 'alkyne') && carbonN < 2) {
                setCarbonN(2)
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Carbon homologous series builder: ${res.iupacName} (${res.molecularFormula}), molecular mass ${res.molecularMassU} u, next homologue ${res.nextHomologueFormula} (${res.nextHomologueMassU} u)`}
        >
          <defs>
            <pattern id="nb-carbon-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-carbon-grid)" />

          {/* Left Panel: Carbon Chain Backbone Visualizer */}
          <rect x="16" y="16" width="412" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="222" y="36" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            {`${res.iupacName.toUpperCase()} (${res.molecularFormula}) · M = ${res.molecularMassU} u`}
          </text>

          {/* Draw C-C bonds first */}
          {Array.from({ length: res.carbonCountN - 1 }).map((_, idx) => {
            const x1 = chainStartX + idx * chainStepX
            const x2 = chainStartX + (idx + 1) * chainStepX
            const isMultipleBondSite = idx === 0 && (family === 'alkene' || family === 'alkyne')

            if (isMultipleBondSite && family === 'alkene') {
              return (
                <g key={`bond-${idx}`}>
                  <line x1={x1} y1="103" x2={x2} y2="103" stroke="#d97706" strokeWidth="3" />
                  <line x1={x1} y1="113" x2={x2} y2="113" stroke="#d97706" strokeWidth="3" />
                </g>
              )
            }
            if (isMultipleBondSite && family === 'alkyne') {
              return (
                <g key={`bond-${idx}`}>
                  <line x1={x1} y1="101" x2={x2} y2="101" stroke="#dc2626" strokeWidth="2.6" />
                  <line x1={x1} y1="108" x2={x2} y2="108" stroke="#dc2626" strokeWidth="2.6" />
                  <line x1={x1} y1="115" x2={x2} y2="115" stroke="#dc2626" strokeWidth="2.6" />
                </g>
              )
            }
            return (
              <line
                key={`bond-${idx}`}
                x1={x1}
                y1="108"
                x2={x2}
                y2="108"
                stroke="#334155"
                strokeWidth="3"
              />
            )
          })}

          {/* Optional -OH functional group attached to last carbon */}
          {family === 'alcohol' && (
            <g>
              <line
                x1={chainStartX + (res.carbonCountN - 1) * chainStepX}
                y1="108"
                x2={chainStartX + res.carbonCountN * chainStepX}
                y2="108"
                stroke="#0284c7"
                strokeWidth="3"
              />
              <circle
                cx={chainStartX + res.carbonCountN * chainStepX}
                cy="108"
                r="16"
                fill="#0284c7"
                stroke="#0c4a6e"
                strokeWidth="2"
              />
              <text
                x={chainStartX + res.carbonCountN * chainStepX}
                y="112"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="900"
                fill="#ffffff"
                fontFamily="ui-monospace, monospace"
              >
                −OH
              </text>
            </g>
          )}

          {/* Draw Carbon Atom Nodes */}
          {Array.from({ length: res.carbonCountN }).map((_, idx) => {
            const cx = chainStartX + idx * chainStepX
            return (
              <g key={`c-${idx}`}>
                <circle cx={cx} cy="108" r="16" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <text x={cx} y="112" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ffffff" fontFamily="ui-monospace, monospace">
                  C{idx + 1}
                </text>
              </g>
            )
          })}

          <rect x="26" y="154" width="392" height="32" rx="5" fill="#fef3c7" stroke="#f59e0b" />
          <text x="222" y="174" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
            {`Constant Homologous Step: +CH₂ (+14 u) → Next: ${res.nextHomologueFormula} (${res.nextHomologueMassU} u)`}
          </text>

          {/* Right Panel: Homologous Series & Saturation Ledger */}
          <g transform="translate(442, 16)">
            <rect x="0" y="0" width="298" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="149" y="23" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              HOMOLOGOUS LEDGER (NCERT Ch 4.2.4)
            </text>

            <rect x="14" y="34" width="270" height="42" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="22" y="50" fontSize="9.5" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              GENERAL FORMULA ({res.generalFormula}):
            </text>
            <text x="22" y="67" fontSize="10.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              {res.iupacName} = {res.molecularFormula} ({res.molecularMassU} u)
            </text>

            <rect x="14" y="84" width="270" height="42" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="22" y="100" fontSize="9.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
              NEXT HOMOLOGUE (n = {res.carbonCountN + 1}):
            </text>
            <text x="22" y="117" fontSize="10.5" fontWeight="900" fill="#0f172a" fontFamily="ui-monospace, monospace">
              {res.nextHomologueFormula} ({res.molecularMassU} + 14 = {res.nextHomologueMassU} u)
            </text>

            <rect
              x="14"
              y="134"
              width="270"
              height="36"
              rx="5"
              fill={res.decolourisesBromineWater ? '#fef2f2' : '#ecfdf5'}
              stroke={res.decolourisesBromineWater ? '#fca5a5' : '#6ee7b7'}
            />
            <text
              x="149"
              y="156"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="900"
              fill={res.decolourisesBromineWater ? '#991b1b' : '#065f46'}
              fontFamily="ui-monospace, monospace"
            >
              {res.decolourisesBromineWater
                ? 'Unsaturated (C=C / C≡C) → Decolourises Br₂ Water!'
                : 'Saturated (Single Bonds) → Clean Blue Flame ✓'}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="ch-carbon-slider"
          label={lang === 'hi' ? 'कार्बन परमाणुओं की संख्या (n)' : 'Number of Carbon Atoms in Chain (n)'}
          value={res.carbonCountN}
          min={family === 'alkene' || family === 'alkyne' ? 2 : 1}
          max={6}
          step={1}
          unit=" C atoms"
          lang={lang}
          onChange={setCarbonN}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Carbon homologous series formula and +14 u step pipeline" />
    </div>
  )
}
