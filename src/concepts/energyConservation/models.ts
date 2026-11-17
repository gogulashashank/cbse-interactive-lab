export interface ElectricalEnergyTransfer {
  voltage: number // V
  current: number // A
  timeSeconds: number // s
  powerWatts: number // W
  energyJoules: number // J
  energyKWh: number // kWh
  heatJoules: number // J (assuming 100% conversion into thermal)
}

export function calculateElectricalEnergy(
  voltage: number,
  current: number,
  timeSeconds: number
): ElectricalEnergyTransfer {
  const v = Math.max(0, voltage)
  const i = Math.max(0, current)
  const t = Math.max(0, timeSeconds)
  const powerWatts = v * i
  const energyJoules = powerWatts * t
  const energyKWh = (powerWatts * (t / 3600)) / 1000
  return {
    voltage: v,
    current: i,
    timeSeconds: t,
    powerWatts,
    energyJoules,
    energyKWh,
    heatJoules: energyJoules,
  }
}

export interface JunctionNode {
  currentIn1: number // A
  currentIn2: number // A
  totalIn: number // A
  currentOut1: number // A
  currentOut2: number // A
  totalOut: number // A
  isConserved: boolean
}

export function calculateJunctionConservation(
  iIn1: number,
  iIn2: number,
  ratioOut1: number // fraction going to branch 1 (0 to 1)
): JunctionNode {
  const in1 = Math.max(0, iIn1)
  const in2 = Math.max(0, iIn2)
  const totalIn = Number((in1 + in2).toFixed(3))
  const clampedRatio = Math.max(0, Math.min(1, ratioOut1))
  const out1 = Number((totalIn * clampedRatio).toFixed(3))
  const out2 = Number((totalIn - out1).toFixed(3))
  const totalOut = Number((out1 + out2).toFixed(3))
  return {
    currentIn1: in1,
    currentIn2: in2,
    totalIn,
    currentOut1: out1,
    currentOut2: out2,
    totalOut,
    isConserved: Math.abs(totalIn - totalOut) < 1e-5,
  }
}

export interface CircuitPowerBalance {
  batteryVoltage: number // V
  totalCurrent: number // A
  batteryPower: number // W (source)
  branch1Resistance: number // Ω
  branch2Resistance: number // Ω
  branch1Power: number // W (dissipated)
  branch2Power: number // W (dissipated)
  totalDissipatedPower: number // W
  powerDifference: number // W (should be ~0)
  isBalanced: boolean
}

export function calculateParallelPowerBalance(
  v: number,
  r1: number,
  r2: number
): CircuitPowerBalance {
  const voltage = Math.max(0.1, v)
  const safeR1 = Math.max(0.1, r1)
  const safeR2 = Math.max(0.1, r2)

  const p1 = (voltage * voltage) / safeR1
  const p2 = (voltage * voltage) / safeR2
  const totalDissipated = p1 + p2

  const i1 = voltage / safeR1
  const i2 = voltage / safeR2
  const totalCurrent = i1 + i2
  const batteryPower = voltage * totalCurrent

  const diff = Math.abs(batteryPower - totalDissipated)

  return {
    batteryVoltage: voltage,
    totalCurrent: Number(totalCurrent.toFixed(3)),
    batteryPower: Number(batteryPower.toFixed(2)),
    branch1Resistance: safeR1,
    branch2Resistance: safeR2,
    branch1Power: Number(p1.toFixed(2)),
    branch2Power: Number(p2.toFixed(2)),
    totalDissipatedPower: Number(totalDissipated.toFixed(2)),
    powerDifference: Number(diff.toFixed(3)),
    isBalanced: diff < 1e-3,
  }
}

export interface MechanicalEnergyState {
  massKg: number
  heightMeters: number
  gravity: number // 9.8 m/s^2
  potentialEnergyJoules: number // PE = mgh
  kineticEnergyJoules: number // KE = 1/2 m v^2
  totalEnergyJoules: number // E = PE + KE
  currentVelocityMps: number // v = sqrt(2gh_fallen)
}

export function calculateMechanicalEnergyAtHeight(
  massKg: number,
  initialHeightM: number,
  currentHeightM: number,
  gravity = 9.8
): MechanicalEnergyState {
  const m = Math.max(0.01, massKg)
  const h0 = Math.max(0, initialHeightM)
  const h = Math.max(0, Math.min(h0, currentHeightM))
  const g = gravity

  const totalE = m * g * h0
  const pe = m * g * h
  const ke = totalE - pe
  const v = Math.sqrt(Math.max(0, 2 * g * (h0 - h)))

  return {
    massKg: m,
    heightMeters: Number(h.toFixed(2)),
    gravity: g,
    potentialEnergyJoules: Number(pe.toFixed(2)),
    kineticEnergyJoules: Number(ke.toFixed(2)),
    totalEnergyJoules: Number(totalE.toFixed(2)),
    currentVelocityMps: Number(v.toFixed(2)),
  }
}

export interface ArchimedesBuoyancyState {
  objectVolumeCm3: number
  objectDensityGcm3: number
  fluidDensityGcm3: number
  objectMassKg: number
  weightInAirN: number
  displacedVolumeCm3: number
  buoyantUpthrustN: number
  apparentWeightN: number
  submergedFraction: number
  floats: boolean
}

/**
 * Class 9 Gravitation & Floatation (NCERT Ch 9.5–9.6):
 * Archimedes' Principle: Upthrust F_B equals the weight of fluid displaced.
 * Using g = 10 N/kg (1 cm³ of 1.0 g/cm³ water has mass 1 g = 0.001 kg and weight 0.01 N).
 * If ρ_obj <= ρ_fluid, the object floats in equilibrium with F_B = W_air and W_apparent = 0 N.
 * If ρ_obj > ρ_fluid, the object sinks completely (V_disp = V_obj) and W_apparent = W_air - F_B.
 */
export function calculateArchimedesBuoyancy(
  objectVolumeCm3: number,
  objectDensityGcm3: number,
  fluidDensityGcm3 = 1.0,
  gravity = 10
): ArchimedesBuoyancyState {
  const safeV = Math.max(50, objectVolumeCm3)
  const safeRhoObj = Math.max(0.2, objectDensityGcm3)
  const safeRhoFluid = Math.max(0.5, fluidDensityGcm3)

  const objectMassKg = Number(((safeV * safeRhoObj) / 1000).toFixed(3))
  const weightInAirN = Number((objectMassKg * gravity).toFixed(2))
  const floats = safeRhoObj <= safeRhoFluid

  const submergedFraction = floats ? Number((safeRhoObj / safeRhoFluid).toFixed(3)) : 1
  const displacedVolumeCm3 = Number((safeV * submergedFraction).toFixed(1))
  const displacedFluidMassKg = (displacedVolumeCm3 * safeRhoFluid) / 1000
  const buoyantUpthrustN = Number((displacedFluidMassKg * gravity).toFixed(2))
  const apparentWeightN = floats ? 0 : Number(Math.max(0, weightInAirN - buoyantUpthrustN).toFixed(2))

  return {
    objectVolumeCm3: safeV,
    objectDensityGcm3: safeRhoObj,
    fluidDensityGcm3: safeRhoFluid,
    objectMassKg,
    weightInAirN,
    displacedVolumeCm3,
    buoyantUpthrustN,
    apparentWeightN,
    submergedFraction,
    floats,
  }
}
