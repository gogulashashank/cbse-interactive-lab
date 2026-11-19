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

export interface VelocityTimeGraphResult {
  initialVelocityMps: number
  finalVelocityMps: number
  timeSeconds: number
  accelerationMps2: number
  rectangleDisplacementM: number
  triangleDisplacementM: number
  totalDisplacementM: number
  averageVelocityMps: number
}

/**
 * Class 9 Motion (NCERT Ch 7.4):
 * Slope of v-t graph = acceleration a = (v - u) / t (m/s²).
 * Area under v-t graph = displacement s = u*t + 0.5*(v - u)*t (m).
 * Assumes uniform (constant) acceleration along a straight line.
 */
export function calculateVelocityTimeGraph(
  initialVelocityMps: number,
  finalVelocityMps: number,
  timeSeconds: number
): VelocityTimeGraphResult {
  const safeU = Math.max(0, initialVelocityMps)
  const safeV = Math.max(0, finalVelocityMps)
  const safeT = Math.max(0.5, timeSeconds)

  const accelerationMps2 = tidyNumber((safeV - safeU) / safeT, 2)
  const rectangleDisplacementM = tidyNumber(safeU * safeT, 2)
  const triangleDisplacementM = tidyNumber(0.5 * (safeV - safeU) * safeT, 2)
  const totalDisplacementM = tidyNumber(rectangleDisplacementM + triangleDisplacementM, 2)
  const averageVelocityMps = tidyNumber((safeU + safeV) / 2, 2)

  return {
    initialVelocityMps: safeU,
    finalVelocityMps: safeV,
    timeSeconds: safeT,
    accelerationMps2,
    rectangleDisplacementM,
    triangleDisplacementM,
    totalDisplacementM,
    averageVelocityMps,
  }
}

export type HomologousFamilyId = 'alkane' | 'alkene' | 'alkyne' | 'alcohol'

export interface HomologousMemberResult {
  family: HomologousFamilyId
  generalFormula: string
  carbonCountN: number
  hydrogenCount: number
  oxygenCount: number
  molecularFormula: string
  iupacName: string
  molecularMassU: number
  nextHomologueFormula: string
  nextHomologueMassU: number
  massStepToNextU: 14
  saturationKind: 'saturated' | 'unsaturated-double' | 'unsaturated-triple'
  decolourisesBromineWater: boolean
}

const IUPAC_PREFIXES: Record<number, string> = {
  1: 'Meth',
  2: 'Eth',
  3: 'Prop',
  4: 'But',
  5: 'Pent',
  6: 'Hex',
}

function toSubscript(n: number): string {
  if (n <= 1) return ''
  const map: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  }
  return String(n)
    .split('')
    .map((d) => map[d] ?? d)
    .join('')
}

/**
 * Class 10 Chemistry Ch 4 (NCERT Sec 4.2.4 — Homologous Series):
 * - Alkanes: CnH(2n+2) (saturated, single bonds)
 * - Alkenes: CnH(2n) for n >= 2 (unsaturated, 1 C=C double bond)
 * - Alkynes: CnH(2n-2) for n >= 2 (unsaturated, 1 C≡C triple bond)
 * - Alcohols: CnH(2n+1)OH (saturated chain + -OH functional group)
 * Every successive member in a homologous series differs by +CH₂ (+14 u).
 */
export function calculateHomologousMember(
  family: HomologousFamilyId,
  carbonCountN: number
): HomologousMemberResult {
  const minN = family === 'alkene' || family === 'alkyne' ? 2 : 1
  const n = Math.max(minN, Math.min(6, Math.round(carbonCountN)))
  const prefix = IUPAC_PREFIXES[n] ?? `C${n}`

  let hydrogenCount = 2 * n + 2
  let oxygenCount = 0
  let generalFormula = 'CₙH₂ₙ₊₂'
  let iupacName = `${prefix}ane`
  let molecularFormula = `C${toSubscript(n)}H${toSubscript(hydrogenCount)}`
  let nextHomologueFormula = `C${toSubscript(n + 1)}H${toSubscript(hydrogenCount + 2)}`
  let saturationKind: HomologousMemberResult['saturationKind'] = 'saturated'

  if (family === 'alkene') {
    hydrogenCount = 2 * n
    generalFormula = 'CₙH₂ₙ'
    iupacName = `${prefix}ene`
    molecularFormula = `C${toSubscript(n)}H${toSubscript(hydrogenCount)}`
    nextHomologueFormula = `C${toSubscript(n + 1)}H${toSubscript(hydrogenCount + 2)}`
    saturationKind = 'unsaturated-double'
  } else if (family === 'alkyne') {
    hydrogenCount = 2 * n - 2
    generalFormula = 'CₙH₂ₙ₋₂'
    iupacName = `${prefix}yne`
    molecularFormula = `C${toSubscript(n)}H${toSubscript(hydrogenCount)}`
    nextHomologueFormula = `C${toSubscript(n + 1)}H${toSubscript(hydrogenCount + 2)}`
    saturationKind = 'unsaturated-triple'
  } else if (family === 'alcohol') {
    hydrogenCount = 2 * n + 2
    oxygenCount = 1
    generalFormula = 'CₙH₂ₙ₊₁OH'
    iupacName = `${prefix}anol`
    const alkylH = 2 * n + 1
    molecularFormula = `C${toSubscript(n)}H${toSubscript(alkylH)}OH`
    nextHomologueFormula = `C${toSubscript(n + 1)}H${toSubscript(alkylH + 2)}OH`
    saturationKind = 'saturated'
  }

  const molecularMassU = n * 12 + hydrogenCount * 1 + oxygenCount * 16
  const nextHomologueMassU = molecularMassU + 14

  return {
    family,
    generalFormula,
    carbonCountN: n,
    hydrogenCount,
    oxygenCount,
    molecularFormula,
    iupacName,
    molecularMassU,
    nextHomologueFormula,
    nextHomologueMassU,
    massStepToNextU: 14,
    saturationKind,
    decolourisesBromineWater: saturationKind !== 'saturated',
  }
}

