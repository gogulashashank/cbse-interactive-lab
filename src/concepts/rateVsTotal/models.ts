import { tidyNumber } from '../../kit/validation'

export interface BucketResult {
  rateLpm: number
  timeMinutes: number
  totalLitres: number
  isFull: boolean
  fillPercentage: number
}

/** Total = Rate × Time (Litres = L/min × min) */
export function calculateBucket(rateLpm: number, timeMinutes: number, capacityLitres = 20): BucketResult {
  const safeRate = Math.max(0, rateLpm)
  const safeTime = Math.max(0, timeMinutes)
  const totalLitres = tidyNumber(safeRate * safeTime, 2)
  const fillPercentage = Math.min(100, tidyNumber((totalLitres / capacityLitres) * 100, 1))

  return {
    rateLpm: safeRate,
    timeMinutes: safeTime,
    totalLitres,
    isFull: totalLitres >= capacityLitres,
    fillPercentage,
  }
}

export interface ChargeResult {
  currentA: number
  timeS: number
  chargeCoulombs: number
  electronsApprox: number
}

/** Q = I × t (Coulombs = Amperes × seconds) */
export function calculateCharge(currentA: number, timeS: number): ChargeResult {
  const safeI = Math.max(0, currentA)
  const safeT = Math.max(0, timeS)
  const chargeCoulombs = tidyNumber(safeI * safeT, 2)
  // 1 Coulomb ≈ 6.25 × 10^18 electrons
  const electronsApprox = chargeCoulombs * 6.25e18

  return {
    currentA: safeI,
    timeS: safeT,
    chargeCoulombs,
    electronsApprox,
  }
}

export interface EnergyResult {
  powerW: number
  timeS: number
  energyJoules: number
  energyWattHours: number
  energyKWh: number
}

/** E = P × t (Joules = Watts × seconds; Watt-hours = Watts × hours) */
export function calculateEnergy(powerW: number, timeS: number): EnergyResult {
  const safeP = Math.max(0, powerW)
  const safeT = Math.max(0, timeS)
  const energyJoules = tidyNumber(safeP * safeT, 2)
  const energyWattHours = tidyNumber((safeP * safeT) / 3600, 3)
  const energyKWh = tidyNumber(energyWattHours / 1000, 5)

  return {
    powerW: safeP,
    timeS: safeT,
    energyJoules,
    energyWattHours,
    energyKWh,
  }
}

export interface BillComparisonResult {
  geyserKWh: number
  fridgeKWh: number
  geyserCost: number
  fridgeCost: number
  totalCost: number
}

/**
 * Monthly electrical energy comparison.
 * Note: Fridge compressor cycles, so we use average active power ~150 W.
 */
export function calculateBillComparison(
  tariffPerUnit: number,
  days = 30,
  geyserHours = 0.5,
  fridgeHours = 24
): BillComparisonResult {
  const geyserKWh = tidyNumber((2000 * geyserHours * days) / 1000, 2)
  const fridgeKWh = tidyNumber((150 * fridgeHours * days) / 1000, 2)
  const geyserCost = tidyNumber(geyserKWh * tariffPerUnit, 2)
  const fridgeCost = tidyNumber(fridgeKWh * tariffPerUnit, 2)

  return {
    geyserKWh,
    fridgeKWh,
    geyserCost,
    fridgeCost,
    totalCost: tidyNumber(geyserCost + fridgeCost, 2),
  }
}
