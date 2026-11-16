import React, { useState } from 'react'
import { calculateBucket } from './models'
import { SliderField } from '../../kit/SliderField'
import { formatNumber } from '../../kit/format'
import { NotebookPipeline } from '../../notebook/NotebookSpread'

export interface BucketInteractiveProps {
  lang: 'en' | 'hi'
}

export const BucketInteractive: React.FC<BucketInteractiveProps> = ({ lang }) => {
  const [rateLpm, setRateLpm] = useState<number>(5)
  const [minutes, setMinutes] = useState<number>(3)

  const res = calculateBucket(rateLpm, minutes, 20)
  const waterHeightPx = (res.fillPercentage / 100) * 124

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. बहाव की दर (Rate)' : '1. Flow Rate (L/min)',
      math: `Rate = ${formatNumber(rateLpm)} L/min`,
    },
    {
      kicker: lang === 'hi' ? '2. समय अंतराल (Time)' : '2. Elapsed Time (min)',
      math: `Time = ${formatNumber(minutes)} min`,
    },
    {
      kicker: lang === 'hi' ? '3. कुल मात्रा (Rate × Time)' : '3. Total Volume (Rate × Time)',
      math: `${formatNumber(rateLpm)} × ${formatNumber(minutes)} = ${formatNumber(res.totalLitres)} L`,
    },
    {
      kicker: lang === 'hi' ? '4. 20 L बाल्टी स्थिति' : '4. 20 L Bucket Level',
      math: `${formatNumber(res.fillPercentage, 0)}% Full (${formatNumber(Math.min(20, res.totalLitres))} / 20 L)`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 210"
          className="nb-optics-svg"
          role="img"
          aria-label={`Bucket filling bench: ${rateLpm} L/min for ${minutes} min gives ${res.totalLitres} L`}
        >
          <defs>
            <pattern id="nb-bkt-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="210" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="210" fill="url(#nb-bkt-grid)" />

          {/* Left: Rate x Time Rectangle Area Visual */}
          <g transform="translate(55, 34)">
            <text x="0" y="0" fontSize="11" fontWeight="800" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              AREA = RATE × TIME = TOTAL VOLUME
            </text>
            <rect
              x="0"
              y="14"
              width={minutes * 42}
              height={rateLpm * 12}
              fill="rgba(37, 99, 235, 0.22)"
              stroke="#2563eb"
              strokeWidth="2.2"
            />
            <text
              x={Math.max(45, (minutes * 42) / 2)}
              y={14 + Math.max(20, (rateLpm * 12) / 2)}
              textAnchor="middle"
              fontSize="12"
              fontWeight="900"
              fill="#1e3a8a"
              fontFamily="ui-monospace, monospace"
            >
              {`${formatNumber(res.totalLitres)} L`}
            </text>
          </g>

          {/* Right: Graduated 20 L Bucket */}
          <g transform="translate(470, 32)">
            <rect x="0" y="16" width="160" height="128" rx="6" fill="#ffffff" stroke="#334155" strokeWidth="2.5" />
            <rect
              x="2"
              y={16 + (124 - waterHeightPx)}
              width="156"
              height={waterHeightPx}
              rx="4"
              fill="rgba(14, 165, 233, 0.45)"
            />
            <text x="80" y="84" textAnchor="middle" fontSize="14" fontWeight="900" fill="#0f172a" fontFamily="ui-monospace, monospace">
              {`${formatNumber(Math.min(20, res.totalLitres))} / 20 L`}
            </text>
            <text x="80" y="162" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0369a1" fontFamily="ui-monospace, monospace">
              {`Graduated Bucket (${formatNumber(res.fillPercentage, 0)}%)`}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="bucket-rate"
          label={lang === 'hi' ? 'बहाव की दर (Flow Rate)' : 'Tap Flow Rate'}
          unit={lang === 'hi' ? 'लीटर/मिनट' : 'L/min'}
          value={rateLpm}
          min={1}
          max={10}
          step={0.5}
          lang={lang}
          onChange={setRateLpm}
        />
        <SliderField
          id="bucket-time"
          label={lang === 'hi' ? 'समय (Time)' : 'Elapsed Time'}
          unit={lang === 'hi' ? 'मिनट' : 'min'}
          value={minutes}
          min={0.5}
          max={6}
          step={0.5}
          lang={lang}
          onChange={setMinutes}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Rate times time bucket pipeline" />
    </div>
  )
}
