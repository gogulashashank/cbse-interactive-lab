import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

interface Props {
  lang: Lang
}

const PRESET_CODES = [
  { sign: '+' as const, mag: 0.4, labelEn: 'm = +0.4 (Concave Lens)', labelHi: 'm = +0.4 (अवतल लेंस)' },
  { sign: '+' as const, mag: 1.0, labelEn: 'm = +1.0 (Plane Mirror)', labelHi: 'm = +1.0 (समतल दर्पण)' },
  { sign: '+' as const, mag: 2.0, labelEn: 'm = +2.0 (Convex Magnifier)', labelHi: 'm = +2.0 (उत्तल आवर्धक)' },
  { sign: '-' as const, mag: 0.6, labelEn: 'm = −0.6 (Beyond 2F)', labelHi: 'm = −0.6 (2F से परे)' },
  { sign: '-' as const, mag: 1.0, labelEn: 'm = −1.0 (At 2F / C)', labelHi: 'm = −1.0 (2F / C पर)' },
  { sign: '-' as const, mag: 2.2, labelEn: 'm = −2.2 (Projector F–2F)', labelHi: 'm = −2.2 (प्रोजेक्टर F–2F)' },
] as const

export function MagnificationDecoderInteractive({ lang }: Props) {
  const [sign, setSign] = useState<'+' | '-'>('-')
  const [magnitude, setMagnitude] = useState(1.6)

  const mValue = sign === '+' ? magnitude : -magnitude
  const isErect = sign === '+'
  const isSameSize = Math.abs(magnitude - 1.0) < 0.05
  const isMagnified = magnitude > 1.05

  const objectHeightCm = 3.0
  const imageHeightCm = Number((mValue * objectHeightCm).toFixed(2))

  // SVG Geometry for Magnification Comparison Bench (760 x 260)
  const axisY = 130
  const pxPerCmY = 11.5
  const objTopY = axisY - objectHeightCm * pxPerCmY
  const imgTipY = axisY - imageHeightCm * pxPerCmY

  const deviceDeduction = isErect
    ? isSameSize
      ? lang === 'hi'
        ? 'समतल दर्पण (Plane Mirror)'
        : 'Plane Mirror (Always m = +1)'
      : isMagnified
        ? lang === 'hi'
          ? 'उत्तल लेंस या अवतल दर्पण (|u| < f)'
          : 'Convex Lens or Concave Mirror (|u| < f)'
        : lang === 'hi'
          ? 'अवतल लेंस या उत्तल दर्पण (सदैव 0 < m < +1)'
          : 'Concave Lens or Convex Mirror (Only devices with 0 < m < +1)'
    : lang === 'hi'
      ? 'उत्तल लेंस या अवतल दर्पण (|u| > f)'
      : 'Convex Lens or Concave Mirror (|u| > f)'

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. दिया गया आवर्धन (m)' : '1. Given Magnification (m)',
      math: `m = ${mValue > 0 ? `+${mValue.toFixed(1)}` : mValue.toFixed(1)}`,
    },
    {
      kicker: lang === 'hi' ? '2. चिह्न डिकोड (Sign)' : '2. Sign Decode (±)',
      math: isErect ? '+ → Virtual & Erect (Upright)' : '− → Real & Inverted',
    },
    {
      kicker: lang === 'hi' ? '3. परिमाण डिकोड (|m|)' : '3. Magnitude Decode (|m|)',
      math: isSameSize
        ? '|m| = 1.0 → Equal Size (hᵢ = hₒ)'
        : isMagnified
          ? `|m| = ${magnitude.toFixed(1)} > 1 → Magnified`
          : `|m| = ${magnitude.toFixed(1)} < 1 → Diminished`,
    },
    {
      kicker: lang === 'hi' ? '4. लेंस/दर्पण पहचान' : '4. Device Fingerprint',
      math: deviceDeduction,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      {/* Quick Board Exam Presets */}
      <div className="nb-optics-toolbar">
        <div className="nb-device-chips" role="group" aria-label="Magnification presets">
          {PRESET_CODES.map((preset) => {
            const active = sign === preset.sign && Math.abs(magnitude - preset.mag) < 0.05
            return (
              <button
                key={preset.labelEn}
                type="button"
                className={`nb-chip-btn ${active ? 'is-active' : ''}`}
                onClick={() => {
                  setSign(preset.sign)
                  setMagnitude(preset.mag)
                }}
              >
                {lang === 'hi' ? preset.labelHi : preset.labelEn}
              </button>
            )
          })}
        </div>
      </div>

      {/* SVG Side-by-Side Height & Orientation Comparison Bench */}
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 260"
          className="nb-optics-svg"
          role="img"
          aria-label={`Magnification comparison: m = ${mValue > 0 ? `+${mValue.toFixed(1)}` : mValue.toFixed(1)}`}
        >
          <defs>
            <pattern id="nb-mag-grid" width="23" height="23" patternUnits="userSpaceOnUse">
              <path d="M 23 0 L 0 0 0 23" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="260" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="260" fill="url(#nb-mag-grid)" />

          {/* Upper (+h) and Lower (-h) Half-Plane Labels */}
          <text
            x="24"
            y="28"
            fontSize="11"
            fontWeight="700"
            fill="#0f766e"
            fontFamily="ui-monospace, monospace"
          >
            {lang === 'hi'
              ? '↑ मुख्य अक्ष के ऊपर (+h): सीधा व आभासी (m > 0)'
              : '↑ Above Principal Axis (+h): Erect & Virtual (m > 0)'}
          </text>
          <text
            x="24"
            y="244"
            fontSize="11"
            fontWeight="700"
            fill="#9a3b2a"
            fontFamily="ui-monospace, monospace"
          >
            {lang === 'hi'
              ? '↓ मुख्य अक्ष के नीचे (−h): उल्टा व वास्तविक (m < 0)'
              : '↓ Below Principal Axis (−h): Inverted & Real (m < 0)'}
          </text>

          {/* Principal Axis */}
          <line x1="20" y1={axisY} x2="740" y2={axisY} stroke="#475569" strokeWidth="1.8" />

          {/* Reference Object Height Dashed Guide Line */}
          <line
            x1="160"
            y1={objTopY}
            x2="580"
            y2={objTopY}
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <line
            x1="160"
            y1={axisY + objectHeightCm * pxPerCmY}
            x2="580"
            y2={axisY + objectHeightCm * pxPerCmY}
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />

          {/* Object Arrow (Left) */}
          <g transform="translate(210, 0)">
            <line x1="0" y1={axisY} x2="0" y2={objTopY} stroke="#1d4ed8" strokeWidth="4" />
            <polygon
              points={`0,${objTopY - 3} -6,${objTopY + 8} 6,${objTopY + 8}`}
              fill="#1d4ed8"
            />
            <rect x="-64" y={objTopY - 28} width="128" height="21" rx="4" fill="#dbeafe" stroke="#2563eb" />
            <text
              x="0"
              y={objTopY - 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill="#1e3a8a"
              fontFamily="ui-monospace, monospace"
            >
              {`Object hₒ = +${objectHeightCm.toFixed(1)} cm`}
            </text>
          </g>

          {/* Formula Bridge Pill in Center */}
          <g transform="translate(380, 130)">
            <rect x="-78" y="-16" width="156" height="32" rx="6" fill="#fef3c7" stroke="#d97706" />
            <text
              x="0"
              y="4"
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill="#92400e"
              fontFamily="ui-monospace, monospace"
            >
              {`hᵢ = (${mValue > 0 ? `+${mValue.toFixed(1)}` : mValue.toFixed(1)}) × hₒ`}
            </text>
          </g>

          {/* Decoded Image Arrow (Right) */}
          <g transform="translate(550, 0)">
            <line
              x1="0"
              y1={axisY}
              x2="0"
              y2={imgTipY}
              stroke={isErect ? '#0f766e' : '#b91c1c'}
              strokeWidth="4.2"
              strokeDasharray={isErect ? '5 3' : undefined}
            />
            <polygon
              points={
                isErect
                  ? `0,${imgTipY - 3} -6,${imgTipY + 8} 6,${imgTipY + 8}`
                  : `0,${imgTipY + 3} -6,${imgTipY - 8} 6,${imgTipY - 8}`
              }
              fill={isErect ? '#0f766e' : '#b91c1c'}
            />
            <rect
              x="-72"
              y={isErect ? Math.max(10, imgTipY - 28) : Math.min(228, imgTipY + 7)}
              width="144"
              height="21"
              rx="4"
              fill={isErect ? '#ccfbf1' : '#fee2e2'}
              stroke={isErect ? '#0d9488' : '#dc2626'}
            />
            <text
              x="0"
              y={isErect ? Math.max(24, imgTipY - 14) : Math.min(242, imgTipY + 21)}
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill={isErect ? '#115e59' : '#991b1b'}
              fontFamily="ui-monospace, monospace"
            >
              {`Image hᵢ = ${imageHeightCm > 0 ? `+${imageHeightCm.toFixed(1)}` : imageHeightCm.toFixed(1)} cm`}
            </text>
          </g>
        </svg>
      </div>

      {/* Sign Toggle + Magnitude Slider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1c2433' }}>
          {lang === 'hi' ? '1. आवर्धन का चिह्न (Sign):' : '1. Toggle Sign of m:'}
        </span>
        <button
          type="button"
          className={`nb-chip-btn ${sign === '-' ? 'is-active' : ''}`}
          onClick={() => setSign('-')}
        >
          {lang === 'hi' ? 'ऋणात्मक (−) → वास्तविक व उल्टा' : 'Negative (−) → Real & Inverted'}
        </button>
        <button
          type="button"
          className={`nb-chip-btn ${sign === '+' ? 'is-active' : ''}`}
          onClick={() => setSign('+')}
        >
          {lang === 'hi' ? 'धनात्मक (+) → आभासी व सीधा' : 'Positive (+) → Virtual & Erect'}
        </button>
      </div>

      <SliderField
        id="md-mag-slider"
        label={
          lang === 'hi'
            ? '2. आवर्धन का परिमाण |m| = |hᵢ / hₒ|'
            : '2. Magnification Magnitude |m| = |hᵢ / hₒ|'
        }
        value={magnitude}
        min={0.2}
        max={3.0}
        step={0.2}
        unit="×"
        lang={lang}
        onChange={setMagnitude}
      />

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Magnification dual-code pipeline" />
    </div>
  )
}
