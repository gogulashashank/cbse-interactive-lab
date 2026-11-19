import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateCellularRespirationATP, type RespirationPathwayId } from './models'

interface Props {
  lang: Lang
}

export function RespirationPathwaysInteractive({ lang }: Props) {
  const [pathway, setPathway] = useState<RespirationPathwayId>('aerobic-mitochondria')
  const [glucoseMoles, setGlucoseMoles] = useState(2)

  const res = calculateCellularRespirationATP(pathway, glucoseMoles)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. कोशिकाद्रव्य (ग्लाइकोलिसिस)' : '1. Cytoplasm (Glycolysis)',
      math: `${res.glucoseMoles} Glucose (6C) → ${res.pyruvateIntermediateMoles} Pyruvate (3C)`,
    },
    {
      kicker: lang === 'hi' ? '2. प्रति ग्लूकोज़ ATP दर' : '2. ATP Yield Rate',
      math: `${res.atpRatePerGlucose} ATP / Glucose (${res.yieldRatioVsAnaerobic}×)`,
    },
    {
      kicker: lang === 'hi' ? '3. कुल संचित ATP' : '3. Total ATP Produced',
      math: `${res.totalAtpMoles} mol ATP (vs ${res.aerobicBenchmarkAtpMoles} aerobic)`,
    },
    {
      kicker: lang === 'hi' ? '4. अंतिम उत्पाद' : '4. End Products',
      math: res.endProductsText,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
        <button
          type="button"
          className={`nb-QuickChip ${pathway === 'aerobic-mitochondria' ? 'is-active' : ''}`}
          onClick={() => setPathway('aerobic-mitochondria')}
        >
          {lang === 'hi'
            ? '1. माइटोकॉन्ड्रिया: वायवीय श्वसन (+O₂ · 38 ATP)'
            : '1. Mitochondria: Aerobic (+O₂ · 38 ATP/glucose)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${pathway === 'yeast-anaerobic' ? 'is-active' : ''}`}
          onClick={() => setPathway('yeast-anaerobic')}
        >
          {lang === 'hi'
            ? '2. यीस्ट: अवायवीय किण्वन (No O₂ · एथेनॉल + CO₂ · 2 ATP)'
            : '2. Yeast: Anaerobic Fermentation (No O₂ · 2 ATP)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${pathway === 'muscle-oxygen-debt' ? 'is-active' : ''}`}
          onClick={() => setPathway('muscle-oxygen-debt')}
        >
          {lang === 'hi'
            ? '3. पेशी कोशिका: O₂ का अभाव (लैक्टिक अम्ल · 2 ATP)'
            : '3. Muscle Sprint: Lack of O₂ (Lactic Acid · 2 ATP)'}
        </button>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`NCERT Figure 5.8 glucose breakdown pathways: ${res.pathway}, ${res.totalAtpMoles} ATP produced from ${res.glucoseMoles} moles glucose`}
        >
          <defs>
            <pattern id="nb-bio5-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-bio5-grid)" />

          {/* Left Panel: NCERT Fig 5.8 3-Branch Pathway Map */}
          <rect x="16" y="16" width="424" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="228" y="34" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            GLUCOSE BREAKDOWN PATHWAYS (NCERT Fig 5.8)
          </text>

          {/* Glucose (6C) Box */}
          <rect x="24" y="86" width="84" height="44" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
          <text x="66" y="105" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
            Glucose (6C)
          </text>
          <text x="66" y="120" textAnchor="middle" fontSize="9" fontWeight="800" fill="#78350f" fontFamily="ui-monospace, monospace">
            {res.glucoseMoles} mol
          </text>

          <line x1="108" y1="108" x2="132" y2="108" stroke="#334155" strokeWidth="2.2" />

          {/* Pyruvate (3C) in Cytoplasm Box */}
          <rect x="132" y="84" width="96" height="48" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" />
          <text x="180" y="103" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            Pyruvate (3C)
          </text>
          <text x="180" y="119" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
            In Cytoplasm ({res.pyruvateIntermediateMoles}m)
          </text>

          {/* 3 Diverging Branch Lines */}
          <line x1="228" y1="96" x2="256" y2="62" stroke={pathway === 'aerobic-mitochondria' ? '#16a34a' : '#94a3b8'} strokeWidth={pathway === 'aerobic-mitochondria' ? '3' : '1.5'} />
          <line x1="228" y1="108" x2="256" y2="108" stroke={pathway === 'yeast-anaerobic' ? '#d97706' : '#94a3b8'} strokeWidth={pathway === 'yeast-anaerobic' ? '3' : '1.5'} />
          <line x1="228" y1="120" x2="256" y2="156" stroke={pathway === 'muscle-oxygen-debt' ? '#dc2626' : '#94a3b8'} strokeWidth={pathway === 'muscle-oxygen-debt' ? '3' : '1.5'} />

          {/* Branch 1: Mitochondria (+O2) */}
          <rect
            x="256"
            y="42"
            width="172"
            height="38"
            rx="5"
            fill={pathway === 'aerobic-mitochondria' ? '#ecfdf5' : '#f8fafc'}
            stroke={pathway === 'aerobic-mitochondria' ? '#16a34a' : '#cbd5e1'}
            strokeWidth={pathway === 'aerobic-mitochondria' ? '2.2' : '1.2'}
          />
          <text x="264" y="58" fontSize="8.8" fontWeight="900" fill="#065f46" fontFamily="ui-monospace, monospace">
            +O₂ (Mitochondria): 38 ATP
          </text>
          <text x="264" y="72" fontSize="8.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
            → 6CO₂ + 6H₂O (Complete)
          </text>

          {/* Branch 2: Yeast (No O2) */}
          <rect
            x="256"
            y="89"
            width="172"
            height="38"
            rx="5"
            fill={pathway === 'yeast-anaerobic' ? '#fef3c7' : '#f8fafc'}
            stroke={pathway === 'yeast-anaerobic' ? '#d97706' : '#cbd5e1'}
            strokeWidth={pathway === 'yeast-anaerobic' ? '2.2' : '1.2'}
          />
          <text x="264" y="105" fontSize="8.8" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
            No O₂ (Yeast): 2 ATP
          </text>
          <text x="264" y="119" fontSize="8.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
            → 2 Ethanol (2C) + 2CO₂
          </text>

          {/* Branch 3: Muscle Cell (Lack of O2) */}
          <rect
            x="256"
            y="136"
            width="172"
            height="38"
            rx="5"
            fill={pathway === 'muscle-oxygen-debt' ? '#fef2f2' : '#f8fafc'}
            stroke={pathway === 'muscle-oxygen-debt' ? '#dc2626' : '#cbd5e1'}
            strokeWidth={pathway === 'muscle-oxygen-debt' ? '2.2' : '1.2'}
          />
          <text x="264" y="152" fontSize="8.8" fontWeight="900" fill="#991b1b" fontFamily="ui-monospace, monospace">
            Lack of O₂ (Muscle): 2 ATP
          </text>
          <text x="264" y="166" fontSize="8.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
            → 2 Lactic Acid (3C · Cramps)
          </text>

          {/* Right Panel: ATP Yield Rate vs Total Ledger */}
          <g transform="translate(452, 16)">
            <rect x="0" y="0" width="290" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="145" y="22" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              ATP YIELD LEDGER (NCERT Ch 5.3)
            </text>

            <rect x="14" y="34" width="262" height="42" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="22" y="50" fontSize="9.5" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              SITE: {res.cellularSite}
            </text>
            <text x="22" y="67" fontSize="10" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              Rate: {res.atpRatePerGlucose} ATP/glucose × {res.glucoseMoles} = {res.totalAtpMoles} ATP
            </text>

            <rect x="14" y="84" width="262" height="42" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="22" y="100" fontSize="9.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
              END PRODUCTS ({res.glucoseMoles} mol Glucose):
            </text>
            <text x="22" y="117" fontSize="9.5" fontWeight="900" fill="#0f172a" fontFamily="ui-monospace, monospace">
              {res.endProductsText}
            </text>

            <rect
              x="14"
              y="134"
              width="262"
              height="36"
              rx="5"
              fill={res.causesMuscleCramps ? '#fef2f2' : '#ecfdf5'}
              stroke={res.causesMuscleCramps ? '#fca5a5' : '#6ee7b7'}
            />
            <text
              x="145"
              y="156"
              textAnchor="middle"
              fontSize="9"
              fontWeight="900"
              fill={res.causesMuscleCramps ? '#991b1b' : '#065f46'}
              fontFamily="ui-monospace, monospace"
            >
              {res.causesMuscleCramps
                ? '⚠️ 3C Lactic Acid Build-Up → Muscle Cramps!'
                : pathway === 'aerobic-mitochondria'
                  ? '✓ 19× More ATP Than Anaerobic Pathways!'
                  : '✓ CO₂ Bubbles Make Bread Rise (Fermentation)'}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="rp-glucose-slider"
          label={lang === 'hi' ? 'ग्लूकोज़ अणुओं (मोल) की संख्या' : 'Moles of Glucose Oxidised'}
          value={glucoseMoles}
          min={1}
          max={10}
          step={1}
          unit=" mol"
          lang={lang}
          onChange={setGlucoseMoles}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Cellular respiration glucose breakdown and ATP yield pipeline" />
    </div>
  )
}
