import {
  type FuseRating,
  type SafetyFaultMode,
  SUPPLY_VOLTAGE_RMS,
  SHORT_CIRCUIT_CURRENT_A,
  EARTH_WIRE_RESISTANCE_OHMS,
  HUMAN_BODY_RESISTANCE_OHMS,
  validateFuseRating,
  validateSupplyVoltage,
} from './safetyLimits'

export interface ActiveApplianceState {
  id: string
  name: string
  powerW: number
  hasMetalBody: boolean
  icon: string
  enabled: boolean
  isInsulationDamaged?: boolean // specific fault target (e.g. for electric iron)
}

export interface DomesticCircuitInput {
  appliances: readonly ActiveApplianceState[]
  fuseRatingA: FuseRating
  supplyVoltageV?: number
  earthingConnected: boolean
  faultMode: SafetyFaultMode
  userTouchingChassis: boolean
}

export interface BranchCurrentResult {
  id: string
  name: string
  powerW: number
  currentA: number
  resistanceOhms: number
  enabled: boolean
  hasMetalBody: boolean
  icon: string
  status: 'OFF' | 'NORMAL' | 'BLOWN_CIRCUIT'
}

export interface DomesticCircuitResult {
  supplyVoltageV: number
  fuseRatingA: FuseRating
  fuseStatus: 'INTACT' | 'BLOWN'
  fuseTripReason: 'NONE' | 'OVERLOAD' | 'SHORT_CIRCUIT' | 'EARTH_FAULT_DISCHARGE'
  fuseColor: 'normal' | 'overheating' | 'blown'
  totalConnectedPowerW: number
  totalActivePowerW: number
  totalLoadCurrentA: number
  shortCircuitCurrentA: number
  totalLineCurrentA: number
  isOverloaded: boolean
  isShortCircuited: boolean
  chassisVoltageV: number // Potential on appliance metal body (0V to 220V)
  chassisEarthCurrentA: number // Current through earth wire to ground
  humanShockCurrentA: number // Current passing through user's body
  shockRiskLevel: 'NONE' | 'SAFE' | 'PERCEPTIBLE' | 'DANGEROUS' | 'LETHAL'
  appliances: readonly BranchCurrentResult[]
  safetySummary: string
}

/**
 * Calculates current drawn by an individual appliance branch:
 * I_branch = P / V
 * R_appliance = V^2 / P
 */
export function calculateBranchCurrent(powerW: number, voltageV: number = SUPPLY_VOLTAGE_RMS): number {
  if (powerW <= 0 || voltageV <= 0) return 0
  return powerW / voltageV
}

/**
 * Calculates effective resistance of an appliance at nominal voltage:
 * R = V^2 / P
 */
export function calculateApplianceResistance(powerW: number, voltageV: number = SUPPLY_VOLTAGE_RMS): number {
  if (powerW <= 0 || voltageV <= 0) return Infinity
  return (voltageV * voltageV) / powerW
}

/**
 * Evaluates human shock risk based on current through human body (RMS AC at 50 Hz):
 * Thresholds (NCERT / IEC 60479-1):
 * < 1 mA: Barely perceptible or imperceptible (Safe)
 * 1 - 5 mA: Perceptible tingling, safe, no muscle control loss
 * 5 - 15 mA: Painful shock, muscles contract, let-go threshold (Can let go)
 * 15 - 50 mA: Cannot let go (freezing to wire), severe breathing difficulty (Dangerous)
 * > 50 mA - 100 mA: Ventricular fibrillation, fatal cardiac arrest (Lethal)
 */
export function evaluateShockRisk(currentA: number): 'NONE' | 'SAFE' | 'PERCEPTIBLE' | 'DANGEROUS' | 'LETHAL' {
  const current_mA = currentA * 1000
  if (current_mA <= 0.05) return 'NONE'
  if (current_mA < 1.0) return 'SAFE'
  if (current_mA < 10.0) return 'PERCEPTIBLE'
  if (current_mA < 50.0) return 'DANGEROUS'
  return 'LETHAL'
}

