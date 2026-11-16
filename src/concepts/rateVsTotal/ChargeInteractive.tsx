import React, { useState } from 'react'
import { calculateCharge } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber, formatScientific } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface ChargeInteractiveProps {
  lang: 'en' | 'hi'
}

export const ChargeInteractive: React.FC<ChargeInteractiveProps> = ({ lang }) => {
  const [currentA, setCurrentA] = useState<number>(2)
  const [timeS, setTimeS] = useState<number>(5)

  const res = calculateCharge(currentA, timeS)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. आवेश प्रवाह दर (I)' : '1. Charge Flow Rate (I)',
      math: `I = ${formatNumber(currentA)} A (${formatNumber(currentA)} C/s)`,
    },
    {
      kicker: lang === 'hi' ? '2. समय अंतराल (t)' : '2. Time Interval (t)',
      math: `t = ${formatNumber(timeS)} s`,
    },
    {
      kicker: lang === 'hi' ? '3. कुल आवेश (Q = I × t)' : '3. Total Charge (Q = I × t)',
      math: `Q = ${formatNumber(currentA)} × ${formatNumber(timeS)} = ${formatNumber(res.chargeCoulombs)} C`,
    },
    {
      kicker: lang === 'hi' ? '4. इलेक्ट्रॉन संख्या (N = Q/e)' : '4. Electrons Passed (Q / e)',
      math: `N ≈ ${formatScientific(res.electronsApprox)} e⁻`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 195"
          className="nb-optics-svg"
          role="img"
          aria-label={`Conductor charge flow: I = ${currentA} A for ${timeS} s passes ${res.chargeCoulombs} C`}
        >
          <defs>
            <pattern id="nb-chg-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="195" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="195" fill="url(#nb-chg-grid)" />

          {/* Copper Wire Tube */}
          <rect x="65" y="68" width="410" height="60" rx="10" fill="#fed7aa" stroke="#c2410c" strokeWidth="2.4" />

          {/* Cross-Section Counting Gate */}
          <line x1="270" y1="45" x2="270" y2="150" stroke="#1d4ed8" strokeWidth="3" strokeDasharray="5 3" />
          <rect x="195" y="18" width="150" height="24" rx="4" fill="#dbeafe" stroke="#2563eb" />
          <text x="270" y="34" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            {`Gate Rate: ${formatNumber(currentA)} C/s`}
          </text>

          {/* Charge Packet Dots inside Wire */}
          {[110, 165, 220, 315, 370, 425].map((cx, idx) => (
            <g key={idx} transform={`translate(${cx}, 98)`}>
              <circle cx="0" cy="0" r="11" fill="#b45309" />
              <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffffff" fontFamily="ui-monospace, monospace">
                +q
              </text>
            </g>
          ))}

          {/* Right Total Coulomb Counter Ledger */}
          <g transform="translate(505, 38)">
            <rect x="0" y="0" width="215" height="120" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
            <text x="107" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
              TOTAL ACCUMULATED CHARGE
            </text>
            <text x="107" y="60" textAnchor="middle" fontSize="18" fontWeight="900" fill="#b45309" fontFamily="ui-monospace, monospace">
              {`Q = ${formatNumber(res.chargeCoulombs)} C`}
            </text>
            <text x="107" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill="#78350f" fontFamily="ui-monospace, monospace">
              {`Q = ${formatNumber(currentA)} A × ${formatNumber(timeS)} s`}
            </text>
            <text x="107" y="106" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
              {`≈ ${formatScientific(res.electronsApprox)} electrons`}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="charge-i"
          label={lang === 'hi' ? 'विद्युत धारा (Current I)' : 'Electric Current (I)'}
          unit="A"
          value={currentA}
          min={0.5}
          max={5}
          step={0.5}
          lang={lang}
          onChange={setCurrentA}
        />
        <SliderField
          id="charge-t"
          label={lang === 'hi' ? 'समय (Time t)' : 'Elapsed Time (t)'}
          unit={lang === 'hi' ? 'सेकंड' : 's'}
          value={timeS}
          min={1}
          max={20}
          step={1}
          lang={lang}
          onChange={setTimeS}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Current times time charge pipeline" />
    </div>
  )
}
