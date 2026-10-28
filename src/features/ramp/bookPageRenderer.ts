import type { RampModelResult } from './rampModel'
import { formatDisplayNumber } from './rampInputValidation'

export type PredictionOptionIndex = 0 | 1 | 2 | null
export type ApplyAnswerIndex = 0 | 1 | null

export interface BookPageHitRegion {
  id: string
  u0: number
  v0: number
  u1: number
  v1: number
  label: string
}

export interface BookPageReadRegion {
  id: string
  u0: number
  v0: number
  u1: number
  v1: number
  kicker: string
  title: string
  lines: string[]
}

export interface BookPageRenderState {
  result: RampModelResult
  prediction: PredictionOptionIndex
  flapOpen: boolean
  applyAnswer: ApplyAnswerIndex
  stampEarned: boolean
  demoProgress: number
  demoStatus: 'idle' | 'playing' | 'paused' | 'completed'
}

export const PAGE_MM = {
  W: 190,
  D: 250,
} as const

// Exact Every Joule ink & paper palette
const INK = '#1c2433'
const INK_MUTED = '#465063'
const RULE = '#b8ad97'
const ACCENT = '#9a3b2a'
const PEN_BLUE = '#24356e'
const STAMP_RED = '#b8412e'
const STORE_VIOLET = '#6c35de'

const SERIF = '"Source Serif 4 Variable", "Source Serif 4", Georgia, serif'
const HAND = '"Caveat Variable", "Caveat", "Bradley Hand", cursive'

export function getPageArchHeightMm(uFromSpineMm: number): number {
  const s = Math.max(0, Math.min(1, uFromSpineMm / PAGE_MM.W))
  return 17.5 * Math.sin(Math.PI * Math.pow(s, 0.72)) * (1 - 0.52 * s)
}

export function getPageArchSlopeRad(uFromSpineMm: number): number {
  const eps = 0.5
  const y0 = getPageArchHeightMm(Math.max(0, uFromSpineMm - eps))
  const y1 = getPageArchHeightMm(Math.min(PAGE_MM.W, uFromSpineMm + eps))
  return Math.atan2(y1 - y0, 2 * eps)
}

function preparePageCanvas(
  canvas: HTMLCanvasElement,
  pxPerMm: number
): CanvasRenderingContext2D | null {
  const targetW = Math.round(PAGE_MM.W * pxPerMm)
  const targetH = Math.round(PAGE_MM.D * pxPerMm)
  // Only set width/height if uninitialized so we never invalidate an active WebGL CanvasTexture!
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

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = String(text).split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const w of words) {
    const candidate = current ? `${current} ${w}` : w
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current)
      current = w
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

function fillWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = wrapLines(ctx, text, maxWidth)
  lines.forEach((line, idx) => {
    ctx.fillText(line, x, y + idx * lineHeight)
  })
  return y + lines.length * lineHeight
}

function fillPaperGrain(ctx: CanvasRenderingContext2D, w: number, h: number, seed = 17) {
  ctx.fillStyle = '#f6efe0'
  ctx.fillRect(0, 0, w, h)

  let s = seed
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }

  for (let i = 0; i < 420; i++) {
    ctx.fillStyle = rand() < 0.5 ? 'rgba(140, 110, 70, 0.032)' : 'rgba(255, 255, 255, 0.055)'
    ctx.beginPath()
    ctx.arc(rand() * w, rand() * h, 0.35 + rand() * 2.1, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawRunningHeaderAndFolio(
  ctx: CanvasRenderingContext2D,
  isLeft: boolean,
  headerText: string,
  folio: string
) {
  const W = PAGE_MM.W
  ctx.fillStyle = INK_MUTED
  setFont(ctx, 3.2, { caps: true, weight: 600 })
  ctx.textAlign = isLeft ? 'left' : 'right'
  ctx.fillText(headerText, isLeft ? 12 : W - 14, 10.5)

  ctx.textAlign = isLeft ? 'left' : 'right'
  setFont(ctx, 3.5, { weight: 600 })
  ctx.fillText(folio, isLeft ? 12 : W - 14, 243.5)

  ctx.textAlign = 'left'
  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.28
  ctx.beginPath()
  ctx.moveTo(isLeft ? 12 : 16, 13.0)
  ctx.lineTo(isLeft ? W - 14 : W - 14, 13.0)
  ctx.stroke()
}

function drawTickBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  checked: boolean,
  size = 4.2
) {
  ctx.strokeStyle = INK
  ctx.lineWidth = 0.36
  ctx.strokeRect(x, y - size + 0.7, size, size)

  if (checked) {
    ctx.save()
    ctx.strokeStyle = PEN_BLUE
    ctx.lineWidth = 0.85
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(x + 0.6, y - size * 0.45)
    ctx.quadraticCurveTo(x + 1.6, y - 0.3, x + 2.0, y + 0.1)
    ctx.quadraticCurveTo(x + 3.4, y - size * 0.85, x + size + 1.2, y - size - 1.0)
    ctx.stroke()
    ctx.restore()
  }
}

function drawInkStamp(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  earned: boolean
) {
  ctx.save()
  ctx.translate(cx, cy)

  if (!earned) {
    ctx.setLineDash([0.9, 1.1])
    ctx.strokeStyle = RULE
    ctx.lineWidth = 0.35
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = INK_MUTED
    setFont(ctx, 2.6, { caps: true, weight: 600 })
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('STAMP', 0, -1.2)
    setFont(ctx, 2.2, { italic: true })
    ctx.fillText('pending', 0, 2.2)
    ctx.restore()
    return
  }

  ctx.rotate(-0.14)
  ctx.strokeStyle = STAMP_RED
  ctx.fillStyle = STAMP_RED
  ctx.globalAlpha = 0.9
  ctx.lineWidth = radius * 0.09
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.stroke()

  ctx.lineWidth = radius * 0.04
  ctx.beginPath()
  ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2)
  ctx.stroke()

  setFont(ctx, radius * 0.54, { weight: 700 })
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('01', 0, -radius * 0.08)

  setFont(ctx, radius * 0.19, { weight: 700, caps: true })
  ctx.fillText('COMPLETED', 0, radius * 0.45)

  ctx.restore()
}

