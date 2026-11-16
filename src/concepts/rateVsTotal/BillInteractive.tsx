import React, { useState } from 'react'
import { calculateBillComparison } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface BillInteractiveProps {
  lang: 'en' | 'hi'
}

export const BillInteractive: React.FC<BillInteractiveProps> = ({ lang }) => {
  const [tariff, setTariff] = useState<number>(6)
  const [geyserMins, setGeyserMins] = useState<number>(30)

  const geyserHours = geyserMins / 60
  const res = calculateBillComparison(tariff, 30, geyserHours, 24)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. 2000 W गीज़र (30 दिन)' : '1. 2000 W Geyser (30 Days)',
      math: `2.0 kW × ${formatNumber(geyserHours, 2)} h × 30 = ${formatNumber(res.geyserKWh)} kWh`,
    },
    {
      kicker: lang === 'hi' ? '2. 150 W फ्रिज (24×30 घंटे)' : '2. 150 W Fridge (24h × 30d)',
      math: `0.15 kW × 24 h × 30 = ${formatNumber(res.fridgeKWh)} kWh`,
    },
    {
      kicker: lang === 'hi' ? '3. कुल यूनिट (kWh)' : '3. Total Monthly Units',
      math: `${formatNumber(res.geyserKWh + res.fridgeKWh)} kWh (Units)`,
    },
    {
      kicker: lang === 'hi' ? '4. कुल मासिक बिल (₹)' : '4. Monthly Bill at Tariff',
      math: `₹${formatNumber(res.totalCost)} (@ ₹${formatNumber(tariff)}/kWh)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 205"
          className="nb-optics-svg"
          role="img"
          aria-label={`Monthly electricity bill comparison: Geyser ${res.geyserKWh} kWh vs Fridge ${res.fridgeKWh} kWh`}
        >
          <defs>
            <pattern id="nb-bill-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="205" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="205" fill="url(#nb-bill-grid)" />

          {/* Left: High-Power Geyser Card */}
          <g transform="translate(40, 32)">
            <rect x="0" y="0" width="215" height="140" rx="8" fill="#fff7ed" stroke="#ea580c" strokeWidth="2" />
            <text x="107" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
              2000 W GEYSER ({geyserMins} min/day)
            </text>
            <text x="107" y="60" textAnchor="middle" fontSize="17" fontWeight="900" fill="#c2410c" fontFamily="ui-monospace, monospace">
              {`${formatNumber(res.geyserKWh)} kWh`}
            </text>
            <text x="107" y="88" textAnchor="middle" fontSize="13" fontWeight="800" fill="#9a3412" fontFamily="ui-monospace, monospace">
              {`Cost = ₹${formatNumber(res.geyserCost)}`}
            </text>
            <text x="107" y="116" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#7c2d12" fontFamily="system-ui, sans-serif">
              High Rate × Short Time
            </text>
          </g>

          {/* Center: Continuous Fridge Card */}
          <g transform="translate(272, 32)">
            <rect x="0" y="0" width="215" height="140" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
            <text x="107" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              150 W FRIDGE (24 hrs/day)
            </text>
            <text x="107" y="60" textAnchor="middle" fontSize="17" fontWeight="900" fill="#1d4ed8" fontFamily="ui-monospace, monospace">
              {`${formatNumber(res.fridgeKWh)} kWh`}
            </text>
            <text x="107" y="88" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              {`Cost = ₹${formatNumber(res.fridgeCost)}`}
            </text>
            <text x="107" y="116" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#1e3a8a" fontFamily="system-ui, sans-serif">
              Low Rate × 24h Continuous!
            </text>
          </g>

          {/* Right: Total Utility Meter */}
          <g transform="translate(505, 32)">
            <rect x="0" y="0" width="215" height="140" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2.2" />
            <text x="107" y="26" textAnchor="middle" fontSize="11" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
              30-DAY METER TOTAL
            </text>
            <text x="107" y="62" textAnchor="middle" fontSize="18" fontWeight="900" fill="#78350f" fontFamily="ui-monospace, monospace">
              {`₹${formatNumber(res.totalCost)}`}
            </text>
            <text x="107" y="92" textAnchor="middle" fontSize="12" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
              {`${formatNumber(res.geyserKWh + res.fridgeKWh)} Units (kWh)`}
            </text>
            <text x="107" y="116" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#b45309" fontFamily="ui-monospace, monospace">
              1 Unit = 1 kWh = 3.6×10⁶ J
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="bill-tariff"
          label={lang === 'hi' ? 'बिजली दर (Tariff Rate)' : 'Electricity Tariff Rate'}
          unit={lang === 'hi' ? '₹ / यूनिट' : '₹ / unit'}
          value={tariff}
          min={2}
          max={12}
          step={0.5}
          lang={lang}
          onChange={setTariff}
        />
        <SliderField
          id="bill-geyser-time"
          label={lang === 'hi' ? 'गीज़र का दैनिक समय' : 'Geyser Daily Runtime'}
          unit={lang === 'hi' ? 'मिनट/दिन' : 'mins/day'}
          value={geyserMins}
          min={10}
          max={120}
          step={10}
          lang={lang}
          onChange={setGeyserMins}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Monthly kWh bill calculation pipeline" />
    </div>
  )
}