/**
 * Core simulation model for domestic circuits:
 * 1. Computes all individual branch currents (in parallel, full V across each).
 * 2. Sums total appliance load current: I_load = sum(I_i).
 * 3. Handles fault conditions:
 *    - short_circuit: Live touches Neutral directly (R -> 0), current surges to 500 A.
 *    - chassis_leakage: Live touches metallic casing of active metal-body appliance.
 * 4. Earthing protection calculation:
 *    - WITH Earth: Casing connected to low resistance earth wire (R_earth ~ 1 ohm).
 *      Fault current I_fault = 220 V / 1 ohm = 220 A.
 *      Chassis potential V_chassis = 220 * (1 / (1 + R_live_lead)) ~ 0 - 2 V (safe).
 *      Surge of 220 A immediately melts the fuse!
 *    - WITHOUT Earth: Casing floating at 220 V.
 *      If user touches it, current flows through user body to earth:
 *      I_human = 220 V / 1000 ohm = 0.22 A = 220 mA (> 50 mA = Lethal shock!).
 *      Because 0.22 A is smaller than 5 A or 15 A fuse rating, the fuse will NOT blow,
 *      continuing to electrocute the human unless saved by external intervention!
 * 5. Fuse evaluation:
 *    If total current exceeds fuse rating, fuse melts (breaks circuit).
 */
