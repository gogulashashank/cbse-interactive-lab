import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateOpticalState } from './models'
import { OpticsRayBenchSVG } from './OpticsRayBenchSVG'

interface Props {
  lang: Lang
}

export function RealVirtualCrossoverInteractive({ lang }: Props) {
  const focalLength = 20 // Fixed f = +20 cm
  const [absU, setAbsU] = useState(35)
  const [compareOppositeMode, setCompareOppositeMode] = useState(false)

  const state = calculateOpticalState('convex-lens', absU, focalLength)
  const isInsideFocus = absU < focalLength
  const isAtFocus = absU === focalLength

  const ghostAbsU = isInsideFocus ? 35 : 12

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. वस्तु बनाम फोकस' : '1. Object vs Focal Boundary',
      math: isAtFocus
        ? `|u| = f (${absU} cm = 20 cm)`
        : isInsideFocus
          ? `|u| < f (${absU} cm < 20 cm)`
          : `|u| > f (${absU} cm > 20 cm)`,
    },
    {
      kicker: lang === 'hi' ? '2. किरण व्यवहार' : '2. Outgoing Ray Behaviour',
      math: isAtFocus
        ? 'Emerging rays are parallel'
        : isInsideFocus
          ? 'Rays diverge → extend backward'
          : 'Rays converge on right screen',
    },
    {
      kicker: lang === 'hi' ? '3. प्रतिबिंब स्थिति (v)' : '3. Image Position (v)',
      math:
        state.imageDistanceV === Infinity
          ? 'v = ∞'
          : `v = ${state.imageDistanceV > 0 ? `+${state.imageDistanceV}` : state.imageDistanceV} cm`,
    },
    {
      kicker: lang === 'hi' ? '4. आवर्धन व प्रकृति' : '4. Magnification & Nature',
      math:
        state.magnificationM === Infinity
          ? 'm = ∞ (At Infinity)'
          : `m = ${state.magnificationM > 0 ? `+${state.magnificationM}` : state.magnificationM}× (${state.isReal ? 'Real' : 'Virtual'})`,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div className="nb-optics-toolbar">
        <div className="nb-device-chips" role="group" aria-label="Optical zone presets">
          <button
            type="button"
            className={`nb-chip-btn ${absU > 20 ? 'is-active' : ''}`}
            onClick={() => setAbsU(35)}
          >
            {lang === 'hi'
              ? 'प्रोजेक्टर क्षेत्र (|u| = 35 cm > f)'
              : 'Projector Zone (|u| = 35 cm > f)'}
          </button>
          <button
            type="button"
            className={`nb-chip-btn ${absU === 20 ? 'is-active' : ''}`}
            onClick={() => setAbsU(20)}
          >
            {lang === 'hi'
              ? 'फोकस सीमा (|u| = f = 20 cm)'
              : 'Focal Crossover (|u| = f = 20 cm)'}
          </button>
          <button
            type="button"
            className={`nb-chip-btn ${absU < 20 ? 'is-active' : ''}`}
            onClick={() => setAbsU(12)}
          >
            {lang === 'hi'
              ? 'आवर्धक लेंस क्षेत्र (|u| = 12 cm < f)'
              : 'Magnifier Zone (|u| = 12 cm < f)'}
          </button>
        </div>

        <button
          type="button"
          className={`nb-chip-btn ${compareOppositeMode ? 'is-ghost-active' : ''}`}
          onClick={() => setCompareOppositeMode((prev) => !prev)}
        >
          {compareOppositeMode
            ? lang === 'hi'
              ? 'तुलना बंद करें'
              : 'Hide Ghost Comparison'
            : lang === 'hi'
              ? '📌 प्रोजेक्टर बनाम आवर्धक तुलना'
              : '📌 Compare Across Focus F'}
        </button>
      </div>

      {/* Interactive SVG Ray Bench */}
      <OpticsRayBenchSVG
        device="convex-lens"
        absU={absU}
        absF={focalLength}
        lang={lang}
        minAbsU={8}
        maxAbsU={50}
        stepAbsU={1}
        onChangeAbsU={setAbsU}
        ghostComparison={
          compareOppositeMode
            ? {
                absU: ghostAbsU,
                absF: focalLength,
                label: isInsideFocus ? 'Projector (|u| = 35 cm)' : 'Magnifier (|u| = 12 cm)',
              }
            : null
        }
      />

      <SliderField
        id="rvc-u-slider"
        label={
          lang === 'hi'
            ? 'लेंस से वस्तु की दूरी |u| (फोकस F₁ = −20 cm के पार स्लाइड करें)'
            : 'Object Distance from Lens |u| (Drag arrow or slide across F₁ = −20 cm)'
        }
        value={absU}
        min={8}
        max={50}
        step={1}
        unit=" cm"
        lang={lang}
        onChange={setAbsU}
      />

      <NotebookPipeline
        steps={pipelineSteps}
        ariaLabel="Focal crossover boundary analysis pipeline"
      />

      {/* Zone indicator banner */}
      <div
        style={{
          padding: '0.85rem 1rem',
          borderRadius: '0.6rem',
          background: isAtFocus ? '#fef9c3' : isInsideFocus ? '#ccfbf1' : '#dcfce7',
          border: `1.5px solid ${isAtFocus ? '#eab308' : isInsideFocus ? '#14b8a6' : '#22c55e'}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.73rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#334155',
                display: 'block',
              }}
            >
              {lang === 'hi' ? 'वर्तमान प्रकाशिक क्षेत्र:' : 'Active Optical Regime:'}
            </span>
            <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
              {isAtFocus
                ? lang === 'hi'
                  ? 'मुख्य फोकस F पर (|u| = f = 20 cm)'
                  : 'Exactly at Focus F (|u| = f = 20 cm)'
                : isInsideFocus
                  ? lang === 'hi'
                    ? 'फोकस के भीतर (|u| < 20 cm) — आवर्धक लेंस मोड'
                    : 'Inside Focus (|u| < 20 cm) — Magnifying Glass Mode'
                  : lang === 'hi'
                    ? 'फोकस के बाहर (|u| > 20 cm) — प्रोजेक्टर मोड'
                    : 'Outside Focus (|u| > 20 cm) — Projector Mode'}
            </strong>
          </div>

          <div
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '0.45rem',
              fontWeight: 800,
              fontSize: '0.85rem',
              background: isAtFocus ? '#ca8a04' : isInsideFocus ? '#0f766e' : '#15803d',
              color: '#ffffff',
            }}
          >
            {isAtFocus
              ? lang === 'hi'
                ? 'प्रतिबिंब अनंत (∞) पर'
                : 'Image at Infinity (∞)'
              : state.isReal
                ? lang === 'hi'
                  ? 'वास्तविक और उल्टा (Real & Inverted)'
                  : 'Real & Inverted'
                : lang === 'hi'
                  ? 'आभासी और सीधा (Virtual & Erect)'
                  : 'Virtual & Erect'}
          </div>
        </div>
      </div>
    </div>
  )
}
