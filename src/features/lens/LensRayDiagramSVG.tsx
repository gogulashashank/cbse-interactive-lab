import { useRef, useState } from 'react'
import type { ConvexLensResult } from './convexLensModel'
import { formatLensNumber, formatSignedCm, LENS_UI_LIMITS } from './lensInputValidation'

export interface LensRayDiagramSVGProps {
  result: ConvexLensResult
  onChangeObjectDistance?: (nextDistanceCm: number) => void
  onChangeScreenDistance?: (nextScreenCm: number) => void
}

const SVG_W = 920
const SVG_H = 440
const ORIGIN_X = 410 // Optical centre O(0,0) in SVG px
const ORIGIN_Y = 236 // Principal axis y in SVG px
const PX_PER_CM = 5.6 // 1 cm = 5.6 px => covers -70 cm to +88 cm
const Y_PX_PER_CM = 12.5 // Vertical exaggeration so rays and arrows are crisp and readable

function toSvgX(xCm: number): number {
  return ORIGIN_X + xCm * PX_PER_CM
}

function toSvgY(yCm: number): number {
  return ORIGIN_Y - yCm * Y_PX_PER_CM
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

export function LensRayDiagramSVG({
  result,
  onChangeObjectDistance,
  onChangeScreenDistance,
}: LensRayDiagramSVGProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [draggingTarget, setDraggingTarget] = useState<'object' | 'screen' | null>(null)

  const {
    focalLengthCm: f,
    objectHeightCm: hObj,
    screenDistanceCm: dScr,
    uCm,
    vCm,
    imageHeightCm,
    magnification,
    isAtFocus,
    imageNature,
    canCatchOnScreen,
    isSharpOnScreen,
    screenBlurFraction,
    rays,
  } = result

  function clientXToCm(clientX: number): number | null {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    if (rect.width <= 0) return null
    const svgX = ((clientX - rect.left) / rect.width) * SVG_W
    return (svgX - ORIGIN_X) / PX_PER_CM
  }

  function handlePointerDown(target: 'object' | 'screen', e: React.PointerEvent<SVGGElement>) {
    e.stopPropagation()
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    setDraggingTarget(target)
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!draggingTarget) return
    const xCm = clientXToCm(e.clientX)
    if (xCm === null) return

    if (draggingTarget === 'object' && onChangeObjectDistance) {
      const rawDist = -xCm
      const snapped =
        Math.round(
          clamp(
            rawDist,
            LENS_UI_LIMITS.objectDistanceCm.min,
            LENS_UI_LIMITS.objectDistanceCm.max
          ) * 2
        ) / 2
      onChangeObjectDistance(snapped)
    } else if (draggingTarget === 'screen' && onChangeScreenDistance) {
      const snapped =
        Math.round(
          clamp(
            xCm,
            LENS_UI_LIMITS.screenDistanceCm.min,
            LENS_UI_LIMITS.screenDistanceCm.max
          ) * 2
        ) / 2
      onChangeScreenDistance(snapped)
    }
  }

  function handlePointerUp() {
    if (draggingTarget) {
      setDraggingTarget(null)
    }
  }

  const objX = toSvgX(uCm)
  const objTipY = toSvgY(hObj)
  const screenX = toSvgX(dScr)

  const f1X = toSvgX(-f)
  const twoF1X = toSvgX(-2 * f)
  const f2X = toSvgX(f)
  const twoF2X = toSvgX(2 * f)

  const lensHalfH = 128

  // Ray 1 points
  const r1Start = { x: toSvgX(rays.ray1ParallelToF2.incidentStart.xCm), y: toSvgY(rays.ray1ParallelToF2.incidentStart.yCm) }
  const r1Lens = { x: toSvgX(0), y: toSvgY(rays.ray1ParallelToF2.lensHit.yCm) }
  const r1End = { x: toSvgX(rays.ray1ParallelToF2.refractedEnd.xCm), y: toSvgY(rays.ray1ParallelToF2.refractedEnd.yCm) }
  const r1Virt = rays.ray1ParallelToF2.virtualExtensionEnd
    ? { x: toSvgX(rays.ray1ParallelToF2.virtualExtensionEnd.xCm), y: toSvgY(rays.ray1ParallelToF2.virtualExtensionEnd.yCm) }
    : null

  // Ray 2 points
  const r2Start = { x: toSvgX(rays.ray2ThroughOpticalCentre.incidentStart.xCm), y: toSvgY(rays.ray2ThroughOpticalCentre.incidentStart.yCm) }
  const r2Lens = { x: toSvgX(0), y: toSvgY(0) }
  const r2End = { x: toSvgX(rays.ray2ThroughOpticalCentre.refractedEnd.xCm), y: toSvgY(rays.ray2ThroughOpticalCentre.refractedEnd.yCm) }
  const r2Virt = rays.ray2ThroughOpticalCentre.virtualExtensionEnd
    ? { x: toSvgX(rays.ray2ThroughOpticalCentre.virtualExtensionEnd.xCm), y: toSvgY(rays.ray2ThroughOpticalCentre.virtualExtensionEnd.yCm) }
    : null

  // Ray 3 points
  const r3 = rays.ray3ThroughF1ToParallel
  const r3Start = r3 ? { x: toSvgX(r3.incidentStart.xCm), y: toSvgY(r3.incidentStart.yCm) } : null
  const r3Lens = r3 ? { x: toSvgX(0), y: toSvgY(r3.lensHit.yCm) } : null
  const r3End = r3 ? { x: toSvgX(r3.refractedEnd.xCm), y: toSvgY(r3.refractedEnd.yCm) } : null
  const r3Virt = r3?.virtualExtensionEnd
    ? { x: toSvgX(r3.virtualExtensionEnd.xCm), y: toSvgY(r3.virtualExtensionEnd.yCm) }
    : null

  // Image arrow coordinates (if not at focus)
  const imgX = vCm !== null ? toSvgX(vCm) : null
  const imgTipY = imageHeightCm !== null ? toSvgY(imageHeightCm) : null

  // Ruler ticks every 10 cm from -60 to +70
  const rulerTicks = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70]

  return (
    <div className="lens-svg-wrapper">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className={`lens-ray-svg ${draggingTarget ? 'is-dragging' : ''}`}
        role="img"
        aria-labelledby="lens-svg-title lens-svg-desc"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <title id="lens-svg-title">
          Interactive Convex Lens Ray Diagram and Optical Bench
        </title>
        <desc id="lens-svg-desc">
          Object at u = {formatSignedCm(uCm)} of height {formatLensNumber(hObj)} cm in front of a
          convex lens of focal length f = +{formatLensNumber(f)} cm.{' '}
          {isAtFocus
            ? 'Refracted rays emerge parallel; image is at infinity.'
            : `Image forms at v = ${formatSignedCm(vCm ?? 0)} with magnification m = ${formatLensNumber(magnification ?? 0)}.`}{' '}
          { result.screenStatusText }
        </desc>

        <defs>
          <clipPath id="bench-viewport-clip">
            <rect x="12" y="42" width={SVG_W - 24} height={SVG_H - 92} rx="8" />
          </clipPath>
          <linearGradient id="lens-glass-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6bb6d6" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#d9f2fc" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#4f9ec2" stopOpacity="0.36" />
          </linearGradient>
          <marker
            id="arrow-ray1"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#b85b14" />
          </marker>
          <marker
            id="arrow-ray2"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#1e4fa3" />
          </marker>
          <marker
            id="arrow-ray3"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#1d7855" />
          </marker>
        </defs>

        {/* Warm Notebook Paper Background */}
        <rect x="0" y="0" width={SVG_W} height={SVG_H} rx="12" fill="#f7f1e3" />

        {/* Top Sign-Convention Banner */}
        <g transform="translate(16, 10)">
          <rect x="0" y="0" width={SVG_W - 32} height="26" rx="6" fill="#ede3ce" stroke="#cfc2a8" strokeWidth="1" />
          <text x="12" y="17" fill="#7c2d12" fontSize="11.5" fontWeight="700">
            NEW CARTESIAN SIGN CONVENTION:
          </text>
          <text x="222" y="17" fill="#1e293b" fontSize="11.5" fontWeight="600">
            Incident Light ➔ (+x)
          </text>
          <text x="372" y="17" fill="#475569" fontSize="11.5">
            Left of O: x &lt; 0 (u = {formatSignedCm(uCm)})
          </text>
          <text x="565" y="17" fill="#475569" fontSize="11.5">
            Right of O: x &gt; 0 (f = +{formatLensNumber(f)} cm)
          </text>
          <text x="752" y="17" fill="#475569" fontSize="11.5">
            Up: y &gt; 0 · Down: y &lt; 0
          </text>
        </g>

        {/* Subtle Engineering Grid */}
        <g clipPath="url(#bench-viewport-clip)" opacity="0.45">
          {rulerTicks.map((cm) => {
            const x = toSvgX(cm)
            return (
              <line
                key={`grid-v-${cm}`}
                x1={x}
                y1={42}
                x2={x}
                y2={SVG_H - 50}
                stroke="#d8ccb4"
                strokeWidth={cm === 0 ? '1.2' : '0.7'}
              />
            )
          })}
          {[-8, -4, 0, 4, 8].map((yCm) => {
            const y = toSvgY(yCm)
            return (
              <line
                key={`grid-h-${yCm}`}
                x1={12}
                y1={y}
                x2={SVG_W - 12}
                y2={y}
                stroke="#d8ccb4"
                strokeWidth={yCm === 0 ? '1.4' : '0.7'}
              />
            )
          })}
        </g>

        {/* Optical Bench Ruler Rail */}
        <g transform={`translate(0, ${ORIGIN_Y + 128})`}>
          <rect x="20" y="0" width={SVG_W - 40} height="22" rx="4" fill="#e5d8be" stroke="#b8a88a" strokeWidth="1" />
          {rulerTicks.map((cm) => {
            const x = toSvgX(cm)
            if (x < 28 || x > SVG_W - 28) return null
            return (
              <g key={`tick-${cm}`} transform={`translate(${x}, 0)`}>
                <line x1="0" y1="0" x2="0" y2="6" stroke="#475569" strokeWidth="1.2" />
                <text x="0" y="16.5" textAnchor="middle" fill="#334155" fontSize="10" fontWeight="600">
                  {cm === 0 ? '0 (O)' : cm > 0 ? `+${cm}` : `${cm}`}
                </text>
              </g>
            )
          })}
        </g>

        {/* Principal Axis */}
        <line
          x1="16"
          y1={ORIGIN_Y}
          x2={SVG_W - 16}
          y2={ORIGIN_Y}
          stroke="#334155"
          strokeWidth="1.8"
        />
        <text x="24" y={ORIGIN_Y - 7} fill="#475569" fontSize="11" fontWeight="600">
          Principal Axis (y = 0)
        </text>

        {/* Clipped Ray & Apparatus Layer */}
        <g clipPath="url(#bench-viewport-clip)">
          {/* Biconvex Converging Lens at x = 0 */}
          <g transform={`translate(${ORIGIN_X}, ${ORIGIN_Y})`}>
            <path
              d={`M 0 ${-lensHalfH} Q 26 0 0 ${lensHalfH} Q -26 0 0 ${-lensHalfH} Z`}
              fill="url(#lens-glass-grad)"
              stroke="#1f6f8b"
              strokeWidth="2.2"
            />
            {/* Vertical principal plane line */}
            <line
              x1="0"
              y1={-lensHalfH - 8}
              x2="0"
              y2={lensHalfH + 8}
              stroke="#1f6f8b"
              strokeWidth="1.2"
              strokeDasharray="4 3"
            />
            <text x="0" y={-lensHalfH - 13} textAnchor="middle" fill="#0f4c5c" fontSize="11.5" fontWeight="700">
              Convex Lens (f = +{formatLensNumber(f)} cm)
            </text>
          </g>

          {/* Focal Marks: 2F1, F1, O, F2, 2F2 */}
          {[
            { x: twoF1X, label: '2F₁', sub: `-${formatLensNumber(2 * f)}` },
            { x: f1X, label: 'F₁', sub: `-${formatLensNumber(f)}` },
            { x: ORIGIN_X, label: 'O', sub: '0' },
            { x: f2X, label: 'F₂', sub: `+${formatLensNumber(f)}` },
            { x: twoF2X, label: '2F₂', sub: `+${formatLensNumber(2 * f)}` },
          ].map((pt) => (
            <g key={pt.label} transform={`translate(${pt.x}, ${ORIGIN_Y})`}>
              <circle cx="0" cy="0" r="4" fill="#7c2d12" />
              <text x="0" y="16" textAnchor="middle" fill="#7c2d12" fontSize="12" fontWeight="700">
                {pt.label}
              </text>
              <text x="0" y="28" textAnchor="middle" fill="#64748b" fontSize="9.5" fontWeight="600">
                ({pt.sub} cm)
              </text>
            </g>
          ))}

          {/* Virtual Ray Extensions (Dashed lines on object side when |u| <= f) */}
          {r1Virt && (
            <line
              x1={r1Lens.x}
              y1={r1Lens.y}
              x2={r1Virt.x}
              y2={r1Virt.y}
              stroke="#b85b14"
              strokeWidth="1.8"
              strokeDasharray="5 4"
              opacity="0.85"
            />
          )}
          {r2Virt && (
            <line
              x1={r2Lens.x}
              y1={r2Lens.y}
              x2={r2Virt.x}
              y2={r2Virt.y}
              stroke="#1e4fa3"
              strokeWidth="1.8"
              strokeDasharray="5 4"
              opacity="0.85"
            />
          )}
          {r3Virt && r3Lens && (
            <line
              x1={r3Lens.x}
              y1={r3Lens.y}
              x2={r3Virt.x}
              y2={r3Virt.y}
              stroke="#1d7855"
              strokeWidth="1.8"
              strokeDasharray="5 4"
              opacity="0.85"
            />
          )}

          {/* Principal Ray 1: Parallel to Axis -> Through F2 (Amber) */}
          <g>
            <line
              x1={r1Start.x}
              y1={r1Start.y}
              x2={r1Lens.x}
              y2={r1Lens.y}
              stroke="#b85b14"
              strokeWidth="2.3"
              markerEnd="url(#arrow-ray1)"
            />
            <line
              x1={r1Lens.x}
              y1={r1Lens.y}
              x2={r1End.x}
              y2={r1End.y}
              stroke="#b85b14"
              strokeWidth="2.3"
              markerEnd="url(#arrow-ray1)"
            />
          </g>

          {/* Principal Ray 2: Through Optical Centre O Undeviated (Cobalt Blue) */}
          <g>
            <line
              x1={r2Start.x}
              y1={r2Start.y}
              x2={r2Lens.x}
              y2={r2Lens.y}
              stroke="#1e4fa3"
              strokeWidth="2.3"
              markerEnd="url(#arrow-ray2)"
            />
            <line
              x1={r2Lens.x}
              y1={r2Lens.y}
              x2={r2End.x}
              y2={r2End.y}
              stroke="#1e4fa3"
              strokeWidth="2.3"
              markerEnd="url(#arrow-ray2)"
            />
          </g>

          {/* Principal Ray 3: Through F1 -> Parallel to Axis (Emerald Dashed-Dot) */}
          {r3Start && r3Lens && r3End && (
            <g>
              <line
                x1={r3Start.x}
                y1={r3Start.y}
                x2={r3Lens.x}
                y2={r3Lens.y}
                stroke="#1d7855"
                strokeWidth="2.1"
                strokeDasharray="8 3"
                markerEnd="url(#arrow-ray3)"
              />
              <line
                x1={r3Lens.x}
                y1={r3Lens.y}
                x2={r3End.x}
                y2={r3End.y}
                stroke="#1d7855"
                strokeWidth="2.1"
                strokeDasharray="8 3"
                markerEnd="url(#arrow-ray3)"
              />
            </g>
          )}

          {/* Formed Image Arrow (Real on right or Virtual on left) */}
          {imgX !== null && imgTipY !== null && imageHeightCm !== null && (
            <g className="lens-image-arrow-group">
              <line
                x1={imgX}
                y1={ORIGIN_Y}
                x2={imgX}
                y2={imgTipY}
                stroke={imageNature === 'virtual_erect' ? '#7c3aed' : '#b91c1c'}
                strokeWidth="3.4"
                strokeDasharray={imageNature === 'virtual_erect' ? '5 3' : undefined}
              />
              {/* Arrowhead at tip */}
              <polygon
                points={
                  imageHeightCm < 0
                    ? `${imgX},${imgTipY} ${imgX - 6},${imgTipY - 10} ${imgX + 6},${imgTipY - 10}`
                    : `${imgX},${imgTipY} ${imgX - 6},${imgTipY + 10} ${imgX + 6},${imgTipY + 10}`
                }
                fill={imageNature === 'virtual_erect' ? '#7c3aed' : '#b91c1c'}
              />
              <rect
                x={imgX - 58}
                y={imageHeightCm < 0 ? imgTipY + 8 : imgTipY - 34}
                width="116"
                height="24"
                rx="5"
                fill="#fffbeb"
                stroke={imageNature === 'virtual_erect' ? '#7c3aed' : '#b91c1c'}
                strokeWidth="1.2"
              />
              <text
                x={imgX}
                y={imageHeightCm < 0 ? imgTipY + 24 : imgTipY - 18}
                textAnchor="middle"
                fill={imageNature === 'virtual_erect' ? '#5b21b6' : '#991b1b'}
                fontSize="10.5"
                fontWeight="700"
              >
                {imageNature === 'virtual_erect' ? 'Virtual Image' : 'Real Image'} (v={formatSignedCm(vCm ?? 0)})
              </text>
            </g>
          )}

          {/* Movable Paper Screen at x = +screenDistanceCm (Draggable & Keyboard-Operable) */}
          <g
            className="draggable-screen-group"
            transform={`translate(${screenX}, 0)`}
            tabIndex={0}
            role="slider"
            aria-label="Movable paper screen distance in cm"
            aria-valuemin={LENS_UI_LIMITS.screenDistanceCm.min}
            aria-valuemax={LENS_UI_LIMITS.screenDistanceCm.max}
            aria-valuenow={dScr}
            onPointerDown={(e) => handlePointerDown('screen', e)}
            onKeyDown={(e) => {
              if (!onChangeScreenDistance) return
              if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault()
                onChangeScreenDistance(
                  clamp(dScr + 1, LENS_UI_LIMITS.screenDistanceCm.min, LENS_UI_LIMITS.screenDistanceCm.max)
                )
              } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault()
                onChangeScreenDistance(
                  clamp(dScr - 1, LENS_UI_LIMITS.screenDistanceCm.min, LENS_UI_LIMITS.screenDistanceCm.max)
                )
              }
            }}
            style={{ cursor: 'ew-resize' }}
          >
            {/* Invisible wide touch target (44px) */}
            <rect x="-22" y={ORIGIN_Y - 125} width="44" height="255" fill="transparent" />
            {/* Screen upright board */}
            <rect
              x="-4"
              y={ORIGIN_Y - 115}
              width="8"
              height="230"
              rx="2"
              fill={isSharpOnScreen ? '#dcfce7' : '#ffffff'}
              stroke={isSharpOnScreen ? '#15803d' : '#475569'}
              strokeWidth="2"
            />
            {/* Blur / Sharp beam spot on the screen */}
            {canCatchOnScreen ? (
              <circle
                cx="0"
                cy={clamp(toSvgY(rays.screenIntersections.beamCenterYCm), ORIGIN_Y - 108, ORIGIN_Y + 108)}
                r={isSharpOnScreen ? 5 : clamp(4 + screenBlurFraction * 22, 6, 26)}
                fill={isSharpOnScreen ? '#16a34a' : '#f59e0b'}
                opacity={isSharpOnScreen ? 0.9 : 0.45}
              />
            ) : (
              <rect
                x="-3"
                y={ORIGIN_Y - 60}
                width="6"
                height="120"
                fill="#fbbf24"
                opacity="0.28"
              />
            )}
            {/* Screen base rider on bench */}
            <rect
              x="-24"
              y={ORIGIN_Y + 114}
              width="48"
              height="18"
              rx="4"
              fill={isSharpOnScreen ? '#15803d' : '#334155'}
            />
            <text
              x="0"
              y={ORIGIN_Y + 126}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9.5"
              fontWeight="700"
            >
              SCREEN
            </text>
            <text
              x="0"
              y={ORIGIN_Y - 121}
              textAnchor="middle"
              fill={isSharpOnScreen ? '#15803d' : '#334155'}
              fontSize="10.5"
              fontWeight="700"
            >
              Screen (+{formatLensNumber(dScr)} cm)
            </text>
          </g>

          {/* Upright Object Arrow & Candle at x = uCm (Draggable & Keyboard-Operable) */}
          <g
            className="draggable-object-group"
            tabIndex={0}
            role="slider"
            aria-label="Object distance |u| in cm"
            aria-valuemin={LENS_UI_LIMITS.objectDistanceCm.min}
            aria-valuemax={LENS_UI_LIMITS.objectDistanceCm.max}
            aria-valuenow={result.objectDistanceCm}
            onPointerDown={(e) => handlePointerDown('object', e)}
            onKeyDown={(e) => {
              if (!onChangeObjectDistance) return
              if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault()
                onChangeObjectDistance(
                  clamp(
                    result.objectDistanceCm + 1,
                    LENS_UI_LIMITS.objectDistanceCm.min,
                    LENS_UI_LIMITS.objectDistanceCm.max
                  )
                )
              } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault()
                onChangeObjectDistance(
                  clamp(
                    result.objectDistanceCm - 1,
                    LENS_UI_LIMITS.objectDistanceCm.min,
                    LENS_UI_LIMITS.objectDistanceCm.max
                  )
                )
              }
            }}
            style={{ cursor: 'ew-resize' }}
          >
            {/* Wide 44px touch target */}
            <rect
              x={objX - 22}
              y={Math.min(objTipY - 24, ORIGIN_Y - 80)}
              width="44"
              height={Math.max(110, ORIGIN_Y - objTipY + 55)}
              fill="transparent"
            />
            {/* Object Stem */}
            <line
              x1={objX}
              y1={ORIGIN_Y}
              x2={objX}
              y2={objTipY}
              stroke="#0f172a"
              strokeWidth="4"
            />
            {/* Arrowhead + Warm Flame */}
            <polygon
              points={`${objX},${objTipY} ${objX - 7},${objTipY + 12} ${objX + 7},${objTipY + 12}`}
              fill="#ea580c"
              stroke="#7c2d12"
              strokeWidth="1"
            />
            {/* Object Rider Pill */}
            <rect
              x={objX - 28}
              y={ORIGIN_Y + 114}
              width="56"
              height="18"
              rx="4"
              fill="#9a3412"
            />
            <text
              x={objX}
              y={ORIGIN_Y + 126}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="9.5"
              fontWeight="700"
            >
              OBJECT
            </text>
            <rect
              x={objX - 48}
              y={objTipY - 28}
              width="96"
              height="20"
              rx="4"
              fill="#fff7ed"
              stroke="#c2410c"
              strokeWidth="1.2"
            />
            <text
              x={objX}
              y={objTipY - 14}
              textAnchor="middle"
              fill="#9a3412"
              fontSize="10.5"
              fontWeight="700"
            >
              Object (u={formatSignedCm(uCm)})
            </text>
          </g>
        </g>

        {/* Top-Left Legend for the 3 Principal Rays (Color + Pattern) */}
        <g transform="translate(22, 48)">
          <rect x="0" y="0" width="256" height="64" rx="6" fill="rgba(255, 251, 235, 0.92)" stroke="#d6cba8" strokeWidth="1" />
          <line x1="10" y1="15" x2="34" y2="15" stroke="#b85b14" strokeWidth="2.4" />
          <text x="42" y="18.5" fill="#1e293b" fontSize="10.5" fontWeight="600">
            Ray 1 (Solid Amber): Parallel ➔ through F₂
          </text>
          <line x1="10" y1="33" x2="34" y2="33" stroke="#1e4fa3" strokeWidth="2.4" />
          <text x="42" y="36.5" fill="#1e293b" fontSize="10.5" fontWeight="600">
            Ray 2 (Solid Blue): Through optical centre O
          </text>
          <line x1="10" y1="51" x2="34" y2="51" stroke="#1d7855" strokeWidth="2.2" strokeDasharray="6 3" />
          <text x="42" y="54.5" fill="#1e293b" fontSize="10.5" fontWeight="600">
            Ray 3 (Dashed Green): Through F₁ ➔ parallel
          </text>
        </g>

        {/* Top-Right Inset: Live View on the Paper Screen */}
        <g transform={`translate(${SVG_W - 242}, 48)`}>
          <rect
            x="0"
            y="0"
            width="220"
            height="86"
            rx="8"
            fill="#ffffff"
            stroke={isSharpOnScreen ? '#16a34a' : '#94a3b8'}
            strokeWidth="1.8"
          />
          <text x="12" y="18" fill="#0f172a" fontSize="11" fontWeight="700">
            PAPER SCREEN VIEW (at +{formatLensNumber(dScr)} cm)
          </text>
          {canCatchOnScreen && imageHeightCm !== null ? (
            <g>
              <text
                x="12"
                y="35"
                fill={isSharpOnScreen ? '#15803d' : '#b45309'}
                fontSize="10.5"
                fontWeight="700"
              >
                {isSharpOnScreen
                  ? '✓ SHARP INVERTED IMAGE CAUGHT!'
                  : `⚠ BLURRED (Move screen to +${formatLensNumber(vCm ?? 0)} cm)`}
              </text>
              <text x="12" y="52" fill="#475569" fontSize="10">
                Real rays converge at v = {formatSignedCm(vCm ?? 0)}
              </text>
              <text x="12" y="67" fill="#475569" fontSize="10">
                Magnification m = {formatLensNumber(magnification ?? 0)}× (Inverted)
              </text>
              {/* Mini preview of inverted arrow on screen card */}
              <g
                transform="translate(190, 48)"
                opacity={isSharpOnScreen ? 1 : Math.max(0.25, 1 - screenBlurFraction * 0.75)}
              >
                <rect x="-18" y="-22" width="36" height="44" rx="4" fill="#f8fafc" stroke="#cbd5e1" />
                <line
                  x1="0"
                  y1="-14"
                  x2="0"
                  y2="12"
                  stroke="#b91c1c"
                  strokeWidth={isSharpOnScreen ? '3' : '6'}
                  opacity={isSharpOnScreen ? 1 : 0.45}
                />
                <polygon
                  points="0,15 -5,7 5,7"
                  fill="#b91c1c"
                  opacity={isSharpOnScreen ? 1 : 0.45}
                />
              </g>
            </g>
          ) : (
            <g>
              <text x="12" y="36" fill="#b91c1c" fontSize="10.5" fontWeight="700">
                ✗ NO IMAGE CAUGHT ON SCREEN
              </text>
              <text x="12" y="53" fill="#475569" fontSize="10">
                {isAtFocus
                  ? 'Refracted rays are parallel (image at ∞).'
                  : 'Refracted rays diverge! Virtual upright'}
              </text>
              <text x="12" y="68" fill="#475569" fontSize="10">
                {isAtFocus
                  ? 'Cannot focus on a screen at finite distance.'
                  : `image is at v = ${formatSignedCm(vCm ?? 0)} (look through lens).`}
              </text>
            </g>
          )}
        </g>

        {/* Bottom Interaction Hint */}
        <text
          x={SVG_W / 2}
          y={SVG_H - 8}
          textAnchor="middle"
          fill="#475569"
          fontSize="11"
          fontWeight="600"
        >
          Tip: Drag the orange OBJECT or dark SCREEN rider directly along the optical bench, or use the sliders &amp; presets below.
        </text>
      </svg>
    </div>
  )
}
