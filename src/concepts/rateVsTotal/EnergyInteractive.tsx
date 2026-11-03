import React, { useState } from 'react'
import { calculateEnergy } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber, formatScientific } from '../../kit/format'

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
  const [selectedAppliance, setSelectedAppliance] = useState<number>(0)
  const [timeMinutes, setTimeMinutes] = useState<number>(30)

  const active = APPLIANCES[selectedAppliance]
  const timeSeconds = timeMinutes * 60
  const res = calculateEnergy(active.power, timeSeconds)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: शक्ति एवं कुल विद्युत ऊर्जा (E = P × t)' : 'Interactive: Power & Electrical Energy (E = P × t)'}
      </h4>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.6rem 0' }}>
        {APPLIANCES.map((app, idx) => (
          <button
            key={idx}
            type="button"
            className={`kit-btn ${selectedAppliance === idx ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
            style={{ padding: '4px 10px', fontSize: '0.85rem', minHeight: '36px' }}
            onClick={() => setSelectedAppliance(idx)}
          >
            {app.name[lang]} ({app.power} W)
          </button>
        ))}
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

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? 'खर्च हुई कुल ऊर्जा:' : 'Total Electrical Energy Transferred:'}
          </span>
          <strong style={{ fontSize: '1.4rem', color: '#047857' }}>
            {formatNumber(res.energyWattHours)} Wh ({formatScientific(res.energyJoules)} J)
          </strong>
        </div>
        <div style={{ fontSize: '0.82rem', color: '#475569', background: '#ecfdf5', padding: '0.4rem 0.6rem', borderRadius: '4px' }}>
          <strong>{res.energyKWh}</strong> {lang === 'hi' ? 'यूनिट (kWh)' : 'kWh (Units)'}
        </div>
      </div>
    </div>
  )
}
