import React from 'react'
import type { DomesticCircuitResult } from './safetyModel'

interface SafetyDiagramsProps {
  circuitResult: DomesticCircuitResult
  earthingConnected: boolean
  faultMode: 'none' | 'short_circuit' | 'chassis_leakage'
  userTouchingChassis: boolean
  onToggleAppliance: (id: string) => void
  onToggleChassisTouch: () => void
}

export const SafetyDiagrams: React.FC<SafetyDiagramsProps> = ({
  circuitResult,
  earthingConnected,
  faultMode,
  userTouchingChassis,
  onToggleAppliance,
  onToggleChassisTouch,
}) => {
  const isFuseBlown = circuitResult.fuseStatus === 'BLOWN'
  const isOverheating = circuitResult.fuseColor === 'overheating'
  const isShortCircuit = circuitResult.isShortCircuited
  const isChassisLeakage = faultMode === 'chassis_leakage'
  const isShockHazard = circuitResult.shockRiskLevel === 'DANGEROUS' || circuitResult.shockRiskLevel === 'LETHAL'

  // Wire colors
  const liveColor = isFuseBlown ? '#94a3b8' : isShortCircuit ? '#ef4444' : '#dc2626' // Red/Crimson
  const neutralColor = isFuseBlown ? '#94a3b8' : '#2563eb' // Blue
  const earthColor = earthingConnected ? '#16a34a' : '#94a3b8' // Green or disabled grey

  return (
    <div className="safe-diagram-wrapper" aria-label="Domestic Circuit Schematic and Safety Demonstration">
      <div className="safe-diagram-header">
        <span className="safe-diagram-badge">
          {isFuseBlown ? '🚨 FUSE TRIPPED / CIRCUIT BROKEN' : '⚡ 220 V AC LIVE DOMESTIC MAINS'}
        </span>
        <span className="safe-diagram-indicator">
          Line Current: <strong>{circuitResult.totalLineCurrentA.toFixed(2)} A</strong> / Fuse:{' '}
          <strong>{circuitResult.fuseRatingA} A</strong>
        </span>
      </div>

      <svg
        className="safe-circuit-svg"
        viewBox="0 0 920 460"
        role="img"
        aria-label="Domestic Electric Circuit Board showing Live, Neutral, and Earth wires with parallel appliances and safety fuse"
      >
        <defs>
          {/* Gradient for Fuse Element */}
          <linearGradient id="fuseGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Pattern for Earth Ground Pit */}
          <pattern id="earthLines" width="10" height="10" patternUnits="userSpaceOnUse">
            <line x1="0" y1="10" x2="10" y2="0" stroke="#16a34a" strokeWidth="1.5" />
          </pattern>

          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Board */}
        <rect x="10" y="10" width="900" height="440" rx="14" fill="#0f172a" stroke="#334155" strokeWidth="2" />

        {/* 1. Electricity Meter & Main Distribution Box */}
        <g id="mains-supply">
          <rect x="25" y="35" width="140" height="390" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          <text x="95" y="65" textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="bold">
            ELECTRICITY MAINS
          </text>
          <text x="95" y="85" textAnchor="middle" fill="#94a3b8" fontSize="11">
            220 V RMS · 50 Hz
          </text>

          {/* Meter window */}
          <rect x="40" y="100" width="110" height="45" rx="4" fill="#000000" stroke="#64748b" strokeWidth="1" />
          <text x="95" y="127" textAnchor="middle" fill="#22c55e" fontFamily="monospace" fontSize="13" fontWeight="bold">
            {circuitResult.totalActivePowerW.toFixed(0)} W ACTIVE
          </text>

          {/* Terminal Labels */}
          <circle cx="50" cy="180" r="7" fill="#dc2626" />
          <text x="65" y="184" fill="#fca5a5" fontSize="11" fontWeight="bold">
            L (Live 220V)
          </text>

          <circle cx="50" cy="240" r="7" fill="#2563eb" />
          <text x="65" y="244" fill="#93c5fd" fontSize="11" fontWeight="bold">
            N (Neutral 0V)
          </text>

          <circle cx="50" cy="300" r="7" fill={earthingConnected ? '#16a34a' : '#64748b'} />
          <text x="65" y="304" fill={earthingConnected ? '#86efac' : '#94a3b8'} fontSize="11" fontWeight="bold">
            E (Earth 0V)
          </text>

          {/* Earthing Ground Plate symbol */}
          <g transform="translate(45, 345)">
            <line x1="10" y1="0" x2="10" y2="25" stroke={earthColor} strokeWidth="2" />
            <line x1="-10" y1="25" x2="30" y2="25" stroke={earthColor} strokeWidth="3" />
            <line x1="-3" y1="31" x2="23" y2="31" stroke={earthColor} strokeWidth="2.5" />
            <line x1="3" y1="37" x2="17" y2="37" stroke={earthColor} strokeWidth="2" />
            <line x1="7" y1="43" x2="13" y2="43" stroke={earthColor} strokeWidth="1.5" />
            <text x="10" y="58" textAnchor="middle" fill={earthingConnected ? '#86efac' : '#94a3b8'} fontSize="10">
              {earthingConnected ? 'Ground Pit' : 'Disconnected'}
            </text>
          </g>
        </g>

        {/* 2. Safety Fuse Cartridge in Live Wire */}
        <g id="fuse-cartridge" transform="translate(195, 155)">
          <rect
            x="0"
            y="0"
            width="100"
            height="50"
            rx="6"
            fill={isFuseBlown ? '#450a0a' : isOverheating ? '#78350f' : '#1e293b'}
            stroke={isFuseBlown ? '#ef4444' : isOverheating ? '#f59e0b' : '#38bdf8'}
            strokeWidth="2"
          />
          {/* Porcelain ends */}
          <rect x="0" y="0" width="16" height="50" rx="3" fill="#cbd5e1" />
          <rect x="84" y="0" width="16" height="50" rx="3" fill="#cbd5e1" />

          {/* Fuse Wire */}
          {isFuseBlown ? (
            <g>
              {/* Melted Gap */}
              <line x1="16" y1="25" x2="42" y2="25" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3,2" />
              <line x1="58" y1="25" x2="84" y2="25" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="3,2" />
              {/* Melted blob */}
              <circle cx="42" cy="27" r="3" fill="#ef4444" />
              <circle cx="58" cy="27" r="3" fill="#ef4444" />
              <text x="50" y="16" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="bold">
                MELTED GAP
              </text>
            </g>
          ) : (
            <g>
              <line
                x1="16"
                y1="25"
                x2="84"
                y2="25"
                stroke={isOverheating ? 'url(#fuseGlow)' : '#e2e8f0'}
                strokeWidth={isOverheating ? 4 : 2.5}
                filter={isOverheating ? 'url(#glowEffect)' : undefined}
              />
              <text x="50" y="17" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                {circuitResult.fuseRatingA} A RATED
              </text>
            </g>
          )}

          <text x="50" y="42" textAnchor="middle" fill="#94a3b8" fontSize="9.5">
            Cartridge Fuse
          </text>
        </g>

        {/* Wire from mains L to Fuse */}
        <line x1="165" y1="180" x2="195" y2="180" stroke={liveColor} strokeWidth="3" />

        {/* Main Live Busbar after Fuse */}
        <line x1="295" y1="180" x2="890" y2="180" stroke={liveColor} strokeWidth="3" />
        <text x="310" y="172" fill="#fca5a5" fontSize="10" fontWeight="bold">
          LIVE WIRE (220 V)
        </text>

        {/* Main Neutral Busbar */}
        <line x1="165" y1="240" x2="890" y2="240" stroke={neutralColor} strokeWidth="3" />
        <text x="310" y="234" fill="#93c5fd" fontSize="10" fontWeight="bold">
          NEUTRAL WIRE (0 V)
        </text>

        {/* Main Earth Busbar */}
        <line
          x1="165"
          y1="300"
          x2="890"
          y2="300"
          stroke={earthColor}
          strokeWidth="2.5"
          strokeDasharray={earthingConnected ? undefined : '5,5'}
        />
        <text x="310" y="294" fill={earthingConnected ? '#86efac' : '#94a3b8'} fontSize="10" fontWeight="bold">
          EARTH WIRE (0 V Reference)
        </text>

        {/* Short Circuit Fault Representation */}
        {isShortCircuit && (
          <g transform="translate(340, 180)">
            <line x1="0" y1="0" x2="0" y2="60" stroke="#f59e0b" strokeWidth="4" filter="url(#glowEffect)" />
            <polygon points="-8,30 0,18 8,30" fill="#ef4444" />
            <text x="12" y="34" fill="#f87171" fontSize="11" fontWeight="bold">
              ⚡ DIRECT SHORT (R → 0 Ω)
            </text>
          </g>
        )}

        {/* 3. Parallel Appliance Branches */}
        {circuitResult.appliances.map((app, index) => {
          const branchX = 390 + index * 80
          const isAppOn = app.enabled && !isFuseBlown

          return (
            <g key={app.id} transform={`translate(${branchX}, 0)`}>
              {/* Vertical Branch Live Wire (from main live bus to switch) */}
              <line x1="30" y1="180" x2="30" y2="200" stroke={liveColor} strokeWidth="2" />

              {/* Local Switch */}
              <g
                className="safe-switch-group"
                style={{ cursor: 'pointer' }}
                onClick={() => onToggleAppliance(app.id)}
              >
                <circle cx="30" cy="200" r="3.5" fill="#f8fafc" />
                <circle cx="30" cy="216" r="3.5" fill="#f8fafc" />
                {app.enabled ? (
                  <line x1="30" y1="200" x2="30" y2="216" stroke="#22c55e" strokeWidth="2.5" />
                ) : (
                  <line x1="30" y1="200" x2="42" y2="208" stroke="#ef4444" strokeWidth="2.5" />
                )}
              </g>

              {/* Wire to appliance load box */}
              <line x1="30" y1="216" x2="30" y2="330" stroke={liveColor} strokeWidth="2" />

              {/* Appliance Box */}
              <rect
                x="5"
                y="330"
                width="50"
                height="65"
                rx="6"
                fill={isAppOn ? '#1e293b' : '#0f172a'}
                stroke={isAppOn ? '#38bdf8' : '#334155'}
                strokeWidth={isAppOn ? 2 : 1}
              />
              <text x="30" y="352" textAnchor="middle" fontSize="18">
                {app.icon}
              </text>
              <text x="30" y="372" textAnchor="middle" fill="#f8fafc" fontSize="9.5" fontWeight="bold">
                {app.powerW}W
              </text>
              <text x="30" y="386" textAnchor="middle" fill="#94a3b8" fontSize="8.5">
                {isAppOn ? `${app.currentA.toFixed(2)}A` : 'OFF'}
              </text>

              {/* Return Wire to Neutral Busbar */}
              <line x1="45" y1="330" x2="45" y2="240" stroke={neutralColor} strokeWidth="2" />
              <circle cx="45" cy="240" r="3" fill={neutralColor} />

              {/* Earth Wire connection for metal body appliances */}
              {app.hasMetalBody && (
                <g>
                  <line
                    x1="15"
                    y1="330"
                    x2="15"
                    y2="300"
                    stroke={earthColor}
                    strokeWidth="1.8"
                    strokeDasharray={earthingConnected ? undefined : '3,3'}
                  />
                  <circle cx="15" cy="300" r="2.5" fill={earthColor} />
                </g>
              )}
            </g>
          )
        })}

        {/* 4. Human Interaction & Shock Simulation Area (Electric Iron Focus) */}
        {isChassisLeakage && (
          <g id="leakage-demonstrator" transform="translate(680, 20)">
            <rect
              x="0"
              y="0"
              width="215"
              height="150"
              rx="8"
              fill={isShockHazard ? '#450a0a' : '#14532d'}
              stroke={isShockHazard ? '#ef4444' : '#22c55e'}
              strokeWidth="2"
            />
            <text x="108" y="24" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold">
              FAULT: Live Wire Touching Metal Body
            </text>

            <text x="12" y="48" fill="#e2e8f0" fontSize="10.5">
              Chassis Potential: <strong style={{ color: isShockHazard ? '#f87171' : '#86efac' }}>{circuitResult.chassisVoltageV.toFixed(1)} V</strong>
            </text>
            <text x="12" y="66" fill="#e2e8f0" fontSize="10.5">
              Earth Wire: <strong>{earthingConnected ? 'CONNECTED' : 'BROKEN / ABSENT'}</strong>
            </text>
            <text x="12" y="84" fill="#e2e8f0" fontSize="10.5">
              Body Contact: <strong>{userTouchingChassis ? 'TOUCHING CHASSIS' : 'NOT TOUCHING'}</strong>
            </text>

            {userTouchingChassis && (
              <text x="12" y="104" fill={isShockHazard ? '#fca5a5' : '#86efac'} fontSize="11" fontWeight="bold">
                Shock Current: {(circuitResult.humanShockCurrentA * 1000).toFixed(1)} mA ({circuitResult.shockRiskLevel})
              </text>
            )}

            <g
              transform="translate(15, 115)"
              style={{ cursor: 'pointer' }}
              onClick={onToggleChassisTouch}
            >
              <rect x="0" y="0" width="185" height="24" rx="4" fill="#3b82f6" />
              <text x="92" y="16" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="bold">
                {userTouchingChassis ? '✋ Release Hand' : '🖐️ Touch Metal Casing'}
              </text>
            </g>
          </g>
        )}

        {/* Legend at bottom */}
        <g id="diagram-legend" transform="translate(40, 420)">
          <line x1="0" y1="10" x2="30" y2="10" stroke="#dc2626" strokeWidth="3" />
          <text x="35" y="14" fill="#fca5a5" fontSize="10">
            Live Wire (Red / Brown)
          </text>

          <line x1="200" y1="10" x2="230" y2="10" stroke="#2563eb" strokeWidth="3" />
          <text x="235" y="14" fill="#93c5fd" fontSize="10">
            Neutral Wire (Black / Blue)
          </text>

          <line x1="420" y1="10" x2="450" y2="10" stroke="#16a34a" strokeWidth="2.5" />
          <text x="455" y="14" fill="#86efac" fontSize="10">
            Earth Wire (Green / Yellow)
          </text>

          <circle cx="640" cy="10" r="4" fill="#22c55e" />
          <text x="650" y="14" fill="#cbd5e1" fontSize="10">
            Switch ON
          </text>

          <circle cx="740" cy="10" r="4" fill="#ef4444" />
          <text x="750" y="14" fill="#cbd5e1" fontSize="10">
            Switch OFF
          </text>
        </g>
      </svg>
    </div>
  )
}
