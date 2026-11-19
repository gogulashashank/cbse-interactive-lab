import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateSteamIronMassBalance } from './models'

interface Props {
  lang: Lang
}

export function ChemicalMassBalanceInteractive({ lang }: Props) {
  const [cFe, setCFe] = useState(3)
  const [cH2O, setCH2O] = useState(4)
  const [cFe3O4, setCFe3O4] = useState(1)
  const [cH2, setCH2] = useState(4)

  const state = calculateSteamIronMassBalance(cFe, cH2O, cFe3O4, cH2)

  // Beam tilt angle in degrees based on mass imbalance
  const massDiff = state.rhsTotalMassG - state.lhsTotalMassG
  const tiltDeg = Math.max(-10, Math.min(10, massDiff / 18))

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. आयरन परमाणु (Fe)' : '1. Iron Atoms (Fe)',
      math: `LHS: ${state.lhsFe} | RHS: ${state.rhsFe} ${state.lhsFe === state.rhsFe ? '✓' : '✗'}`,
    },
    {
      kicker: lang === 'hi' ? '2. हाइड्रोजन परमाणु (H)' : '2. Hydrogen Atoms (H)',
      math: `LHS: ${state.lhsH} | RHS: ${state.rhsH} ${state.lhsH === state.rhsH ? '✓' : '✗'}`,
    },
    {
      kicker: lang === 'hi' ? '3. ऑक्सीजन परमाणु (O)' : '3. Oxygen Atoms (O)',
      math: `LHS: ${state.lhsO} | RHS: ${state.rhsO} ${state.lhsO === state.rhsO ? '✓' : '✗'}`,
    },
    {
      kicker: lang === 'hi' ? '4. कुल मोलर द्रव्यमान' : '4. Total Molar Mass',
      math: `${state.lhsTotalMassG} g → ${state.rhsTotalMassG} g ${state.isBalanced ? '✓' : '✗'}`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          type="button"
          className={`nb-QuickChip ${state.isBalanced ? 'is-active' : ''}`}
          onClick={() => {
            setCFe(3)
            setCH2O(4)
            setCFe3O4(1)
            setCH2(4)
          }}
        >
          {lang === 'hi'
            ? '✓ संतुलित समीकरण (3Fe + 4H₂O → Fe₃O₄ + 4H₂ · 240g = 240g)'
            : '✓ Load Balanced Stoichiometry (3 : 4 : 1 : 4 · 240g = 240g)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${!state.isBalanced && cFe === 1 && cH2O === 1 ? 'is-active' : ''}`}
          onClick={() => {
            setCFe(1)
            setCH2O(1)
            setCFe3O4(1)
            setCH2(1)
          }}
        >
          {lang === 'hi'
            ? '✗ असंतुलित कंकाली समीकरण (1 : 1 : 1 : 1 · 74g ≠ 234g)'
            : '✗ Load Unbalanced Skeleton (1 : 1 : 1 : 1 · 74g ≠ 234g)'}
        </button>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Chemical equation mass balance: ${state.coeffFe} Fe + ${state.coeffH2O} H2O -> ${state.coeffFe3O4} Fe3O4 + ${state.coeffH2} H2, LHS mass ${state.lhsTotalMassG} g, RHS mass ${state.rhsTotalMassG} g`}
        >
          <defs>
            <pattern id="nb-chem1-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-chem1-grid)" />

          {/* Left Panel: Analytical Balance Scale for LHS Reactants vs RHS Products */}
          <rect x="18" y="16" width="410" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="223" y="36" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            {`${state.coeffFe}Fe + ${state.coeffH2O}H₂O  →  ${state.coeffFe3O4 === 1 ? '' : state.coeffFe3O4}Fe₃O₄ + ${state.coeffH2}H₂`}
          </text>

          {/* Fulcrum Pillar */}
          <polygon points="205,178 241,178 223,116" fill="#475569" />
          <rect x="175" y="178" width="96" height="8" rx="3" fill="#1e293b" />

          {/* Tilting Balance Beam */}
          <g transform={`rotate(${tiltDeg}, 223, 114)`}>
            <line x1="88" y1="114" x2="358" y2="114" stroke="#1e293b" strokeWidth="4" />

            {/* LHS Reactants Pan */}
            <line x1="96" y1="114" x2="96" y2="144" stroke="#64748b" strokeWidth="2" />
            <rect
              x="38"
              y="144"
              width="116"
              height="32"
              rx="6"
              fill={state.isBalanced ? '#ecfdf5' : '#fef2f2'}
              stroke={state.isBalanced ? '#16a34a' : '#dc2626'}
              strokeWidth="2"
            />
            <text x="96" y="158" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              Reactants (LHS)
            </text>
            <text x="96" y="171" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1d4ed8" fontFamily="ui-monospace, monospace">
              {state.lhsTotalMassG} g
            </text>

            {/* RHS Products Pan */}
            <line x1="350" y1="114" x2="350" y2="144" stroke="#64748b" strokeWidth="2" />
            <rect
              x="292"
              y="144"
              width="116"
              height="32"
              rx="6"
              fill={state.isBalanced ? '#ecfdf5' : '#fef2f2'}
              stroke={state.isBalanced ? '#16a34a' : '#dc2626'}
              strokeWidth="2"
            />
            <text x="350" y="158" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              Products (RHS)
            </text>
            <text x="350" y="171" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#b45309" fontFamily="ui-monospace, monospace">
              {state.rhsTotalMassG} g
            </text>
          </g>

          {/* Right Panel: Atom Conservation Ledger */}
          <g transform="translate(442, 16)">
            <rect x="0" y="0" width="298" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="149" y="22" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              ATOM &amp; MASS LEDGER (NCERT Ch 1.1)
            </text>

            {[
              { el: 'Fe (56u)', l: state.lhsFe, r: state.rhsFe, y: 34 },
              { el: 'H  (1u) ', l: state.lhsH, r: state.rhsH, y: 66 },
              { el: 'O  (16u)', l: state.lhsO, r: state.rhsO, y: 98 },
            ].map((row) => {
              const ok = row.l === row.r
              return (
                <g key={row.el} transform={`translate(14, ${row.y})`}>
                  <rect
                    x="0"
                    y="0"
                    width="270"
                    height="26"
                    rx="5"
                    fill={ok ? '#ecfdf5' : '#fef2f2'}
                    stroke={ok ? '#6ee7b7' : '#fca5a5'}
                  />
                  <text x="12" y="17" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
                    {row.el}: LHS = {row.l} | RHS = {row.r} {ok ? '✓' : '✗'}
                  </text>
                </g>
              )
            })}

            <rect
              x="14"
              y="132"
              width="270"
              height="36"
              rx="6"
              fill={state.isBalanced ? '#ecfdf5' : '#fef3c7'}
              stroke={state.isBalanced ? '#16a34a' : '#f59e0b'}
            />
            <text
              x="149"
              y="154"
              textAnchor="middle"
              fontSize="10"
              fontWeight="900"
              fill={state.isBalanced ? '#065f46' : '#92400e'}
              fontFamily="ui-monospace, monospace"
            >
              {state.isBalanced
                ? `BALANCED: ${state.lhsTotalMassG} g LHS = ${state.rhsTotalMassG} g RHS ✓`
                : `UNBALANCED: ${state.lhsTotalMassG} g LHS ≠ ${state.rhsTotalMassG} g RHS`}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: '0.75rem' }}>
        <SliderField
          id="cmb-fe-slider"
          label={lang === 'hi' ? 'Fe गुणांक (c₁)' : 'Fe Coefficient (c₁)'}
          value={cFe}
          min={1}
          max={6}
          step={1}
          unit=" mol"
          lang={lang}
          onChange={setCFe}
        />
        <SliderField
          id="cmb-h2o-slider"
          label={lang === 'hi' ? 'H₂O गुणांक (c₂)' : 'H₂O Coefficient (c₂)'}
          value={cH2O}
          min={1}
          max={6}
          step={1}
          unit=" mol"
          lang={lang}
          onChange={setCH2O}
        />
        <SliderField
          id="cmb-fe3o4-slider"
          label={lang === 'hi' ? 'Fe₃O₄ गुणांक (c₃)' : 'Fe₃O₄ Coefficient (c₃)'}
          value={cFe3O4}
          min={1}
          max={3}
          step={1}
          unit=" mol"
          lang={lang}
          onChange={setCFe3O4}
        />
        <SliderField
          id="cmb-h2-slider"
          label={lang === 'hi' ? 'H₂ गुणांक (c₄)' : 'H₂ Coefficient (c₄)'}
          value={cH2}
          min={1}
          max={6}
          step={1}
          unit=" mol"
          lang={lang}
          onChange={setCH2}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Chemical equation stoichiometry and mass conservation pipeline" />
    </div>
  )
}
