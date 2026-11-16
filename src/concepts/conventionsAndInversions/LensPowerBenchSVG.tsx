import { useRef, useState } from 'react'
import {
  BENCH_SVG_GEOMETRY,
  formatSignedValue,
  type LensPowerModelResult,
} from './lensPowerModel'

export interface LensPowerBenchSVGProps {
  /** Primary active lens model */
  model: LensPowerModelResult
  /** Qualitative label used when focal length is hidden before prediction commit */
  unrevealedLensLabel: string
  /** Optional ghost comparison lens model (when "Compare Overlay" is active) */
  comparisonModel?: LensPowerModelResult | null
  /** Whether refracted rays and focal point are revealed (false before prediction commit in Stage A) */
  raysRevealed: boolean
  /** Whether the principal focus marker (F2 or F1) is explicitly highlighted */
  showFocalMarker: boolean
  /** Whether the numerical cm value is shown directly on the focus marker (true after ruler alignment or in Stages C–F) */
  showExactFocalValueOnMarker: boolean
  /** Whether the interactive centimetre ruler / caliper is shown */
  showRuler: boolean
  /** Current ruler measurement cursor position in cm along the axis (-50 to +50) */
  rulerCursorCm: number
  /** Callback when the user moves the ruler cursor (via drag or keyboard) */
  onChangeRulerCursorCm: (nextCm: number) => void
  /** Whether equations/power callout is shown directly on the diagram */
  showEquationTag: boolean
  /** Reduced motion preference */
  stillMode: boolean
}

const {
  SVG_W,
  SVG_H,
  ORIGIN_X,
  ORIGIN_Y,
  PX_PER_CM,
  RULER_MIN_CM,
  RULER_MAX_CM,
  RULER_BAR_LEFT_CM,
  RULER_BAR_RIGHT_CM,
  toSvgX,
  toSvgY,
} = BENCH_SVG_GEOMETRY

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

/**
 * Generates an SVG path for an illustrative biconvex or biconcave lens centered at (ORIGIN_X, ORIGIN_Y).
 * Note: Surface curvature is scaled modestly as a visual cue; the lesson explicitly explains that
 * refractive index and surface radii of curvature govern focal length under the thin-lens model.
 */
function buildLensOutlinePath(focalLengthCm: number): string {
  const halfH = 108
  const absF = Math.abs(focalLengthCm)
  const curveFactor = clamp((55 - absF) / 45, 0.25, 1)

  if (focalLengthCm > 0) {
    const halfWidth = 10 + curveFactor * 12
    const leftEdgeX = ORIGIN_X - 3
    const rightEdgeX = ORIGIN_X + 3
    const ctrlOffset = halfWidth * 1.65
    return [
      `M ${leftEdgeX} ${ORIGIN_Y - halfH}`,
      `L ${rightEdgeX} ${ORIGIN_Y - halfH}`,
      `Q ${ORIGIN_X + ctrlOffset} ${ORIGIN_Y} ${rightEdgeX} ${ORIGIN_Y + halfH}`,
      `L ${leftEdgeX} ${ORIGIN_Y + halfH}`,
      `Q ${ORIGIN_X - ctrlOffset} ${ORIGIN_Y} ${leftEdgeX} ${ORIGIN_Y - halfH}`,
      'Z',
    ].join(' ')
  } else {
    const rimHalfW = 17 + curveFactor * 6
    const waistHalfW = 6
    const ctrlInward = rimHalfW - waistHalfW
    return [
      `M ${ORIGIN_X - rimHalfW} ${ORIGIN_Y - halfH}`,
      `L ${ORIGIN_X + rimHalfW} ${ORIGIN_Y - halfH}`,
      `Q ${ORIGIN_X + rimHalfW - ctrlInward * 1.35} ${ORIGIN_Y} ${ORIGIN_X + rimHalfW} ${ORIGIN_Y + halfH}`,
      `L ${ORIGIN_X - rimHalfW} ${ORIGIN_Y + halfH}`,
      `Q ${ORIGIN_X - rimHalfW + ctrlInward * 1.35} ${ORIGIN_Y} ${ORIGIN_X - rimHalfW} ${ORIGIN_Y - halfH}`,
      'Z',
    ].join(' ')
  }
}

