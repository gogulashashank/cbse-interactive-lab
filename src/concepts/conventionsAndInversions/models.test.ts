import { describe, expect, it } from 'vitest'
import {
  calculateOpticalState,
  calculateLensPower,
  computePrincipalRays,
  OPTICS_RAY_BENCH_GEOMETRY,
} from './models'

describe('Thread 5: Conventions & Inversions Optics Models', () => {
  it('computes convex lens real inverted same-size image at 2F', () => {
    const res = calculateOpticalState('convex-lens', 40, 20)
    expect(res.objectDistanceU).toBe(-40)
    expect(res.focalLengthF).toBe(20)
    expect(res.imageDistanceV).toBe(40)
    expect(res.magnificationM).toBe(-1)
    expect(res.isReal).toBe(true)
    expect(res.isErect).toBe(false)
    expect(res.imageSizeCategory).toBe('same-size')
  })

  it('computes convex lens virtual erect magnified image when object is inside F', () => {
    const res = calculateOpticalState('convex-lens', 10, 20)
    expect(res.imageDistanceV).toBe(-20)
    expect(res.magnificationM).toBe(2)
    expect(res.isReal).toBe(false)
    expect(res.isErect).toBe(true)
    expect(res.imageSizeCategory).toBe('magnified')
  })

  it('computes concave lens virtual erect diminished image for all positions', () => {
    const res = calculateOpticalState('concave-lens', 30, 15)
    expect(res.focalLengthF).toBe(-15)
    expect(res.imageDistanceV).toBe(-10)
    expect(res.magnificationM).toBeCloseTo(0.33, 2)
    expect(res.isReal).toBe(false)
    expect(res.isErect).toBe(true)
    expect(res.imageSizeCategory).toBe('diminished')
  })

  it('computes lens power in Dioptres with metre conversion P = 100 / f(cm)', () => {
    const pConvex = calculateLensPower(25)
    expect(pConvex.focalLengthMeters).toBe(0.25)
    expect(pConvex.powerDioptres).toBe(4)
    expect(pConvex.lensNature).toBe('converging')

    const pConcave = calculateLensPower(-50)
    expect(pConcave.focalLengthMeters).toBe(-0.5)
    expect(pConcave.powerDioptres).toBe(-2)
    expect(pConcave.lensNature).toBe('diverging')
  })

  it('maps symmetric -60 cm to +60 cm ruler bounds within the 880x340 SVG viewBox with 80px padding', () => {
    expect(OPTICS_RAY_BENCH_GEOMETRY.toSvgX(-60)).toBe(80)
    expect(OPTICS_RAY_BENCH_GEOMETRY.toSvgX(0)).toBe(440)
    expect(OPTICS_RAY_BENCH_GEOMETRY.toSvgX(60)).toBe(800)
  })

  it('generates principal rays and virtual extensions across all 4 spherical optical devices', () => {
    // 1. Convex lens real image (|u| = 35 > f = 20) -> 2 incident + 2 transmitted segments
    const convexReal = computePrincipalRays('convex-lens', 35, 20)
    expect(convexReal.state.isReal).toBe(true)
    expect(convexReal.segments.filter((s) => s.kind === 'incident')).toHaveLength(2)
    expect(convexReal.segments.filter((s) => s.kind === 'transmitted-or-reflected')).toHaveLength(2)
    expect(convexReal.segments.filter((s) => s.kind === 'virtual-extension')).toHaveLength(0)

    // 2. Convex lens virtual image (|u| = 12 < f = 20) -> includes 2 virtual backward extensions
    const convexVirtual = computePrincipalRays('convex-lens', 12, 20)
    expect(convexVirtual.state.isReal).toBe(false)
    expect(convexVirtual.segments.filter((s) => s.kind === 'virtual-extension')).toHaveLength(2)

    // 3. Convex lens at exact focus (|u| = f = 20) -> parallel rays to infinity
    const convexInfinity = computePrincipalRays('convex-lens', 20, 20)
    expect(convexInfinity.state.imageDistanceV).toBe(Infinity)
    expect(convexInfinity.clampedImageXCm).toBeNull()

    // 4. Concave mirror and convex mirror ray tracing
    const concaveMirror = computePrincipalRays('concave-mirror', 30, 15)
    expect(concaveMirror.state.imageDistanceV).toBe(-30)
    expect(concaveMirror.state.isReal).toBe(true)

    const convexMirror = computePrincipalRays('convex-mirror', 30, 15)
    expect(convexMirror.state.imageDistanceV).toBe(10)
    expect(convexMirror.state.isReal).toBe(false)
    expect(convexMirror.segments.filter((s) => s.kind === 'virtual-extension')).toHaveLength(2)
  })
})
