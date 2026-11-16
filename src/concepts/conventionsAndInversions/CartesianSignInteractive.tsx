import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateOpticalState, type OpticalDeviceType } from './models'
import { OpticsRayBenchSVG } from './OpticsRayBenchSVG'

interface Props {
  lang: Lang
}

export function CartesianSignInteractive({ lang }: Props) {
  const [device, setDevice] = useState<OpticalDeviceType>('convex-lens')
  const [absU, setAbsU] = useState(30)
  const [absF, setAbsF] = useState(15)
  const [pinnedGhost, setPinnedGhost] = useState<{ absU: number; absF: number } | null>(null)

  const state = calculateOpticalState(device, absU, absF)
  const isLens = device === 'convex-lens' || device === 'concave-lens'
  const formatSigned = (n: number) => (n === Infinity ? '∞' : n > 0 ? `+${n}` : `${n}`)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. बिंब चिह्न (बाईं ओर)' : '1. Object Sign (Left of O)',
      math: `u = −|u| = ${state.objectDistanceU} cm`,
    },
    {
      kicker: lang === 'hi' ? '2. मुख्य फोकस चिह्न' : '2. Focus Sign by Curvature',
      math: `f = ${formatSigned(state.focalLengthF)} cm (${state.focalLengthF > 0 ? 'Convex +' : 'Concave −'})`,
    },
    {
      kicker: isLens
        ? lang === 'hi'
          ? '3. लेंस सूत्र: 1/v − 1/u = 1/f'
          : '3. Lens Formula: 1/v − 1/u = 1/f'
        : lang === 'hi'
          ? '3. दर्पण सूत्र: 1/v + 1/u = 1/f'
          : '3. Mirror Formula: 1/v + 1/u = 1/f',
      math: isLens
        ? `1/v = 1/(${formatSigned(state.focalLengthF)}) + 1/(${state.objectDistanceU})`
        : `1/v = 1/(${formatSigned(state.focalLengthF)}) − 1/(${state.objectDistanceU})`,
    },
    {
      kicker: lang === 'hi' ? '4. प्रतिबिंब स्थिति (v)' : '4. Signed Image Position (v)',
      math:
        state.imageDistanceV === Infinity
          ? 'v = ∞ (Parallel Rays)'
          : `v = ${formatSigned(state.imageDistanceV)} cm (${state.isReal ? 'Real' : 'Virtual'})`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-toolbar">
        <div className="nb-device-chips" role="group" aria-label="Optical device selector">
          {(
            [
              { id: 'convex-lens', en: 'Convex Lens (+f)', hi: 'उत्तल लेंस (+f)' },
              { id: 'concave-lens', en: 'Concave Lens (−f)', hi: 'अवतल लेंस (−f)' },
              { id: 'concave-mirror', en: 'Concave Mirror (−f)', hi: 'अवतल दर्पण (−f)' },
              { id: 'convex-mirror', en: 'Convex Mirror (+f)', hi: 'उत्तल दर्पण (+f)' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nb-chip-btn ${device === item.id ? 'is-active' : ''}`}
              aria-pressed={device === item.id}
              onClick={() => setDevice(item.id)}
            >
              {lang === 'hi' ? item.hi : item.en}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`nb-chip-btn ${pinnedGhost ? 'is-ghost-active' : ''}`}
          onClick={() =>
            setPinnedGhost((prev) => (prev ? null : { absU, absF }))
          }
        >
          {pinnedGhost
            ? lang === 'hi'
              ? 'तुलना हटाएँ (Clear Ghost)'
              : 'Clear Ghost Overlay'
            : lang === 'hi'
              ? '📌 वर्तमान स्थिति पिन करें (Pin Ghost)'
              : '📌 Pin Reference State'}
        </button>
      </div>

      {/* Interactive SVG Ray-Tracing Bench */}
      <OpticsRayBenchSVG
        device={device}
        absU={absU}
        absF={absF}
        lang={lang}
        minAbsU={6}
        maxAbsU={55}
        stepAbsU={1}
        onChangeAbsU={setAbsU}
        ghostComparison={
          pinnedGhost
            ? { absU: pinnedGhost.absU, absF: pinnedGhost.absF, label: 'Pinned Reference' }
            : null
        }
      />

      {/* Sliders synced with SVG drag */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '0.85rem',
        }}
      >
        <SliderField
          id="cs-u-slider"
          label={lang === 'hi' ? 'बिंब की दूरी |u| (बाईं ओर, ड्रैग करें)' : 'Object Distance |u| (Left of O, or drag arrow)'}
          value={absU}
          min={6}
          max={55}
          step={1}
          unit=" cm"
          lang={lang}
          onChange={setAbsU}
        />
        <SliderField
          id="cs-f-slider"
          label={lang === 'hi' ? 'फोकस दूरी का परिमाण |f|' : 'Focal Length Magnitude |f|'}
          value={absF}
          min={10}
          max={25}
          step={1}
          unit=" cm"
          lang={lang}
          onChange={setAbsF}
        />
      </div>

      {/* Live Formula & Sign Substitution Pipeline */}
      <NotebookPipeline
        steps={pipelineSteps}
        ariaLabel="New Cartesian Sign Convention substitution pipeline"
      />

      {/* Signed Ledger Strip */}
      <div className="nb-ledger-strip">
        <div className="nb-ledger-cell">
          <div className="nb-ledger-cell-label">
            {lang === 'hi' ? 'बिंब दूरी (u)' : 'Object Distance (u)'}
          </div>
          <div className="nb-ledger-cell-val" style={{ color: '#1d4ed8' }}>
            {formatSigned(state.objectDistanceU)} cm
          </div>
          <div className="nb-ledger-cell-sub">
            {lang === 'hi' ? 'सदैव ऋणात्मक (−)' : 'Always Negative (−)'}
          </div>
        </div>

        <div className="nb-ledger-cell">
          <div className="nb-ledger-cell-label">
            {lang === 'hi' ? 'फोकस दूरी (f)' : 'Focal Length (f)'}
          </div>
          <div
            className="nb-ledger-cell-val"
            style={{ color: state.focalLengthF > 0 ? '#15803d' : '#b91c1c' }}
          >
            {formatSigned(state.focalLengthF)} cm
          </div>
          <div className="nb-ledger-cell-sub">
            {state.focalLengthF > 0
              ? lang === 'hi'
                ? 'उत्तल = धनात्मक (+)'
                : 'Convex = Positive (+)'
              : lang === 'hi'
                ? 'अवतल = ऋणात्मक (−)'
                : 'Concave = Negative (−)'}
          </div>
        </div>

        <div className="nb-ledger-cell">
          <div className="nb-ledger-cell-label">
            {lang === 'hi' ? 'प्रतिबिंब दूरी (v)' : 'Image Distance (v)'}
          </div>
          <div
            className="nb-ledger-cell-val"
            style={{ color: state.isReal ? '#14532d' : '#0f766e' }}
          >
            {formatSigned(state.imageDistanceV)} {state.imageDistanceV === Infinity ? '' : 'cm'}
          </div>
          <div className="nb-ledger-cell-sub">
            {state.isReal
              ? lang === 'hi'
                ? 'वास्तविक व उल्टा (Real & Inverted)'
                : 'Real & Inverted'
              : lang === 'hi'
                ? 'आभासी व सीधा (Virtual & Erect)'
                : 'Virtual & Erect'}
          </div>
        </div>
      </div>
    </div>
  )
}
