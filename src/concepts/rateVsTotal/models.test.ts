import { describe, expect, it } from 'vitest'
import {
  calculateBillComparison,
  calculateBucket,
  calculateCellularRespirationATP,
  calculateCharge,
  calculateEnergy,
  calculateHomologousMember,
  calculateVelocityTimeGraph,
} from './models'

describe('Rate vs Total Models', () => {
  it('calculates bucket fill (Total = Rate × Time)', () => {
    const res = calculateBucket(5, 3, 20)
    expect(res.totalLitres).toBe(15)
    expect(res.fillPercentage).toBe(75)
    expect(res.isFull).toBe(false)

    const full = calculateBucket(5, 5, 20)
    expect(full.totalLitres).toBe(25)
    expect(full.fillPercentage).toBe(100)
    expect(full.isFull).toBe(true)
  })

  it('calculates charge from current (Q = I × t)', () => {
    const res = calculateCharge(2.5, 4)
    expect(res.chargeCoulombs).toBe(10)
    expect(res.electronsApprox).toBeCloseTo(6.25e19)
  })

  it('calculates energy from power (E = P × t)', () => {
    // 100 W bulb for 1 hour (3600 s)
    const res = calculateEnergy(100, 3600)
    expect(res.energyJoules).toBe(360000)
    expect(res.energyWattHours).toBe(100)
    expect(res.energyKWh).toBe(0.1)
  })

  it('calculates bill comparison (Geyser 30 mins vs Fridge 24 hrs for 30 days)', () => {
    // Geyser: 2000 W × 0.5 h × 30 days = 30 kWh (30 units)
    // Fridge: 150 W avg × 24 h × 30 days = 108 kWh (108 units)
    const res = calculateBillComparison(6, 30, 0.5, 24)
    expect(res.geyserKWh).toBe(30)
    expect(res.fridgeKWh).toBe(108)
    expect(res.geyserCost).toBe(180)
    expect(res.fridgeCost).toBe(648)
    expect(res.totalCost).toBe(828)
  })

  it('calculates velocity-time graph slope (acceleration) and area (displacement)', () => {
    // u = 5 m/s, v = 25 m/s, t = 4 s:
    // a = (25 - 5) / 4 = 5 m/s²
    // s_rect = 5 * 4 = 20 m, s_tri = 0.5 * 20 * 4 = 40 m => total s = 60 m
    const res = calculateVelocityTimeGraph(5, 25, 4)
    expect(res.accelerationMps2).toBe(5)
    expect(res.rectangleDisplacementM).toBe(20)
    expect(res.triangleDisplacementM).toBe(40)
    expect(res.totalDisplacementM).toBe(60)
    expect(res.averageVelocityMps).toBe(15)
  })

  it('calculates carbon homologous series formulas, +14 u (+CH2) step, and saturation', () => {
    const propane = calculateHomologousMember('alkane', 3)
    expect(propane.iupacName).toBe('Propane')
    expect(propane.molecularFormula).toBe('C₃H₈')
    expect(propane.molecularMassU).toBe(44)
    expect(propane.nextHomologueMassU).toBe(58)
    expect(propane.massStepToNextU).toBe(14)
    expect(propane.decolourisesBromineWater).toBe(false)

    const ethene = calculateHomologousMember('alkene', 2)
    expect(ethene.iupacName).toBe('Ethene')
    expect(ethene.molecularFormula).toBe('C₂H₄')
    expect(ethene.molecularMassU).toBe(28)
    expect(ethene.decolourisesBromineWater).toBe(true)
  })

  it('compares aerobic (38 ATP) vs yeast anaerobic and muscle lactic-acid (2 ATP) pathways', () => {
    const aerobic = calculateCellularRespirationATP('aerobic-mitochondria', 2)
    expect(aerobic.atpRatePerGlucose).toBe(38)
    expect(aerobic.totalAtpMoles).toBe(76)
    expect(aerobic.co2MolesReleased).toBe(12)
    expect(aerobic.causesMuscleCramps).toBe(false)

    const muscle = calculateCellularRespirationATP('muscle-oxygen-debt', 2)
    expect(muscle.atpRatePerGlucose).toBe(2)
    expect(muscle.totalAtpMoles).toBe(4)
    expect(muscle.co2MolesReleased).toBe(0)
    expect(muscle.causesMuscleCramps).toBe(true)
  })
})