/**
 * Draws the Free-Body Force & Slope Geometry Diagram on the Left Page
 * so the student understands WHY F_pull = mg sin(θ) = mg (h / L).
 */
function drawFreeBodyMiniDiagram(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  w: number,
  h: number,
  result: RampModelResult
) {
  ctx.save()
  ctx.fillStyle = 'rgba(238, 228, 207, 0.62)'
  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.32
  ctx.fillRect(x0, y0, w, h)
  ctx.strokeRect(x0, y0, w, h)

  // Diagram title
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.15, { caps: true, weight: 700 })
  ctx.fillText('How a Ramp Splits Gravity · Free-Body Diagram', x0 + 3.5, y0 + 5.0)

  // Left half of box: 2D inclined plane + crate + 3 force vectors (mg, N, F_pull)
  const triFootX = x0 + 44
  const triApexX = x0 + 9
  const triBaseY = y0 + h - 5.5
  const triApexY = y0 + 13.5

  ctx.fillStyle = 'rgba(216, 161, 93, 0.18)'
  ctx.strokeStyle = INK
  ctx.lineWidth = 0.42
  ctx.beginPath()
  ctx.moveTo(triApexX, triBaseY)
  ctx.lineTo(triFootX, triBaseY)
  ctx.lineTo(triApexX, triApexY)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // Height h label on left vertical side
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.1, { weight: 600 })
  ctx.fillText(`h=${formatDisplayNumber(result.heightM, 1)}m`, x0 + 1.8, (triBaseY + triApexY) * 0.5 + 1)

  // Crate on the slope
  const slopeAng = Math.atan2(triBaseY - triApexY, triFootX - triApexX)
  const cx = (triApexX + triFootX) * 0.52
  const cy = (triApexY + triBaseY) * 0.52
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(-slopeAng)
  ctx.fillStyle = '#d8a15d'
  ctx.strokeStyle = INK
  ctx.lineWidth = 0.38
  ctx.fillRect(-4.2, -6.4, 8.4, 6.4)
  ctx.strokeRect(-4.2, -6.4, 8.4, 6.4)

  // Uphill F_pull arrow (blue)
  ctx.strokeStyle = PEN_BLUE
  ctx.fillStyle = PEN_BLUE
  ctx.lineWidth = 0.65
  ctx.beginPath()
  ctx.moveTo(-4.2, -3.2)
  ctx.lineTo(-14.5, -3.2)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-15.5, -3.2)
  ctx.lineTo(-13.2, -4.4)
  ctx.lineTo(-13.2, -2.0)
  ctx.closePath()
  ctx.fill()
  setFont(ctx, 3.0, { weight: 700 })
  ctx.fillText('F_pull', -16.5, -5.2)

  // Normal force N arrow (greenish-ink perpendicular to ramp)
  ctx.strokeStyle = '#2d5a43'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(0, -6.4)
  ctx.lineTo(0, -13.5)
  ctx.stroke()
  setFont(ctx, 2.7, { weight: 600 })
  ctx.fillStyle = '#2d5a43'
  ctx.fillText('N (ramp supports)', 1.5, -11.2)
  ctx.restore()

  // Straight-down Weight mg arrow (red)
  ctx.strokeStyle = STAMP_RED
  ctx.fillStyle = STAMP_RED
  ctx.lineWidth = 0.55
  ctx.beginPath()
  ctx.moveTo(cx, cy - 2)
  ctx.lineTo(cx, cy + 8.5)
  ctx.stroke()
  setFont(ctx, 2.8, { weight: 700 })
  ctx.fillText(`mg=${formatDisplayNumber(result.weightN, 1)}N`, cx + 1.4, cy + 8.2)

  // Right half of box: Step-by-step live substitution in fountain-pen blue
  const eqX = x0 + 50
  ctx.fillStyle = INK
  setFont(ctx, 3.25, { weight: 600 })
  ctx.fillText('1. Slope reduces effort force:', eqX, y0 + 10.5)

  ctx.fillStyle = PEN_BLUE
  setFont(ctx, 4.4, { family: HAND, weight: 700 })
  ctx.fillText(
    `F_pull = mg × (h / L) = ${formatDisplayNumber(result.weightN, 1)} × (${formatDisplayNumber(
      result.heightM,
      1
    )} / ${formatDisplayNumber(result.rampLengthM, 1)}) = ${formatDisplayNumber(result.pullingForceN, 2)} N`,
    eqX,
    y0 + 16.0
  )

  ctx.fillStyle = INK
  setFont(ctx, 3.25, { weight: 600 })
  ctx.fillText('2. Longer distance keeps Work = mgh:', eqX, y0 + 22.0)

  ctx.fillStyle = STORE_VIOLET
  setFont(ctx, 4.4, { family: HAND, weight: 700 })
  ctx.fillText(
    `W = F_pull × L = ${formatDisplayNumber(result.pullingForceN, 2)} N × ${formatDisplayNumber(
      result.rampLengthM,
      1
    )} m = ${formatDisplayNumber(result.appliedWorkJ, 1)} J`,
    eqX,
    y0 + 27.5
  )

  ctx.fillStyle = INK_MUTED
  setFont(ctx, 2.95, { italic: true })
  ctx.fillText(
    `Ideal Mechanical Advantage (IMA = L/h) = ${formatDisplayNumber(result.idealMechanicalAdvantage, 2)}× easier`,
    eqX,
    y0 + 32.8
  )

  ctx.restore()
}

