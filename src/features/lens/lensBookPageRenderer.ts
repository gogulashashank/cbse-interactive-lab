import type { ConvexLensResult } from './convexLensModel'
import { formatLensNumber, formatSignedCm } from './lensInputValidation'
import {
  PAGE_MM,
  type BookPageHitRegion,
  type BookPageReadRegion,
  type PredictionOptionIndex,
} from '../ramp/bookPageRenderer'

export interface LensBookPageRenderState {
  result: ConvexLensResult
  prediction: PredictionOptionIndex
  flapOpen: boolean
}

const INK = '#1c2433'
const INK_MUTED = '#465063'
const RULE = '#b8ad97'
const ACCENT = '#9a3b2a'
const PEN_BLUE = '#24356e'
const STAMP_RED = '#b8412e'
const VIRT_VIOLET = '#6c35de'
const SHARP_GREEN = '#15803d'

const SERIF = '"Source Serif 4 Variable", "Source Serif 4", Georgia, serif'
const HAND = '"Caveat Variable", "Caveat", "Bradley Hand", cursive'

function preparePageCanvas(
  canvas: HTMLCanvasElement,
  pxPerMm: number
): CanvasRenderingContext2D | null {
  const targetW = Math.round(PAGE_MM.W * pxPerMm)
  const targetH = Math.round(PAGE_MM.D * pxPerMm)
  if (canvas.width === 0 || canvas.height === 0) {
    canvas.width = targetW
    canvas.height = targetH
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  ctx.save()
  ctx.setTransform(canvas.width / PAGE_MM.W, 0, 0, canvas.height / PAGE_MM.D, 0, 0)
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  return ctx
}

function setFont(
  ctx: CanvasRenderingContext2D,
  sizeMm: number,
  opts: {
    weight?: number
    italic?: boolean
    family?: string
    caps?: boolean
  } = {}
) {
  const { weight = 400, italic = false, family = SERIF, caps = false } = opts
  ctx.font = `${italic ? 'italic ' : ''}${weight} ${sizeMm}px ${family}`
  if ('fontVariantCaps' in ctx) {
    ;(ctx as CanvasRenderingContext2D & { fontVariantCaps: string }).fontVariantCaps = caps
      ? 'all-small-caps'
      : 'normal'
  }
}

function fillPaperGrain(ctx: CanvasRenderingContext2D, W: number, D: number, seed = 1) {
  const grad = ctx.createRadialGradient(
    W * 0.48,
    D * 0.42,
    10,
    W * 0.5,
    D * 0.5,
    Math.max(W, D) * 0.78
  )
  grad.addColorStop(0, '#faf4e6')
  grad.addColorStop(0.7, '#f4ecda')
  grad.addColorStop(1, '#eadfc8')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, D)

  let s = (seed * 9301 + 49297) % 233280
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  ctx.save()
  for (let i = 0; i < 400; i++) {
    const x = rand() * W
    const y = rand() * D
    const r = 0.14 + rand() * 0.25
    ctx.fillStyle =
      rand() > 0.5 ? 'rgba(110, 88, 56, 0.04)' : 'rgba(255, 250, 235, 0.06)'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

function drawRunningHeaderAndFolio(
  ctx: CanvasRenderingContext2D,
  isLeftPage: boolean,
  headerText: string,
  folioNumber: string
) {
  const W = PAGE_MM.W
  const D = PAGE_MM.D
  ctx.save()
  ctx.fillStyle = INK_MUTED
  setFont(ctx, 3.6, { caps: true, weight: 600 })
  if (isLeftPage) {
    ctx.textAlign = 'left'
    ctx.fillText(headerText, 14, 12)
  } else {
    ctx.textAlign = 'right'
    ctx.fillText(headerText, W - 14, 12)
  }

  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.28
  ctx.beginPath()
  ctx.moveTo(14, 14.5)
  ctx.lineTo(W - 14, 14.5)
  ctx.stroke()

  setFont(ctx, 4.2, { italic: true, weight: 600 })
  ctx.fillStyle = INK_MUTED
  ctx.textAlign = isLeftPage ? 'left' : 'right'
  ctx.fillText(folioNumber, isLeftPage ? 14 : W - 14, D - 8)
  ctx.restore()
}

function drawTickBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  yBaseline: number,
  checked: boolean,
  size = 4.6
) {
  ctx.save()
  const boxY = yBaseline - size + 0.8
  ctx.fillStyle = checked ? 'rgba(36, 53, 110, 0.12)' : 'rgba(255, 252, 244, 0.85)'
  ctx.strokeStyle = checked ? PEN_BLUE : INK
  ctx.lineWidth = 0.42
  ctx.fillRect(x, boxY, size, size)
  ctx.strokeRect(x, boxY, size, size)

  if (checked) {
    ctx.strokeStyle = PEN_BLUE
    ctx.lineWidth = 0.8
    ctx.beginPath()
    ctx.moveTo(x + 0.8, boxY + size * 0.55)
    ctx.lineTo(x + size * 0.42, boxY + size - 0.8)
    ctx.lineTo(x + size - 0.6, boxY + 0.7)
    ctx.stroke()
  }
  ctx.restore()
}

/**
 * Draws the Left Page (Page 6) of Lesson II: "How a convex lens forms an image."
 * Avoids dense miniature paragraphs: renders large editorial headers, the left half of the
 * spread-wide Optical Bench blueprint (Object & Virtual Image side), a clean visual Ray Key,
 * compact prediction tick pills, and the 3D Hinged Paper Flap summary.
 */
export function drawLensLeftBookPage(
  canvas: HTMLCanvasElement,
  state: LensBookPageRenderState,
  pxPerMm = 5
): { hits: BookPageHitRegion[]; reads: BookPageReadRegion[] } {
  const W = PAGE_MM.W
  const D = PAGE_MM.D
  const ctx = preparePageCanvas(canvas, pxPerMm)
  if (!ctx) return { hits: [], reads: [] }

  fillPaperGrain(ctx, W, D, 31)

  // Spine gutter shadow on right edge of left page
  const spineGrad = ctx.createLinearGradient(W - 22, 0, W, 0)
  spineGrad.addColorStop(0, 'rgba(28, 36, 51, 0)')
  spineGrad.addColorStop(0.7, 'rgba(28, 36, 51, 0.06)')
  spineGrad.addColorStop(1, 'rgba(28, 36, 51, 0.22)')
  ctx.fillStyle = spineGrad
  ctx.fillRect(W - 22, 0, 22, D)

  drawRunningHeaderAndFolio(
    ctx,
    true,
    'Lesson II · NCERT Class 10 Section 9.3.3–9.3.8',
    '6'
  )

  const hits: BookPageHitRegion[] = []
  const reads: BookPageReadRegion[] = []
  const { result } = state

  // 1. Editorial Title Banner (Large, readable typography — no miniature paragraphs)
  ctx.fillStyle = ACCENT
  setFont(ctx, 4.0, { caps: true, weight: 700 })
  ctx.fillText('Spherical Lenses · Optical Bench Spread', 14, 23)

  ctx.fillStyle = INK
  setFont(ctx, 8.2, { weight: 700 })
  ctx.fillText('How a convex lens forms an image.', 14, 33)

  // 2. Spread-Wide Optical Bench Blueprint — Left Half (Object Side u < 0, v = 40..140 mm)
  const stageU0 = 14
  const stageV0 = 40
  const stageW = W - 14
  const stageH = 100

  ctx.fillStyle = 'rgba(238, 229, 210, 0.65)'
  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.38
  ctx.fillRect(stageU0, stageV0, stageW, stageH)
  ctx.strokeRect(stageU0, stageV0, stageW, stageH)

  // Blueprint grid lines
  ctx.strokeStyle = 'rgba(36, 53, 110, 0.08)'
  ctx.lineWidth = 0.24
  for (let gx = stageU0 + 16; gx < stageU0 + stageW; gx += 16) {
    ctx.beginPath()
    ctx.moveTo(gx, stageV0)
    ctx.lineTo(gx, stageV0 + stageH)
    ctx.stroke()
  }
  for (let gy = stageV0 + 16; gy < stageV0 + stageH; gy += 16) {
    ctx.beginPath()
    ctx.moveTo(stageU0, gy)
    ctx.lineTo(stageU0 + stageW, gy)
    ctx.stroke()
  }

  // Principal axis across the left page (continues across spine to right page at v = 90 mm)
  const axisV = 90
  ctx.strokeStyle = PEN_BLUE
  ctx.lineWidth = 0.55
  ctx.setLineDash([2.5, 1.8])
  ctx.beginPath()
  ctx.moveTo(stageU0 + 4, axisV)
  ctx.lineTo(W, axisV)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = PEN_BLUE
  setFont(ctx, 4.2, { caps: true, weight: 700 })
  ctx.fillText('Object Side (u < 0 · Incident Light ➔)', stageU0 + 6, stageV0 + 8.5)

  // Signed scale markers on left page matching 3D bench (BENCH_CENTER_X_MM = 25 on right page, MM_PER_CM = 1.9)
  // Left page u coordinate (0..190) corresponds to world x = u - 190.
  // Distance from lens (at world x = +25) is dxMm = (u - 190) - 25 = u - 215.
  // So a point at -d cm sits at left-page u = 215 - d * 1.9.
  const toLeftPageU = (negCm: number) => 215 - Math.abs(negCm) * 1.9
  const f1U = toLeftPageU(result.fCm)
  const twoF1U = toLeftPageU(2 * result.fCm)

  const drawAxisMarker = (uPos: number, label: string, subLabel: string, color: string) => {
    if (uPos < stageU0 + 8 || uPos > W - 6) return
    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 0.55
    ctx.beginPath()
    ctx.moveTo(uPos, axisV - 5)
    ctx.lineTo(uPos, axisV + 5)
    ctx.stroke()
    ctx.textAlign = 'center'
    setFont(ctx, 4.6, { weight: 700 })
    ctx.fillText(label, uPos, axisV + 12)
    setFont(ctx, 3.6, { weight: 600 })
    ctx.fillText(subLabel, uPos, axisV + 17.5)
    ctx.restore()
  }

  drawAxisMarker(twoF1U, '2F₁', `−${formatLensNumber(2 * result.fCm)} cm`, ACCENT)
  drawAxisMarker(f1U, 'F₁', `−${formatLensNumber(result.fCm)} cm`, ACCENT)

  // Live Object & Virtual Image badge inside blueprint stage
  ctx.fillStyle = INK
  setFont(ctx, 5.2, { family: HAND, weight: 700 })
  ctx.fillText(
    `Candle u = ${formatSignedCm(result.uCm)}   •   Lens f = +${formatLensNumber(result.fCm)} cm (P = +${formatLensNumber(result.opticalPowerDioptre, 1)} D)`,
    stageU0 + 6,
    stageV0 + stageH - 7
  )

  // 3. Clean Visual Principal Ray Key + Worked Math Pill (v = 146..179 mm)
  const rayBoxY = 145
  ctx.fillStyle = 'rgba(252, 248, 239, 0.9)'
  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.35
  ctx.fillRect(14, rayBoxY, W - 28, 33)
  ctx.strokeRect(14, rayBoxY, W - 28, 33)

  ctx.fillStyle = '#b85b14'
  setFont(ctx, 4.1, { weight: 700 })
  ctx.fillText('━ Ray 1 (Amber): Parallel ➔ F₂', 18, rayBoxY + 8)

  ctx.fillStyle = '#1e4fa3'
  ctx.fillText('━ Ray 2 (Blue): Optical Centre O', 98, rayBoxY + 8)

  ctx.fillStyle = '#15803d'
  ctx.fillText('╌ Ray 3 (Green): F₁ ➔ Parallel', 18, rayBoxY + 16)

  ctx.fillStyle = VIRT_VIOLET
  ctx.fillText('┈ Dashed Violet: Virtual Traceback', 98, rayBoxY + 16)

  // Clickable pill to open secondary Study & Practice view
  ctx.fillStyle = PEN_BLUE
  ctx.fillRect(18, rayBoxY + 20.5, 86, 9.5)
  ctx.fillStyle = '#ffffff'
  setFont(ctx, 3.8, { weight: 700 })
  ctx.fillText('Open Math, Table 9.4 & Practice ➔', 22, rayBoxY + 26.6)
  hits.push({
    id: 'open:worked-math',
    u0: 18,
    v0: rayBoxY + 20,
    u1: 104,
    v1: rayBoxY + 31,
    label: 'Open step-by-step worked thin-lens calculation and practice',
  })

  // Compact on-page prediction tick boxes (A / B / C)
  const predOpts: Array<{ idx: 0 | 1 | 2; label: string }> = [
    { idx: 0, label: 'A: Converge' },
    { idx: 1, label: 'B: Diverge' },
    { idx: 2, label: 'C: Blocked' },
  ]
  let px = 109
  for (const item of predOpts) {
    const checked = state.prediction === item.idx
    drawTickBox(ctx, px, rayBoxY + 26.5, checked, 4.2)
    ctx.fillStyle = checked ? PEN_BLUE : INK
    setFont(ctx, 3.4, { weight: checked ? 700 : 600 })
    ctx.fillText(item.label, px + 5.2, rayBoxY + 26.5)
    hits.push({
      id: `predict:${item.idx}`,
      u0: px - 1,
      v0: rayBoxY + 20,
      u1: px + 22,
      v1: rayBoxY + 31,
      label: `Predict ${item.label}`,
    })
    px += 22.5
  }

  // 4. Lower Left Margin: Return to Contents Button (u = 14..49, v = 188..232)
  ctx.fillStyle = 'rgba(238, 228, 207, 0.92)'
  ctx.strokeStyle = PEN_BLUE
  ctx.lineWidth = 0.45
  ctx.fillRect(14, 188, 35, 22)
  ctx.strokeRect(14, 188, 35, 22)
  ctx.fillStyle = PEN_BLUE
  setFont(ctx, 4.0, { weight: 700 })
  ctx.fillText('‹ Book', 18, 197.5)
  ctx.fillText('  Contents', 18, 204)
  hits.push({
    id: 'open:contents',
    u0: 13,
    v0: 187,
    u1: 50,
    v1: 211,
    label: 'Return to Book Table of Contents',
  })

  // 5. Revealable Summary Underneath 3D Hinged Paper Flap (u = 54..176, v = 185..235)
  const flapRect = {
    u0: 54,
    v0: 185,
    u1: 176,
    v1: 235,
  }

  ctx.fillStyle = '#fcf8ef'
  ctx.fillRect(flapRect.u0, flapRect.v0, flapRect.u1 - flapRect.u0, flapRect.v1 - flapRect.v0)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 0.45
  ctx.strokeRect(flapRect.u0, flapRect.v0, flapRect.u1 - flapRect.u0, flapRect.v1 - flapRect.v0)

  const headingText = result.canCatchOnScreen
    ? 'REAL IMAGE (|u| > f · Rays Converge)'
    : result.isAtFocus
      ? 'AT FOCUS F₁ (|u| = f · Parallel Rays)'
      : 'VIRTUAL IMAGE (|u| < f · Rays Diverge)'

  ctx.fillStyle = result.canCatchOnScreen
    ? SHARP_GREEN
    : result.isAtFocus
      ? ACCENT
      : VIRT_VIOLET
  setFont(ctx, 4.4, { caps: true, weight: 700 })
  ctx.fillText(headingText, flapRect.u0 + 5, flapRect.v0 + 11)

  ctx.fillStyle = INK
  setFont(ctx, 4.8, { weight: 700 })
  ctx.fillText(
    result.isAtFocus
      ? `u = ${formatSignedCm(result.uCm)}   ➔   v = ±∞ (Image at Infinity)`
      : `u = ${formatSignedCm(result.uCm)}   ➔   v = ${formatSignedCm(result.vCm ?? 0)}   (m = ${formatLensNumber(result.magnification ?? 0, 2)}×)`,
    flapRect.u0 + 5,
    flapRect.v0 + 23
  )

  ctx.fillStyle = PEN_BLUE
  setFont(ctx, 5.2, { family: HAND, weight: 700 })
  ctx.fillText(
    result.canCatchOnScreen
      ? result.isSharpOnScreen
        ? `✓ Caught sharp inverted image on screen at +${formatLensNumber(result.screenDistanceCm)} cm!`
        : `➔ Move screen to +${formatLensNumber(result.vCm ?? 0)} cm to catch sharp image`
      : result.isAtFocus
        ? 'Refracted rays emerge parallel — no finite screen focus'
        : 'Cannot catch on screen — look through lens for upright image',
    flapRect.u0 + 5,
    flapRect.v0 + 36
  )

  hits.push({
    id: 'flap',
    ...flapRect,
    label: state.flapOpen ? 'Lower the Explanation flap' : 'Lift the Explanation flap',
  })

  ctx.restore()
  return { hits, reads }
}

/**
 * Draws the Right Page (Page 7) of Lesson II: "How a convex lens forms an image."
 * Enlarges the Optical Bench blueprint across the right page and provides large,
 * high-contrast interactive position preset pills and screen-snap target without
 * miniature table paragraphs.
 */
export function drawLensRightBookPage(
  canvas: HTMLCanvasElement,
  state: LensBookPageRenderState,
  pxPerMm = 5
): { hits: BookPageHitRegion[]; reads: BookPageReadRegion[] } {
  const W = PAGE_MM.W
  const D = PAGE_MM.D
  const ctx = preparePageCanvas(canvas, pxPerMm)
  if (!ctx) return { hits: [], reads: [] }

  fillPaperGrain(ctx, W, D, 43)

  // Left spine gutter shadow on right page
  const spineGrad = ctx.createLinearGradient(0, 0, 22, 0)
  spineGrad.addColorStop(0, 'rgba(28, 36, 51, 0.22)')
  spineGrad.addColorStop(0.3, 'rgba(28, 36, 51, 0.06)')
  spineGrad.addColorStop(1, 'rgba(28, 36, 51, 0)')
  ctx.fillStyle = spineGrad
  ctx.fillRect(0, 0, 22, D)

  drawRunningHeaderAndFolio(
    ctx,
    false,
    '3D Optical Bench · Drag Candle, Screen or Click Presets',
    '7'
  )

  const hits: BookPageHitRegion[] = []
  const reads: BookPageReadRegion[] = []
  const { result } = state

  // 1. Enlarged Optical Bench Blueprint — Right Half (Lens O & Image/Screen Side, v = 40..140 mm)
  const stageU0 = 0
  const stageV0 = 40
  const stageW = W - 14
  const stageH = 100

  ctx.fillStyle = 'rgba(238, 229, 210, 0.65)'
  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.38
  ctx.fillRect(stageU0, stageV0, stageW, stageH)
  ctx.strokeRect(stageU0, stageV0, stageW, stageH)

  ctx.strokeStyle = 'rgba(36, 53, 110, 0.08)'
  ctx.lineWidth = 0.24
  for (let gx = stageU0 + 16; gx < stageU0 + stageW; gx += 16) {
    ctx.beginPath()
    ctx.moveTo(gx, stageV0)
    ctx.lineTo(gx, stageV0 + stageH)
    ctx.stroke()
  }
  for (let gy = stageV0 + 16; gy < stageV0 + stageH; gy += 16) {
    ctx.beginPath()
    ctx.moveTo(stageU0, gy)
    ctx.lineTo(stageU0 + stageW, gy)
    ctx.stroke()
  }

  // Principal axis line (continuous with left page at v = 90 mm)
  const axisV = 90
  ctx.strokeStyle = PEN_BLUE
  ctx.lineWidth = 0.55
  ctx.setLineDash([2.5, 1.8])
  ctx.beginPath()
  ctx.moveTo(0, axisV)
  ctx.lineTo(stageW - 4, axisV)
  ctx.stroke()
  ctx.setLineDash([])

  // Lens Principal Plane at u = 25 mm on the right page (matching BENCH_CENTER_X_MM = 25)
  const lensU = 25
  ctx.strokeStyle = PEN_BLUE
  ctx.lineWidth = 0.65
  ctx.beginPath()
  ctx.moveTo(lensU, stageV0 + 8)
  ctx.lineTo(lensU, stageV0 + stageH - 12)
  ctx.stroke()

  ctx.fillStyle = PEN_BLUE
  setFont(ctx, 4.2, { caps: true, weight: 700 })
  ctx.fillText('Image & Screen Side (v > 0)', lensU + 8, stageV0 + 8.5)

  const toRightPageU = (posCm: number) => lensU + posCm * 1.9
  const f2U = toRightPageU(result.fCm)
  const twoF2U = toRightPageU(2 * result.fCm)

  const drawRightMarker = (uPos: number, label: string, subLabel: string, color: string) => {
    if (uPos < 6 || uPos > stageW - 8) return
    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 0.55
    ctx.beginPath()
    ctx.moveTo(uPos, axisV - 5)
    ctx.lineTo(uPos, axisV + 5)
    ctx.stroke()
    ctx.textAlign = 'center'
    setFont(ctx, 4.6, { weight: 700 })
    ctx.fillText(label, uPos, axisV + 12)
    setFont(ctx, 3.6, { weight: 600 })
    ctx.fillText(subLabel, uPos, axisV + 17.5)
    ctx.restore()
  }

  drawRightMarker(lensU, 'O', '0 cm', PEN_BLUE)
  drawRightMarker(f2U, 'F₂', `+${formatLensNumber(result.fCm)} cm`, ACCENT)
  drawRightMarker(twoF2U, '2F₂', `+${formatLensNumber(2 * result.fCm)} cm`, ACCENT)

  // Screen Focus Status + Large "Snap Screen" button inside stage
  const statusColor = result.isSharpOnScreen
    ? SHARP_GREEN
    : result.canCatchOnScreen
      ? STAMP_RED
      : VIRT_VIOLET
  ctx.fillStyle = statusColor
  setFont(ctx, 5.2, { family: HAND, weight: 700 })
  ctx.fillText(
    result.isSharpOnScreen
      ? `✓ Sharp real image caught at +${formatLensNumber(result.screenDistanceCm)} cm`
      : result.canCatchOnScreen
        ? `Screen at +${formatLensNumber(result.screenDistanceCm)} cm (Blurred — sharp image at +${formatLensNumber(result.vCm ?? 0)} cm)`
        : result.isAtFocus
          ? 'Rays parallel (Image at ∞ — cannot catch on finite screen)'
          : `Virtual image at ${formatSignedCm(result.vCm ?? 0)} (Rays diverge — blank screen)`,
    12,
    stageV0 + stageH - 7
  )

  if (result.canCatchOnScreen && !result.isSharpOnScreen) {
    const snapX = stageW - 58
    const snapY = stageV0 + 5
    ctx.fillStyle = SHARP_GREEN
    ctx.fillRect(snapX, snapY, 54, 11)
    ctx.fillStyle = '#ffffff'
    setFont(ctx, 3.8, { weight: 700 })
    ctx.fillText(`Snap Screen to +${formatLensNumber(result.vCm ?? 0)} cm`, snapX + 3, snapY + 7.2)
    hits.push({
      id: 'snap:screen',
      u0: snapX,
      v0: snapY,
      u1: snapX + 54,
      v1: snapY + 11,
      label: `Snap screen to sharp image at +${formatLensNumber(result.vCm ?? 0)} cm`,
    })
  }

  // 2. Large Active Regime Readout Card (v = 148..184 mm)
  const cardY = 148
  ctx.fillStyle = 'rgba(252, 248, 239, 0.92)'
  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.4
  ctx.fillRect(14, cardY, W - 28, 34)
  ctx.strokeRect(14, cardY, W - 28, 34)

  ctx.fillStyle = ACCENT
  setFont(ctx, 3.8, { caps: true, weight: 700 })
  ctx.fillText(`Active Optical Regime · ${result.objectPositionLabel}`, 19, cardY + 9)

  ctx.fillStyle = INK
  setFont(ctx, 5.0, { weight: 700 })
  ctx.fillText(
    result.canCatchOnScreen
      ? `Real & Inverted  •  v = ${formatSignedCm(result.vCm ?? 0)}  •  h' = ${formatSignedCm(result.imageHeightCm ?? 0)}`
      : result.isAtFocus
        ? 'Parallel Refracted Beam  •  Image at Infinity (±∞)'
        : `Virtual & Erect  •  v = ${formatSignedCm(result.vCm ?? 0)}  •  h' = ${formatSignedCm(result.imageHeightCm ?? 0)}`,
    19,
    cardY + 19.5
  )

  ctx.fillStyle = INK_MUTED
  setFont(ctx, 4.0, { italic: true, weight: 600 })
  ctx.fillText(
    result.canCatchOnScreen
      ? 'Can be caught on a paper screen placed at x = v.'
      : 'Cannot be caught on a screen — view by looking back through the lens.',
    19,
    cardY + 28.5
  )

  // 3. Five Large Interactive Object Position Preset Buttons on Page (v = 192..228 mm)
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.8, { caps: true, weight: 700 })
  ctx.fillText('Quick Object Positions (Click on Page or Use Lower Controls)', 14, 195)

  const presets: Array<{ factor: string; id: string; label: string; sub: string }> = [
    { factor: '2.5', id: 'beyond_2f', label: 'Beyond 2F₁', sub: '2.5f' },
    { factor: '2', id: 'at_2f', label: 'At 2F₁', sub: '2.0f' },
    { factor: '1.5', id: 'between_f_and_2f', label: 'F₁..2F₁', sub: '1.5f' },
    { factor: '1', id: 'at_f', label: 'At F₁', sub: '1.0f' },
    { factor: '0.6', id: 'within_f', label: 'Inside F₁', sub: '0.6f' },
  ]

  let bx = 14
  const bw = 31.2
  const bh = 20
  const by = 200
  for (const p of presets) {
    const active = result.regime === p.id
    ctx.fillStyle = active ? PEN_BLUE : '#f5ebd6'
    ctx.strokeStyle = active ? PEN_BLUE : INK
    ctx.lineWidth = 0.45
    ctx.fillRect(bx, by, bw, bh)
    ctx.strokeRect(bx, by, bw, bh)

    ctx.fillStyle = active ? '#ffffff' : INK
    setFont(ctx, 3.7, { weight: 700 })
    ctx.fillText(p.label, bx + 2.2, by + 8.5)

    ctx.fillStyle = active ? '#dbeafe' : ACCENT
    setFont(ctx, 3.4, { weight: 600 })
    ctx.fillText(`|u| = ${p.sub}`, bx + 2.2, by + 15.5)

    hits.push({
      id: `preset:${p.factor}`,
      u0: bx,
      v0: by,
      u1: bx + bw,
      v1: by + bh,
      label: `Move object to ${p.label} (|u| = ${p.sub})`,
    })
    bx += bw + 1.5
  }

  ctx.restore()
  return { hits, reads }
}
