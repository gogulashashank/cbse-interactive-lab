import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateSoundEchoWave } from './models'

interface Props {
  lang: Lang
}

export function SoundEchoWaveInteractive({ lang }: Props) {
  const [frequencyHz, setFrequencyHz] = useState(170)
  const [waveSpeedMps, setWaveSpeedMps] = useState(340)
  const [cliffDistanceM, setCliffDistanceM] = useState(85)

  const res = calculateSoundEchoWave(frequencyHz, waveSpeedMps, cliffDistanceM)

  // Map cliff position across x: 95..395 for d: 10..340 m
  const speakerX = 65
  const cliffX = 95 + ((res.cliffDistanceM - 10) / 330) * 300

  // Draw sinusoidal wave cycles inside the top wave band proportional to frequency
  const waveCycles = Math.max(2, Math.min(10, Math.round(res.frequencyHz / 85)))
  const waveSpanWidth = 330
  const cycleWidth = waveSpanWidth / waveCycles
  const wavePathParts: string[] = [`M ${speakerX} 58`]
  for (let i = 0; i < waveCycles; i++) {
    const x0 = speakerX + i * cycleWidth
    const xMid = x0 + cycleWidth / 2
    const x1 = x0 + cycleWidth
    wavePathParts.push(`Q ${x0 + cycleWidth * 0.25} 30, ${xMid} 58`)
    wavePathParts.push(`Q ${x0 + cycleWidth * 0.75} 86, ${x1} 58`)
  }

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. तरंगदैर्घ्य (λ = v / f)' : '1. Wavelength (λ = v / f)',
      math: `λ = ${res.waveSpeedMps}/${res.frequencyHz} = ${res.wavelengthM} m`,
    },
    {
      kicker: lang === 'hi' ? '2. आवर्तकाल (T = 1 / f)' : '2. Time Period (T = 1 / f)',
      math: `T = ${res.timePeriodMs} ms`,
    },
    {
      kicker: lang === 'hi' ? '3. कुल प्रतिध्वनि पथ (2d)' : '3. Echo Round-Trip (2d)',
      math: `2d = 2 × ${res.cliffDistanceM} = ${res.roundTripDistanceM} m`,
    },
    {
      kicker: lang === 'hi' ? '4. प्रतिध्वनि समय (t = 2d / v)' : '4. Echo Time (t = 2d / v)',
      math: `t = ${res.echoTimeS} s (${res.isDistinctEcho ? '≥ 0.1s ✓' : '< 0.1s ✗'})`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Sound wave and echo bench: frequency ${res.frequencyHz} Hz, wavelength ${res.wavelengthM} m, cliff distance ${res.cliffDistanceM} m, echo time ${res.echoTimeS} s`}
        >
          <defs>
            <pattern id="nb-sound-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-sound-grid)" />

          {/* Top Band: Inverse Wavelength λ = v / f */}
          <rect x="20" y="16" width="405" height="78" rx="7" fill="#ffffff" stroke="#b8a585" strokeWidth="1.5" />
          <text x="32" y="32" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            WAVE PROFILE: f = {res.frequencyHz} Hz → λ = v / f = {res.wavelengthM} m
          </text>
          <path d={wavePathParts.join(' ')} fill="none" stroke="#2563eb" strokeWidth="2.5" />

          {/* Bottom Band: Echo Round-Trip 2d = v * t */}
          <rect x="20" y="104" width="405" height="94" rx="7" fill="#ffffff" stroke="#b8a585" strokeWidth="1.5" />
          <text x="32" y="121" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            ECHO RANGING: Outgoing (+d) + Reflected (+d) = {res.roundTripDistanceM} m
          </text>

          {/* Source Speaker */}
          <rect x="34" y="138" width="24" height="34" rx="4" fill="#1e293b" />
          <text x="46" y="186" textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
            Source
          </text>

          {/* Outgoing & Returning Echo Paths */}
          <line x1={speakerX} y1="146" x2={cliffX - 6} y2="146" stroke="#2563eb" strokeWidth="2.2" />
          <line x1={cliffX - 6} y1="164" x2={speakerX} y2="164" stroke="#d97706" strokeWidth="2.2" strokeDasharray="5 3" />
          <text
            x={(speakerX + cliffX) / 2}
            y="141"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="800"
            fill="#1d4ed8"
            fontFamily="ui-monospace, monospace"
          >
            d = {res.cliffDistanceM} m →
          </text>
          <text
            x={(speakerX + cliffX) / 2}
            y="178"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="800"
            fill="#b45309"
            fontFamily="ui-monospace, monospace"
          >
            ← Echo (+{res.cliffDistanceM} m)
          </text>

          {/* Reflecting Cliff Wall */}
          <rect x={cliffX} y="126" width="16" height="58" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />

          {/* Right-Side Ledger Card */}
          <g transform="translate(442, 16)">
            <rect x="0" y="0" width="298" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="149" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              SOUND &amp; ECHO LEDGER (NCERT Ch 11)
            </text>

            <rect x="14" y="34" width="270" height="40" rx="5" fill="#eff6ff" stroke="#93c5fd" />
            <text x="24" y="50" fontSize="10" fontWeight="800" fill="#1e40af" fontFamily="ui-monospace, monospace">
              INVERSE WAVELENGTH (λ = v / f):
            </text>
            <text x="24" y="66" fontSize="11" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
              λ = {res.waveSpeedMps} / {res.frequencyHz} = {res.wavelengthM} m (T = {res.timePeriodMs} ms)
            </text>

            <rect x="14" y="82" width="270" height="40" rx="5" fill="#fef3c7" stroke="#fcd34d" />
            <text x="24" y="98" fontSize="10" fontWeight="800" fill="#92400e" fontFamily="ui-monospace, monospace">
              ROUND-TRIP ECHO (2d = v × t):
            </text>
            <text x="24" y="114" fontSize="11" fontWeight="900" fill="#78350f" fontFamily="ui-monospace, monospace">
              2d = {res.roundTripDistanceM} m → t = {res.echoTimeS} s
            </text>

            <rect
              x="14"
              y="130"
              width="270"
              height="38"
              rx="5"
              fill={res.isDistinctEcho ? '#ecfdf5' : '#fef2f2'}
              stroke={res.isDistinctEcho ? '#6ee7b7' : '#fca5a5'}
            />
            <text
              x="149"
              y="153"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="900"
              fill={res.isDistinctEcho ? '#065f46' : '#991b1b'}
              fontFamily="ui-monospace, monospace"
            >
              {res.isDistinctEcho
                ? `t = ${res.echoTimeS} s ≥ 0.10 s → DISTINCT ECHO HEARD ✓`
                : `t = ${res.echoTimeS} s < 0.10 s → TOO CLOSE FOR ECHO ✗`}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="sew-freq-slider"
          label={lang === 'hi' ? 'आवृत्ति (f)' : 'Wave Frequency (f)'}
          value={frequencyHz}
          min={100}
          max={850}
          step={10}
          unit=" Hz"
          lang={lang}
          onChange={setFrequencyHz}
        />
        <SliderField
          id="sew-speed-slider"
          label={lang === 'hi' ? 'ध्वनि की चाल (v)' : 'Wave Speed (v)'}
          value={waveSpeedMps}
          min={340}
          max={680}
          step={10}
          unit=" m/s"
          lang={lang}
          onChange={setWaveSpeedMps}
        />
        <SliderField
          id="sew-cliff-slider"
          label={lang === 'hi' ? 'चट्टान की दूरी (d)' : 'Cliff Distance (d)'}
          value={cliffDistanceM}
          min={10}
          max={340}
          step={5}
          unit=" m"
          lang={lang}
          onChange={setCliffDistanceM}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Sound wave inverse wavelength and echo round-trip pipeline" />
    </div>
  )
}