export function drawLeftBookPage(
  canvas: HTMLCanvasElement,
  state: BookPageRenderState,
  pxPerMm = 5
): { hits: BookPageHitRegion[]; reads: BookPageReadRegion[] } {
  const W = PAGE_MM.W
  const D = PAGE_MM.D
  const ctx = preparePageCanvas(canvas, pxPerMm)
  if (!ctx) return { hits: [], reads: [] }

  fillPaperGrain(ctx, W, D, 23)

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
    'CBSE Class 9–11 Physics · Work, Energy & Simple Machines',
    '4'
  )

  const hits: BookPageHitRegion[] = []
  const reads: BookPageReadRegion[] = []
  const { result, demoProgress, demoStatus } = state

  const marginX = 11
  const marginW = 39
  const textX = 55
  const textW = 121

  // Vertical margin rule
  ctx.strokeStyle = 'rgba(184, 173, 151, 0.65)'
  ctx.lineWidth = 0.28
  ctx.beginPath()
  ctx.moveTo(51.5, 16)
  ctx.lineTo(51.5, 238)
  ctx.stroke()

  // 1. Lesson Kicker, Editorial Title & Real-World Question
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.3, { caps: true, weight: 700 })
  ctx.fillText('Lesson 1 · Inclined Plane vs. Direct Lift', textX, 21.5)

  ctx.fillStyle = INK
  setFont(ctx, 8.2, { weight: 700 })
  ctx.fillText('Less force. More distance.', textX, 30.5)
  ctx.fillText('Same energy.', textX, 39.0)

  ctx.fillStyle = INK
  setFont(ctx, 3.85, { weight: 400 })
  let y = 45.5
  y = fillWrappedText(
    ctx,
    `To raise a ${formatDisplayNumber(result.massKg, 0)} kg crate onto a ${formatDisplayNumber(
      result.heightM,
      1
    )} m shelf, lifting straight up (Rig A on the right page) requires its full weight (${formatDisplayNumber(
      result.verticalLiftForceN,
      1
    )} N). Sliding it up the ${formatDisplayNumber(
      result.rampLengthM,
      1
    )} m frictionless ramp (Rig B) requires only ${formatDisplayNumber(
      result.pullingForceN,
      2
    )} N—${formatDisplayNumber(
      result.idealMechanicalAdvantage,
      1
    )}× less force! Where is the trade-off?`,
    textX,
    y,
    textW,
    4.75
  )

  reads.push({
    id: 'head',
    u0: textX - 2,
    v0: 16,
    u1: textX + textW,
    v1: y,
    kicker: 'Lesson 1 · Core Concept',
    title: 'Why Does a Ramp Make Lifting Easier?',
    lines: [
      `Direct Vertical Lift (Rig A): Pulls straight up ${formatDisplayNumber(result.heightM, 1)} m with full weight F = mg = ${formatDisplayNumber(result.verticalLiftForceN, 1)} N.`,
      `Frictionless Ramp (Rig B): Pulls along a ${formatDisplayNumber(result.rampLengthM, 1)} m slope with F_pull = ${formatDisplayNumber(result.pullingForceN, 2)} N (${formatDisplayNumber(result.idealMechanicalAdvantage, 2)}× easier).`,
      `Both paths transfer the exact same ${formatDisplayNumber(result.appliedWorkJ, 1)} J into the violet Gravitational Potential Energy Store jars!`,
    ],
  })

  // 2. Printed Free-Body Force & Geometry Breakdown Box (v = 70..106)
  y += 2.2
  const fbdTop = y
  const fbdH = 35.5
  drawFreeBodyMiniDiagram(ctx, textX - 1, fbdTop, textW + 2, fbdH, result)

  reads.push({
    id: 'equation',
    u0: textX - 2,
    v0: fbdTop,
    u1: textX + textW + 2,
    v1: fbdTop + fbdH,
    kicker: 'Free-Body Diagram & Equations',
    title: 'How the Ramp Splits Gravity (F_pull = mg sin θ)',
    lines: [
      `1. The ramp surface supports the perpendicular component of weight (N = mg cos θ).`,
      `2. You only pull against the slope component: F_pull = mg sin θ = mg × (h / L) = ${formatDisplayNumber(result.pullingForceN, 2)} N.`,
      `3. Because you pull over distance L = ${formatDisplayNumber(result.rampLengthM, 1)} m, Work = F_pull × L = ${formatDisplayNumber(result.appliedWorkJ, 1)} J = mgh.`,
    ],
  })

  y = fbdTop + fbdH + 5.5

  // 3. Key Definitions for CBSE Exams
  const kwTop = y - 3.5
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.2, { caps: true, weight: 700 })
  ctx.fillText('Key Exam Concepts', textX, y)
  y += 4.6

  const keywords = [
    [
      'Ideal Mechanical Advantage (IMA = L / h)',
      `Factor by which effort force drops (${formatDisplayNumber(result.rampLengthM, 1)} m ÷ ${formatDisplayNumber(result.heightM, 1)} m = ${formatDisplayNumber(result.idealMechanicalAdvantage, 2)}×).`,
    ],
    [
      'Conservation of Energy (W_ramp = W_lift)',
      `A ramp reduces force, never work. Both violet jars receive mgh = ${formatDisplayNumber(result.potentialEnergyGainJ, 1)} J.`,
    ],
  ] as const

  for (const [term, def] of keywords) {
    ctx.fillStyle = INK
    setFont(ctx, 3.55, { weight: 700 })
    ctx.fillText(`• ${term}: `, textX, y)
    y += 4.2
    ctx.fillStyle = INK_MUTED
    setFont(ctx, 3.45, { weight: 400 })
    y = fillWrappedText(ctx, def, textX + 3, y, textW - 3, 4.1) + 0.8
  }

  reads.push({
    id: 'keywords',
    u0: textX - 2,
    v0: kwTop,
    u1: textX + textW,
    v1: y,
    kicker: 'CBSE Exam Key Terms',
    title: 'Ideal Mechanical Advantage & Conservation of Work',
    lines: [
      `IMA = L / h = ${formatDisplayNumber(result.idealMechanicalAdvantage, 2)}×: Doubling ramp length L halves the required pulling force F_pull.`,
      `Work = Force × Displacement = ${formatDisplayNumber(result.appliedWorkJ, 2)} J: Equal to gravitational potential energy gain ΔEp = mgh.`,
    ],
  })

  y += 2.8

  // 4. STEP 1: PREDICT (Interactive fountain-pen tick boxes on the page)
  const predTop = y - 3.5
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.2, { caps: true, weight: 700 })
  ctx.fillText('Step 1 · Predict (Click a box on the page)', textX, y)
  y += 4.6

  ctx.fillStyle = INK
  setFont(ctx, 3.75, { weight: 600 })
  y =
    fillWrappedText(
      ctx,
      'If we stretch the ramp from 2 m to 4 m (keeping height = 1 m), what happens to the pulling force?',
      textX,
      y,
      textW,
      4.5
    ) + 1.4

  const predictOptions = [
    'Force increases (steeper pull)',
    'Force drops to half (24.53 N), distance doubles',
    'Force stays 49.05 N',
  ]
  predictOptions.forEach((opt, idx) => {
    const isChecked = state.prediction === idx
    drawTickBox(ctx, textX, y, isChecked, 3.9)
    ctx.fillStyle = isChecked ? PEN_BLUE : INK
    setFont(ctx, 3.65, { weight: isChecked ? 700 : 400 })
    ctx.fillText(opt, textX + 6.0, y)

    hits.push({
      id: `predict:${idx}`,
      u0: textX - 2,
      v0: y - 4.5,
      u1: textX + textW,
      v1: y + 1.8,
      label: `Predict: ${opt}`,
    })
    y += 5.6
  })

  reads.push({
    id: 'predict',
    u0: textX - 2,
    v0: predTop,
    u1: textX + textW,
    v1: y,
    kicker: 'Step 1 · Make Your Prediction',
    title: 'What happens when ramp length doubles from 2 m to 4 m?',
    lines: [
      'Click any tick-box directly on the page:',
      ...predictOptions.map((o, i) => (state.prediction === i ? `✓ ${o} (selected)` : `□ ${o}`)),
    ],
  })

  // 5. STEP 4: WHY? (Underneath the 3D Hinged Paper Flap: u = 54..176, v = 185..235)
  const flapRect = {
    u0: 54,
    v0: 185,
    u1: 176,
    v1: 235,
  }

  ctx.fillStyle = '#fcf8ef'
  ctx.fillRect(flapRect.u0, flapRect.v0, flapRect.u1 - flapRect.u0, flapRect.v1 - flapRect.v0)
  ctx.strokeStyle = ACCENT
  ctx.lineWidth = 0.38
  ctx.strokeRect(flapRect.u0, flapRect.v0, flapRect.u1 - flapRect.u0, flapRect.v1 - flapRect.v0)

  ctx.fillStyle = ACCENT
  setFont(ctx, 3.25, { caps: true, weight: 700 })
  ctx.fillText(
    'Golden Rule of Simple Machines · Why Both Jars Fill to 98.1 J',
    textX + 2,
    flapRect.v0 + 5.8
  )

  ctx.fillStyle = INK
  setFont(ctx, 3.55, { weight: 400 })
  let wy = flapRect.v0 + 11.0
  wy = fillWrappedText(
    ctx,
    '1. Force–Distance Trade-off: On the 2 m ramp, IMA = 2 m / 1 m = 2, so F_pull = 98.1 / 2 = 49.05 N. On the 4 m ramp, IMA = 4, so F_pull drops to 24.53 N (4× easier!).',
    textX + 2,
    wy,
    textW - 4,
    4.3
  )
  wy += 1.0
  fillWrappedText(
    ctx,
    '2. Energy Conservation: Work = Force × Distance = (mg · h/L) × L = mgh = 98.1 J. You never save energy; you spread the same 98.1 J over a longer path! (With friction, W_in > mgh.)',
    textX + 2,
    wy,
    textW - 4,
    4.3
  )

  hits.push({
    id: 'flap',
    ...flapRect,
    label: state.flapOpen ? 'Lower the Why? answer flap' : 'Lift the Why? answer flap',
  })

  reads.push({
    id: 'flap',
    ...flapRect,
    kicker: 'Step 4 · Deep Explanation (3D Paper Flap)',
    title: 'The Golden Rule of Simple Machines: W_ramp = W_lift = mgh',
    lines: [
      'Doubling ramp length L from 2 m to 4 m halves the pulling force (49.05 N → 24.53 N) while doubling the distance pulled (2 m → 4 m).',
      'Their product W = F_pull × L stays constant at 98.1 J—which is why both glowing violet Energy Store jars on the right page fill to the exact same level!',
    ],
  })

  // 6. LEFT MARGIN: Live Handwritten Notebook ("Live Lab Data")
  ctx.save()
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.15, { caps: true, weight: 700 })
  ctx.fillText('Live Lab Notebook', marginX, 21.5)

  ctx.fillStyle = INK_MUTED
  setFont(ctx, 2.95, { italic: true })
  fillWrappedText(
    ctx,
    'Updates live as you drag the 3D ramp or crate:',
    marginX,
    26.2,
    marginW,
    3.6
  )

  const workSoFarJ =
    demoStatus === 'idle' && demoProgress === 0
      ? result.appliedWorkJ
      : result.appliedWorkJ * demoProgress

  const marginNotes = [
    `Mass m = ${formatDisplayNumber(result.massKg, 1)} kg`,
    `Height h = ${formatDisplayNumber(result.heightM, 2)} m`,
    `Length L = ${formatDisplayNumber(result.rampLengthM, 2)} m`,
    `Angle θ = ${formatDisplayNumber(result.rampAngleDegrees, 1)}°`,
    `IMA = L/h = ${formatDisplayNumber(result.idealMechanicalAdvantage, 2)}×`,
    `F_lift = ${formatDisplayNumber(result.verticalLiftForceN, 1)} N`,
    `F_pull = ${formatDisplayNumber(result.pullingForceN, 2)} N`,
    `W_total = ${formatDisplayNumber(result.appliedWorkJ, 1)} J`,
    `Ep Jar = ${formatDisplayNumber(workSoFarJ, 1)} J`,
  ]

  let my = 41
  marginNotes.forEach((line, idx) => {
    ctx.save()
    ctx.translate(marginX, my)
    ctx.rotate((idx % 2 === 0 ? -1 : 0.7) * 0.01)
    setFont(ctx, 4.75, { family: HAND, weight: 700 })
    ctx.fillStyle = idx === 5 ? STAMP_RED : idx === 6 ? PEN_BLUE : idx >= 7 ? STORE_VIOLET : INK
    ctx.fillText(line, 0, 0)
    ctx.restore()
    my += 7.4
  })
  ctx.restore()

  reads.push({
    id: 'margin',
    u0: marginX - 2,
    v0: 18,
    u1: marginX + marginW + 2,
    v1: 112,
    kicker: 'Live Lab Notebook',
    title: 'Real-Time Physics Values',
    lines: marginNotes,
  })

  // 7. LEFT MARGIN BOTTOM: Step 5 Challenge & Red Completion Stamp
  drawInkStamp(ctx, marginX + marginW / 2, 132, 11.0, state.stampEarned)

  ctx.fillStyle = ACCENT
  setFont(ctx, 3.1, { caps: true, weight: 700 })
  ctx.fillText('Quick Check · Earn Stamp', marginX, 151)

  ctx.fillStyle = INK
  setFont(ctx, 3.3, { weight: 500 })
  let cy = fillWrappedText(
    ctx,
    'Does a 4 m frictionless ramp use less energy (Joules) than lifting straight up 1 m?',
    marginX,
    156,
    marginW,
    4.0
  )
  cy += 2.2

  const applyOpts = ['Yes, half the Joules', 'No, same 98.1 J']
  applyOpts.forEach((opt, idx) => {
    const checked = state.applyAnswer === idx
    drawTickBox(ctx, marginX, cy, checked, 3.7)
    ctx.fillStyle = checked ? PEN_BLUE : INK
    setFont(ctx, 3.25, { weight: checked ? 700 : 400 })
    ctx.fillText(opt, marginX + 5.0, cy)
    hits.push({
      id: `apply:${idx}`,
      u0: marginX - 1,
      v0: cy - 4.5,
      u1: marginX + marginW + 2,
      v1: cy + 1.8,
      label: `Challenge: ${opt}`,
    })
    cy += 5.6
  })

  if (state.applyAnswer !== null) {
    ctx.fillStyle = state.applyAnswer === 1 ? PEN_BLUE : STAMP_RED
    setFont(ctx, 3.1, { weight: 600 })
    fillWrappedText(
      ctx,
      state.applyAnswer === 1
        ? '✓ Correct! Force drops, distance grows, work stays 98.1 J.'
        : '✗ Look at both violet jars: both fill to 98.1 J (W = F × d)!',
      marginX,
      cy + 1.0,
      marginW,
      3.8
    )
  }

  reads.push({
    id: 'challenge',
    u0: marginX - 2,
    v0: 118,
    u1: marginX + marginW + 2,
    v1: 236,
    kicker: 'Quick Check · Earn Your Stamp',
    title: 'Does a Ramp Save Energy (Joules)?',
    lines: [
      'Question: Does a 4 m frictionless ramp use less energy (Joules) than lifting straight up 1 m?',
      'Answer: No! It uses 4× less force over 4× more distance, so both Energy Store jars receive the exact same 98.1 J.',
    ],
  })

  ctx.restore()
  return { hits, reads }
}

