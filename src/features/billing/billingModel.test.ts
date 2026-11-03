import { describe, it, expect } from 'vitest'
import {
  calculateApplianceEnergyKWh,
  calculateEnergyCost,
  calculateHouseholdBilling,
  convertJoulesToKWh,
  convertKWhToJoules,
  JOULES_PER_KWH,
} from './billingModel'
import { BillingValidationError } from './billingLimits'

describe('Commercial Billing & Energy Scientific Model', () => {
  it('converts between kWh and Joules with physical fidelity (1 kWh = 3.6 × 10⁶ J)', () => {
    expect(JOULES_PER_KWH).toBe(3.6e6)

    // 1 kWh = 3,600,000 J
    expect(convertKWhToJoules(1)).toBe(3.6e6)
    expect(convertJoulesToKWh(3.6e6)).toBe(1)

    // 5 kWh = 18,000,000 J
    expect(convertKWhToJoules(5)).toBe(1.8e7)
    expect(convertJoulesToKWh(1.8e7)).toBe(5)
  })

  it('calculates single appliance energy correctly for NCERT Example 12.12', () => {
    // 400 W refrigerator operated 8 hours/day for 30 days
    // E = 400 W * 8 h/day * 30 days / 1000 = 96 kWh
    const energyKWh = calculateApplianceEnergyKWh(400, 8, 30, 1)
    expect(energyKWh).toBeCloseTo(96.0, 5)

    // Cost at ₹3.00 per unit = 96 * 3 = ₹288.00
    const cost = calculateEnergyCost(energyKWh, 3.0)
    expect(cost).toBeCloseTo(288.0, 5)
  })

  it('computes acceptance benchmark: 2000 W geyser (1 hr/day) vs 200 W refrigerator (24 hr/day) over 30 days', () => {
    // Geyser: 2000 * 1 * 30 / 1000 = 60 kWh
    const geyserEnergy = calculateApplianceEnergyKWh(2000, 1, 30, 1)
    expect(geyserEnergy).toBe(60.0)

    // Refrigerator: 200 * 24 * 30 / 1000 = 144 kWh
    const fridgeEnergy = calculateApplianceEnergyKWh(200, 24, 30, 1)
    expect(fridgeEnergy).toBe(144.0)

    // Refrigerator uses 2.4x more energy despite having 1/10th the power!
    expect(fridgeEnergy / geyserEnergy).toBeCloseTo(2.4, 5)

    // Costs at ₹6/unit
    expect(calculateEnergyCost(geyserEnergy, 6.0)).toBe(360.0)
    expect(calculateEnergyCost(fridgeEnergy, 6.0)).toBe(864.0)
  })

  it('computes multi-appliance household billing with full breakdown', () => {
    const input = {
      appliances: [
        {
          id: 'geyser',
          name: 'Geyser',
          powerW: 2000,
          hoursPerDay: 1,
          quantity: 1,
          enabled: true,
        },
        {
          id: 'refrigerator',
          name: 'Fridge',
          powerW: 200,
          hoursPerDay: 24,
          quantity: 1,
          enabled: true,
        },
        {
          id: 'fan',
          name: 'Ceiling Fan',
          powerW: 75,
          hoursPerDay: 10,
          quantity: 3,
          enabled: true,
        },
      ],
      billingDays: 30,
      tariffRateRupeesPerKWh: 6.0,
    }

    const res = calculateHouseholdBilling(input)

    // Connected power: 2000*1 + 200*1 + 75*3 = 2000 + 200 + 225 = 2425 W
    expect(res.totalConnectedPowerW).toBe(2425)
    expect(res.activePowerDrawW).toBe(2425)

    // Geyser: 2000*1*30/1000 = 60 kWh
    // Fridge: 200*24*30/1000 = 144 kWh
    // Fans: 225*10*30/1000 = 67.5 kWh
    // Total = 60 + 144 + 67.5 = 271.5 kWh
    expect(res.totalEnergyKWh).toBeCloseTo(271.5, 4)
    expect(res.dailyEnergyKWh).toBeCloseTo(9.05, 4)

    // Total cost at ₹6 = 271.5 * 6 = ₹1629.00
    expect(res.totalCostRupees).toBeCloseTo(1629.0, 4)

    // Highest consumer should be the refrigerator
    expect(res.highestEnergyApplianceId).toBe('refrigerator')

    // Percentage checks
    const fridgeRes = res.appliances.find((a) => a.id === 'refrigerator')!
    expect(fridgeRes.costPercentageOfTotal).toBeCloseTo((144 / 271.5) * 100, 2)
  })

  it('handles disabled appliances cleanly without adding their power or energy', () => {
    const input = {
      appliances: [
        {
          id: 'geyser',
          name: 'Geyser',
          powerW: 2000,
          hoursPerDay: 1,
          quantity: 1,
          enabled: false, // Disabled
        },
        {
          id: 'fan',
          name: 'Fan',
          powerW: 100,
          hoursPerDay: 5,
          quantity: 1,
          enabled: true,
        },
      ],
      billingDays: 30,
      tariffRateRupeesPerKWh: 5.0,
    }

    const res = calculateHouseholdBilling(input)

    expect(res.totalConnectedPowerW).toBe(2100)
    expect(res.activePowerDrawW).toBe(100) // Only fan active
    expect(res.totalEnergyKWh).toBe(15.0) // 100 * 5 * 30 / 1000 = 15 kWh
    expect(res.totalCostRupees).toBe(75.0) // 15 * 5 = ₹75
    expect(res.highestEnergyApplianceId).toBe('fan')
  })

  it('rejects invalid inputs with BillingValidationError', () => {
    expect(() => calculateApplianceEnergyKWh(-10, 5, 30, 1)).toThrow(
      BillingValidationError
    )
    expect(() => calculateApplianceEnergyKWh(100, -1, 30, 1)).toThrow(
      BillingValidationError
    )
    expect(() => calculateApplianceEnergyKWh(100, 5, 0, 1)).toThrow(
      BillingValidationError
    )
    expect(() => calculateApplianceEnergyKWh(100, 5, 30, 0)).toThrow(
      BillingValidationError
    )
    expect(() => calculateEnergyCost(10, -5)).toThrow(BillingValidationError)
  })
})
