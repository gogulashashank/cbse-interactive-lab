import { describe, expect, it } from 'vitest'
import {
  calculateArchimedesBuoyancy,
  calculateElectricalEnergy,
  calculateJunctionConservation,
  calculateParallelPowerBalance,
  calculateMechanicalEnergyAtHeight,
} from './models'

describe('Thread 4: Energy Conservation Models', () => {
  it('calculates electrical energy transfer E = V * I * t accurately', () => {
    // 220V, 2A for 1 hour (3600s)
    const result = calculateElectricalEnergy(220, 2, 3600)
    expect(result.powerWatts).toBe(440)
    expect(result.energyJoules).toBe(440 * 3600)
    expect(result.energyKWh).toBeCloseTo(0.44, 2)
    expect(result.heatJoules).toBe(result.energyJoules)
  })

  it('verifies Kirchhoff junction charge conservation sum(I_in) == sum(I_out)', () => {
    const junction = calculateJunctionConservation(3, 2, 0.4)
    expect(junction.totalIn).toBe(5)
    expect(junction.currentOut1).toBe(2)
    expect(junction.currentOut2).toBe(3)
    expect(junction.totalOut).toBe(5)
    expect(junction.isConserved).toBe(true)
  })

  it('confirms total battery source power equals sum of dissipated branch powers', () => {
    // 12V supply across 6Ω and 4Ω in parallel
    const balance = calculateParallelPowerBalance(12, 6, 4)
    expect(balance.branch1Power).toBe(24) // 144 / 6 = 24 W
    expect(balance.branch2Power).toBe(36) // 144 / 4 = 36 W
    expect(balance.totalDissipatedPower).toBe(60) // 24 + 36 = 60 W
    expect(balance.batteryPower).toBe(60) // 12V * (2A + 3A) = 60 W
    expect(balance.isBalanced).toBe(true)
  })

  it('demonstrates mechanical PE + KE conservation as an object descends', () => {
    const mass = 2 // kg
    const initialHeight = 10 // m
    // At top: PE = 2 * 9.8 * 10 = 196 J, KE = 0 J
    const top = calculateMechanicalEnergyAtHeight(mass, initialHeight, 10)
    expect(top.potentialEnergyJoules).toBe(196)
    expect(top.kineticEnergyJoules).toBe(0)
    expect(top.totalEnergyJoules).toBe(196)
    expect(top.currentVelocityMps).toBe(0)

    // At ground: PE = 0 J, KE = 196 J, v = sqrt(2 * 9.8 * 10) = 14 m/s
    const ground = calculateMechanicalEnergyAtHeight(mass, initialHeight, 0)
    expect(ground.potentialEnergyJoules).toBe(0)
    expect(ground.kineticEnergyJoules).toBe(196)
    expect(ground.totalEnergyJoules).toBe(196)
    expect(ground.currentVelocityMps).toBe(14)
  })

  it('calculates Archimedes buoyancy, displaced fluid volume, and apparent weight for floating vs sinking blocks', () => {
    // Sinking block: 400 cm³, density 2.5 g/cm³ in water (1.0 g/cm³)
    // Mass = 1.0 kg => W_air = 10 N, V_disp = 400 cm³ => F_B = 4 N, W_app = 6 N
    const sink = calculateArchimedesBuoyancy(400, 2.5, 1.0)
    expect(sink.floats).toBe(false)
    expect(sink.weightInAirN).toBe(10)
    expect(sink.displacedVolumeCm3).toBe(400)
    expect(sink.buoyantUpthrustN).toBe(4)
    expect(sink.apparentWeightN).toBe(6)

    // Floating block: 400 cm³, density 0.6 g/cm³ in water (1.0 g/cm³)
    // Mass = 0.24 kg => W_air = 2.4 N, submergedFraction = 0.6 => V_disp = 240 cm³, F_B = 2.4 N, W_app = 0 N
    const float = calculateArchimedesBuoyancy(400, 0.6, 1.0)
    expect(float.floats).toBe(true)
    expect(float.weightInAirN).toBe(2.4)
    expect(float.displacedVolumeCm3).toBe(240)
    expect(float.buoyantUpthrustN).toBe(2.4)
    expect(float.apparentWeightN).toBe(0)
  })
})
