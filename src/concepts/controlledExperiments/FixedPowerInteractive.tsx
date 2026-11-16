import React, { useState } from 'react'
import { calculateFixedConditionPower } from './models'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface FixedPowerInteractiveProps {
  lang: 'en' | 'hi'
}

export const FixedPowerInteractive: React.FC<FixedPowerInteractiveProps> = ({ lang }) => {
  const [mode, setMode] = useState<'fixed-voltage' | 'fixed-current'>('fixed-voltage')
  const r1 = 4.0
  const r2 = 12.0

  // 12 V in fixed-voltage mode, 2 A in fixed-current mode
  const res = calculateFixedConditionPower(mode, r1, r2, mode === 'fixed-voltage' ? 12.0 : 2.0)
  const isParallel = mode === 'fixed-voltage'

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. क्या स्थिर है?' : '1. What is Held Fixed?',
      math: isParallel ? 'Parallel Mains: V = 12 V fixed' : 'Series Loop: I = 2 A fixed',
    },
    {
      kicker: lang === 'hi' ? '2. सही सूत्र चुनें' : '2. Select Power Formula',
      math: isParallel ? 'P = V² / R (P ∝ 1/R)' : 'P = I² × R (P ∝ R)',
    },
    {
      kicker: lang === 'hi' ? '3. R₁ (4 Ω) बनाम R₂ (12 Ω)' : '3. Compare R₁ (4 Ω) vs R₂ (12 Ω)',
      math: `P₁ = ${formatNumber(res.p1)} W  |  P₂ = ${formatNumber(res.p2)} W`,
    },
    {
      kicker: lang === 'hi' ? '4. कौन अधिक चमकता/गर्म होता है?' : '4. Higher Power Winner',
      math:
        res.higherPowerResistor === 'r1'
          ? 'R₁ (4 Ω) dissipates 3× more power!'
          : 'R₂ (12 Ω) dissipates 3× more power!',
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-toolbar">
        <div className="nb-device-chips" role="group" aria-label="Circuit constraint mode">
          <button
            type="button"
            className={`nb-chip-btn ${isParallel ? 'is-active' : ''}`}
            onClick={() => setMode('fixed-voltage')}
          >
            {lang === 'hi'
              ? '1. स्थिर वोल्टेज (12 V समानांतर) → P = V²/R'
              : '1. Fixed Voltage (12 V Parallel) → P = V²/R'}
          </button>
          <button
            type="button"
            className={`nb-chip-btn ${!isParallel ? 'is-active' : ''}`}
            onClick={() => setMode('fixed-current')}
          >
            {lang === 'hi'
              ? '2. स्थिर धारा (2 A श्रेणीक्रम) → P = I²R'
              : '2. Fixed Current (2 A Series) → P = I²R'}
          </button>
        </div>
      </div>

      {/* Interactive SVG Circuit Bench */}
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 250"
          className="nb-optics-svg"
          role="img"
          aria-label={isParallel ? 'Parallel fixed-voltage circuit' : 'Series fixed-current circuit'}
        >
          <defs>
            <pattern id="nb-fp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="250" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="250" fill="url(#nb-fp-grid)" />

          {isParallel ? (
            <g>
              {/* Parallel Rails */}
              <line x1="120" y1="45" x2="640" y2="45" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="120" y1="205" x2="640" y2="205" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="120" y1="45" x2="120" y2="205" stroke="#1e293b" strokeWidth="2.5" />
              <rect x="52" y="102" width="136" height="46" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.8" />
              <text x="120" y="122" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
                FIXED V = 12 V
              </text>
              <text x="120" y="139" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1d4ed8" fontFamily="system-ui, sans-serif">
                Same 12 V across both
              </text>

              {/* Branch 1: R1 = 4 Ohm (Higher Power!) */}
              <line x1="340" y1="45" x2="340" y2="205" stroke="#1e293b" strokeWidth="2.5" />
              <circle cx="340" cy="125" r="46" fill="rgba(234, 88, 12, 0.22)" />
              <rect x="262" y="96" width="156" height="58" rx="8" fill="#fff7ed" stroke="#ea580c" strokeWidth="2.5" />
              <text x="340" y="118" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
                R₁ = 4 Ω (I₁ = 3 A)
              </text>
              <text x="340" y="140" textAnchor="middle" fontSize="13" fontWeight="900" fill="#c2410c" fontFamily="ui-monospace, monospace">
                ★ P₁ = 36 W (3×)
              </text>

              {/* Branch 2: R2 = 12 Ohm */}
              <line x1="560" y1="45" x2="560" y2="205" stroke="#1e293b" strokeWidth="2.5" />
              <rect x="482" y="96" width="156" height="58" rx="8" fill="#ffffff" stroke="#64748b" strokeWidth="1.8" />
              <text x="560" y="118" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#334155" fontFamily="ui-monospace, monospace">
                R₂ = 12 Ω (I₂ = 1 A)
              </text>
              <text x="560" y="140" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#475569" fontFamily="ui-monospace, monospace">
                P₂ = 12 W
              </text>
            </g>
          ) : (
            <g>
              {/* Series Single Loop */}
              <rect x="90" y="55" width="580" height="140" rx="14" fill="none" stroke="#1e293b" strokeWidth="2.6" />
              <rect x="44" y="102" width="110" height="46" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.8" />
              <text x="99" y="122" textAnchor="middle" fontSize="11" fontWeight="800" fill="#14532d" fontFamily="ui-monospace, monospace">
                FIXED I = 2 A
              </text>
              <text x="99" y="139" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803d" fontFamily="system-ui, sans-serif">
                Same 2 A through both
              </text>

              {/* Series R1 = 4 Ohm */}
              <rect x="235" y="30" width="140" height="54" rx="8" fill="#ffffff" stroke="#64748b" strokeWidth="1.8" />
              <text x="305" y="52" textAnchor="middle" fontSize="12" fontWeight="700" fill="#334155" fontFamily="ui-monospace, monospace">
                R₁ = 4 Ω (V₁ = 8 V)
              </text>
              <text x="305" y="72" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#475569" fontFamily="ui-monospace, monospace">
                P₁ = 16 W
              </text>

              {/* Series R2 = 12 Ohm (Higher Power!) */}
              <circle cx="515" cy="57" r="46" fill="rgba(234, 88, 12, 0.22)" />
              <rect x="445" y="30" width="140" height="54" rx="8" fill="#fff7ed" stroke="#ea580c" strokeWidth="2.5" />
              <text x="515" y="52" textAnchor="middle" fontSize="12" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
                R₂ = 12 Ω (V₂ = 24 V)
              </text>
              <text x="515" y="72" textAnchor="middle" fontSize="13.5" fontWeight="900" fill="#c2410c" fontFamily="ui-monospace, monospace">
                ★ P₂ = 48 W (3×)
              </text>
            </g>
          )}
        </svg>
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Fixed condition power analysis pipeline" />
    </div>
  )
}
