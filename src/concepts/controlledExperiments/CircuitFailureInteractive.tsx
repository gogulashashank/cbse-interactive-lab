import React, { useState } from 'react'
import { calculateCircuitFailure } from './models'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface CircuitFailureInteractiveProps {
  lang: 'en' | 'hi'
}

export const CircuitFailureInteractive: React.FC<CircuitFailureInteractiveProps> = ({ lang }) => {
  const [circuitType, setCircuitType] = useState<'series' | 'parallel'>('series')
  const [brokenIndex, setBrokenIndex] = useState<number | null>(null)

  const res = calculateCircuitFailure(circuitType, 3, brokenIndex)
  const isSeries = circuitType === 'series'

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. परिपथ संरचना' : '1. Circuit Topology',
      math: isSeries ? 'Series: 1 shared current loop' : 'Parallel: 3 independent branches',
    },
    {
      kicker: lang === 'hi' ? '2. फ्यूज बल्ब स्थिति' : '2. Fault Status',
      math:
        brokenIndex === null
          ? 'All 3 filaments intact'
          : `Bulb ${brokenIndex + 1} filament OPEN (∞ Ω)`,
    },
    {
      kicker: lang === 'hi' ? '3. परिपथ पथ प्रभाव' : '3. Path Consequence',
      math:
        brokenIndex === null
          ? 'Current flows normally'
          : isSeries
            ? 'Loop broken → I = 0 A everywhere'
            : `Only Branch ${brokenIndex + 1} stops; others get 220 V`,
    },
    {
      kicker: lang === 'hi' ? '4. जलते बल्बों की संख्या' : '4. Working Bulbs',
      math: `${res.activeBulbsCount} / 3 Bulbs Lit`,
    },
  ]

  function toggleBulb(idx: number) {
    setBrokenIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-toolbar">
        <div className="nb-device-chips" role="group" aria-label="Circuit topology">
          <button
            type="button"
            className={`nb-chip-btn ${isSeries ? 'is-active' : ''}`}
            onClick={() => {
              setCircuitType('series')
              setBrokenIndex(null)
            }}
          >
            {lang === 'hi' ? '1. श्रेणीक्रम (दिवाली लड़ी)' : '1. Series Circuit (Single Loop)'}
          </button>
          <button
            type="button"
            className={`nb-chip-btn ${!isSeries ? 'is-active' : ''}`}
            onClick={() => {
              setCircuitType('parallel')
              setBrokenIndex(null)
            }}
          >
            {lang === 'hi' ? '2. पार्श्वक्रम (घरेलू वायरिंग)' : '2. Parallel Circuit (Home Branches)'}
          </button>
        </div>

        <button
          type="button"
          className="nb-chip-btn"
          onClick={() => setBrokenIndex(null)}
        >
          ↺ {lang === 'hi' ? 'सभी बल्ब ठीक करें' : 'Repair All Bulbs'}
        </button>
      </div>

      {/* Interactive Click-to-Fuse SVG Circuit Bench */}
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 230"
          className="nb-optics-svg"
          role="img"
          aria-label={`${circuitType} circuit with ${res.activeBulbsCount} of 3 bulbs lit`}
        >
          <defs>
            <pattern id="nb-cf-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="230" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="230" fill="url(#nb-cf-grid)" />

          {isSeries ? (
            <g>
              <rect
                x="80"
                y="55"
                width="600"
                height="130"
                rx="14"
                fill="none"
                stroke={brokenIndex !== null ? '#94a3b8' : '#1e293b'}
                strokeWidth="2.8"
                strokeDasharray={brokenIndex !== null ? '6 5' : undefined}
              />
              <rect x="320" y="166" width="120" height="36" rx="6" fill="#dbeafe" stroke="#2563eb" />
              <text x="380" y="188" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
                220 V Supply
              </text>

              {[0, 1, 2].map((idx) => {
                const cx = 200 + idx * 180
                const cy = 55
                const isBroken = brokenIndex === idx
                const isLit = brokenIndex === null
                return (
                  <g
                    key={idx}
                    transform={`translate(${cx}, ${cy})`}
                    onClick={() => toggleBulb(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    {isLit && <circle cx="0" cy="0" r="36" fill="rgba(250, 204, 21, 0.35)" />}
                    <circle
                      cx="0"
                      cy="0"
                      r="24"
                      fill={isBroken ? '#fee2e2' : isLit ? '#fef9c3' : '#f1f5f9'}
                      stroke={isBroken ? '#dc2626' : isLit ? '#ca8a04' : '#64748b'}
                      strokeWidth="2.4"
                    />
                    <text x="0" y="5" textAnchor="middle" fontSize="12" fontWeight="900" fill={isBroken ? '#991b1b' : '#1e293b'} fontFamily="ui-monospace, monospace">
                      {isBroken ? '✕ OPEN' : `B${idx + 1}`}
                    </text>
                    <text x="0" y="42" textAnchor="middle" fontSize="11" fontWeight="800" fill={isBroken ? '#b91c1c' : isLit ? '#15803d' : '#64748b'} fontFamily="system-ui, sans-serif">
                      {isBroken ? 'Blown (Click to fix)' : isLit ? 'Lit (Click to fuse)' : 'OFF (No current)'}
                    </text>
                  </g>
                )
              })}
            </g>
          ) : (
            <g>
              {/* Parallel Rails */}
              <line x1="110" y1="36" x2="640" y2="36" stroke="#1e293b" strokeWidth="2.6" />
              <line x1="110" y1="194" x2="640" y2="194" stroke="#1e293b" strokeWidth="2.6" />
              <line x1="110" y1="36" x2="110" y2="194" stroke="#1e293b" strokeWidth="2.6" />
              <rect x="52" y="96" width="116" height="40" rx="6" fill="#dbeafe" stroke="#2563eb" />
              <text x="110" y="120" textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
                220 V Mains
              </text>

              {[0, 1, 2].map((idx) => {
                const cx = 270 + idx * 170
                const cy = 115
                const isBroken = brokenIndex === idx
                const isLit = !isBroken
                return (
                  <g
                    key={idx}
                    onClick={() => toggleBulb(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <line
                      x1={cx}
                      y1="36"
                      x2={cx}
                      y2="194"
                      stroke={isBroken ? '#94a3b8' : '#1e293b'}
                      strokeWidth="2.4"
                      strokeDasharray={isBroken ? '5 5' : undefined}
                    />
                    {isLit && <circle cx={cx} cy={cy} r="36" fill="rgba(250, 204, 21, 0.35)" />}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="24"
                      fill={isBroken ? '#fee2e2' : '#fef9c3'}
                      stroke={isBroken ? '#dc2626' : '#ca8a04'}
                      strokeWidth="2.4"
                    />
                    <text x={cx} y={cy + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill={isBroken ? '#991b1b' : '#1e293b'} fontFamily="ui-monospace, monospace">
                      {isBroken ? '✕ OPEN' : `B${idx + 1}`}
                    </text>
                    <text x={cx + 58} y={cy + 4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={isBroken ? '#b91c1c' : '#15803d'} fontFamily="ui-monospace, monospace">
                      {isBroken ? 'OFF' : 'ON (220V)'}
                    </text>
                  </g>
                )
              })}
            </g>
          )}
        </svg>
      </div>

      {/* Accessible Button Controls for Fusing Any Bulb */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[0, 1, 2].map((idx) => {
          const isThisBroken = brokenIndex === idx
          return (
            <button
              key={idx}
              type="button"
              className={`nb-chip-btn ${isThisBroken ? 'is-ghost-active' : ''}`}
              onClick={() => toggleBulb(idx)}
            >
              {isThisBroken
                ? lang === 'hi'
                  ? `⚡ बल्ब ${idx + 1} फ्यूज है (ठीक करें)`
                  : `⚡ Bulb ${idx + 1} Blown (Click to Repair)`
                : lang === 'hi'
                  ? `💡 बल्ब ${idx + 1} फ्यूज करें`
                  : `💡 Fuse Bulb ${idx + 1}`}
            </button>
          )
        })}
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Series vs parallel fault analysis pipeline" />
    </div>
  )
}
