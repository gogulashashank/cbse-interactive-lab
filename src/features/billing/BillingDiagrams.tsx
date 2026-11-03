import React from 'react'
import type { HouseholdBillingResult, ApplianceEnergyResult } from './billingModel'
import { formatBillingRupees, formatBillingUnits } from './billingInputValidation'

interface UtilityEnergyMeterSVGProps {
  result: HouseholdBillingResult
}

export const UtilityEnergyMeterSVG: React.FC<UtilityEnergyMeterSVGProps> = ({ result }) => {
  const { totalEnergyKWh, activePowerDrawW, totalConnectedPowerW, totalCostRupees } = result
  const activeKW = activePowerDrawW / 1000

  // Format the kWh reading as a 6-digit mechanical counter: 5 digits + 1 red decimal digit
  // e.g. 142.5 kWh -> "00142" and "5"
  const formattedUnits = Math.min(99999.9, Math.max(0, totalEnergyKWh)).toFixed(1)
  const parts = formattedUnits.split('.')
  const wholeUnits = (parts[0] || '0').padStart(5, '0').slice(-5)
  const decimalDigit = parts[1] || '0'

  // Spinning disc rotation angle based on power draw
  // Higher active kW means faster spinning simulation indicator
  const hasDraw = activePowerDrawW > 0

  return (
    <div className="bill-meter-svg-wrap" aria-label="Domestic Utility Energy Meter Display">
      <svg
        viewBox="0 0 680 340"
        className="bill-meter-svg"
        role="img"
        aria-label="Realistic domestic kWh utility electricity meter with digital pulse and spinning disc indicator"
      >
        <defs>
          <linearGradient id="meter-case" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          <linearGradient id="faceplate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>

          <linearGradient id="disc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>

          <filter id="meter-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Meter Box Enclosure */}
        <rect
          x="20"
          y="15"
          width="640"
          height="310"
          rx="18"
          fill="url(#meter-case)"
          stroke="#334155"
          strokeWidth="3"
          filter="url(#meter-shadow)"
        />

        {/* Meter Window / Faceplate */}
        <rect
          x="40"
          y="35"
          width="600"
          height="270"
          rx="12"
          fill="url(#faceplate)"
          stroke="#cbd5e1"
          strokeWidth="2"
        />

        {/* Utility Branding Header */}
        <text
          x="65"
          y="68"
          fontSize="14"
          fontWeight="800"
          fill="#1e293b"
          letterSpacing="0.08em"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          STATE ELECTRICITY DISTRIBUTION CORP. · SINGLE PHASE 240V 50Hz
        </text>
        <text
          x="65"
          y="86"
          fontSize="11"
          fontWeight="600"
          fill="#64748b"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          PROPERTY OF UTILITY · TYPE: STATISTICAL ELECTRONIC kWh ENERGY METER
        </text>

        {/* Mechanical/Digital Roller Register Display Box */}
        <g transform="translate(65, 105)">
          {/* Bezel frame */}
          <rect x="0" y="0" width="290" height="74" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="2" />

          {/* 5 Whole Digits (Black on White) */}
          {wholeUnits.split('').map((digit, idx) => (
            <g key={idx} transform={`translate(${12 + idx * 46}, 10)`}>
              <rect x="0" y="0" width="40" height="54" rx="4" fill="#ffffff" stroke="#cbd5e1" />
              <line x1="0" y1="27" x2="40" y2="27" stroke="#e2e8f0" strokeWidth="1" />
              <text
                x="20"
                y="38"
                textAnchor="middle"
                fontSize="32"
                fontWeight="900"
                fill="#0f172a"
                fontFamily="Courier, monospace"
              >
                {digit}
              </text>
            </g>
          ))}

          {/* 1 Decimal Digit (White on Red) */}
          <g transform="translate(242, 10)">
            <rect x="0" y="0" width="38" height="54" rx="4" fill="#dc2626" stroke="#b91c1c" />
            <line x1="0" y1="27" x2="38" y2="27" stroke="#ef4444" strokeWidth="1" />
            <text
              x="19"
              y="38"
              textAnchor="middle"
              fontSize="32"
              fontWeight="900"
              fill="#ffffff"
              fontFamily="Courier, monospace"
            >
              {decimalDigit}
            </text>
          </g>
        </g>

        {/* Units Label beside counter */}
        <text
          x="365"
          y="152"
          fontSize="24"
          fontWeight="800"
          fill="#0f172a"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          kW·h
        </text>
        <text
          x="365"
          y="172"
          fontSize="12"
          fontWeight="700"
          fill="#d97706"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          1 UNIT = 1 kWh = 3.6 × 10⁶ J
        </text>

        {/* Live Power & Consumption Status Panel (Right side) */}
        <g transform="translate(435, 105)">
          <rect x="0" y="0" width="185" height="180" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />

          <text x="14" y="24" fontSize="11" fontWeight="700" fill="#64748b">
            ACTIVE POWER LOAD
          </text>
          <text x="14" y="52" fontSize="24" fontWeight="900" fill="#0284c7" fontFamily="Courier, monospace">
            {formatBillingUnits(activeKW, 3)} kW
          </text>
          <text x="14" y="68" fontSize="11" fontWeight="600" fill="#0369a1">
            ({formatBillingUnits(activePowerDrawW, 0)} Watts active)
          </text>

          <line x1="14" y1="80" x2="171" y2="80" stroke="#e2e8f0" strokeWidth="1" />

          <text x="14" y="98" fontSize="11" fontWeight="700" fill="#64748b">
            BILLED CONSUMPTION
          </text>
          <text x="14" y="122" fontSize="20" fontWeight="800" fill="#15803d">
            {formatBillingUnits(totalEnergyKWh, 1)} Units
          </text>

          <text x="14" y="146" fontSize="11" fontWeight="700" fill="#64748b">
            TOTAL ESTIMATED COST
          </text>
          <text x="14" y="170" fontSize="18" fontWeight="900" fill="#b45309">
            ₹ {formatBillingRupees(totalCostRupees, 2)}
          </text>
        </g>

        {/* Spinning Disc / Optical Pulse Indicator Simulation */}
        <g transform="translate(65, 205)">
          {/* Disc aperture window */}
          <rect x="0" y="0" width="345" height="42" rx="5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />

          {/* Aluminum rotating disc strip */}
          <rect x="10" y="8" width="325" height="26" rx="4" fill="url(#disc-grad)" />

          {/* Center line mark on disc */}
          <line x1="172" y1="4" x2="172" y2="38" stroke="#dc2626" strokeWidth="3" />

          {/* Black edge mark indicating rotation */}
          {hasDraw ? (
            <circle cx="172" cy="21" r="5" fill="#1e293b" />
          ) : (
            <circle cx="90" cy="21" r="4" fill="#94a3b8" />
          )}

          <text x="10" y="58" fontSize="10.5" fontWeight="600" fill="#64748b">
            DISC SPEED ∝ ACTIVE POWER DRAW (P) · 3200 IMPULSES / kWh
          </text>
        </g>

        {/* Pulse LED (Calib LED) */}
        <g transform="translate(65, 275)">
          <circle
            cx="14"
            cy="10"
            r="7"
            fill={hasDraw ? '#ef4444' : '#94a3b8'}
            stroke="#b91c1c"
            strokeWidth="1.5"
          />
          {hasDraw && <circle cx="14" cy="10" r="11" fill="none" stroke="#fca5a5" strokeWidth="1.5" opacity="0.8" />}
          <text x="30" y="14" fontSize="11" fontWeight="700" fill="#334155">
            IMPULSE PULSE {hasDraw ? '(PULSING: LOAD ON)' : '(IDLE: NO LOAD)'}
          </text>
          <text x="260" y="14" fontSize="11" fontWeight="600" fill="#64748b">
            Connected Capacity: {formatBillingUnits(totalConnectedPowerW, 0)} W
          </text>
        </g>
      </svg>
    </div>
  )
}

