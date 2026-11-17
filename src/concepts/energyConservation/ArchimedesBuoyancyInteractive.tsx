import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateArchimedesBuoyancy } from './models'

interface Props {
  lang: Lang
}

export function ArchimedesBuoyancyInteractive({ lang }: Props) {
  const [volumeCm3, setVolumeCm3] = useState(400)
  const [objectDensity, setObjectDensity] = useState(2.5)
  const [fluidDensity, setFluidDensity] = useState(1.0)

  const state = calculateArchimedesBuoyancy(volumeCm3, objectDensity, fluidDensity)

  // Beaker waterline at y=95; block height=44
  const waterlineY = 95
  const blockH = 44
  // If floating, submerged fraction of blockH sits below waterlineY; if sinking, rests near bottom (y=134)
  const blockTopY = state.floats
    ? waterlineY - blockH * (1 - state.submergedFraction)
    : 132

  const displacedBarHeight = Math.min(75, (state.displacedVolumeCm3 / 600) * 75)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. वायु में वास्तविक भार (W_air)' : '1. Weight in Air (W_air)',
      math: `W_air = mg = ${state.weightInAirN} N`,
    },
    {
      kicker: lang === 'hi' ? '2. विस्थापित द्रव आयतन (V_disp)' : '2. Displaced Fluid (V_disp)',
      math: `V_disp = ${state.displacedVolumeCm3} cm³ (${(state.submergedFraction * 100).toFixed(0)}%)`,
    },
    {
      kicker: lang === 'hi' ? '3. उत्प्लावन बल (F_B = W_fluid)' : '3. Buoyant Upthrust (F_B)',
      math: `F_B = ${state.buoyantUpthrustN} N ↑`,
    },
    {
      kicker: lang === 'hi' ? '4. आभासी भार (W_app = W_air − F_B)' : '4. Apparent Weight (W_app)',
      math: `${state.apparentWeightN} N (${state.floats ? (lang === 'hi' ? 'तैरता है' : 'FLOATS') : (lang === 'hi' ? 'डूबता है' : 'SINKS')})`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Archimedes buoyancy apparatus: weight in air ${state.weightInAirN} N, buoyant upthrust ${state.buoyantUpthrustN} N, apparent weight ${state.apparentWeightN} N`}
        >
          <defs>
            <pattern id="nb-buoyancy-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-buoyancy-grid)" />

          {/* Spring Balance Header */}
          <rect x="132" y="14" width="96" height="24" rx="5" fill="#1e293b" />
          <text x="180" y="30" textAnchor="middle" fontSize="10" fontWeight="800" fill="#f8fafc" fontFamily="ui-monospace, monospace">
            Scale: {state.apparentWeightN} N
          </text>
          <line x1="180" y1="38" x2="180" y2={blockTopY} stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />

          {/* Eureka Overflow Beaker */}
          <rect x="105" y="65" width="150" height="122" rx="4" fill="none" stroke="#334155" strokeWidth="2.5" />
          <rect x="107" y={waterlineY} width="146" height={185 - waterlineY} fill="rgba(56, 189, 248, 0.32)" />
          <line x1="106" y1={waterlineY} x2="254" y2={waterlineY} stroke="#0284c7" strokeWidth="2" />

          {/* Overflow Spout to Catch Cylinder */}
          <line x1="255" y1={waterlineY} x2="310" y2={waterlineY + 14} stroke="#0284c7" strokeWidth="3" />

          {/* Test Block inside Beaker */}
          <rect
            x="146"
            y={blockTopY}
            width="68"
            height={blockH}
            rx="5"
            fill={state.floats ? '#f59e0b' : '#64748b'}
            stroke="#1e293b"
            strokeWidth="2"
          />
          <text
            x="180"
            y={blockTopY + 19}
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="900"
            fill="#ffffff"
            fontFamily="ui-monospace, monospace"
          >
            ρ={state.objectDensityGcm3}
          </text>
          <text
            x="180"
            y={blockTopY + 34}
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            fill="#ffffff"
            fontFamily="ui-monospace, monospace"
          >
            {state.floats ? 'FLOATS' : 'SINKS'}
          </text>

          {/* Force Vector Labels next to Beaker */}
          <text x="92" y="116" textAnchor="end" fontSize="10" fontWeight="900" fill="#dc2626" fontFamily="ui-monospace, monospace">
            ↓ W_air = {state.weightInAirN} N
          </text>
          <text x="92" y="142" textAnchor="end" fontSize="10" fontWeight="900" fill="#0284c7" fontFamily="ui-monospace, monospace">
            ↑ F_B = {state.buoyantUpthrustN} N
          </text>

          {/* Graduated Catch Cylinder for Displaced Fluid */}
          <rect x="305" y="95" width="76" height="92" rx="4" fill="#ffffff" stroke="#334155" strokeWidth="2.2" />
          <rect
            x="307"
            y={185 - displacedBarHeight}
            width="72"
            height={displacedBarHeight}
            fill="rgba(14, 165, 233, 0.45)"
          />
          <text x="343" y="86" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0369a1" fontFamily="ui-monospace, monospace">
            Displaced Fluid
          </text>
          <text x="343" y="202" textAnchor="middle" fontSize="10" fontWeight="900" fill="#0c4a6e" fontFamily="ui-monospace, monospace">
            {state.displacedVolumeCm3} cm³ = {state.buoyantUpthrustN} N
          </text>

          {/* Right-Side Archimedes Balance Ledger */}
          <g transform="translate(425, 22)">
            <rect x="0" y="0" width="315" height="168" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="157" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              ARCHIMEDES LEDGER (NCERT Ch 9.5)
            </text>

            <text x="18" y="50" fontSize="10.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
              True Weight in Air (W_air): {state.weightInAirN} N
            </text>
            <text x="18" y="74" fontSize="10.5" fontWeight="800" fill="#0369a1" fontFamily="ui-monospace, monospace">
              Displaced Fluid Weight (F_B): {state.buoyantUpthrustN} N
            </text>
            <text x="18" y="98" fontSize="10.5" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace">
              Apparent Weight (W_air − F_B): {state.apparentWeightN} N
            </text>

            <rect
              x="16"
              y="114"
              width="283"
              height="40"
              rx="6"
              fill={state.floats ? '#ecfdf5' : '#fef2f2'}
              stroke={state.floats ? '#6ee7b7' : '#fca5a5'}
            />
            <text
              x="157"
              y="138"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="900"
              fill={state.floats ? '#065f46' : '#991b1b'}
              fontFamily="ui-monospace, monospace"
            >
              {state.floats
                ? `ρ_obj (${state.objectDensityGcm3}) ≤ ρ_fluid (${state.fluidDensityGcm3}) → FLOATS (${(state.submergedFraction * 100).toFixed(0)}%)`
                : `ρ_obj (${state.objectDensityGcm3}) > ρ_fluid (${state.fluidDensityGcm3}) → SINKS (100%)`}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="ab-obj-density"
          label={lang === 'hi' ? 'वस्तु का घनत्व (ρ_obj)' : 'Object Density (ρ_obj)'}
          value={objectDensity}
          min={0.4}
          max={3.0}
          step={0.1}
          unit=" g/cm³"
          lang={lang}
          onChange={setObjectDensity}
        />
        <SliderField
          id="ab-obj-volume"
          label={lang === 'hi' ? 'वस्तु का आयतन (V)' : 'Object Volume (V)'}
          value={volumeCm3}
          min={100}
          max={600}
          step={50}
          unit=" cm³"
          lang={lang}
          onChange={setVolumeCm3}
        />
        <SliderField
          id="ab-fluid-density"
          label={lang === 'hi' ? 'द्रव का घनत्व (ρ_fluid)' : 'Fluid Density (ρ_fluid)'}
          value={fluidDensity}
          min={0.8}
          max={1.4}
          step={0.1}
          unit=" g/cm³"
          lang={lang}
          onChange={setFluidDensity}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Archimedes buoyancy and apparent weight calculation pipeline" />
    </div>
  )
}
