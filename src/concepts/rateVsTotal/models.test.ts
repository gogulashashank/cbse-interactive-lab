import { describe, expect, it } from 'vitest'
import {
  calculateBillComparison,
  calculateBucket,
  calculateCharge,
  calculateEnergy,
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
})
