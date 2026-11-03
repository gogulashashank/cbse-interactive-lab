import { describe, expect, it } from 'vitest'
import {
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
})