export function drawRightBookPage(
  canvas: HTMLCanvasElement,
  state: BookPageRenderState,
  pxPerMm = 5
): { hits: BookPageHitRegion[]; reads: BookPageReadRegion[] } {
  const W = PAGE_MM.W
  const D = PAGE_MM.D
  const ctx = preparePageCanvas(canvas, pxPerMm)
  if (!ctx) return { hits: [], reads: [] }

  fillPaperGrain(ctx, W, D, 41)

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
    '3D Interactive Apparatus · Direct Lift vs. Ramp',
    '5'
  )

  const hits: BookPageHitRegion[] = []
  const reads: BookPageReadRegion[] = []
  const { result, demoProgress, demoStatus } = state

  // 1. Upper 3D Apparatus Stage Blueprint & Printed Callouts (v = 16..154)
  const stageU0 = 14
  const stageV0 = 16.5
  const stageW = W - 26
  const stageH = 136

  ctx.fillStyle = 'rgba(238, 228, 207, 0.32)'
  ctx.fillRect(stageU0, stageV0, stageW, stageH)

  ctx.strokeStyle = 'rgba(184, 173, 151, 0.35)'
  ctx.lineWidth = 0.2
  for (let u = stageU0; u <= stageU0 + stageW; u += 10) {
    ctx.beginPath()
    ctx.moveTo(u, stageV0)
    ctx.lineTo(u, stageV0 + stageH)
    ctx.stroke()
  }
  for (let v = stageV0; v <= stageV0 + stageH; v += 10) {
    ctx.beginPath()
    ctx.moveTo(stageU0, v)
    ctx.lineTo(stageU0 + stageW, v)
    ctx.stroke()
  }
  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.38
  ctx.strokeRect(stageU0, stageV0, stageW, stageH)

  // Top Stage Banner explaining the 3D scene directly on the page!
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.25, { caps: true, weight: 700 })
  ctx.fillText('Interactive 3D Experiment · Compare Path A and Path B', stageU0 + 3.5, stageV0 + 5.2)

  ctx.fillStyle = INK
  setFont(ctx, 3.3, { italic: true })
  ctx.fillText(
    'Both violet jars store Gravitational Potential Energy (Ep = mgh). Click PULL CRATES or drag the ramp!',
    stageU0 + 3.5,
    stageV0 + 10.0
  )

  // Printed callout zones on the stage floor around the 3D baseplate
  ctx.fillStyle = STAMP_RED
  setFont(ctx, 3.15, { weight: 700 })
  ctx.fillText(
    `PATH A · Direct Vertical Lift: F = ${formatDisplayNumber(result.verticalLiftForceN, 1)} N`,
    stageU0 + 4,
    stageV0 + stageH - 8.5
  )
  ctx.fillStyle = PEN_BLUE
  ctx.fillText(
    `PATH B · ${formatDisplayNumber(result.rampLengthM, 1)} m Ramp: F_pull = ${formatDisplayNumber(
      result.pullingForceN,
      2
    )} N (${formatDisplayNumber(result.idealMechanicalAdvantage, 2)}× easier!)`,
    stageU0 + 78,
    stageV0 + stageH - 8.5
  )
  ctx.fillStyle = STORE_VIOLET
  setFont(ctx, 3.1, { weight: 700 })
  ctx.fillText(
    `RESULT · Both Ep Jars Fill to Exact Same Work: W = F × d = ${formatDisplayNumber(
      result.appliedWorkJ,
      1
    )} J`,
    stageU0 + 4,
    stageV0 + stageH - 3.2
  )

  // 2. Visual Force vs. Distance vs. Energy Trade-off Bars (v = 156..182)
  const barsTop = 156.5
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.2, { caps: true, weight: 700 })
  ctx.fillText(
    'Visual Trade-Off · Why Force Drops While Energy Stays Constant',
    14,
    barsTop
  )

  const barLeft = 64
  const barMaxW = 92
  const forceRatio = Math.min(1, result.pullingForceN / result.verticalLiftForceN)
  const distRatio = Math.min(1, result.rampLengthM / 8.0)
  const liftDistRatio = Math.min(1, result.heightM / 8.0)

  const barItems = [
    {
      label: 'Pulling Force (F)',
      valText: `${formatDisplayNumber(result.pullingForceN, 1)} N vs ${formatDisplayNumber(
        result.verticalLiftForceN,
        1
      )} N`,
      fillW: barMaxW * forceRatio,
      refW: barMaxW,
      color: PEN_BLUE,
    },
    {
      label: 'Distance Pulled (d)',
      valText: `${formatDisplayNumber(result.rampLengthM, 1)} m vs ${formatDisplayNumber(
        result.heightM,
        1
      )} m`,
      fillW: barMaxW * distRatio,
      refW: barMaxW * liftDistRatio,
      color: '#c47a1b',
    },
    {
      label: 'Energy Stored (W=F×d)',
      valText: `${formatDisplayNumber(result.appliedWorkJ, 1)} J = ${formatDisplayNumber(
        result.verticalLiftWorkJ,
        1
      )} J (SAME!)`,
      fillW: barMaxW * 0.78,
      refW: barMaxW * 0.78,
      color: STORE_VIOLET,
    },
  ]

  let by = barsTop + 5.2
  for (const item of barItems) {
    ctx.fillStyle = INK
    setFont(ctx, 3.3, { weight: 600 })
    ctx.fillText(item.label, 14, by)

    // Reference outline (Direct Lift)
    ctx.fillStyle = 'rgba(28, 36, 51, 0.08)'
    ctx.fillRect(barLeft, by - 3.1, barMaxW, 3.6)
    ctx.strokeStyle = 'rgba(184, 65, 46, 0.55)'
    ctx.lineWidth = 0.3
    ctx.strokeRect(barLeft, by - 3.1, item.refW, 3.6)

    // Ramp bar fill
    ctx.fillStyle = item.color
    ctx.fillRect(barLeft, by - 3.1, Math.max(2, item.fillW), 3.6)

    ctx.fillStyle = INK
    setFont(ctx, 3.05, { weight: 600 })
    ctx.fillText(item.valText, barLeft + barMaxW + 3, by - 0.2)
    by += 6.0
  }

  // 3. Numerical Comparison Table (v = 186..221)
  const compY = 186.5
  ctx.fillStyle = ACCENT
  setFont(ctx, 3.2, { caps: true, weight: 700 })
  ctx.fillText('Side-by-Side Data Table · Ramp vs. Direct Vertical Lift', 14, compY)

  const tableTop = compY + 2.5
  const col1 = 14
  const col2 = 86
  const col3 = 136

  ctx.strokeStyle = RULE
  ctx.lineWidth = 0.3
  ctx.beginPath()
  ctx.moveTo(col1, tableTop + 4.5)
  ctx.lineTo(W - 12, tableTop + 4.5)
  ctx.stroke()

  ctx.fillStyle = INK_MUTED
  setFont(ctx, 3.1, { weight: 700, caps: true })
  ctx.fillText('Physical Quantity', col1, tableTop + 3.2)
  ctx.fillStyle = PEN_BLUE
  ctx.fillText(`Path B: Ramp (${formatDisplayNumber(result.rampLengthM, 1)} m)`, col2, tableTop + 3.2)
  ctx.fillStyle = STAMP_RED
  ctx.fillText(`Path A: Lift (${formatDisplayNumber(result.heightM, 1)} m)`, col3, tableTop + 3.2)

  const workSoFarJ =
    demoStatus === 'idle' && demoProgress === 0
      ? result.appliedWorkJ
      : result.appliedWorkJ * demoProgress

  const rows = [
    [
      'Effort Force (F)',
      `${formatDisplayNumber(result.pullingForceN, 2)} N (${formatDisplayNumber(
        result.idealMechanicalAdvantage,
        2
      )}× less)`,
      `${formatDisplayNumber(result.verticalLiftForceN, 2)} N (100% weight)`,
    ],
    [
      'Distance Moved (d)',
      `${formatDisplayNumber(result.distanceAlongRampM, 2)} m along slope`,
      `${formatDisplayNumber(result.verticalLiftDistanceM, 2)} m straight up`,
    ],
    [
      'Total Work (W = F × d)',
      `${formatDisplayNumber(result.appliedWorkJ, 2)} J`,
      `${formatDisplayNumber(result.verticalLiftWorkJ, 2)} J`,
    ],
    [
      demoStatus === 'idle' ? 'Gravitational Store (ΔEp)' : 'Energy Transferred So Far',
      demoStatus === 'idle'
        ? `${formatDisplayNumber(result.potentialEnergyGainJ, 2)} J in Ramp Jar`
        : `${formatDisplayNumber(workSoFarJ, 1)} J (${Math.round(demoProgress * 100)}%)`,
      `${formatDisplayNumber(result.potentialEnergyGainJ, 2)} J in Lift Jar`,
    ],
  ]

  let ry = tableTop + 9.2
  rows.forEach(([label, rampVal, vertVal], idx) => {
    ctx.fillStyle = INK
    setFont(ctx, 3.45, { weight: idx === 0 || idx === 2 ? 700 : 500 })
    ctx.fillText(label, col1, ry)

    ctx.fillStyle = idx === 0 ? PEN_BLUE : idx >= 2 ? STORE_VIOLET : INK
    setFont(ctx, 3.5, { weight: 700 })
    ctx.fillText(rampVal, col2, ry)

    ctx.fillStyle = idx === 0 ? STAMP_RED : idx >= 2 ? STORE_VIOLET : INK_MUTED
    setFont(ctx, 3.45, { weight: 600 })
    ctx.fillText(vertVal, col3, ry)

    ry += 5.4
  })

  reads.push({
    id: 'comparison',
    u0: 14,
    v0: barsTop - 3,
    u1: W - 12,
    v1: ry,
    kicker: 'Live Comparison Table & Trade-Off Bars',
    title: `Path B (${formatDisplayNumber(result.rampLengthM, 1)} m Ramp) vs. Path A (Direct Lift)`,
    lines: [
      `Effort Force: ${formatDisplayNumber(result.pullingForceN, 2)} N on ramp vs. ${formatDisplayNumber(result.verticalLiftForceN, 2)} N straight up (${formatDisplayNumber(result.idealMechanicalAdvantage, 2)}× easier).`,
      `Distance Moved: ${formatDisplayNumber(result.distanceAlongRampM, 2)} m along slope vs. ${formatDisplayNumber(result.verticalLiftDistanceM, 2)} m vertically.`,
      `Work & Energy Stored: ${formatDisplayNumber(result.appliedWorkJ, 2)} J in BOTH Gravitational Store jars!`,
    ],
  })

  // 4. Bottom Interactive On-Page Ramp Length Switch (v = 224..238)
  const capY = 224.5
  ctx.fillStyle = INK
  setFont(ctx, 3.7, { weight: 700 })
  ctx.fillText('Try changing ramp length L (click on page or drag orange 3D knob):', 14, capY)

  const lengthPresets = [
    { len: 1, tag: '1 m (1×)' },
    { len: 2, tag: '2 m (2× easier)' },
    { len: 3, tag: '3 m (3× easier)' },
    { len: 4, tag: '4 m (4× easier)' },
    { len: 6, tag: '6 m (6× easier)' },
  ]
  let sx = 14
  const btnY = capY + 2.5
  for (const item of lengthPresets) {
    const isSelected = Math.abs(result.rampLengthM - item.len) < 0.06
    setFont(ctx, 3.45, { weight: isSelected ? 700 : 600 })
    const tw = ctx.measureText(item.tag).width
    const boxW = tw + 5.2

    ctx.fillStyle = isSelected ? 'rgba(36, 53, 110, 0.16)' : 'rgba(238, 228, 207, 0.75)'
    ctx.fillRect(sx, btnY, boxW, 6.2)
    ctx.strokeStyle = isSelected ? PEN_BLUE : RULE
    ctx.lineWidth = isSelected ? 0.45 : 0.28
    ctx.strokeRect(sx, btnY, boxW, 6.2)

    ctx.fillStyle = isSelected ? PEN_BLUE : INK
    ctx.fillText(item.tag, sx + 2.6, btnY + 4.3)

    hits.push({
      id: `preset:${item.len}`,
      u0: sx,
      v0: btnY - 1,
      u1: sx + boxW,
      v1: btnY + 7.2,
      label: `Set ramp length to ${item.len} m`,
    })
    sx += boxW + 2.8
  }

  reads.push({
    id: 'figure-caption',
    u0: 14,
    v0: capY - 4,
    u1: W - 12,
    v1: btnY + 8,
    kicker: 'Interactive Ramp Length Switch',
    title: 'Click Any Ramp Length (1 m, 2 m, 3 m, 4 m, 6 m)',
    lines: [
      'Click any length preset right on the page—or drag the orange handle at the foot of the 3D ramp—to watch the ramp stretch, the blue force arrow shrink, and the comparison bars update live!',
    ],
  })

  ctx.restore()
  return { hits, reads }
}

