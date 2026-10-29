import {
  validateDuration,
  validateResistance,
  validateSupplyVoltage,
} from './powerHeatingLimits'

export interface HeatingCircuitInput {
  supplyVoltageV: number
  resistanceOhm: number
  switchClosed: boolean
  elapsedTimeS: number
}

export interface HeatingCircuitResult {
  supplyVoltageV: number
  elementVoltageV: number
  resistanceOhm: number
  switchClosed: boolean
  currentA: number
  powerW: number
  elapsedTimeS: number
  energyJ: number
  energyKJ: number
}

export interface EnergyDataPoint {
  timeS: number
  energyJ: number
  powerW: number
  voltageV: number
  resistanceOhm: number
}

export const INITIAL_HEATING_INPUT: HeatingCircuitInput = {
  supplyVoltageV: 6.0,
  resistanceOhm: 6.0,
  switchClosed: true,
  elapsedTimeS: 0,
}

/**
 * Calculates current, power, and accumulated heat energy for a resistive heating element.
 *
 * Closed switch:
 *   I = V / R
 *   P = V * I = V^2 / R = I^2 * R
 *   H = P * t  (Joule's Law of Heating)
 *
 * Open switch:
 *   I = 0 A
 *   P = 0 W
 *   H = 0 J (or frozen)
 */
export function calculateHeatingCircuit(input: HeatingCircuitInput): HeatingCircuitResult {
  validateSupplyVoltage(input.supplyVoltageV)
  validateResistance(input.resistanceOhm)
  validateDuration(Math.max(1, input.elapsedTimeS === 0 ? 1 : input.elapsedTimeS))

  const { supplyVoltageV, resistanceOhm, switchClosed, elapsedTimeS } = input

  if (!switchClosed) {
    return {
      supplyVoltageV,
      elementVoltageV: 0,
      resistanceOhm,
      switchClosed: false,
      currentA: 0,
      powerW: 0,
      elapsedTimeS,
      energyJ: 0,
      energyKJ: 0,
    }
  }

  const elementVoltageV = supplyVoltageV
  const currentA = supplyVoltageV / resistanceOhm
  const powerW = supplyVoltageV * currentA // equivalently supplyVoltageV^2 / resistanceOhm
  const energyJ = powerW * elapsedTimeS
  const energyKJ = energyJ / 1000

  return {
    supplyVoltageV,
    elementVoltageV,
    resistanceOhm,
    switchClosed: true,
    currentA,
    powerW,
    elapsedTimeS,
    energyJ,
    energyKJ,
  }
}

/**
 * Calculate instantaneous power (W) given voltage (V) and resistance (Ω).
 * P = V^2 / R
 */
export function calculatePowerFromVoltage(voltageV: number, resistanceOhm: number): number {
  validateSupplyVoltage(voltageV)
  validateResistance(resistanceOhm)
  return (voltageV * voltageV) / resistanceOhm
}

/**
 * Calculate instantaneous power (W) given current (A) and resistance (Ω).
 * P = I^2 * R
 */
export function calculatePowerFromCurrent(currentA: number, resistanceOhm: number): number {
  validateResistance(resistanceOhm)
  return currentA * currentA * resistanceOhm
}

/**
 * Calculate total heat energy (J) given power (W) and time (s).
 * H = P * t
 */
export function calculateHeatEnergy(powerW: number, durationS: number): number {
  if (powerW < 0) throw new Error('Power cannot be negative.')
  if (durationS < 0) throw new Error('Duration cannot be negative.')
  return powerW * durationS
}
