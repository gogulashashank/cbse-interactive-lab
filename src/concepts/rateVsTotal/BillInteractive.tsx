import React, { useState } from 'react'
import { calculateBillComparison } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'

export interface BillInteractiveProps {
  lang: 'en' | 'hi'
}

export const BillInteractive: React.FC<BillInteractiveProps> = ({ lang }) => {
  const [tariff, setTariff] = useState<number>(6)
  const [geyserMins, setGeyserMins] = useState<number>(30)

  const geyserHours = geyserMins / 60
  const res = calculateBillComparison(tariff, 30, geyserHours, 24)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: मासिक बिजली बिल तुलना (30 दिन)' : 'Interactive: Monthly Bill Comparison (30 Days)'}
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', gap: '0.75rem' }}>
        <SliderField
          id="bill-tariff"
          label={lang === 'hi' ? 'बिजली दर (Tariff Rate)' : 'Tariff Rate'}
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
          label={lang === 'hi' ? 'गीज़र का दैनिक समय (Geyser Daily Time)' : 'Geyser Daily Runtime'}
          unit={lang === 'hi' ? 'मिनट/दिन' : 'mins/day'}
          value={geyserMins}
          min={10}
          max={120}
          step={10}
          lang={lang}
          onChange={setGeyserMins}
        />
      </div>

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? '2000 W गीज़र (30 दिन):' : '2000 W Geyser (30 days):'}
          </span>
          <strong style={{ fontSize: '1.15rem', color: '#b45309' }}>
            {formatNumber(res.geyserKWh)} {lang === 'hi' ? 'यूनिट' : 'units'} = ₹{formatNumber(res.geyserCost)}
          </strong>
        </div>

        <div style={{ padding: '0.75rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>
            {lang === 'hi' ? '150 W फ्रिज (24 घंटे, 30 दिन):' : '150 W Fridge (24 hrs, 30 days):'}
          </span>
          <strong style={{ fontSize: '1.15rem', color: '#0369a1' }}>
            {formatNumber(res.fridgeKWh)} {lang === 'hi' ? 'यूनिट' : 'units'} = ₹{formatNumber(res.fridgeCost)}
          </strong>
        </div>

        <div style={{ padding: '0.75rem', background: '#fefce8', border: '1.5px solid #fde047', borderRadius: '6px' }}>
          <span style={{ fontSize: '0.8rem', color: '#854d0e', display: 'block' }}>
            {lang === 'hi' ? 'कुल मासिक बिल:' : 'Total Monthly Bill:'}
          </span>
          <strong style={{ fontSize: '1.3rem', color: '#854d0e' }}>
            ₹{formatNumber(res.totalCost)}
          </strong>
        </div>
      </div>
    </div>
  )
}
