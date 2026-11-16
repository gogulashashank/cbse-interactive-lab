import { useRef, useState } from 'react'
import type { Lang } from '../../kit/i18n'
import {
  computePrincipalRays,
  OPTICS_RAY_BENCH_GEOMETRY,
  type OpticalDeviceType,
  type PrincipalRayDiagram,
} from './models'

export interface OpticsRayBenchSVGProps {
  device: OpticalDeviceType
  absU: number
  absF: number
  lang: Lang
  minAbsU?: number
  maxAbsU?: number
  stepAbsU?: number
  onChangeAbsU?: (nextAbsU: number) => void
  ghostComparison?: {
    absU: number
    absF: number
    label: string
  } | null
  blindMode?: boolean
}

const { SVG_W, SVG_H, ORIGIN_X, ORIGIN_Y, PX_PER_CM, RULER_MIN_CM, RULER_MAX_CM, toSvgX, toSvgY } =
  OPTICS_RAY_BENCH_GEOMETRY

const RULER_TICKS = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60] as const

function formatSigned(n: number): string {
  if (n === Infinity) return '∞'
  return n > 0 ? `+${n}` : `${n}`
}

function renderRayGroup(diagram: PrincipalRayDiagram, isGhost: boolean) {
  const strokeIncident = isGhost ? '#94a3b8' : '#b45309'
  const strokeOut = isGhost ? '#94a3b8' : diagram.state.isReal ? '#d97706' : '#0f766e'
  const opacity = isGhost ? 0.42 : 0.92

  return (
    <g opacity={opacity}>
      {diagram.segments.map((seg, idx) => {
        const x1 = toSvgX(seg.x1Cm)
        const y1 = toSvgY(seg.y1Cm)
        const x2 = toSvgX(seg.x2Cm)
        const y2 = toSvgY(seg.y2Cm)
        const isVirtual = seg.kind === 'virtual-extension'
        return (
          <line
            key={idx}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={seg.kind === 'incident' ? strokeIncident : strokeOut}
            strokeWidth={isGhost ? 1.6 : isVirtual ? 1.8 : 2.3}
            strokeDasharray={isGhost ? '5 4' : isVirtual ? '4 4' : undefined}
          />
        )
      })}
    </g>
  )
}

