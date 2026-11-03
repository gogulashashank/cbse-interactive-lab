import { describe, it, expect } from 'vitest'
import {
  calculateBranchCurrent,
  calculateApplianceResistance,
  evaluateShockRisk,
  simulateDomesticCircuit,
} from './safetyModel'
import { SUPPLY_VOLTAGE_RMS } from './safetyLimits'

describe('safetyModel - Domestic Circuit Physics Calculations', () => {
  it('calculates individual branch currents accurately using I = P / V', () => {
    // 220 V supply
    // 1000 W iron -> I = 1000 / 220 = 4.5454... A
    const ironCurrent = calculateBranchCurrent(1000, 220)
    expect(ironCurrent).toBeCloseTo(4.545, 3)

    // 2000 W geyser -> I = 2000 / 220 = 9.0909... A
    const geyserCurrent = calculateBranchCurrent(2000, 220)
    expect(geyserCurrent).toBeCloseTo(9.091, 3)

    // 60 W bulb -> I = 60 / 220 = 0.2727... A
    const bulbCurrent = calculateBranchCurrent(60, 220)
    expect(bulbCurrent).toBeCloseTo(0.273, 3)
  })

  it('calculates load resistance accurately using R = V^2 / P', () => {
    // 1000 W iron at 220 V: R = (220 * 220) / 1000 = 48.4 ohms
    const ironResistance = calculateApplianceResistance(1000, 220)
    expect(ironResistance).toBeCloseTo(48.4, 1)

    // 2000 W geyser: R = 48400 / 2000 = 24.2 ohms
    const geyserResistance = calculateApplianceResistance(2000, 220)
    expect(geyserResistance).toBeCloseTo(24.2, 1)
  })

  it('evaluates physiological shock risk thresholds correctly', () => {
    expect(evaluateShockRisk(0)).toBe('NONE')
    expect(evaluateShockRisk(0.0005)).toBe('SAFE') // 0.5 mA
    expect(evaluateShockRisk(0.005)).toBe('PERCEPTIBLE') // 5 mA
    expect(evaluateShockRisk(0.025)).toBe('DANGEROUS') // 25 mA
    expect(evaluateShockRisk(0.22)).toBe('LETHAL') // 220 mA
  })

  it('simulates normal parallel circuit within fuse rating (fuse remains intact)', () => {
    // Bulb (60W) + Fan (75W) = 135W
    // Current at 220V = 135 / 220 = 0.6136 A
    // 5 A fuse -> intact
    const result = simulateDomesticCircuit({
      appliances: [
        { id: 'bulb', name: 'Bulb', powerW: 60, hasMetalBody: false, icon: '💡', enabled: true },
        { id: 'fan', name: 'Fan', powerW: 75, hasMetalBody: true, icon: '🌀', enabled: true },
      ],
      fuseRatingA: 5,
      earthingConnected: true,
      faultMode: 'none',
      userTouchingChassis: false,
    })

    expect(result.fuseStatus).toBe('INTACT')
    expect(result.totalActivePowerW).toBe(135)
    expect(result.totalLoadCurrentA).toBeCloseTo(0.614, 2)
    expect(result.isOverloaded).toBe(false)
    expect(result.isShortCircuited).toBe(false)
    expect(result.chassisVoltageV).toBe(0)
  })

  it('detects overloading when load exceeds fuse capacity and melts the fuse', () => {
    // 5 A fuse with Iron (1000 W) and Geyser (2000 W) -> Total power 3000 W
    // Current = 3000 / 220 = 13.636 A (> 5 A)
    const result = simulateDomesticCircuit({
      appliances: [
        { id: 'iron', name: 'Iron', powerW: 1000, hasMetalBody: true, icon: '👔', enabled: true },
        { id: 'geyser', name: 'Geyser', powerW: 2000, hasMetalBody: true, icon: '🚿', enabled: true },
      ],
      fuseRatingA: 5,
      earthingConnected: true,
      faultMode: 'none',
      userTouchingChassis: false,
    })

    expect(result.fuseStatus).toBe('BLOWN')
    expect(result.fuseTripReason).toBe('OVERLOAD')
    expect(result.isOverloaded).toBe(true)
    // After fuse blows, branch currents drop to 0
    expect(result.totalActivePowerW).toBe(0)
    expect(result.appliances.every((a) => a.status === 'BLOWN_CIRCUIT')).toBe(true)
  })

  it('simulates short circuit current surge and trips fuse', () => {
    const result = simulateDomesticCircuit({
      appliances: [
        { id: 'bulb', name: 'Bulb', powerW: 60, hasMetalBody: false, icon: '💡', enabled: true },
      ],
      fuseRatingA: 15,
      earthingConnected: true,
      faultMode: 'short_circuit',
      userTouchingChassis: false,
    })

    expect(result.fuseStatus).toBe('BLOWN')
    expect(result.fuseTripReason).toBe('SHORT_CIRCUIT')
    expect(result.isShortCircuited).toBe(true)
  })

  it('verifies earthing protection: with earth, fault current safely trips fuse and keeps human safe', () => {
    // Electric iron on, live wire touches chassis, earthing CONNECTED, user touching chassis
    const result = simulateDomesticCircuit({
      appliances: [
        { id: 'iron', name: 'Iron', powerW: 1000, hasMetalBody: true, icon: '👔', enabled: true },
      ],
      fuseRatingA: 15,
      earthingConnected: true,
      faultMode: 'chassis_leakage',
      userTouchingChassis: true,
    })

    // Earth wire drains high fault current (220 A) which blows the 15 A fuse!
    expect(result.fuseStatus).toBe('BLOWN')
    expect(result.fuseTripReason).toBe('EARTH_FAULT_DISCHARGE')
    expect(result.humanShockCurrentA).toBe(0)
    expect(result.shockRiskLevel).toBe('NONE')
  })

  it('demonstrates deadly hazard: without earthing, chassis stays at 220V and fuse does NOT blow', () => {
    // Electric iron on, live touches chassis, earthing DISCONNECTED, user touching chassis
    // Human resistance = 1000 ohms -> I_human = 220 / 1000 = 0.22 A (220 mA)
    // Fuse rating = 15 A. Since 0.22 A + 4.55 A = 4.77 A < 15 A, the fuse does NOT blow!
    const result = simulateDomesticCircuit({
      appliances: [
        { id: 'iron', name: 'Iron', powerW: 1000, hasMetalBody: true, icon: '👔', enabled: true },
      ],
      fuseRatingA: 15,
      earthingConnected: false,
      faultMode: 'chassis_leakage',
      userTouchingChassis: true,
    })

    expect(result.fuseStatus).toBe('INTACT')
    expect(result.chassisVoltageV).toBe(SUPPLY_VOLTAGE_RMS)
    expect(result.humanShockCurrentA).toBeCloseTo(0.22, 2)
    expect(result.shockRiskLevel).toBe('LETHAL')
    expect(result.safetySummary).toContain('EXTREME SHOCK HAZARD')
  })
})
