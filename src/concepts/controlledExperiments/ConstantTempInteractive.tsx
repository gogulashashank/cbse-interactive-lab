import React, { useState } from 'react'
import { calculateConstantTempOhmic } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'

export interface ConstantTempInteractiveProps {
  lang: 'en' | 'hi'
}

export const ConstantTempInteractive: React.FC<ConstantTempInteractiveProps> = ({ lang }) => {
  const [voltageV, setVoltageV] = useState<number>(10.0)
  const res = calculateConstantTempOhmic(voltageV, 10.0)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
        {lang === 'hi' ? 'प्रयोग: स्थिर ताप (ओमीय चालक) बनाम गर्म होता फिलामेंट' : 'Interactive: Constant Temp (Ohmic) vs Glowing Filament'}
      </h4>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#475569' }}>
        {lang === 'hi' ? 'वोल्टेज बढ़ाएं और देखें कि फिलामेंट का प्रतिरोध ताप के साथ कैसे बढ़ता है:' : 'Increase voltage and observe how filament resistance rises with temperature:'}
      </p>

      <SliderField
        id="ohmic-voltage-slider"
        label={lang === 'hi' ? 'लागू वोल्टेज (Voltage V)' : 'Applied Voltage (V)'}
        unit="V"
        value={voltageV}
        min={2.0}
        max={20.0}
        step={2.0}
        lang={lang}
        onChange={setVoltageV}
      />

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#ecfdf5', border: '1px solid #86efac', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
            {lang === 'hi' ? 'ओमीय प्रतिरोधक (स्थिर ताप पर)' : 'Ohmic Resistor (Constant Temp)'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#166534', margin: '0.2rem 0' }}>
            {lang === 'hi' ? 'प्रतिरोध स्थिर:' : 'Constant Resistance:'} <strong>{formatNumber(res.ohmicResistanceOhm)} Ω</strong>
          </div>
          <strong style={{ fontSize: '1.25rem', color: '#14532d' }}>
            I = {formatNumber(res.ohmicCurrentA)} A
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#166534', display: 'block' }}>
            (V ∝ I: {lang === 'hi' ? 'सीधी रेखा' : 'perfect straight line'})
          </span>
        </div>

        <div style={{ padding: '0.75rem', background: '#fff7ed', border: '1.5px solid #fdba74', borderRadius: '6px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9a3412', textTransform: 'uppercase' }}>
            {lang === 'hi' ? 'टॉर्च का बल्ब (ताप बढ़ने पर)' : 'Torch Bulb (Heating Filament)'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#9a3412', margin: '0.2rem 0' }}>
            {lang === 'hi' ? 'प्रतिरोध बढ़कर:' : 'Resistance rises to:'} <strong>{formatNumber(res.filamentResistanceOhm)} Ω</strong>
          </div>
          <strong style={{ fontSize: '1.25rem', color: '#c2410c' }}>
            I = {formatNumber(res.filamentCurrentA)} A
          </strong>
          <span style={{ fontSize: '0.75rem', color: '#9a3412', display: 'block', fontWeight: 600 }}>
            ({lang === 'hi' ? 'वक्र ग्राफ: अन-ओमीय!' : 'curved graph: Non-Ohmic!'})
          </span>
        </div>
      </div>
    </div>
  )
}
