import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculatePrismDispersionScattering } from './models'

interface Props {
  lang: Lang
}

export function PrismDispersionInteractive({ lang }: Props) {
  const [wavelengthNm, setWavelengthNm] = useState(420)
  const [secondPrism, setSecondPrism] = useState(false)

  const res = calculatePrismDispersionScattering(wavelengthNm, secondPrism)

  const colorHex =
    res.colorBandName === 'Violet'
      ? '#7c3aed'
      : res.colorBandName === 'Blue'
        ? '#2563eb'
        : res.colorBandName === 'Green'
          ? '#16a34a'
          : res.colorBandName === 'Yellow-Orange'
            ? '#d97706'
            : '#dc2626'

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. तरंगदैर्घ्य एवं वर्ण (λ)' : '1. Wavelength & Band (λ)',
      math: `λ = ${res.wavelengthNm} nm (${res.colorBandName})`,
    },
    {
      kicker: lang === 'hi' ? '2. काँच का अपवर्तनांक (n)' : '2. Glass Index (n)',
      math: `n(λ) = ${res.refractiveIndexGlass} (v = ${res.relativeSpeedInGlassFactor}c)`,
    },
    {
      kicker: lang === 'hi' ? '3. प्रिज्म विचलन कोण (δ)' : '3. Prism Deviation (δ)',
      math: `δ = ${res.prismDeviationDeg}°`,
    },
    {
      kicker: lang === 'hi' ? '4. प्रकीर्णन अनुपात (∝ 1/λ⁴)' : '4. Rayleigh Scattering',
      math: `${res.rayleighScatteringRelativeToRed}× vs Red (700 nm)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button
          type="button"
          className={`nb-QuickChip ${!secondPrism ? 'is-active' : ''}`}
          aria-pressed={!secondPrism}
          onClick={() => setSecondPrism(false)}
        >
          {lang === 'hi'
            ? '1. एकल प्रिज्म: वर्ण-विक्षेपण (VIBGYOR Spectrum)'
            : '1. Single Prism: Dispersion into VIBGYOR'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${secondPrism ? 'is-active' : ''}`}
          aria-pressed={secondPrism}
          onClick={() => setSecondPrism(true)}
        >
          {lang === 'hi'
            ? '2. न्यूटन का उल्टा द्वितीय प्रिज्म: श्वेत प्रकाश पुनर्योजन'
            : '2. Newton’s Inverted 2nd Prism: Recombine White Light'}
        </button>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Glass prism dispersion and Rayleigh scattering bench: wavelength ${res.wavelengthNm} nm (${res.colorBandName}), deviation ${res.prismDeviationDeg} degrees, scattering ${res.rayleighScatteringRelativeToRed}x relative to red`}
        >
          <defs>
            <pattern id="nb-prism-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-prism-grid)" />

          {/* Incident White Light Ray */}
          <line x1="28" y1="142" x2="132" y2="106" stroke="#334155" strokeWidth="3.5" />
          <text x="34" y="125" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            White Light
          </text>

          {/* First Glass Prism (Apex Up) */}
          <polygon
            points="100,166 160,44 220,166"
            fill="rgba(186, 230, 253, 0.42)"
            stroke="#0284c7"
            strokeWidth="2.4"
          />
          <text x="160" y="184" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0369a1" fontFamily="ui-monospace, monospace">
            Prism 1 (Apex ↑)
          </text>

          {/* Dispersed Rays Inside Prism 1 (Red on top, Violet bends most at bottom) */}
          <line x1="132" y1="106" x2="188" y2="96" stroke="#dc2626" strokeWidth="2.2" />
          <line x1="132" y1="106" x2="195" y2="118" stroke="#7c3aed" strokeWidth="2.2" />
          <line x1="132" y1="106" x2="192" y2="108" stroke={colorHex} strokeWidth="2.8" />

          {!secondPrism ? (
            <>
              {/* Emergent VIBGYOR Fan onto Screen at x=332 */}
              <line x1="188" y1="96" x2="332" y2="112" stroke="#dc2626" strokeWidth="2.4" />
              <line x1="190" y1="102" x2="332" y2="132" stroke="#16a34a" strokeWidth="2.2" />
              <line x1="195" y1="118" x2="332" y2="160" stroke="#7c3aed" strokeWidth="2.4" />

              {/* Screen */}
              <rect x="332" y="92" width="9" height="86" rx="3" fill="#1e293b" />
              <text x="348" y="115" fontSize="9.5" fontWeight="900" fill="#dc2626" fontFamily="ui-monospace, monospace">
                Red (700nm)
              </text>
              <text x="348" y="135" fontSize="9.5" fontWeight="800" fill="#16a34a" fontFamily="ui-monospace, monospace">
                Green
              </text>
              <text x="348" y="162" fontSize="9.5" fontWeight="900" fill="#7c3aed" fontFamily="ui-monospace, monospace">
                Violet (400nm)
              </text>
            </>
          ) : (
            <>
              {/* Second Identical Inverted Prism (Apex Down) */}
              <polygon
                points="230,44 290,166 350,44"
                fill="rgba(186, 230, 253, 0.42)"
                stroke="#0284c7"
                strokeWidth="2.4"
              />
              <text x="290" y="184" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0369a1" fontFamily="ui-monospace, monospace">
                Prism 2 (Inverted ↓)
              </text>
              {/* Rays enter Prism 2 and recombine into a single emergent white beam */}
              <line x1="188" y1="96" x2="262" y2="104" stroke="#dc2626" strokeWidth="2" />
              <line x1="195" y1="118" x2="255" y2="122" stroke="#7c3aed" strokeWidth="2" />
              <line x1="262" y1="104" x2="322" y2="106" stroke="#dc2626" strokeWidth="2" />
              <line x1="255" y1="122" x2="322" y2="106" stroke="#7c3aed" strokeWidth="2" />
              <line x1="322" y1="106" x2="418" y2="78" stroke="#1e293b" strokeWidth="3.6" />
              <text x="348" y="68" fontSize="10" fontWeight="900" fill="#065f46" fontFamily="ui-monospace, monospace">
                Recombined White Beam ✓
              </text>
            </>
          )}

          {/* Right-Side Dispersion & Scattering Ledger */}
          <g transform="translate(442, 18)">
            <rect x="0" y="0" width="298" height="178" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="149" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              DISPERSION &amp; SCATTERING (Ch 10.3–10.6)
            </text>

            <rect x="14" y="34" width="270" height="42" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="24" y="51" fontSize="10" fontWeight="900" fill={colorHex} fontFamily="ui-monospace, monospace">
              Selected: λ = {res.wavelengthNm} nm ({res.colorBandName})
            </text>
            <text x="24" y="67" fontSize="10" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
              Glass Index n = {res.refractiveIndexGlass} | Deviation δ = {res.prismDeviationDeg}°
            </text>

            <rect x="14" y="84" width="270" height="42" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="24" y="100" fontSize="10" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              RAYLEIGH SKY SCATTERING (I ∝ 1/λ⁴):
            </text>
            <text x="24" y="116" fontSize="10.5" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              Scatters {res.rayleighScatteringRelativeToRed}× stronger than 700 nm Red
            </text>

            <rect x="14" y="134" width="270" height="32" rx="5" fill="#fef3c7" stroke="#fcd34d" />
            <text x="149" y="154" textAnchor="middle" fontSize="9" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
              Shorter λ → Higher n → Slower → Bends Most!
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="pds-wavelength-slider"
          label={lang === 'hi' ? 'प्रकाश तरंगदैर्घ्य (λ)' : 'Light Wavelength (λ: 400 Violet → 700 Red)'}
          value={wavelengthNm}
          min={400}
          max={700}
          step={10}
          unit=" nm"
          lang={lang}
          onChange={setWavelengthNm}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Prism wavelength dispersion and Rayleigh scattering pipeline" />
    </div>
  )
}
