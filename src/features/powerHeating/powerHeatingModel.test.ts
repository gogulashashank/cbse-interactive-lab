import { describe, it, expect } from 'vitest'
import {
  calculateHeatingCircuit,
  calculatePowerFromVoltage,
  calculatePowerFromCurrent,
  calculateHeatEnergy,
  INITIAL_HEATING_INPUT,
} from './powerHeatingModel'
import { PowerHeatingValidationError } from './powerHeatingLimits'

describe('Power and Heating Scientific Model', () => {
  it('computes acceptance benchmark 1: 6 V on 6 Ω for 10 s', () => {
    const result = calculateHeatingCircuit({
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 10,
    })

    expect(result.currentA).toBeCloseTo(1.0, 5)
    expect(result.powerW).toBeCloseTo(6.0, 5)
    expect(result.energyJ).toBeCloseTo(60.0, 5)
    expect(result.energyKJ).toBeCloseTo(0.06, 5)
    expect(result.elementVoltageV).toBeCloseTo(6.0, 5)
  })

  it('computes acceptance benchmark 2: 12 V on 6 Ω for 10 s (doubling voltage quadruples power and heat)', () => {
    const result = calculateHeatingCircuit({
      supplyVoltageV: 12.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 10,
    })

    expect(result.currentA).toBeCloseTo(2.0, 5)
    expect(result.powerW).toBeCloseTo(24.0, 5)
    expect(result.energyJ).toBeCloseTo(240.0, 5)
    expect(result.energyKJ).toBeCloseTo(0.24, 5)
  })

  it('returns zero current, zero power, and zero energy when switch is open', () => {
    const result = calculateHeatingCircuit({
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: false,
      elapsedTimeS: 10,
    })

    expect(result.elementVoltageV).toBe(0)
    expect(result.currentA).toBe(0)
    expect(result.powerW).toBe(0)
    expect(result.energyJ).toBe(0)
    expect(result.switchClosed).toBe(false)
  })

  it('doubling duration doubles heat energy while power remains unchanged', () => {
    const res10 = calculateHeatingCircuit({
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 10,
    })
    const res20 = calculateHeatingCircuit({
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 20,
    })

    expect(res10.powerW).toBe(6.0)
    expect(res20.powerW).toBe(6.0)
    expect(res20.energyJ).toBe(2 * res10.energyJ)
    expect(res20.energyJ).toBe(120.0)
  })

  it('doubling resistance at constant voltage halves both power and heat', () => {
    const res6 = calculateHeatingCircuit({
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 10,
    })
    const res12 = calculateHeatingCircuit({
      supplyVoltageV: 6.0,
      resistanceOhm: 12.0,
      switchClosed: true,
      elapsedTimeS: 10,
    })

    expect(res6.powerW).toBe(6.0)
    expect(res12.powerW).toBe(3.0)
    expect(res12.energyJ).toBe(30.0)
    expect(res12.currentA).toBe(0.5)
  })

  it('calculates power correctly from voltage (P = V²/R)', () => {
    const p1 = calculatePowerFromVoltage(6.0, 6.0)
    expect(p1).toBe(6.0)

    const p2 = calculatePowerFromVoltage(12.0, 6.0)
    expect(p2).toBe(24.0)

    const p3 = calculatePowerFromVoltage(12.0, 4.0)
    expect(p3).toBe(36.0)
  })

  it('calculates power correctly from current (P = I²R for series comparison)', () => {
    const pSeries1 = calculatePowerFromCurrent(2.0, 2.0)
    expect(pSeries1).toBe(8.0) // 2^2 * 2 = 8 W

    const pSeries2 = calculatePowerFromCurrent(2.0, 8.0)
    expect(pSeries2).toBe(32.0) // 2^2 * 8 = 32 W (higher resistance produces more heat when I is fixed)
  })

  it('calculates total heat energy correctly (H = P * t)', () => {
    expect(calculateHeatEnergy(24.0, 10)).toBe(240.0)
    expect(calculateHeatEnergy(5.0, 60)).toBe(300.0)
  })

  it('handles zero voltage gracefully without errors', () => {
    const res = calculateHeatingCircuit({
      supplyVoltageV: 0.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 10,
    })

    expect(res.currentA).toBe(0)
    expect(res.powerW).toBe(0)
    expect(res.energyJ).toBe(0)
  })

  it('rejects out of range voltage', () => {
    expect(() =>
      calculateHeatingCircuit({
        ...INITIAL_HEATING_INPUT,
        supplyVoltageV: -1.0,
      })
    ).toThrow(PowerHeatingValidationError)

    expect(() =>
      calculateHeatingCircuit({
        ...INITIAL_HEATING_INPUT,
        supplyVoltageV: 15.0,
      })
    ).toThrow(PowerHeatingValidationError)
  })

  it('rejects out of range resistance', () => {
    expect(() =>
      calculateHeatingCircuit({
        ...INITIAL_HEATING_INPUT,
        resistanceOhm: 0.5,
      })
    ).toThrow(PowerHeatingValidationError)

    expect(() =>
      calculateHeatingCircuit({
        ...INITIAL_HEATING_INPUT,
        resistanceOhm: 100.0,
      })
    ).toThrow(PowerHeatingValidationError)
  })
})
