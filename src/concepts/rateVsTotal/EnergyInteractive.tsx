import React, { useState } from 'react'
import { calculateEnergy } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber, formatScientific } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface EnergyInteractiveProps {
  lang: 'en' | 'hi'
}

const APPLIANCES = [
  { name: { en: 'LED Bulb', hi: 'एलईडी बल्ब' }, power: 10 },
  { name: { en: 'Ceiling Fan', hi: 'छत का पंखा' }, power: 75 },
  { name: { en: 'Mixer Grinder', hi: 'मिक्सर ग्राइंडर' }, power: 500 },
  { name: { en: 'Water Geyser', hi: 'गीज़र (हीटर)' }, power: 2000 },
]

export const EnergyInteractive: React.FC<EnergyInteractiveProps> = ({ lang }) => {
  const [selectedAppliance, setSelectedAppliance] = useState<number>(3)
  const [timeMinutes, setTimeMinutes] = useState<number>(30)

  const active = APPLIANCES[selectedAppliance]
  const timeSeconds = timeMinutes * 60
  const res = calculateEnergy(active.power, timeSeconds)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. उपकरण शक्ति दर (P)' : '1. Appliance Power Rate (P)',
      math: `${active.name.en}: P = ${active.power} W (${active.power} J/s)`,
    },
    {
      kicker: lang === 'hi' ? '2. परिचालन समय (t)' : '2. Operating Time (t)',
      math: `${timeMinutes} min = ${timeSeconds} s (${formatNumber(timeMinutes / 60, 2)} h)`,
    },
    {
      kicker: lang === 'hi' ? '3. एसआई ऊर्जा (E = P × t)' : '3. SI Joules (E = P × t_s)',
      math: `E = ${formatScientific(res.energyJoules)} J`,
    },
    {
      kicker: lang === 'hi' ? '4. व्यावसायिक यूनिट (kWh)' : '4. Commercial Units (kWh)',
      math: `${formatNumber(res.energyWattHours)} Wh = ${res.energyKWh} kWh`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-toolbar">
        <div className="nb-device-chips" role="group" aria-label="Appliance selector">
          {APPLIANCES.map((app, idx) => (
            <button
              key={idx}
              type="button"
              className={`nb-chip-btn ${selectedAppliance === idx ? 'is-active' : ''}`}
              onClick={() => setSelectedAppliance(idx)}
            >
              {app.name[lang]} ({app.power} W)
            </button>
          ))}
        </div>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 190"
          className="nb-optics-svg"
          role="img"
          aria-label={`${active.name.en} at ${active.power} W for ${timeMinutes} mins consumes ${res.energyKWh} kWh`}
        >
          <defs>
            <pattern id="nb-eng-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="190" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="190" fill="url(#nb-eng-grid)" />

          {/* Left: Power Rate Meter */}
          <g transform="translate(55, 36)">
            <rect x="0" y="0" width="205" height="118" rx="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
            <text x="102" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              INSTANTANEOUS POWER (RATE)
            </text>
            <text x="102" y="64" textAnchor="middle" fontSize="18" fontWeight="900" fill="#1d4ed8" fontFamily="ui-monospace, monospace">
              {`P = ${active.power} W`}
            </text>
            <text x="102" y="94" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af" fontFamily="ui-monospace, monospace">
              {`(${active.power} Joules per second)`}
            </text>
          </g>

          {/* Multiply by Time Bridge */}
          <g transform="translate(285, 75)">
            <rect x="0" y="0" width="165" height="40" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.8" />
            <text x="82" y="24" textAnchor="middle" fontSize="12" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
              {`× ${timeMinutes} min (${formatNumber(timeMinutes / 60, 2)} h) ⟶`}
            </text>
          </g>

          {/* Right: Total Energy Accumulated */}
          <g transform="translate(475, 36)">
            <rect x="0" y="0" width="230" height="118" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" />
            <text x="115" y="28" textAnchor="middle" fontSize="11" fontWeight="800" fill="#14532d" fontFamily="ui-monospace, monospace">
              TOTAL ENERGY TRANSFERRED
            </text>
            <text x="115" y="62" textAnchor="middle" fontSize="17" fontWeight="900" fill="#15803d" fontFamily="ui-monospace, monospace">
              {`${res.energyKWh} kWh (Units)`}
            </text>
            <text x="115" y="92" textAnchor="middle" fontSize="11" fontWeight="700" fill="#166534" fontFamily="ui-monospace, monospace">
              {`${formatNumber(res.energyWattHours)} Wh = ${formatScientific(res.energyJoules)} J`}
            </text>
          </g>
        </svg>
      </div>

      <SliderField
        id="energy-time"
        label={lang === 'hi' ? 'उपयोग का समय (Runtime)' : 'Operating Time'}
        unit={lang === 'hi' ? 'मिनट' : 'mins'}
        value={timeMinutes}
        min={5}
        max={120}
        step={5}
        lang={lang}
        onChange={setTimeMinutes}
      />

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Power times time energy pipeline" />
    </div>
  )
}
