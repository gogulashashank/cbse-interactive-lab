import { describe, expect, it } from 'vitest'
import {
  calculateEyeDefectCorrection,
  calculateMendelianPunnett,
  calculateOpticalState,
  calculateLensPower,
  calculatePrismDispersionScattering,
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

  it('calculates myopia concave lens power and hypermetropia convex lens power', () => {
    // Myopia with far point d_F = 80 cm => f = -80 cm, P = -1.25 D
    const myopia = calculateEyeDefectCorrection('myopia', 80, true)
    expect(myopia.requiredLensType).toBe('concave')
    expect(myopia.correctiveFocalLengthCm).toBe(-80)
    expect(myopia.correctivePowerDioptres).toBe(-1.25)
    expect(myopia.uncorrectedFocusSite).toBe('in-front-of-retina')
    expect(myopia.activeFocusSite).toBe('on-retina')

    // Hypermetropia with near point d_N = 100 cm (1 m) => 1/f = 1/25 - 1/100 = 3/100 => f = +33.3 cm, P = +3.0 D
    const hyper = calculateEyeDefectCorrection('hypermetropia', 100, false)
    expect(hyper.requiredLensType).toBe('convex')
    expect(hyper.correctiveFocalLengthCm).toBeCloseTo(33.3, 1)
    expect(hyper.correctivePowerDioptres).toBe(3)
    expect(hyper.uncorrectedFocusSite).toBe('behind-retina')
    expect(hyper.activeFocusSite).toBe('behind-retina')
  })

  it('calculates prism wavelength dispersion, Rayleigh scattering (∝ 1/λ⁴), and inverted-prism recombination', () => {
    const violet = calculatePrismDispersionScattering(400, false)
    const red = calculatePrismDispersionScattering(700, true)

    expect(violet.colorBandName).toBe('Violet')
    expect(red.colorBandName).toBe('Red')
    expect(violet.refractiveIndexGlass).toBeGreaterThan(red.refractiveIndexGlass)
    expect(violet.prismDeviationDeg).toBeGreaterThan(red.prismDeviationDeg)
    // (700/400)^4 = 1.75^4 = 9.3789 => 9.38
    expect(violet.rayleighScatteringRelativeToRed).toBeCloseTo(9.38, 2)
    expect(red.rayleighScatteringRelativeToRed).toBe(1)
    expect(violet.emergentBeamState).toBe('dispersed-spectrum')
    expect(red.emergentBeamState).toBe('recombined-white-light')
  })

  it('calculates Mendelian monohybrid Punnett square F1 (100% Tt) and F2 (3:1 phenotype, 1:2:1 genotype) ratios', () => {
    const f1 = calculateMendelianPunnett('TT', 'tt', 400)
    expect(f1.countTt).toBe(4)
    expect(f1.tallPhenotypePercent).toBe(100)
    expect(f1.expectedTallPlants).toBe(400)

    const f2 = calculateMendelianPunnett('Tt', 'Tt', 400)
    expect(f2.countTT).toBe(1)
    expect(f2.countTt).toBe(2)
    expect(f2.counttt).toBe(1)
    expect(f2.tallPhenotypePercent).toBe(75)
    expect(f2.dwarfPhenotypePercent).toBe(25)
    expect(f2.expectedTallPlants).toBe(300)
    expect(f2.expectedDwarfPlants).toBe(100)
  })
})