export function OpticsRayBenchSVG({
  device,
  absU,
  absF,
  lang,
  minAbsU = 6,
  maxAbsU = 55,
  stepAbsU = 1,
  onChangeAbsU,
  ghostComparison = null,
  blindMode = false,
}: OpticsRayBenchSVGProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [draggingObject, setDraggingObject] = useState(false)

  const diagram = computePrincipalRays(device, absU, absF)
  const ghostDiagram = ghostComparison
    ? computePrincipalRays(device, ghostComparison.absU, ghostComparison.absF)
    : null

  const isLens = device === 'convex-lens' || device === 'concave-lens'
  const isConverging = device === 'convex-lens' || device === 'concave-mirror'
  const state = diagram.state

  function clientXToAbsU(clientX: number): number {
    const svg = svgRef.current
    if (!svg) return absU
    const rect = svg.getBoundingClientRect()
    if (rect.width <= 0) return absU
    const svgX = ((clientX - rect.left) / rect.width) * SVG_W
    const cm = (svgX - ORIGIN_X) / PX_PER_CM
    // Object is on the left (cm < 0), so absU = -cm
    const rawAbsU = Math.round(-cm / stepAbsU) * stepAbsU
    return Math.max(minAbsU, Math.min(maxAbsU, rawAbsU))
  }

  function handlePointerDown(e: React.PointerEvent<SVGGElement>) {
    if (!onChangeAbsU) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDraggingObject(true)
    onChangeAbsU(clientXToAbsU(e.clientX))
  }

  function handlePointerMove(e: React.PointerEvent<SVGGElement>) {
    if (!draggingObject || !onChangeAbsU) return
    onChangeAbsU(clientXToAbsU(e.clientX))
  }

  function handlePointerUp(e: React.PointerEvent<SVGGElement>) {
    if (!draggingObject) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }
    setDraggingObject(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<SVGGElement>) {
    if (!onChangeAbsU) return
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      // Moving further left increases |u|
      onChangeAbsU(Math.min(maxAbsU, absU + stepAbsU))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      // Moving closer to O decreases |u|
      onChangeAbsU(Math.max(minAbsU, absU - stepAbsU))
    }
  }

  const objX = toSvgX(state.objectDistanceU)
  const objTopY = toSvgY(diagram.objectHeightCm)

  const imgX = diagram.clampedImageXCm !== null ? toSvgX(diagram.clampedImageXCm) : null
  const imgTipY =
    diagram.imageHeightCm !== Infinity ? toSvgY(diagram.imageHeightCm) : ORIGIN_Y

  return (
    <div className="nb-optics-svg-frame">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="nb-optics-svg"
        role="img"
        aria-label={
          lang === 'hi'
            ? `प्रकाशिक बेंच किरण आरेख: u = ${state.objectDistanceU} cm, f = ${formatSigned(state.focalLengthF)} cm`
            : `Optical bench ray diagram: u = ${state.objectDistanceU} cm, f = ${formatSigned(state.focalLengthF)} cm`
        }
      >
        <defs>
          <pattern id="nb-optics-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="#e5dcc8"
              strokeWidth="0.75"
            />
          </pattern>
          <clipPath id="nb-optics-ray-clip">
            <rect x="65" y="18" width="750" height="265" />
          </clipPath>
        </defs>

        {/* Warm Notebook Paper + Subtle Blueprint Grid */}
        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="#fcf8ef" />
        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#nb-optics-grid)" />

        {/* Top Cartesian Sign Zone Banner */}
        <g transform="translate(80, 14)">
          <rect x="0" y="0" width="352" height="24" rx="5" fill="#fee2e2" stroke="#fca5a5" />
          <text
            x="176"
            y="16"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#991b1b"
            fontFamily="system-ui, sans-serif"
          >
            {lang === 'hi'
              ? '← बाईं ओर (आपतित प्रकाश के विपरीत): दूरी ऋणात्मक (−)'
              : '← Left of O/P (Against Incident Light): NEGATIVE (−)'}
          </text>
        </g>

        <g transform="translate(448, 14)">
          <rect x="0" y="0" width="352" height="24" rx="5" fill="#dcfce7" stroke="#86efac" />
          <text
            x="176"
            y="16"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#166534"
            fontFamily="system-ui, sans-serif"
          >
            {lang === 'hi'
              ? 'दाईं ओर (आपतित प्रकाश की दिशा में): दूरी धनात्मक (+) →'
              : 'Right of O/P (Along Incident Light): POSITIVE (+) →'}
          </text>
        </g>

        {/* Principal Axis */}
        <line
          x1="50"
          y1={ORIGIN_Y}
          x2="830"
          y2={ORIGIN_Y}
          stroke="#475569"
          strokeWidth="1.6"
        />

        {/* Vertical Reference Axis at Optical Centre O / Pole P */}
        <line
          x1={ORIGIN_X}
          y1="44"
          x2={ORIGIN_X}
          y2="288"
          stroke="#94a3b8"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        {/* Optical Device Cross-Section at x = 0 */}
        {device === 'convex-lens' && (
          <path
            d={`M ${ORIGIN_X} 62 Q ${ORIGIN_X + 24} ${ORIGIN_Y} ${ORIGIN_X} 288 Q ${ORIGIN_X - 24} ${ORIGIN_Y} ${ORIGIN_X} 62 Z`}
            fill="rgba(56, 189, 248, 0.2)"
            stroke="#0284c7"
            strokeWidth="2.2"
          />
        )}
        {device === 'concave-lens' && (
          <path
            d={`M ${ORIGIN_X - 16} 62 L ${ORIGIN_X + 16} 62 Q ${ORIGIN_X + 5} ${ORIGIN_Y} ${ORIGIN_X + 16} 288 L ${ORIGIN_X - 16} 288 Q ${ORIGIN_X - 5} ${ORIGIN_Y} ${ORIGIN_X - 16} 62 Z`}
            fill="rgba(20, 184, 166, 0.18)"
            stroke="#0f766e"
            strokeWidth="2.2"
          />
        )}
        {device === 'concave-mirror' && (
          <g>
            <path
              d={`M ${ORIGIN_X - 14} 62 Q ${ORIGIN_X + 12} ${ORIGIN_Y} ${ORIGIN_X - 14} 288`}
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
            />
            <path
              d={`M ${ORIGIN_X - 8} 62 Q ${ORIGIN_X + 18} ${ORIGIN_Y} ${ORIGIN_X - 8} 288`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeDasharray="3 3"
            />
          </g>
        )}
        {device === 'convex-mirror' && (
          <g>
            <path
              d={`M ${ORIGIN_X + 14} 62 Q ${ORIGIN_X - 12} ${ORIGIN_Y} ${ORIGIN_X + 14} 288`}
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
            />
            <path
              d={`M ${ORIGIN_X + 20} 62 Q ${ORIGIN_X - 6} ${ORIGIN_Y} ${ORIGIN_X + 20} 288`}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeDasharray="3 3"
            />
          </g>
        )}

        {/* Origin Label O or P */}
        <circle cx={ORIGIN_X} cy={ORIGIN_Y} r="4" fill="#1e293b" />
        <text
          x={ORIGIN_X + 7}
          y={ORIGIN_Y - 7}
          fontSize="11.5"
          fontWeight="800"
          fill="#1e293b"
          fontFamily="ui-monospace, monospace"
        >
          {isLens ? 'O (0)' : 'P (0)'}
        </text>

        {/* Principal Focus & 2F / C Markers */}
        {isLens ? (
          <>
            {[
              { cm: -absF, label: isConverging ? 'F₁' : 'F₁ (Focus)' },
              { cm: -2 * absF, label: '2F₁' },
              { cm: absF, label: isConverging ? 'F₂ (Focus)' : 'F₂' },
              { cm: 2 * absF, label: '2F₂' },
            ]
              .filter((pt) => pt.cm >= RULER_MIN_CM && pt.cm <= RULER_MAX_CM)
              .map((pt) => {
                const nearInvertedImage =
                  !blindMode &&
                  !state.isErect &&
                  diagram.clampedImageXCm !== null &&
                  Math.abs(diagram.clampedImageXCm - pt.cm) < 4
                return (
                  <g key={pt.label} transform={`translate(${toSvgX(pt.cm)}, ${ORIGIN_Y})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="4"
                      fill={pt.cm === state.focalLengthF ? '#dc2626' : '#475569'}
                    />
                    <text
                      x={nearInvertedImage ? '14' : '0'}
                      y={nearInvertedImage ? '-8' : '17'}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="700"
                      fill={pt.cm === state.focalLengthF ? '#b91c1c' : '#334155'}
                      fontFamily="ui-monospace, monospace"
                    >
                      {pt.label}
                    </text>
                  </g>
                )
              })}
          </>
        ) : (
          <>
            {[
              { cm: state.focalLengthF, label: `F (${formatSigned(state.focalLengthF)})` },
              { cm: 2 * state.focalLengthF, label: 'C (2F)' },
            ]
              .filter((pt) => pt.cm >= RULER_MIN_CM && pt.cm <= RULER_MAX_CM)
              .map((pt) => (
                <g key={pt.label} transform={`translate(${toSvgX(pt.cm)}, ${ORIGIN_Y})`}>
                  <circle cx="0" cy="0" r="4" fill="#dc2626" />
                  <text
                    x="0"
                    y="17"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill="#b91c1c"
                    fontFamily="ui-monospace, monospace"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
          </>
        )}

        {/* Principal Ray Tracing Layer (Clipped to bench interior) */}
        {!blindMode && (
          <g clipPath="url(#nb-optics-ray-clip)">
            {ghostDiagram && renderRayGroup(ghostDiagram, true)}
            {renderRayGroup(diagram, false)}
          </g>
        )}

        {/* Ghost Image Arrow if comparison pinned */}
        {!blindMode &&
          ghostDiagram &&
          ghostDiagram.clampedImageXCm !== null &&
          ghostDiagram.imageHeightCm !== Infinity && (
            <g opacity="0.48">
              <line
                x1={toSvgX(ghostDiagram.clampedImageXCm)}
                y1={ORIGIN_Y}
                x2={toSvgX(ghostDiagram.clampedImageXCm)}
                y2={toSvgY(ghostDiagram.imageHeightCm)}
                stroke="#64748b"
                strokeWidth="2.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={toSvgX(ghostDiagram.clampedImageXCm)}
                cy={toSvgY(ghostDiagram.imageHeightCm)}
                r="4"
                fill="#64748b"
              />
            </g>
          )}

        {/* Formed Image Arrow I */}
        {!blindMode && imgX !== null && diagram.imageHeightCm !== Infinity && (
          <g>
            <line
              x1={imgX}
              y1={ORIGIN_Y}
              x2={imgX}
              y2={imgTipY}
              stroke={state.isReal ? '#15803d' : '#0f766e'}
              strokeWidth="3.4"
              strokeDasharray={state.isReal ? undefined : '4 3'}
            />
            <polygon
              points={
                state.isErect
                  ? `${imgX},${imgTipY - 2} ${imgX - 5},${imgTipY + 8} ${imgX + 5},${imgTipY + 8}`
                  : `${imgX},${imgTipY + 2} ${imgX - 5},${imgTipY - 8} ${imgX + 5},${imgTipY - 8}`
              }
              fill={state.isReal ? '#15803d' : '#0f766e'}
            />
            <rect
              x={imgX - 56}
              y={state.isErect ? Math.max(46, imgTipY - 26) : Math.min(265, imgTipY + 6)}
              width="112"
              height="20"
              rx="4"
              fill={state.isReal ? '#dcfce7' : '#ccfbf1'}
              stroke={state.isReal ? '#16a34a' : '#0d9488'}
            />
            <text
              x={imgX}
              y={state.isErect ? Math.max(60, imgTipY - 12) : Math.min(279, imgTipY + 20)}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="800"
              fill={state.isReal ? '#14532d' : '#115e59'}
              fontFamily="ui-monospace, monospace"
            >
              {`v = ${formatSigned(state.imageDistanceV)} cm (${state.magnificationM > 0 ? `+${state.magnificationM}` : state.magnificationM}×)`}
            </text>
          </g>
        )}

        {/* Infinity Callout when |u| == |f| for converging device */}
        {!blindMode && state.imageDistanceV === Infinity && (
          <g transform="translate(590, 54)">
            <rect x="0" y="0" width="210" height="30" rx="6" fill="#fef9c3" stroke="#eab308" />
            <text
              x="105"
              y="19"
              textAnchor="middle"
              fontSize="11"
              fontWeight="800"
              fill="#854d0e"
              fontFamily="ui-monospace, monospace"
            >
              {lang === 'hi'
                ? 'किरणें समानांतर → प्रतिबिंब ∞ पर'
                : 'Parallel Rays → Image at ∞'}
            </text>
          </g>
        )}

        {/* Draggable Object Arrow (u < 0) */}
        <g
          role="slider"
          tabIndex={onChangeAbsU ? 0 : -1}
          aria-label={lang === 'hi' ? 'बिंब की दूरी |u| (सेमी)' : 'Object distance |u| in cm'}
          aria-valuemin={minAbsU}
          aria-valuemax={maxAbsU}
          aria-valuenow={absU}
          aria-valuetext={`u = ${state.objectDistanceU} cm`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onKeyDown={handleKeyDown}
          style={{ cursor: onChangeAbsU ? 'ew-resize' : 'default' }}
        >
          {/* Invisible wider touch target for mobile/pointer dragging */}
          <rect x={objX - 18} y={objTopY - 16} width="36" height={ORIGIN_Y - objTopY + 32} fill="transparent" />
          <line
            x1={objX}
            y1={ORIGIN_Y}
            x2={objX}
            y2={objTopY}
            stroke="#1d4ed8"
            strokeWidth="3.6"
          />
          <polygon
            points={`${objX},${objTopY - 3} ${objX - 6},${objTopY + 8} ${objX + 6},${objTopY + 8}`}
            fill="#1d4ed8"
          />
          <rect
            x={objX - 48}
            y={objTopY - 26}
            width="96"
            height="20"
            rx="4"
            fill="#dbeafe"
            stroke="#2563eb"
          />
          <text
            x={objX}
            y={objTopY - 12}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="800"
            fill="#1e3a8a"
            fontFamily="ui-monospace, monospace"
          >
            {`u = ${state.objectDistanceU} cm`}
          </text>
        </g>

        {/* Symmetric Calibrated Ruler (-60 cm to +60 cm) */}
        <g transform="translate(0, 296)">
          <rect
            x={toSvgX(-62)}
            y="0"
            width={toSvgX(62) - toSvgX(-62)}
            height="26"
            rx="4"
            fill="#efe5cf"
            stroke="#b8a585"
          />
          {RULER_TICKS.map((cm) => {
            const x = toSvgX(cm)
            return (
              <g key={cm} transform={`translate(${x}, 0)`}>
                <line x1="0" y1="0" x2="0" y2="8" stroke="#475569" strokeWidth="1.3" />
                <text
                  x="0"
                  y="20"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight={cm === 0 ? '800' : '600'}
                  fill={cm < 0 ? '#991b1b' : cm > 0 ? '#166534' : '#1e293b'}
                  fontFamily="ui-monospace, monospace"
                >
                  {cm === 0 ? '0' : cm > 0 ? `+${cm}` : `${cm}`}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
