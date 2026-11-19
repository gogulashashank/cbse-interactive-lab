import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateMendelianPunnett, type PeaHeightGenotype } from './models'

interface Props {
  lang: Lang
}

export function MendelianPunnettInteractive({ lang }: Props) {
  const [parent1, setParent1] = useState<PeaHeightGenotype>('Tt')
  const [parent2, setParent2] = useState<PeaHeightGenotype>('Tt')
  const [offspringCount, setOffspringCount] = useState(400)

  const res = calculateMendelianPunnett(parent1, parent2, offspringCount)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. जनक युग्मक (Gametes)' : '1. Parent Gametes',
      math: `P₁(${res.parent1Genotype}) × P₂(${res.parent2Genotype})`,
    },
    {
      kicker: lang === 'hi' ? '2. जीनप्ररूप अनुपात (Genotype)' : '2. Genotype Ratio',
      math: res.genotypeRatioText,
    },
    {
      kicker: lang === 'hi' ? '3. लक्षणप्ररूप अनुपात (Phenotype)' : '3. Phenotype Ratio',
      math: res.phenotypeRatioText,
    },
    {
      kicker: lang === 'hi' ? `4. संतति संख्या (N=${res.totalOffspringCount})` : `4. Expected Plants (N=${res.totalOffspringCount})`,
      math: `${res.expectedTallPlants} Tall : ${res.expectedDwarfPlants} Dwarf`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
        <button
          type="button"
          className={`nb-QuickChip ${parent1 === 'TT' && parent2 === 'tt' ? 'is-active' : ''}`}
          onClick={() => {
            setParent1('TT')
            setParent2('tt')
          }}
        >
          {lang === 'hi'
            ? '1. F₁ संकरण: TT × tt → 100% Tt (सभी लंबे)'
            : '1. F₁ Cross (TT × tt → 100% Tt Tall)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${parent1 === 'Tt' && parent2 === 'Tt' ? 'is-active' : ''}`}
          onClick={() => {
            setParent1('Tt')
            setParent2('Tt')
          }}
        >
          {lang === 'hi'
            ? '2. F₂ स्वपरागण: Tt × Tt → 3 लंबे : 1 बौना (1:2:1)'
            : '2. F₂ Self-Cross (Tt × Tt → 3:1 Phenotype · 1:2:1 Genotype)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${parent1 === 'Tt' && parent2 === 'tt' ? 'is-active' : ''}`}
          onClick={() => {
            setParent1('Tt')
            setParent2('tt')
          }}
        >
          {lang === 'hi'
            ? '3. परीक्षार्थ संकरण: Tt × tt → 1 लंबा : 1 बौना (1:1)'
            : '3. Test Cross (Tt × tt → 1:1 Tall : Dwarf)'}
        </button>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Mendelian Punnett square: ${res.parent1Genotype} crossed with ${res.parent2Genotype}, genotype ratio ${res.genotypeRatioText}, phenotype ratio ${res.phenotypeRatioText}`}
        >
          <defs>
            <pattern id="nb-bio8-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-bio8-grid)" />

          {/* Left Panel: 2x2 Punnett Square Matrix */}
          <rect x="18" y="16" width="370" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="203" y="35" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            2×2 PUNNETT SQUARE ({res.parent1Genotype} × {res.parent2Genotype})
          </text>

          {/* Column Gamete Headers (Parent 2) */}
          <text x="172" y="56" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1d4ed8" fontFamily="ui-monospace, monospace">
            P₂ Gamete: {res.parent2Gametes[0]}
          </text>
          <text x="292" y="56" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1d4ed8" fontFamily="ui-monospace, monospace">
            P₂ Gamete: {res.parent2Gametes[1]}
          </text>

          {/* Row Gamete Headers (Parent 1) */}
          <text x="66" y="96" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#b45309" fontFamily="ui-monospace, monospace">
            P₁: {res.parent1Gametes[0]}
          </text>
          <text x="66" y="156" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#b45309" fontFamily="ui-monospace, monospace">
            P₁: {res.parent1Gametes[1]}
          </text>

          {/* 4 Punnett Cells */}
          {res.gridCells.map((cell, idx) => {
            const row = Math.floor(idx / 2)
            const col = idx % 2
            const x = 116 + col * 120
            const y = 66 + row * 60
            const isTall = cell !== 'tt'
            return (
              <g key={idx} transform={`translate(${x}, ${y})`}>
                <rect
                  x="0"
                  y="0"
                  width="110"
                  height="52"
                  rx="6"
                  fill={isTall ? '#ecfdf5' : '#fef3c7'}
                  stroke={isTall ? '#16a34a' : '#d97706'}
                  strokeWidth="2"
                />
                <text
                  x="55"
                  y="24"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="900"
                  fill={isTall ? '#065f46' : '#92400e'}
                  fontFamily="ui-monospace, monospace"
                >
                  {cell}
                </text>
                <text
                  x="55"
                  y="42"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="800"
                  fill="#334155"
                  fontFamily="ui-monospace, monospace"
                >
                  {isTall ? 'TALL (Dominant)' : 'DWARF (Recessive)'}
                </text>
              </g>
            )
          })}

          {/* Right Panel: Genotype vs Phenotype Decoder Ledger */}
          <g transform="translate(402, 16)">
            <rect x="0" y="0" width="340" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="170" y="23" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              MENDELIAN LEDGER (NCERT Ch 8.2)
            </text>

            <rect x="14" y="34" width="312" height="42" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="22" y="50" fontSize="9.5" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              GENOTYPIC RATIO (TT : Tt : tt):
            </text>
            <text x="22" y="67" fontSize="10.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              {res.genotypeRatioText}
            </text>

            <rect x="14" y="84" width="312" height="42" rx="5" fill="#ecfdf5" stroke="#6ee7b7" />
            <text x="22" y="100" fontSize="9.5" fontWeight="800" fill="#065f46" fontFamily="ui-monospace, monospace">
              PHENOTYPIC RATIO (Tall : Dwarf):
            </text>
            <text x="22" y="117" fontSize="10.5" fontWeight="900" fill="#064e3b" fontFamily="ui-monospace, monospace">
              {res.phenotypeRatioText} ({res.expectedTallPlants} : {res.expectedDwarfPlants})
            </text>

            <rect x="14" y="134" width="312" height="36" rx="5" fill="#fef3c7" stroke="#fcd34d" />
            <text x="170" y="156" textAnchor="middle" fontSize="9" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
              1 copy of T makes enough enzyme → Tt is full Tall!
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="mp-offspring-slider"
          label={lang === 'hi' ? 'कुल मटर संतति पौधों की संख्या (N)' : 'Total Pea Offspring Sample Size (N)'}
          value={offspringCount}
          min={100}
          max={1600}
          step={100}
          unit=" plants"
          lang={lang}
          onChange={setOffspringCount}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Mendelian Punnett square genotype and phenotype ratio pipeline" />
    </div>
  )
}
