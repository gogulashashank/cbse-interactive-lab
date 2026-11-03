import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { calculateJunctionConservation } from './models'

interface Props {
  lang: Lang
}

export function ChargeConservationInteractive({ lang }: Props) {
  const [in1, setIn1] = useState(3.0)
  const [in2, setIn2] = useState(2.0)
  const [branch1Ratio, setBranch1Ratio] = useState(0.4)

  const junction = calculateJunctionConservation(in1, in2, branch1Ratio)

  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', margin: '1rem 0' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#0f172a', fontSize: '1rem' }}>
        {lang === 'hi' ? '🔬 प्रयोग: तार के जोड़ पर आवेश संरक्षण (Σ I_in = Σ I_out)' : '🔬 Experiment: Charge Conservation at a Junction (Σ I_in = Σ I_out)'}
      </h4>
      <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '0 0 1rem 0' }}>
        {lang === 'hi'
          ? 'दो आने वाली धाराओं और शाखाओं के अनुपात को बदलें। देखें कि आने वाला कुल आवेश जाने वाले आवेश के ठीक बराबर रहता है।'
          : 'Vary the two incoming currents and the branch splitting ratio. Notice that incoming charge rate exactly matches outgoing.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <SliderField
          id="cc-inflow1-slider"
          label={lang === 'hi' ? 'प्रवेश धारा 1 (I₁ in)' : 'Inflow Current 1 (I₁ in)'}
          value={in1}
          min={0.5}
          max={6.0}
          step={0.5}
          unit=" A"
          lang={lang}
          onChange={setIn1}
        />
        <SliderField
          id="cc-inflow2-slider"
          label={lang === 'hi' ? 'प्रवेश धारा 2 (I₂ in)' : 'Inflow Current 2 (I₂ in)'}
          value={in2}
          min={0.0}
          max={6.0}
          step={0.5}
          unit=" A"
          lang={lang}
          onChange={setIn2}
        />
        <SliderField
          id="cc-ratio-slider"
          label={lang === 'hi' ? 'शाखा 1 विभाजन अनुपात' : 'Branch 1 Split Ratio'}
          value={branch1Ratio}
          min={0.1}
          max={0.9}
          step={0.05}
          unit=""
          lang={lang}
          onChange={setBranch1Ratio}
        />
      </div>

      {/* Interactive junction SVG visual */}
      <div style={{ background: '#ffffff', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
        <svg viewBox="0 0 400 160" style={{ width: '100%', maxHeight: '160px', display: 'block' }}>
          {/* Incoming wires */}
          <line x1="40" y1="40" x2="200" y2="80" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
          <line x1="40" y1="120" x2="200" y2="80" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />

          {/* Junction Node */}
          <circle cx="200" cy="80" r="10" fill="#0f172a" />

          {/* Outgoing wires */}
          <line x1="200" y1="80" x2="360" y2="40" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
          <line x1="200" y1="80" x2="360" y2="120" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />

          {/* Labels */}
          <text x="35" y="30" fill="#1e40af" fontSize="12" fontWeight="700">I₁ = {junction.currentIn1} A →</text>
          <text x="35" y="145" fill="#1e40af" fontSize="12" fontWeight="700">I₂ = {junction.currentIn2} A →</text>

          <text x="200" y="105" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800">
            Node (Σ = {junction.totalIn} A)
          </text>

          <text x="365" y="30" textAnchor="end" fill="#15803d" fontSize="12" fontWeight="700">→ I₃ = {junction.currentOut1} A</text>
          <text x="365" y="145" textAnchor="end" fill="#15803d" fontSize="12" fontWeight="700">→ I₄ = {junction.currentOut2} A</text>
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.5rem', fontSize: '0.86rem' }}>
          <div style={{ color: '#1e40af', fontWeight: 700 }}>
            {lang === 'hi' ? 'कुल प्रवेश' : 'Total Inflow'}: {junction.totalIn} A
          </div>
          <div style={{ color: '#0f172a', fontWeight: 800 }}>=</div>
          <div style={{ color: '#15803d', fontWeight: 700 }}>
            {lang === 'hi' ? 'कुल निकास' : 'Total Outflow'}: {junction.totalOut} A
          </div>
        </div>
      </div>

      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '6px', padding: '0.6rem 0.8rem', fontSize: '0.82rem', color: '#065f46' }}>
        <strong>{lang === 'hi' ? 'आवेश संरक्षण पुष्टि:' : 'Conservation Verified:'}</strong>{' '}
        {lang === 'hi'
          ? `प्रवेश धारा (${junction.currentIn1} + ${junction.currentIn2} = ${junction.totalIn} A) ठीक निकास धारा (${junction.currentOut1} + ${junction.currentOut2} = ${junction.totalOut} A) के बराबर है। कोई आवेश नष्ट नहीं हुआ।`
          : `Inflow (${junction.currentIn1} + ${junction.currentIn2} = ${junction.totalIn} A) perfectly equals Outflow (${junction.currentOut1} + ${junction.currentOut2} = ${junction.totalOut} A). Not a single coulomb is lost.`}
      </div>
    </div>
  )
}