export function simulateDomesticCircuit(input: DomesticCircuitInput): DomesticCircuitResult {
  const voltageV = validateSupplyVoltage(input.supplyVoltageV ?? SUPPLY_VOLTAGE_RMS)
  const fuseRatingA = validateFuseRating(input.fuseRatingA)

  let totalConnectedPowerW = 0
  let totalActivePowerW = 0
  let totalLoadCurrentA = 0

  const branchResults: BranchCurrentResult[] = input.appliances.map((app) => {
    totalConnectedPowerW += app.powerW
    const branchCurrent = app.enabled ? calculateBranchCurrent(app.powerW, voltageV) : 0
    const resistance = calculateApplianceResistance(app.powerW, voltageV)

    if (app.enabled) {
      totalActivePowerW += app.powerW
      totalLoadCurrentA += branchCurrent
    }

    return {
      id: app.id,
      name: app.name,
      powerW: app.powerW,
      currentA: branchCurrent,
      resistanceOhms: resistance,
      enabled: app.enabled,
      hasMetalBody: app.hasMetalBody,
      icon: app.icon,
      status: app.enabled ? 'NORMAL' : 'OFF',
    }
  })

  // Fault variables
  let isShortCircuited = false
  let shortCircuitCurrentA = 0
  let chassisVoltageV = 0
  let chassisEarthCurrentA = 0
  let humanShockCurrentA = 0
  let fuseTripReason: 'NONE' | 'OVERLOAD' | 'SHORT_CIRCUIT' | 'EARTH_FAULT_DISCHARGE' = 'NONE'

  // Check fault mode
  if (input.faultMode === 'short_circuit') {
    isShortCircuited = true
    shortCircuitCurrentA = SHORT_CIRCUIT_CURRENT_A
  } else if (input.faultMode === 'chassis_leakage') {
    // Check if any metal body appliance is turned on
    const activeMetalAppliance = input.appliances.find((a) => a.hasMetalBody && a.enabled)
    const hasLeakageActive = !!activeMetalAppliance

    if (hasLeakageActive) {
      if (input.earthingConnected) {
        // Safe low resistance path to earth
        // Fault current = V / R_earth (approx 220 A)
        chassisEarthCurrentA = voltageV / EARTH_WIRE_RESISTANCE_OHMS
        // Casing voltage is tiny (voltage divider between fault resistance and ground, practically < 1V)
        chassisVoltageV = 0.5

        if (input.userTouchingChassis) {
          // Voltage across human is chassisVoltageV (0.5 V)
          humanShockCurrentA = chassisVoltageV / HUMAN_BODY_RESISTANCE_OHMS
        }
      } else {
        // UNGROUNDED! Metal body is energised to 220 V live!
        chassisVoltageV = voltageV
        chassisEarthCurrentA = 0

        if (input.userTouchingChassis) {
          // Fatal shock current flows through human
          humanShockCurrentA = voltageV / HUMAN_BODY_RESISTANCE_OHMS // 220 / 1000 = 0.22 A = 220 mA
        }
      }
    }
  }

  // Total current attempting to pass through the main fuse
  const totalLineCurrentA = totalLoadCurrentA + shortCircuitCurrentA + chassisEarthCurrentA + humanShockCurrentA

  // Fuse blowing condition:
  // If line current exceeds fuse rating, the fuse wire heats up rapidly and blows
  let fuseStatus: 'INTACT' | 'BLOWN' = 'INTACT'
  let fuseColor: 'normal' | 'overheating' | 'blown' = 'normal'

  if (totalLineCurrentA > fuseRatingA) {
    fuseStatus = 'BLOWN'
    fuseColor = 'blown'

    if (isShortCircuited) {
      fuseTripReason = 'SHORT_CIRCUIT'
    } else if (chassisEarthCurrentA > 0) {
      fuseTripReason = 'EARTH_FAULT_DISCHARGE'
    } else {
      fuseTripReason = 'OVERLOAD'
    }
  } else if (totalLineCurrentA > fuseRatingA * 0.85) {
    fuseColor = 'overheating'
  }

  // If fuse is blown, the circuit is open! No current can flow through appliances or user after tripping
  const isOverloaded = totalLoadCurrentA > fuseRatingA

  // If fuse blows, currents downstream drop to 0
  const finalAppliances = branchResults.map((br) => ({
    ...br,
    status: (fuseStatus === 'BLOWN' ? 'BLOWN_CIRCUIT' : br.status) as 'OFF' | 'NORMAL' | 'BLOWN_CIRCUIT',
    currentA: fuseStatus === 'BLOWN' ? 0 : br.currentA,
  }))

  const finalHumanCurrentA = fuseStatus === 'BLOWN' ? 0 : humanShockCurrentA
  const finalChassisVoltageV = fuseStatus === 'BLOWN' ? 0 : chassisVoltageV
  const shockRiskLevel = evaluateShockRisk(finalHumanCurrentA)

  let safetySummary = 'Circuit operating normally and safely within rated limits.'
  if (fuseStatus === 'BLOWN') {
    if (fuseTripReason === 'SHORT_CIRCUIT') {
      safetySummary = `Short circuit detected! Drastic current surge (${SHORT_CIRCUIT_CURRENT_A} A) instantly melted the ${fuseRatingA} A fuse wire, interrupting the fire hazard.`
    } else if (fuseTripReason === 'EARTH_FAULT_DISCHARGE') {
      safetySummary = `Insulation breakdown! Live wire touched metallic chassis. The Earth wire safely drained high current (${chassisEarthCurrentA.toFixed(0)} A) to ground, blowing the ${fuseRatingA} A fuse and protecting the user from fatal shock!`
    } else {
      safetySummary = `Overloading! Total current drawn (${totalLoadCurrentA.toFixed(2)} A) exceeded fuse rating (${fuseRatingA} A). Fuse wire melted safely to prevent wiring overheat and fire.`
    }
  } else if (shockRiskLevel === 'DANGEROUS' || shockRiskLevel === 'LETHAL') {
    safetySummary = `EXTREME SHOCK HAZARD! Live wire touches metallic body with NO EARTHING. Body is at 220 V. Current through user is ${(finalHumanCurrentA * 1000).toFixed(0)} mA. The ${fuseRatingA} A fuse does NOT blow because 0.22 A < ${fuseRatingA} A!`
  } else if (isOverloaded) {
    safetySummary = `Warning: Current (${totalLoadCurrentA.toFixed(2)} A) exceeds fuse limit (${fuseRatingA} A). Fuse is about to blow!`
  }

  return {
    supplyVoltageV: voltageV,
    fuseRatingA,
    fuseStatus,
    fuseTripReason,
    fuseColor,
    totalConnectedPowerW,
    totalActivePowerW: fuseStatus === 'BLOWN' ? 0 : totalActivePowerW,
    totalLoadCurrentA: fuseStatus === 'BLOWN' ? 0 : totalLoadCurrentA,
    shortCircuitCurrentA: fuseStatus === 'BLOWN' ? 0 : shortCircuitCurrentA,
    totalLineCurrentA: fuseStatus === 'BLOWN' ? 0 : totalLineCurrentA,
    isOverloaded,
    isShortCircuited,
    chassisVoltageV: finalChassisVoltageV,
    chassisEarthCurrentA: fuseStatus === 'BLOWN' ? 0 : chassisEarthCurrentA,
    humanShockCurrentA: finalHumanCurrentA,
    shockRiskLevel,
    appliances: finalAppliances,
    safetySummary,
  }
}
