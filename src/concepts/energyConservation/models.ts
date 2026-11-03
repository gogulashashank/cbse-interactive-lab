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
