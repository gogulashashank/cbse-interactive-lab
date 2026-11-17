import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateVelocityTimeGraph } from './models'

interface Props {
  lang: Lang
}

export function VelocityTimeGraphInteractive({ lang }: Props) {
  const [initialU, setInitialU] = useState(5)
  const [finalV, setFinalV] = useState(25)
  const [timeT, setTimeT] = useState(4)

  const res = calculateVelocityTimeGraph(initialU, finalV, timeT)

  // Plot geometry inside SVG (x: 75..435 for t: 0..10 s, y: 175..25 for v: 0..30 m/s)
  const plotLeft = 75
  const plotBottom = 175
  const plotWidth = 340
  const plotHeight = 145
  const maxT = 10
  const maxV = 30

  const xEnd = plotLeft + (res.timeSeconds / maxT) * plotWidth
  const yU = plotBottom - (res.initialVelocityMps / maxV) * plotHeight
  const yV = plotBottom - (res.finalVelocityMps / maxV) * plotHeight

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. ढाल = त्वरण (a)' : '1. Graph Slope (a)',
      math: `a = (v−u)/t = ${res.accelerationMps2} m/s²`,
    },
    {
      kicker: lang === 'hi' ? '2. आयत का क्षेत्रफल (ut)' : '2. Rectangle Area (ut)',
      math: `s₁ = ${res.initialVelocityMps}×${res.timeSeconds} = ${res.rectangleDisplacementM} m`,
    },
    {
      kicker: lang === 'hi' ? '3. त्रिभुज का क्षेत्रफल (½at²)' : '3. Triangle Area (½at²)',
      math: `s₂ = ½(${res.finalVelocityMps - res.initialVelocityMps})(${res.timeSeconds}) = ${res.triangleDisplacementM} m`,
    },
    {
      kicker: lang === 'hi' ? '4. कुल विस्थापन (कुल क्षेत्रफल)' : '4. Total Displacement (Area)',
      math: `s = s₁ + s₂ = ${res.totalDisplacementM} m`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Velocity-time graph: u=${res.initialVelocityMps} m/s, v=${res.finalVelocityMps} m/s, t=${res.timeSeconds} s, slope a=${res.accelerationMps2} m/s², area s=${res.totalDisplacementM} m`}
        >
          <defs>
            <pattern id="nb-vt-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-vt-grid)" />

          {/* Shaded Rectangle Area (u * t) */}
          <rect
            x={plotLeft}
            y={yU}
            width={Math.max(0, xEnd - plotLeft)}
            height={Math.max(0, plotBottom - yU)}
            fill="rgba(37, 99, 235, 0.2)"
            stroke="#2563eb"
            strokeWidth="1.4"
            strokeDasharray="4 2"
          />

          {/* Shaded Triangle Area (0.5 * (v - u) * t) */}
          <polygon
            points={`${plotLeft},${yU} ${xEnd},${yU} ${xEnd},${yV}`}
            fill="rgba(217, 119, 6, 0.24)"
            stroke="#d97706"
            strokeWidth="1.4"
          />

          {/* Coordinate Axes */}
          <line x1={plotLeft} y1="22" x2={plotLeft} y2={plotBottom} stroke="#1e293b" strokeWidth="2.2" />
          <line x1={plotLeft} y1={plotBottom} x2={plotLeft + plotWidth + 15} y2={plotBottom} stroke="#1e293b" strokeWidth="2.2" />

          {/* Axis Labels */}
          <text x="18" y="34" fontSize="10.5" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace">
            v (m/s)
          </text>
          <text x={plotLeft + plotWidth} y="198" textAnchor="end" fontSize="10.5" fontWeight="800" fill="#1e293b" fontFamily="ui-monospace, monospace">
            Time t (s) →
          </text>

          {/* Velocity Line Segment from (0, u) to (t, v) */}
          <line
            x1={plotLeft}
            y1={yU}
            x2={xEnd}
            y2={yV}
            stroke="#b91c1c"
            strokeWidth="3.2"
          />
          <circle cx={plotLeft} cy={yU} r="5" fill="#1d4ed8" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx={xEnd} cy={yV} r="5.5" fill="#b91c1c" stroke="#ffffff" strokeWidth="1.5" />

          {/* Point Annotations */}
          <text x={plotLeft - 8} y={yU + 4} textAnchor="end" fontSize="10" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            u={res.initialVelocityMps}
          </text>
          <text x={xEnd + 8} y={Math.max(32, yV + 4)} fontSize="10.5" fontWeight="800" fill="#991b1b" fontFamily="ui-monospace, monospace">
            (t={res.timeSeconds}s, v={res.finalVelocityMps}m/s)
          </text>
          <text x={xEnd} y="192" textAnchor="middle" fontSize="10" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
            t={res.timeSeconds}s
          </text>

          {/* Right-Side Ledger Card */}
          <g transform="translate(465, 22)">
            <rect x="0" y="0" width="272" height="168" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="136" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              v–t GRAPH LEDGER (NCERT Ch 7.4)
            </text>

            <rect x="14" y="34" width="244" height="36" rx="5" fill="#fef2f2" stroke="#fca5a5" />
            <text x="24" y="50" fontSize="10" fontWeight="800" fill="#991b1b" fontFamily="ui-monospace, monospace">
              RATE (SLOPE = Δv / Δt):
            </text>
            <text x="24" y="64" fontSize="11" fontWeight="900" fill="#7f1d1d" fontFamily="ui-monospace, monospace">
              a = ({res.finalVelocityMps} − {res.initialVelocityMps}) / {res.timeSeconds} = {res.accelerationMps2} m/s²
            </text>

            <rect x="14" y="78" width="244" height="38" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="24" y="94" fontSize="10" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              AREA SPLIT (ut + ½at²):
            </text>
            <text x="24" y="109" fontSize="10.5" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              Rect: {res.rectangleDisplacementM} m | Tri: {res.triangleDisplacementM} m
            </text>

            <rect x="14" y="124" width="244" height="34" rx="5" fill="#ecfdf5" stroke="#6ee7b7" />
            <text x="136" y="146" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#065f46" fontFamily="ui-monospace, monospace">
              TOTAL AREA (s) = {res.totalDisplacementM} m ✓
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="vt-u-slider"
          label={lang === 'hi' ? 'प्रारंभिक वेग (u)' : 'Initial Velocity (u)'}
          value={initialU}
          min={0}
          max={20}
          step={1}
          unit=" m/s"
          lang={lang}
          onChange={setInitialU}
        />
        <SliderField
          id="vt-v-slider"
          label={lang === 'hi' ? 'अंतिम वेग (v)' : 'Final Velocity (v)'}
          value={finalV}
          min={0}
          max={30}
          step={1}
          unit=" m/s"
          lang={lang}
          onChange={setFinalV}
        />
        <SliderField
          id="vt-t-slider"
          label={lang === 'hi' ? 'समयांतराल (t)' : 'Time Interval (t)'}
          value={timeT}
          min={1}
          max={10}
          step={0.5}
          unit=" s"
          lang={lang}
          onChange={setTimeT}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Velocity-time graph slope and area calculation pipeline" />
    </div>
  )
}