export function LensPowerBenchSVG({
  model,
  unrevealedLensLabel,
  comparisonModel = null,
  raysRevealed,
  showFocalMarker,
  showExactFocalValueOnMarker,
  showRuler,
  rulerCursorCm,
  onChangeRulerCursorCm,
  showEquationTag,
  stillMode,
}: LensPowerBenchSVGProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [draggingRuler, setDraggingRuler] = useState(false)

  const focusSvgX = toSvgX(model.principalFocusPoint.xCm)
  const cursorSvgX = toSvgX(rulerCursorCm)
  const isRulerAlignedWithFocus = Math.abs(rulerCursorCm - model.focalLengthCm) <= 1.0

  function clientXToCm(clientX: number): number | null {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (rect.width <= 0) return null
    const svgX = ((clientX - rect.left) / rect.width) * SVG_W
    return (svgX - ORIGIN_X) / PX_PER_CM
  }

  function handlePointerDown(e: React.PointerEvent<SVGGElement>) {
    e.stopPropagation()
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    setDraggingRuler(true)
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!draggingRuler) return
    const rawCm = clientXToCm(e.clientX)
    if (rawCm === null) return
    const snapped = Math.round(clamp(rawCm, RULER_MIN_CM, RULER_MAX_CM))
    onChangeRulerCursorCm(snapped)
  }

  function handlePointerUp() {
    if (draggingRuler) setDraggingRuler(false)
  }

  function handleRulerKeyDown(e: React.KeyboardEvent<SVGGElement>) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault()
      onChangeRulerCursorCm(clamp(rulerCursorCm + (e.shiftKey ? 5 : 1), RULER_MIN_CM, RULER_MAX_CM))
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault()
      onChangeRulerCursorCm(clamp(rulerCursorCm - (e.shiftKey ? 5 : 1), RULER_MIN_CM, RULER_MAX_CM))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChangeRulerCursorCm(0)
    }
  }

  const rulerTicks: number[] = [
    -50, -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
  ]

  return (
    <div className="lp-bench-svg-frame">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className={`lp-bench-svg ${stillMode ? 'is-still' : ''}`}
        role="img"
        aria-label={
          raysRevealed
            ? `Optical bench showing a ${model.lensNature} lens with focal length f = ${formatSignedValue(
                model.focalLengthCm,
                0
              )} cm (${formatSignedValue(model.focalLengthMetres, 2)} m) and optical power P = ${formatSignedValue(
                model.powerDioptres,
                2
              )} D. Ruler caliper is at ${formatSignedValue(rulerCursorCm, 0)} cm.`
            : `Optical bench showing parallel incident rays approaching ${unrevealedLensLabel} at optical centre O. Commit to a prediction in Stage A to reveal the refracted ray paths.`
        }
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          {/* Paper grid pattern */}
          <pattern id="lp-notebook-grid" width="23" height="23" patternUnits="userSpaceOnUse">
            <path
              d="M 23 0 L 0 0 0 23"
              fill="none"
              stroke="rgba(28, 36, 51, 0.065)"
              strokeWidth="1"
            />
          </pattern>

          {/* Filled arrowhead for actual incident & refracted rays */}
          <marker
            id="lp-ray-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5.5"
            markerHeight="5.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#9a3b2a" />
          </marker>

          {/* Open chevron arrowhead for comparison overlay rays (non-colour distinction) */}
          <marker
            id="lp-ghost-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M 1 1.5 L 8.5 5 L 1 8.5"
              fill="none"
              stroke="#273463"
              strokeWidth="1.8"
            />
          </marker>
        </defs>

        {/* Warm notebook graph-paper background */}
        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="#fbf6e9" rx="10" />
        <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#lp-notebook-grid)" rx="10" />

        {/* Subtle notebook top margin rule */}
        <line x1="20" y1="34" x2={SVG_W - 20} y2="34" stroke="rgba(154, 59, 42, 0.22)" strokeWidth="1" />

        {/* Diagram caption header inside SVG */}
        <text x="24" y="23" fill="#475569" fontSize="11" fontFamily="var(--sans)" fontWeight="700">
          PARAXIAL THIN-LENS BENCH · PARALLEL INCIDENT BEAM (+x DIRECTION)
        </text>
        <text x={SVG_W - 24} y="23" textAnchor="end" fill="#64748b" fontSize="10.5" fontFamily="var(--mono)">
          Optical Centre O fixed at x = 0 cm
        </text>

        {/* Principal Axis */}
        <line
          x1="20"
          y1={ORIGIN_Y}
          x2={SVG_W - 20}
          y2={ORIGIN_Y}
          stroke="#334155"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        <text x={SVG_W - 24} y={ORIGIN_Y - 7} textAnchor="end" fill="#475569" fontSize="10.5" fontFamily="var(--serif)" fontStyle="italic">
          Principal Axis
        </text>

        {/* Optional Ghost Comparison Overlay (Non-colour distinctions: dash-dot pattern + square focus marker + legend box) */}
        {raysRevealed && comparisonModel && (
          <g className="lp-comparison-overlay">
            {/* Comparison Legend Badge in Top-Left of Bench (separate from Top-Right Equation Box) */}
            <g transform="translate(24, 38)">
              <rect
                x="0"
                y="0"
                width="274"
                height="40"
                rx="6"
                fill="rgba(251, 247, 238, 0.96)"
                stroke="#b8a88a"
                strokeWidth="1.2"
              />
              <line x1="10" y1="13" x2="34" y2="13" stroke="#9a3b2a" strokeWidth="2.2" />
              <circle cx="22" cy="13" r="3.5" fill="#9a3b2a" />
              <text x="42" y="17" fill="#1c2433" fontSize="10.5" fontWeight="700" fontFamily="var(--sans)">
                Active Lens ({formatSignedValue(model.focalLengthCm, 0)} cm): Solid + Circle
              </text>

              <line
                x1="10"
                y1="29"
                x2="34"
                y2="29"
                stroke="#273463"
                strokeWidth="2"
                strokeDasharray="8 3 2 3"
              />
              <rect x="18.5" y="25.5" width="7" height="7" fill="#ffffff" stroke="#273463" strokeWidth="1.8" />
              <text x="42" y="32" fill="#273463" fontSize="10.5" fontWeight="700" fontFamily="var(--sans)">
                Comparison ({formatSignedValue(comparisonModel.focalLengthCm, 0)} cm): Dash-Dot + Square
              </text>
            </g>

            <path
              d={buildLensOutlinePath(comparisonModel.focalLengthCm)}
              fill="rgba(39, 52, 99, 0.06)"
              stroke="#273463"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            {comparisonModel.parallelRays.map((ray, idx) => {
              const hitX = toSvgX(0)
              const hitY = toSvgY(ray.lensHit.yCm)
              const endX = toSvgX(ray.refractedEnd.xCm)
              const endY = toSvgY(ray.refractedEnd.yCm)
              return (
                <line
                  key={`comp-ray-${idx}`}
                  x1={hitX}
                  y1={hitY}
                  x2={endX}
                  y2={endY}
                  stroke="#273463"
                  strokeWidth="1.7"
                  strokeDasharray="9 4 2 4"
                  opacity="0.75"
                  markerEnd="url(#lp-ghost-arrow)"
                />
              )
            })}
            {/* Square marker for comparison focus (distinct shape from active circle marker, label placed below axis so it never collides with active F2 label above axis) */}
            <rect
              x={toSvgX(comparisonModel.principalFocusPoint.xCm) - 6}
              y={ORIGIN_Y - 6}
              width="12"
              height="12"
              fill="#ffffff"
              stroke="#273463"
              strokeWidth="2.2"
            />
            <text
              x={toSvgX(comparisonModel.principalFocusPoint.xCm)}
              y={ORIGIN_Y + 23}
              textAnchor="middle"
              fill="#273463"
              fontSize="11"
              fontWeight="700"
              fontFamily="var(--sans)"
              paintOrder="stroke"
              stroke="#fbf6e9"
              strokeWidth="4"
            >
              Compare {comparisonModel.principalFocusPoint.label} ({formatSignedValue(comparisonModel.focalLengthCm, 0)} cm)
            </text>
          </g>
        )}

        {/* Parallel Incident Rays (Left of Lens: x = -34 cm to x = 0 cm) */}
        <g className="lp-incident-rays">
          {model.parallelRays.map((ray, idx) => {
            const startX = toSvgX(ray.incidentStart.xCm)
            const startY = toSvgY(ray.incidentStart.yCm)
            const hitX = toSvgX(0)
            const hitY = toSvgY(ray.lensHit.yCm)
            const midX = (startX + hitX) / 2
            return (
              <g key={`inc-${idx}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={hitX}
                  y2={hitY}
                  stroke="#9a3b2a"
                  strokeWidth={ray.heightYCm === 0 ? '2.2' : '2'}
                />
                <line
                  x1={startX}
                  y1={startY}
                  x2={midX}
                  y2={hitY}
                  stroke="transparent"
                  strokeWidth="1"
                  markerEnd="url(#lp-ray-arrow)"
                />
              </g>
            )
          })}
          <text
            x={toSvgX(-26)}
            y={toSvgY(6) - 8}
            textAnchor="middle"
            fill="#9a3b2a"
            fontSize="11"
            fontWeight="700"
            fontFamily="var(--sans)"
          >
            Parallel Incident Beam (Actual Rays)
          </text>
        </g>

        {/* Refracted Rays & Virtual Backward Extensions (Revealed after prediction commit) */}
        {raysRevealed ? (
          <g className="lp-refracted-group">
            {/* Dashed backward extensions for diverging concave lens (NO arrowheads — light never travels backward) */}
            {model.lensNature === 'diverging' &&
              model.parallelRays.map((ray, idx) => {
                if (!ray.backwardExtensionEnd) return null
                const hitX = toSvgX(0)
                const hitY = toSvgY(ray.lensHit.yCm)
                const virtX = toSvgX(ray.backwardExtensionEnd.xCm)
                const virtY = toSvgY(ray.backwardExtensionEnd.yCm)
                return (
                  <line
                    key={`virt-${idx}`}
                    x1={hitX}
                    y1={hitY}
                    x2={virtX}
                    y2={virtY}
                    stroke="#273463"
                    strokeWidth="1.7"
                    strokeDasharray="4 4"
                  />
                )
              })}

            {model.lensNature === 'diverging' && (
              <text
                x={toSvgX(-48)}
                y={toSvgY(-6) - 7}
                textAnchor="start"
                fill="#273463"
                fontSize="10.5"
                fontWeight="700"
                fontFamily="var(--sans)"
                paintOrder="stroke"
                stroke="#fbf6e9"
                strokeWidth="3.5"
              >
                Dashed Backward Extensions (Virtual Rays)
              </text>
            )}

            {/* Actual Refracted Rays on Right Side (+x) */}
            {model.parallelRays.map((ray, idx) => {
              const hitX = toSvgX(0)
              const hitY = toSvgY(ray.lensHit.yCm)
              const endX = toSvgX(ray.refractedEnd.xCm)
              const endY = toSvgY(ray.refractedEnd.yCm)
              const midX = hitX + (endX - hitX) * 0.52
              const midY = hitY + (endY - hitY) * 0.52
              return (
                <g key={`ref-${idx}`}>
                  <line
                    x1={hitX}
                    y1={hitY}
                    x2={endX}
                    y2={endY}
                    stroke="#9a3b2a"
                    strokeWidth={ray.heightYCm === 0 ? '2.2' : '2'}
                    className="lp-animated-ray"
                  />
                  <line
                    x1={hitX}
                    y1={hitY}
                    x2={midX}
                    y2={midY}
                    stroke="transparent"
                    strokeWidth="1"
                    markerEnd="url(#lp-ray-arrow)"
                  />
                </g>
              )
            })}
          </g>
        ) : (
          /* Pre-prediction qualitative mystery zone on the right of the lens (Zero numerical leakage) */
          <g>
            <rect
              x={ORIGIN_X + 36}
              y={ORIGIN_Y - 88}
              width="364"
              height="176"
              rx="10"
              fill="rgba(245, 236, 218, 0.88)"
              stroke="#cbbba0"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
            <text
              x={ORIGIN_X + 218}
              y={ORIGIN_Y - 16}
              textAnchor="middle"
              fill="#1c2433"
              fontSize="13"
              fontWeight="700"
              fontFamily="var(--serif)"
            >
              Where will {unrevealedLensLabel.split('·')[0].trim()} bring the parallel rays together?
            </text>
            <text
              x={ORIGIN_X + 218}
              y={ORIGIN_Y + 8}
              textAnchor="middle"
              fill="#475569"
              fontSize="11"
              fontFamily="var(--sans)"
            >
              Switch between Lens A and Lens B to compare their curves,
            </text>
            <text
              x={ORIGIN_X + 218}
              y={ORIGIN_Y + 24}
              textAnchor="middle"
              fill="#475569"
              fontSize="11"
              fontFamily="var(--sans)"
            >
              then commit to your prediction to reveal the refracted beam.
            </text>
          </g>
        )}

        {/* Active Thin Lens Element & Principal Plane at x = 0 */}
        <g className="lp-lens-element">
          <path
            d={buildLensOutlinePath(model.focalLengthCm)}
            fill="rgba(186, 218, 248, 0.44)"
            stroke="#1e3a8a"
            strokeWidth="2.2"
          />
          <line
            x1={ORIGIN_X}
            y1={ORIGIN_Y - 112}
            x2={ORIGIN_X}
            y2={ORIGIN_Y + 112}
            stroke="#1e3a8a"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <circle cx={ORIGIN_X} cy={ORIGIN_Y} r="4.5" fill="#1e3a8a" />
          <text
            x={ORIGIN_X - 18}
            y={ORIGIN_Y + 16}
            textAnchor="end"
            fill="#1e3a8a"
            fontSize="11.5"
            fontWeight="800"
            fontFamily="var(--serif)"
            paintOrder="stroke"
            stroke="#fbf6e9"
            strokeWidth="3.5"
          >
            O (0 cm)
          </text>
          <text
            x={ORIGIN_X}
            y={ORIGIN_Y - 118}
            textAnchor="middle"
            fill="#1e3a8a"
            fontSize="11.5"
            fontWeight="700"
            fontFamily="var(--sans)"
          >
            {raysRevealed
              ? model.lensNature === 'converging'
                ? 'Convex Lens (Converging)'
                : 'Concave Lens (Diverging)'
              : unrevealedLensLabel}
          </text>
        </g>

        {/* Principal Focus Marker & Focal Distance Dimension Bracket */}
        {raysRevealed && showFocalMarker && (
          <g className="lp-focal-marker-group">
            {showExactFocalValueOnMarker && (
              <>
                <line
                  x1={ORIGIN_X}
                  y1={ORIGIN_Y + 46}
                  x2={focusSvgX}
                  y2={ORIGIN_Y + 46}
                  stroke="#c48412"
                  strokeWidth="2.2"
                />
                <line
                  x1={ORIGIN_X}
                  y1={ORIGIN_Y + 40}
                  x2={ORIGIN_X}
                  y2={ORIGIN_Y + 52}
                  stroke="#c48412"
                  strokeWidth="2"
                />
                <line
                  x1={focusSvgX}
                  y1={ORIGIN_Y + 40}
                  x2={focusSvgX}
                  y2={ORIGIN_Y + 52}
                  stroke="#c48412"
                  strokeWidth="2"
                />
                <rect
                  x={(ORIGIN_X + focusSvgX) / 2 - 44}
                  y={model.absFocalLengthCm < 15 ? ORIGIN_Y + 53 : ORIGIN_Y + 35}
                  width="88"
                  height="20"
                  rx="5"
                  fill="#fef3c7"
                  stroke="#d97706"
                  strokeWidth="1.2"
                />
                <text
                  x={(ORIGIN_X + focusSvgX) / 2}
                  y={model.absFocalLengthCm < 15 ? ORIGIN_Y + 67 : ORIGIN_Y + 49}
                  textAnchor="middle"
                  fill="#78350f"
                  fontSize="10.5"
                  fontWeight="800"
                  fontFamily="var(--mono)"
                >
                  f = {formatSignedValue(model.focalLengthCm, 0)} cm
                </text>
              </>
            )}

            <circle
              cx={focusSvgX}
              cy={ORIGIN_Y}
              r="6.5"
              fill={model.lensNature === 'converging' ? '#9a3b2a' : '#ffffff'}
              stroke={model.lensNature === 'converging' ? '#ffffff' : '#273463'}
              strokeWidth="2.4"
            />
            <text
              x={focusSvgX}
              y={ORIGIN_Y - 13}
              textAnchor="middle"
              fill={model.lensNature === 'converging' ? '#9a3b2a' : '#273463'}
              fontSize="12.5"
              fontWeight="800"
              fontFamily="var(--serif)"
              paintOrder="stroke"
              stroke="#fbf6e9"
              strokeWidth="4"
            >
              {showExactFocalValueOnMarker
                ? `${model.principalFocusPoint.label} (${formatSignedValue(model.focalLengthCm, 0)} cm)`
                : `${model.principalFocusPoint.label} (Measure with Ruler)`}
            </text>
          </g>
        )}

        {/* Contextual Equation Callout Beside the Lens / Focus */}
        {raysRevealed && showEquationTag && (
          <g transform={`translate(${SVG_W - 252}, 42)`}>
            <rect
              x="0"
              y="0"
              width="232"
              height="66"
              rx="8"
              fill="rgba(251, 247, 238, 0.96)"
              stroke="#cbbba0"
              strokeWidth="1.5"
            />
            <text x="12" y="19" fill="#9a3b2a" fontSize="10" fontWeight="800" fontFamily="var(--sans)">
              CONFIGURED LENS MODEL (P = 1/f)
            </text>
            <text x="12" y="38" fill="#1c2433" fontSize="11.5" fontWeight="700" fontFamily="var(--mono)">
              f = {formatSignedValue(model.focalLengthCm, 0)} cm ={' '}
              {formatSignedValue(model.focalLengthMetres, 2)} m
            </text>
            <text x="12" y="56" fill="#273463" fontSize="12" fontWeight="800" fontFamily="var(--mono)">
              P = 1/f = {formatSignedValue(model.powerDioptres, 2)} D
            </text>
          </g>
        )}

        {/* Interactive Optical Bench Centimetre Ruler & Draggable/Keyboard Measurement Caliper */}
        {raysRevealed && showRuler && (
          <g className="lp-bench-ruler">
            <rect
              x={toSvgX(RULER_BAR_LEFT_CM)}
              y="310"
              width={toSvgX(RULER_BAR_RIGHT_CM) - toSvgX(RULER_BAR_LEFT_CM)}
              height="42"
              rx="6"
              fill="#efe4cc"
              stroke="#b8a88a"
              strokeWidth="1.5"
            />
            {rulerTicks.map((cm) => {
              const tx = toSvgX(cm)
              const isMajor = cm % 10 === 0
              return (
                <g key={`tick-${cm}`}>
                  <line
                    x1={tx}
                    y1="310"
                    x2={tx}
                    y2={isMajor ? '325' : '319'}
                    stroke="#334155"
                    strokeWidth={cm === 0 ? '2.2' : isMajor ? '1.5' : '1'}
                  />
                  {isMajor && (
                    <text
                      x={tx}
                      y="341"
                      textAnchor="middle"
                      fill={cm === 0 ? '#1e3a8a' : '#334155'}
                      fontSize="10.5"
                      fontWeight={cm === 0 ? '800' : '600'}
                      fontFamily="var(--mono)"
                    >
                      {cm > 0 ? `+${cm}` : cm}
                    </text>
                  )}
                </g>
              )
            })}
            <text
              x={ORIGIN_X}
              y="368"
              textAnchor="middle"
              fill="#475569"
              fontSize="10"
              fontWeight="700"
              fontFamily="var(--sans)"
            >
              CALIBRATED BENCH RULER (−50 cm to +50 cm from O) — Align caliper with focus {model.principalFocusPoint.label}
            </text>

            {/* Vertical measurement caliper line from ruler up to principal axis */}
            <line
              x1={cursorSvgX}
              y1={ORIGIN_Y}
              x2={cursorSvgX}
              y2="310"
              stroke={isRulerAlignedWithFocus ? '#15803d' : '#273463'}
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Draggable & Keyboard-Focusable Caliper Handle */}
            <g
              className="lp-ruler-handle"
              transform={`translate(${cursorSvgX}, 310)`}
              tabIndex={0}
              role="slider"
              aria-label="Optical bench ruler caliper position in centimetres"
              aria-valuemin={RULER_MIN_CM}
              aria-valuemax={RULER_MAX_CM}
              aria-valuenow={rulerCursorCm}
              aria-valuetext={`Ruler reading ${formatSignedValue(rulerCursorCm, 0)} centimetres${
                isRulerAlignedWithFocus ? ', aligned with principal focus' : ''
              }`}
              onPointerDown={handlePointerDown}
              onKeyDown={handleRulerKeyDown}
              style={{ cursor: 'ew-resize' }}
            >
              <polygon points="0,0 -7,-11 7,-11" fill={isRulerAlignedWithFocus ? '#15803d' : '#273463'} />
              <rect
                x="-62"
                y="-32"
                width="124"
                height="21"
                rx="5"
                fill={isRulerAlignedWithFocus ? '#15803d' : '#273463'}
              />
              <text
                x="0"
                y="-18"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10.5"
                fontWeight="700"
                fontFamily="var(--mono)"
              >
                {isRulerAlignedWithFocus
                  ? `Ruler: ${formatSignedValue(rulerCursorCm, 0)} cm ✓`
                  : `Ruler: ${formatSignedValue(rulerCursorCm, 0)} cm`}
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}