export type RespirationPathwayId =
  | 'aerobic-mitochondria'
  | 'yeast-anaerobic'
  | 'muscle-oxygen-debt'

export interface CellularRespirationATPResult {
  pathway: RespirationPathwayId
  glucoseMoles: number
  pyruvateIntermediateMoles: number
  atpRatePerGlucose: number
  totalAtpMoles: number
  aerobicBenchmarkAtpMoles: number
  yieldRatioVsAnaerobic: number
  cellularSite: string
  endProductsText: string
  co2MolesReleased: number
  causesMuscleCramps: boolean
}

/**
 * Class 10 Biology Ch 5 (NCERT Sec 5.3, Fig 5.8 — Breakdown of Glucose by Various Pathways):
 * Step 1 (in Cytoplasm): 1 Glucose (6-carbon) -> 2 Pyruvate (3-carbon).
 * Step 2:
 * - Aerobic (in Mitochondria, presence of O2): -> 6 CO2 + 6 H2O + 38 ATP per glucose.
 * - Anaerobic fermentation (in Yeast, absence of O2): -> 2 Ethanol (2C) + 2 CO2 + 2 ATP per glucose.
 * - Muscle oxygen lack (in Human Muscle Cells): -> 2 Lactic Acid (3C) + 2 ATP per glucose (no CO2; causes cramps).
 */
export function calculateCellularRespirationATP(
  pathway: RespirationPathwayId,
  glucoseMoles: number
): CellularRespirationATPResult {
  const safeG = Math.max(1, Math.min(10, Math.round(glucoseMoles)))
  const pyruvateIntermediateMoles = safeG * 2
  const aerobicBenchmarkAtpMoles = safeG * 38

  if (pathway === 'aerobic-mitochondria') {
    return {
      pathway,
      glucoseMoles: safeG,
      pyruvateIntermediateMoles,
      atpRatePerGlucose: 38,
      totalAtpMoles: safeG * 38,
      aerobicBenchmarkAtpMoles,
      yieldRatioVsAnaerobic: 19,
      cellularSite: 'Cytoplasm → Mitochondria (+O₂)',
      endProductsText: `${safeG * 6} CO₂ + ${safeG * 6} H₂O`,
      co2MolesReleased: safeG * 6,
      causesMuscleCramps: false,
    }
  }

  if (pathway === 'yeast-anaerobic') {
    return {
      pathway,
      glucoseMoles: safeG,
      pyruvateIntermediateMoles,
      atpRatePerGlucose: 2,
      totalAtpMoles: safeG * 2,
      aerobicBenchmarkAtpMoles,
      yieldRatioVsAnaerobic: 1,
      cellularSite: 'Cytoplasm → Yeast Cell (No O₂)',
      endProductsText: `${safeG * 2} Ethanol (C₂H₅OH) + ${safeG * 2} CO₂`,
      co2MolesReleased: safeG * 2,
      causesMuscleCramps: false,
    }
  }

  return {
    pathway,
    glucoseMoles: safeG,
    pyruvateIntermediateMoles,
    atpRatePerGlucose: 2,
    totalAtpMoles: safeG * 2,
    aerobicBenchmarkAtpMoles,
    yieldRatioVsAnaerobic: 1,
    cellularSite: 'Cytoplasm → Muscle Cell (Lack of O₂)',
    endProductsText: `${safeG * 2} Lactic Acid (C₃H₆O₃, 3-Carbon)`,
    co2MolesReleased: 0,
    causesMuscleCramps: true,
  }
}