export function drawContentsBookPage(
  canvas: HTMLCanvasElement,
  side: 'left' | 'right',
  pxPerMm = 5
): { hits: BookPageHitRegion[]; reads: BookPageReadRegion[] } {
  const W = PAGE_MM.W
  const D = PAGE_MM.D
  const ctx = preparePageCanvas(canvas, pxPerMm)
  if (!ctx) return { hits: [], reads: [] }

  fillPaperGrain(ctx, W, D, side === 'left' ? 19 : 23)

  const hits: BookPageHitRegion[] = []
  const reads: BookPageReadRegion[] = []

  if (side === 'left') {
    drawRunningHeaderAndFolio(ctx, true, 'Contents · CBSE Interactive Lab', '2')
    const x0 = 16
    const w = W - 34

    ctx.fillStyle = ACCENT
    setFont(ctx, 4.1, { caps: true, weight: 700 })
    ctx.fillText('Contents · Class 9–11 Physics', x0, 26)

    ctx.fillStyle = INK
    setFont(ctx, 10.2, { weight: 700 })
    ctx.fillText('Illustrated Science Notebook', x0, 38)

    ctx.fillStyle = INK_MUTED
    setFont(ctx, 4.2, { italic: true })
    ctx.fillText('Interactive Class 9–10 Physics · Mechanics & Geometric Optics', x0, 44.5)

    ctx.strokeStyle = RULE
    ctx.lineWidth = 0.28
    ctx.beginPath()
    ctx.moveTo(x0, 49)
    ctx.lineTo(x0 + w, 49)
    ctx.stroke()

    const entries = [
      {
        num: 'I',
        hitId: 'open:lesson1',
        title: 'Less Force. More Distance. Same Energy.',
        sub: 'Why does a ramp make lifting easier? Direct lift vs. inclined plane.',
        page: '4',
        active: true,
      },
      {
        num: 'II',
        hitId: 'open:lesson2',
        title: 'How a convex lens forms an image.',
        sub: 'Class 10 Optics · Real vs. virtual images, principal rays & screen projection.',
        page: '6',
        active: true,
      },
      {
        num: 'III',
        hitId: 'open:lesson3',
        title: 'Real Ramps & Optical Aberrations',
        sub: 'Thermal dissipation on rough slopes and spherical/chromatic lens limits.',
        page: '—',
        active: false,
      },
    ]

    let y = 62
    for (const item of entries) {
      ctx.fillStyle = item.active ? ACCENT : INK_MUTED
      setFont(ctx, 6.2, { italic: true, weight: 700 })
      ctx.fillText(item.num, x0, y)

      ctx.fillStyle = item.active ? INK : INK_MUTED
      setFont(ctx, 5.4, { weight: 600 })
      ctx.fillText(item.title, x0 + 13, y)

      ctx.textAlign = 'right'
      ctx.fillStyle = item.active ? ACCENT : INK_MUTED
      setFont(ctx, 5.2, { weight: 600 })
      ctx.fillText(item.page, x0 + w, y)
      ctx.textAlign = 'left'

      ctx.fillStyle = INK_MUTED
      setFont(ctx, 3.8, { italic: true })
      ctx.fillText(item.sub, x0 + 13, y + 5.2)

      if (item.active) {
        hits.push({
          id: item.hitId,
          u0: x0 - 2,
          v0: y - 6,
          u1: x0 + w + 2,
          v1: y + 8,
          label: `Open Lesson ${item.num}: ${item.title}`,
        })
      }
      y += 18
    }

    ctx.fillStyle = PEN_BLUE
    setFont(ctx, 5.0, { family: HAND, weight: 700 })
    ctx.fillText('Click Lesson I (Ramp) or Lesson II (Convex Lens) on this page →', x0, y + 6)
  } else {
    drawRunningHeaderAndFolio(ctx, false, 'How to Use This Book', '3')
    const x0 = 18
    const w = W - 34

    ctx.fillStyle = ACCENT
    setFont(ctx, 4.1, { caps: true, weight: 700 })
    ctx.fillText('How to Use This Book', x0, 26)

    const steps = [
      ['1. Predict', 'Tick your prediction on the left page with the fountain pen before testing.'],
      ['2. Experiment', 'Click the red PULL button or drag the crate and ramp foot directly in 3D.'],
      ['3. Watch Tour', 'Press ▶ in the bottom capsule for a 5-shot guided 3D camera tour.'],
      ['4. Lift Flap', 'Lift the hinged Why? paper flap to inspect W = F × d = mgh.'],
    ]
    let y = 37
    for (const [head, body] of steps) {
      ctx.fillStyle = INK
      setFont(ctx, 4.8, { weight: 700 })
      ctx.fillText(head, x0, y)
      ctx.fillStyle = INK_MUTED
      setFont(ctx, 4.0)
      ctx.fillText(body, x0 + 30, y)
      y += 11
    }

    ctx.strokeStyle = RULE
    ctx.lineWidth = 0.28
    ctx.beginPath()
    ctx.moveTo(x0, y + 3)
    ctx.lineTo(x0 + w, y + 3)
    ctx.stroke()

    ctx.fillStyle = ACCENT
    setFont(ctx, 4.1, { caps: true, weight: 700 })
    ctx.fillText('The Glowing Energy Jars on Every Page', x0, y + 14)

    ctx.fillStyle = INK
    setFont(ctx, 4.15)
    fillWrappedText(
      ctx,
      'Behind each 3D apparatus sit graduated glass jars. The glowing violet liquid shows how many Joules of energy have been transferred into the Gravitational Potential Store (Ep = m g h). Compare the Direct Lift jar with the Ramp Climb jar!',
      x0,
      y + 22,
      w,
      5.4
    )
  }

  ctx.restore()
  return { hits, reads }
}
