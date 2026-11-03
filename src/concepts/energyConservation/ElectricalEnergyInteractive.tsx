import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { calculateElectricalEnergy } from './models'

interface Props {
  lang: Lang
}

export function ElectricalEnergyInteractive({ lang }: Props) {
  const [voltage, setVoltage] = useState(220)
  const [current, setCurrent] = useState(5)
  const [minutes, setMinutes] = useState(15)

  const seconds = minutes * 60
  const model = calculateElectricalEnergy(voltage, current, seconds)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1rem' }}>
        {lang === 'hi' ? '🔬 प्रयोग: विद्युत ऊर्जा का ऊष्मा में रूपांतरण (E = V·I·t)' : '🔬 Experiment: Electrical Energy to Heat Transfer (E = V·I·t)'}
      </h4>
      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 1rem 0' }}>
        {lang === 'hi'
          ? 'वोल्टेज, धारा और समय बदलकर देखें कि कितनी विद्युत ऊर्जा ऊष्मा में परिवर्तित होती है।'
          : 'Adjust voltage, current, and runtime to observe how electrical energy converts into thermal energy.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <SliderField
          id="ee-voltage-slider"
          label={lang === 'hi' ? 'वोल्टेज (V)' : 'Voltage (V)'}
          value={voltage}
          min={10}
          max={250}
          step={5}
          unit=" V"
          lang={lang}
          onChange={setVoltage}
        />
        <SliderField
          id="ee-current-slider"
          label={lang === 'hi' ? 'विद्युत धारा (I)' : 'Current (I)'}
          value={current}
          min={0.5}
          max={15}
          step={0.5}
          unit=" A"
          lang={lang}
          onChange={setCurrent}
        />
        <SliderField
          id="ee-runtime-slider"
          label={lang === 'hi' ? 'समय (t)' : 'Runtime (t)'}
          value={minutes}
          min={1}
          max={60}
          step={1}
          unit={lang === 'hi' ? ' मिनट' : ' mins'}
          lang={lang}
          onChange={setMinutes}
        />
      </div>

      {/* Visual meter comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#1e40af', fontWeight: 700 }}>
            {lang === 'hi' ? 'तात्कालिक शक्ति (Power)' : 'Instantaneous Power'}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a', margin: '0.2rem 0' }}>
            {model.powerWatts >= 1000 ? `${(model.powerWatts / 1000).toFixed(2)} kW` : `${model.powerWatts.toFixed(0)} W`}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#3b82f6' }}>
            P = V × I = {voltage} V × {current} A
          </div>
        </div>

        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#991b1b', fontWeight: 700 }}>
            {lang === 'hi' ? 'कुल तापीय ऊर्जा (Heat Energy)' : 'Total Thermal Energy'}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#7f1d1d', margin: '0.2rem 0' }}>
            {model.energyJoules >= 1_000_000
              ? `${(model.energyJoules / 1_000_000).toFixed(2)} MJ`
              : `${(model.energyJoules / 1000).toFixed(1)} kJ`}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#dc2626' }}>
            E = P × t ({model.energyKWh.toFixed(3)} kWh)
          </div>
        </div>
      </div>

      {/* Energy conservation bar visual */}
      <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', marginBottom: '0.35rem' }}>
          <span>{lang === 'hi' ? 'विद्युत ऊर्जा इनपुट' : 'Electrical Energy Input'}</span>
          <span>100% → {lang === 'hi' ? 'ऊष्मा आउटपुट' : 'Heat Output'} (100%)</span>
        </div>
        <div style={{ height: '14px', background: '#e2e8f0', borderRadius: '7px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: '100%', background: 'linear-gradient(90deg, #3b82f6 0%, #ef4444 100%)' }} />
        </div>
        <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.35rem', textAlign: 'center' }}>
          {lang === 'hi'
            ? 'ऊर्जा न तो उत्पन्न होती है न नष्ट: समस्त विद्युत कार्य आंतरिक तापीय ऊर्जा में परिणत हुआ।'
            : 'Conservation confirmed: All electrical work converted into internal thermal energy.'}
        </div>
      </div>
    </div>
  )
}