interface ApplianceBreakdownChartProps {
  appliances: readonly ApplianceEnergyResult[]
  totalEnergyKWh: number
  tariffRate: number
}

export const ApplianceBreakdownChartSVG: React.FC<ApplianceBreakdownChartProps> = ({
  appliances,
  totalEnergyKWh,
}) => {
  const activeAppliances = appliances.filter((a) => a.totalEnergyKWh > 0)
  const maxEnergy = Math.max(...activeAppliances.map((a) => a.totalEnergyKWh), 1)

  return (
    <div className="bill-breakdown-svg-wrap" aria-label="Appliance Energy and Cost Breakdown Chart">
      <svg
        viewBox="0 0 680 290"
        className="bill-breakdown-svg"
        role="img"
        aria-label="Horizontal bar chart comparing monthly energy consumption and cost across household appliances"
      >
        <defs>
          <linearGradient id="bar-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <linearGradient id="bar-max-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
        </defs>

        <rect width="680" height="290" fill="#ffffff" rx="8" stroke="#e2e8f0" />

        <text x="24" y="30" fontSize="14" fontWeight="800" fill="#0f172a">
          MONTHLY CONSUMPTION BREAKDOWN BY APPLIANCE (kWh &amp; ₹)
        </text>
        <text x="24" y="48" fontSize="11.5" fontWeight="600" fill="#64748b">
          Total: {formatBillingUnits(totalEnergyKWh, 1)} Units (100%)
        </text>

        {activeAppliances.length === 0 ? (
          <text x="340" y="150" textAnchor="middle" fontSize="14" fontWeight="600" fill="#94a3b8">
            No appliances currently active. Increase usage hours or enable an appliance above.
          </text>
        ) : (
          activeAppliances.map((app, idx) => {
            const y = 70 + idx * 34
            const barWidth = Math.max(8, (app.totalEnergyKWh / maxEnergy) * 360)
            const isHighest = app.totalEnergyKWh === maxEnergy && activeAppliances.length > 1

            return (
              <g key={app.id} transform={`translate(24, ${y})`}>
                {/* Appliance Label */}
                <text x="0" y="16" fontSize="12" fontWeight="700" fill="#334155">
                  {app.name.length > 20 ? `${app.name.slice(0, 18)}…` : app.name}
                </text>

                {/* Bar Track Background */}
                <rect x="150" y="2" width="360" height="20" rx="4" fill="#f1f5f9" />

                {/* Filled Value Bar */}
                <rect
                  x="150"
                  y="2"
                  width={barWidth}
                  height="20"
                  rx="4"
                  fill={isHighest ? 'url(#bar-max-gradient)' : 'url(#bar-gradient)'}
                />

                {/* Values Label */}
                <text x="520" y="16" fontSize="12" fontWeight="800" fill={isHighest ? '#c2410c' : '#0369a1'}>
                  {formatBillingUnits(app.totalEnergyKWh, 1)} kWh ({app.costPercentageOfTotal.toFixed(1)}%)
                </text>
                <text x="635" y="16" textAnchor="end" fontSize="11.5" fontWeight="700" fill="#475569">
                  ₹{formatBillingRupees(app.totalCostRupees, 0)}
                </text>
              </g>
            )
          })
        )}
      </svg>
    </div>
  )
}
