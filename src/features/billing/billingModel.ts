import {
  validateAppliancePower,
  validateBillingDays,
  validateHoursPerDay,
  validateQuantity,
  validateTariffRate,
} from './billingLimits'

/**
 * 1 kWh = 1000 W * 3600 s = 3,600,000 Joules = 3.6 * 10^6 J
 * 1 kWh is also commercially known in India and the Commonwealth as 1 "Board of Trade Unit" (B.O.T.U.) or simply 1 "unit".
 */
export const JOULES_PER_KWH = 3.6e6

export interface ApplianceUsageState {
  id: string
  name: string
  powerW: number
  hoursPerDay: number
  quantity: number
  enabled: boolean
}

export interface ApplianceEnergyResult {
  id: string
  name: string
  powerW: number
  totalPowerW: number // powerW * quantity
  hoursPerDay: number
  quantity: number
  enabled: boolean
  dailyEnergyKWh: number
  totalEnergyKWh: number
  totalEnergyJoules: number
  totalCostRupees: number
  costPercentageOfTotal: number
}

export interface HouseholdBillingInput {
  appliances: readonly ApplianceUsageState[]
  billingDays: number
  tariffRateRupeesPerKWh: number
}

export interface HouseholdBillingResult {
  appliances: readonly ApplianceEnergyResult[]
  totalConnectedPowerW: number
  activePowerDrawW: number
  dailyEnergyKWh: number
  totalEnergyKWh: number // Commercially "Units"
  totalEnergyJoules: number
  totalCostRupees: number
  billingDays: number
  tariffRateRupeesPerKWh: number
  highestEnergyApplianceId: string | null
}

/**
 * Convert energy in kWh to Joules:
 * E (Joules) = E (kWh) * 3.6 * 10^6
 */
export function convertKWhToJoules(kWh: number): number {
  return kWh * JOULES_PER_KWH
}

/**
 * Convert Joules to kWh:
 * E (kWh) = E (Joules) / (3.6 * 10^6)
 */
export function convertJoulesToKWh(joules: number): number {
  return joules / JOULES_PER_KWH
}

/**
 * Calculates energy consumed by a single appliance over a given number of days in kWh:
 * Energy (kWh) = (Power in Watts * Hours/day * Days * Quantity) / 1000
 */
export function calculateApplianceEnergyKWh(
  powerW: number,
  hoursPerDay: number,
  days: number,
  quantity: number = 1
): number {
  validateAppliancePower(powerW)
  validateHoursPerDay(hoursPerDay)
  validateBillingDays(days)
  validateQuantity(quantity)

  return (powerW * hoursPerDay * days * quantity) / 1000
}

/**
 * Calculates financial cost:
 * Cost (₹) = Energy (kWh) * Tariff (₹/kWh)
 */
export function calculateEnergyCost(energyKWh: number, tariffRate: number): number {
  validateTariffRate(tariffRate)
  return energyKWh * tariffRate
}

/**
 * Full scientific calculation for a household configuration.
 */
export function calculateHouseholdBilling(
  input: HouseholdBillingInput
): HouseholdBillingResult {
  validateBillingDays(input.billingDays)
  validateTariffRate(input.tariffRateRupeesPerKWh)

  let totalConnectedPowerW = 0
  let activePowerDrawW = 0
  let dailyEnergyKWh = 0
  let totalEnergyKWh = 0

  // First pass: compute energy for each appliance
  const rawResults: {
    id: string
    name: string
    powerW: number
    totalPowerW: number
    hoursPerDay: number
    quantity: number
    enabled: boolean
    dailyEnergyKWh: number
    totalEnergyKWh: number
    totalEnergyJoules: number
    totalCostRupees: number
  }[] = []

  for (const app of input.appliances) {
    validateAppliancePower(app.powerW)
    validateHoursPerDay(app.hoursPerDay)
    validateQuantity(app.quantity)

    const totalPower = app.powerW * app.quantity
    totalConnectedPowerW += totalPower

    if (!app.enabled || app.hoursPerDay === 0) {
      rawResults.push({
        id: app.id,
        name: app.name,
        powerW: app.powerW,
        totalPowerW: totalPower,
        hoursPerDay: app.hoursPerDay,
        quantity: app.quantity,
        enabled: app.enabled,
        dailyEnergyKWh: 0,
        totalEnergyKWh: 0,
        totalEnergyJoules: 0,
        totalCostRupees: 0,
      })
      continue
    }

    activePowerDrawW += totalPower
    const dailyAppEnergy = (totalPower * app.hoursPerDay) / 1000
    const totalAppEnergy = dailyAppEnergy * input.billingDays
    const totalJoules = convertKWhToJoules(totalAppEnergy)
    const totalCost = totalAppEnergy * input.tariffRateRupeesPerKWh

    dailyEnergyKWh += dailyAppEnergy
    totalEnergyKWh += totalAppEnergy

    rawResults.push({
      id: app.id,
      name: app.name,
      powerW: app.powerW,
      totalPowerW: totalPower,
      hoursPerDay: app.hoursPerDay,
      quantity: app.quantity,
      enabled: app.enabled,
      dailyEnergyKWh: dailyAppEnergy,
      totalEnergyKWh: totalAppEnergy,
      totalEnergyJoules: totalJoules,
      totalCostRupees: totalCost,
    })
  }

  const totalCostRupees = totalEnergyKWh * input.tariffRateRupeesPerKWh
  const totalEnergyJoules = convertKWhToJoules(totalEnergyKWh)

  // Find appliance with highest energy consumption
  let highestEnergyApplianceId: string | null = null
  let maxEnergy = -1

  const appliances: ApplianceEnergyResult[] = rawResults.map((app) => {
    const percentage = totalEnergyKWh > 0 ? (app.totalEnergyKWh / totalEnergyKWh) * 100 : 0
    if (app.totalEnergyKWh > maxEnergy && app.totalEnergyKWh > 0) {
      maxEnergy = app.totalEnergyKWh
      highestEnergyApplianceId = app.id
    }
    return {
      ...app,
      costPercentageOfTotal: percentage,
    }
  })

  return {
    appliances,
    totalConnectedPowerW,
    activePowerDrawW,
    dailyEnergyKWh,
    totalEnergyKWh,
    totalEnergyJoules,
    totalCostRupees,
    billingDays: input.billingDays,
    tariffRateRupeesPerKWh: input.tariffRateRupeesPerKWh,
    highestEnergyApplianceId,
  }
}
