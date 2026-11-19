import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateMetalDisplacement, type ReactivityMetalSymbol } from './models'

interface Props {
  lang: Lang
}

const METALS: readonly { sym: ReactivityMetalSymbol; name: string }[] = [
  { sym: 'Mg', name: 'Mg (Magnesium)' },
  { sym: 'Zn', name: 'Zn (Zinc)' },
  { sym: 'Fe', name: 'Fe (Iron)' },
  { sym: 'Cu', name: 'Cu (Copper)' },
  { sym: 'Ag', name: 'Ag (Silver)' },
]

export function MetalReactivityInteractive({ lang }: Props) {
  const [dippedMetal, setDippedMetal] = useState<ReactivityMetalSymbol>('Fe')
  const [solutionMetal, setSolutionMetal] = useState<ReactivityMetalSymbol>('Cu')

  const res = calculateMetalDisplacement(dippedMetal, solutionMetal)

  const liquidFill =
    res.finalSolutionColor.includes('Blue')
      ? 'rgba(37, 99, 235, 0.42)'
      : res.finalSolutionColor.includes('Green')
        ? 'rgba(34, 197, 94, 0.36)'
        : 'rgba(226, 232, 240, 0.55)'

  const stripDepositFill =
    !res.reactionOccurs
      ? '#64748b'
      : solutionMetal === 'Cu'
        ? '#b45309'
        : solutionMetal === 'Ag'
          ? '#cbd5e1'
          : '#475569'

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. डुबोई गई धातु (A)' : '1. Dipped Metal Strip (A)',
      math: `${res.dippedMetal} (Rank #${6 - res.dippedRank})`,
    },
    {
      kicker: lang === 'hi' ? '2. लवण विलयन आयन (B²⁺)' : '2. Salt Solution (B²⁺)',
      math: `${res.solutionCationMetal} salt (Rank #${6 - res.solutionRank})`,
    },
    {
      kicker: lang === 'hi' ? '3. विस्थापन शर्त (A > B)' : '3. Displacement Test',
      math: res.reactionOccurs ? `${res.dippedMetal} > ${res.solutionCationMetal} → Displaces ✓` : 'No Displacement ✗',
    },
    {
      kicker: lang === 'hi' ? '4. विलयन का अंतिम रंग' : '4. Final Solution State',
      math: res.finalSolutionColor,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
          <strong style={{ fontSize: '0.8rem', color: '#1e293b' }}>
            {lang === 'hi' ? '1. धातु की पट्टी चुनें (Metal Strip A):' : '1. Select Metal Strip A:'}
          </strong>
          {METALS.map((m) => (
            <button
              key={`strip-${m.sym}`}
              type="button"
              className={`nb-QuickChip ${dippedMetal === m.sym ? 'is-active' : ''}`}
              onClick={() => setDippedMetal(m.sym)}
            >
              {m.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
          <strong style={{ fontSize: '0.8rem', color: '#1e293b' }}>
            {lang === 'hi' ? '2. लवण विलयन चुनें (Aqueous Salt BC):' : '2. Select Salt Solution BC:'}
          </strong>
          {METALS.map((m) => (
            <button
              key={`sol-${m.sym}`}
              type="button"
              className={`nb-QuickChip ${solutionMetal === m.sym ? 'is-active' : ''}`}
              onClick={() => setSolutionMetal(m.sym)}
            >
              {m.sym === 'Ag' ? 'AgNO₃ (aq)' : `${m.sym}SO₄ (aq)`}
            </button>
          ))}
        </div>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Metal reactivity single-displacement apparatus: ${res.equationText}`}
        >
          <defs>
            <pattern id="nb-metal-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-metal-grid)" />

          {/* Left Panel: Test Tube & Immersed Metal Strip */}
          <rect x="18" y="16" width="230" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="133" y="35" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            NCERT ACTIVITY 3.12 BENCH
          </text>

          {/* Beaker / Test Tube */}
          <rect x="78" y="54" width="110" height="118" rx="8" fill="none" stroke="#334155" strokeWidth="2.4" />
          <rect x="80" y="88" width="106" height="82" rx="6" fill={liquidFill} />
          <line x1="80" y1="88" x2="186" y2="88" stroke="#0284c7" strokeWidth="1.8" />

          {/* Immersed Metal Strip A */}
          <rect x="122" y="42" width="22" height="112" rx="3" fill="#64748b" stroke="#1e293b" strokeWidth="1.8" />
          {/* Deposited Metal Coating on Submerged Lower Half */}
          <rect
            x="120"
            y="92"
            width="26"
            height="62"
            rx="3"
            fill={stripDepositFill}
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <text x="133" y="72" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#ffffff" fontFamily="ui-monospace, monospace">
            {res.dippedMetal}
          </text>
          <text x="133" y="188" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace">
            {res.finalSolutionColor}
          </text>

          {/* Middle Panel: Reactivity Ladder (Mg > Zn > Fe > Cu > Ag) */}
          <rect x="260" y="16" width="165" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="342" y="35" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            REACTIVITY SERIES ↓
          </text>
          {METALS.map((m, idx) => {
            const isStrip = m.sym === dippedMetal
            const isSol = m.sym === solutionMetal
            return (
              <g key={m.sym} transform={`translate(274, ${46 + idx * 28})`}>
                <rect
                  x="0"
                  y="0"
                  width="137"
                  height="23"
                  rx="4"
                  fill={isStrip ? '#dbeafe' : isSol ? '#fef3c7' : '#f8fafc'}
                  stroke={isStrip ? '#2563eb' : isSol ? '#d97706' : '#cbd5e1'}
                />
                <text x="10" y="15" fontSize="9.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
                  {idx + 1}. {m.sym} {isStrip ? '← Strip' : ''} {isSol ? '← Salt' : ''}
                </text>
              </g>
            )
          })}

          {/* Right Panel: Reaction Equation & Deposit Ledger */}
          <g transform="translate(438, 16)">
            <rect x="0" y="0" width="302" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="151" y="23" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              DISPLACEMENT LEDGER (NCERT Ch 3.2.5)
            </text>

            <rect
              x="12"
              y="34"
              width="278"
              height="44"
              rx="5"
              fill={res.reactionOccurs ? '#ecfdf5' : '#fef2f2'}
              stroke={res.reactionOccurs ? '#6ee7b7' : '#fca5a5'}
            />
            <text
              x="151"
              y="52"
              textAnchor="middle"
              fontSize="10"
              fontWeight="900"
              fill={res.reactionOccurs ? '#065f46' : '#991b1b'}
              fontFamily="ui-monospace, monospace"
            >
              {res.reactionOccurs ? '✓ DISPLACEMENT OCCURS' : '✗ NO REACTION'}
            </text>
            <text x="151" y="69" textAnchor="middle" fontSize="9" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace">
              {res.equationText}
            </text>

            <rect x="12" y="86" width="278" height="44" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="20" y="103" fontSize="9.5" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              Initial Solution: {res.initialSolutionColor}
            </text>
            <text x="20" y="120" fontSize="9.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              Deposit on Strip: {res.depositOnStrip}
            </text>

            <rect x="12" y="138" width="278" height="32" rx="5" fill="#fef3c7" stroke="#fcd34d" />
            <text x="151" y="158" textAnchor="middle" fontSize="8.8" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
              Higher metal displaces lower metal from its salt!
            </text>
          </g>
        </svg>
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Metal reactivity series single-displacement pipeline" />
    </div>
  )
}
