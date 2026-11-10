import { describe, expect, it } from 'vitest'
import { calculateOpticalState, calculateLensPower } from './models'

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
})
