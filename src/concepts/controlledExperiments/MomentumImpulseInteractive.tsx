import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateMomentumImpulse } from './models'

interface Props {
  lang: Lang
}

export function MomentumImpulseInteractive({ lang }: Props) {
  const [massKg, setMassKg] = useState(0.15)
  const [speedMps, setSpeedMps] = useState(20)
  const [stoppingTimeS, setStoppingTimeS] = useState(0.25)

  const res = calculateMomentumImpulse(massKg, speedMps, stoppingTimeS, 0.05)

  // Visual bar heights for peak impact force comparison
  const maxBarHeight = 110
  const maxPossibleForce = Math.max(res.stiffHandsForceN, 120)
  const stiffBarH = Math.min(maxBarHeight, (res.stiffHandsForceN / maxPossibleForce) * maxBarHeight)
  const cushionedBarH = Math.min(maxBarHeight, (res.impactForceN / maxPossibleForce) * maxBarHeight)
  const handPullBackPx = Math.round(((res.stoppingTimeS - 0.05) / 0.45) * 140)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. स्थिर संवेग परिवर्तन (Δp)' : '1. Fixed Momentum Change (Δp)',
      math: `Δp = m·u = ${res.momentumChangeKgMps} kg·m/s`,
    },
    {
      kicker: lang === 'hi' ? '2. कड़े हाथ (Δt = 0.05 s)' : '2. Stiff Hands (Δt = 0.05 s)',
      math: `F_stiff = ${res.stiffHandsForceN} N`,
    },
    {
      kicker: lang === 'hi' ? '3. हाथ पीछे खींचना (Δt)' : '3. Cushioned Catch (Δt)',
      math: `F = Δp / ${res.stoppingTimeS}s = ${res.impactForceN} N`,
    },
    {
      kicker: lang === 'hi' ? '4. बल में कमी अनुपात' : '4. Force Reduction Factor',
      math: `${res.forceReductionFactor}× gentler impact`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Second law of motion impulse bench: fixed momentum change ${res.momentumChangeKgMps} kg m/s, stopping time ${res.stoppingTimeS} s, impact force ${res.impactForceN} N`}
        >
          <defs>
            <pattern id="nb-impulse-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-impulse-grid)" />

          {/* Left Panel: Cricket Ball & Fielder Hands Recoil */}
          <rect x="18" y="20" width="390" height="175" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="32" y="42" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            HELD FIXED: Δp = m × u = {res.momentumChangeKgMps} kg·m/s
          </text>

          {/* Incoming Ball Motion Line */}
          <line x1="45" y1="102" x2={185 + handPullBackPx} y2="102" stroke="#dc2626" strokeWidth="2.4" strokeDasharray="5 3" />
          <circle cx="65" cy="102" r="13" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
          <text x="65" y="78" textAnchor="middle" fontSize="10" fontWeight="800" fill="#991b1b" fontFamily="ui-monospace, monospace">
            u={res.initialSpeedMps}m/s
          </text>

          {/* Stiff Hand Reference Marker at x=185 */}
          <line x1="185" y1="68" x2="185" y2="138" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
          <text x="185" y="62" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#64748b" fontFamily="ui-monospace, monospace">
            Contact (t=0)
          </text>

          {/* Cushioned Catch Stopping Point */}
          <rect
            x={185 + handPullBackPx}
            y="76"
            width="18"
            height="52"
            rx="6"
            fill="#16a34a"
            stroke="#14532d"
            strokeWidth="2"
          />
          <circle cx={178 + handPullBackPx} cy="102" r="12" fill="#f97316" stroke="#7c2d12" strokeWidth="1.8" />
          <text
            x={185 + handPullBackPx}
            y="148"
            textAnchor="middle"
            fontSize="10"
            fontWeight="800"
            fill="#166534"
            fontFamily="ui-monospace, monospace"
          >
            Stop Δt={res.stoppingTimeS}s (v=0)
          </text>

          {/* Invariant Banner */}
          <rect x="32" y="160" width="362" height="24" rx="4" fill="#fef3c7" stroke="#f59e0b" />
          <text x="213" y="176" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
            Same Δp = {res.momentumChangeKgMps} kg·m/s stopped over Δt = {res.stoppingTimeS} s
          </text>

          {/* Right Panel: Peak Impact Force Comparison */}
          <g transform="translate(425, 20)">
            <rect x="0" y="0" width="317" height="175" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
            <text x="158" y="22" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              IMPACT FORCE ON HANDS (F = Δp / Δt)
            </text>

            {/* Baseline axis */}
            <line x1="30" y1="146" x2="288" y2="146" stroke="#334155" strokeWidth="1.8" />

            {/* Stiff Hands Bar */}
            <rect
              x="58"
              y={146 - stiffBarH}
              width="68"
              height={stiffBarH}
              rx="4"
              fill="#ef4444"
              stroke="#991b1b"
              strokeWidth="1.5"
            />
            <text x="92" y={Math.max(34, 140 - stiffBarH)} textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#991b1b" fontFamily="ui-monospace, monospace">
              {res.stiffHandsForceN} N
            </text>
            <text x="92" y="162" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#7f1d1d" fontFamily="ui-monospace, monospace">
              Stiff (0.05s)
            </text>

            {/* Cushioned Pull-Back Bar */}
            <rect
              x="186"
              y={146 - cushionedBarH}
              width="68"
              height={cushionedBarH}
              rx="4"
              fill="#10b981"
              stroke="#065f46"
              strokeWidth="1.5"
            />
            <text x="220" y={Math.max(34, 140 - cushionedBarH)} textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#065f46" fontFamily="ui-monospace, monospace">
              {res.impactForceN} N
            </text>
            <text x="220" y="162" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#065f46" fontFamily="ui-monospace, monospace">
              Pull-Back ({res.stoppingTimeS}s)
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="mi-mass-slider"
          label={lang === 'hi' ? 'गेंद का द्रव्यमान (m)' : 'Ball Mass (m)'}
          value={massKg}
          min={0.1}
          max={0.5}
          step={0.05}
          unit=" kg"
          lang={lang}
          onChange={setMassKg}
        />
        <SliderField
          id="mi-speed-slider"
          label={lang === 'hi' ? 'गेंद की चाल (u)' : 'Incoming Speed (u)'}
          value={speedMps}
          min={10}
          max={40}
          step={2}
          unit=" m/s"
          lang={lang}
          onChange={setSpeedMps}
        />
        <SliderField
          id="mi-time-slider"
          label={lang === 'hi' ? 'रोकने का समय (Δt)' : 'Stopping Time (Δt)'}
          value={stoppingTimeS}
          min={0.05}
          max={0.5}
          step={0.05}
          unit=" s"
          lang={lang}
          onChange={setStoppingTimeS}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Momentum and impulse stopping force pipeline" />
    </div>
  )
}
