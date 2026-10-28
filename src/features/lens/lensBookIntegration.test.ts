import { describe, expect, it } from 'vitest'
import { getInitialReducedMotion } from '../platform/reducedMotion'
import { drawContentsBookPage } from '../ramp/bookPageRenderer'
import { calculateConvexLens } from './convexLensModel'
import { drawLensLeftBookPage, drawLensRightBookPage } from './lensBookPageRenderer'

function createMockCanvas(): HTMLCanvasElement {
  const noop = () => {}
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalAlpha: 1,
    font: '',
    textAlign: 'left',
    textBaseline: 'alphabetic',
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetY: 0,
    fillRect: noop,
    strokeRect: noop,
    clearRect: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    quadraticCurveTo: noop,
    arc: noop,
    ellipse: noop,
    fill: noop,
    stroke: noop,
    save: noop,
    restore: noop,
    translate: noop,
    rotate: noop,
    scale: noop,
    setTransform: noop,
    setLineDash: noop,
    fillText: noop,
    measureText: (text: string) => ({ width: text.length * 2.1 } as TextMetrics),
    createLinearGradient: () => ({ addColorStop: noop } as unknown as CanvasGradient),
    createRadialGradient: () => ({ addColorStop: noop } as unknown as CanvasGradient),
  } as unknown as CanvasRenderingContext2D

  return {
    width: 950,
    height: 1250,
    getContext: (contextId: string) => (contextId === '2d' ? ctx : null),
  } as unknown as HTMLCanvasElement
}

describe('Book Integration, Shared State & Reduced Motion Regression Tests', () => {
  it('respects prefers-reduced-motion on initial load via matchMedia', () => {
    expect(
      getInitialReducedMotion((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
      })),
    ).toBe(true)

    expect(
      getInitialReducedMotion(() => ({
        matches: false,
      })),
    ).toBe(false)

    expect(
      getInitialReducedMotion(() => {
        throw new Error('matchMedia unavailable')
      }),
    ).toBe(false)
  })

  it('registers clickable hit regions for both Lesson I (Ramp) and Lesson II (Convex Lens) on the Book Contents page', () => {
    const canvas = createMockCanvas()
    const leftRegions = drawContentsBookPage(canvas, 'left')
    const hitIds = leftRegions.hits.map((r) => r.id)

    expect(hitIds).toContain('open:lesson1')
    expect(hitIds).toContain('open:lesson2')

    const rightRegions = drawContentsBookPage(canvas, 'right')
    expect(rightRegions.hits).toHaveLength(0)
  })

  it('renders Lesson II left and right book pages from the shared ConvexLensResult state and exposes interactive hit regions', () => {
    const canvas = createMockCanvas()
    const sharedResult = calculateConvexLens({
      focalLengthCm: 15,
      objectDistanceCm: 36,
      objectHeightCm: 4,
      screenDistanceCm: 40,
    })

    const leftOut = drawLensLeftBookPage(canvas, {
      result: sharedResult,
      prediction: 1,
      flapOpen: true,
    })
    const leftIds = leftOut.hits.map((r) => r.id)
    expect(leftIds).toEqual(
      expect.arrayContaining([
        'open:worked-math',
        'predict:0',
        'predict:1',
        'predict:2',
        'flap',
        'open:contents',
      ]),
    )

    const rightOut = drawLensRightBookPage(canvas, {
      result: sharedResult,
      prediction: 1,
      flapOpen: true,
    })
    const rightIds = rightOut.hits.map((r) => r.id)
    expect(rightIds).toEqual(
      expect.arrayContaining([
        'snap:screen',
        'preset:2.5',
        'preset:2',
        'preset:1.5',
        'preset:1',
        'preset:0.6',
      ]),
    )
  })

  it('omits the snap:screen hit region on the right book page when the lens forms a virtual or parallel-beam outcome', () => {
    const canvas = createMockCanvas()
    const virtualResult = calculateConvexLens({
      focalLengthCm: 15,
      objectDistanceCm: 9,
      objectHeightCm: 4,
      screenDistanceCm: 25,
    })

    const rightOut = drawLensRightBookPage(canvas, {
      result: virtualResult,
      prediction: 1,
      flapOpen: false,
    })
    const rightIds = rightOut.hits.map((r) => r.id)
    expect(rightIds).not.toContain('snap:screen')
    expect(rightIds).toContain('preset:0.6')
  })
})
