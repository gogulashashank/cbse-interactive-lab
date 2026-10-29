/**
 * Pure TypeScript Scientific Model: Resistivity and Wire Resistance (Class 10 Optics & Electricity)
 *
 * Law: R = ρ · (L / A)
 * where:
 * - R: resistance in ohms (Ω)
 * - ρ: electrical resistivity of the material at 20 °C in ohm-meters (Ω·m)
 * - L: length of wire in meters (m)
 * - A: cross-sectional area in square meters (m²); in UI input as mm² (1 mm² = 1e-6 m²)
 *
 * Current: I = V / R (when switch is closed, else 0 A)
 *
 * Material resistivity values sourced from NCERT Class 10 Science Table 12.2 at 20 °C:
 * - Copper:    1.62 × 10⁻⁸ Ω·m (excellent conductor, transmission wires)
 * - Aluminium: 2.63 × 10⁻⁸ Ω·m (lightweight transmission lines)
 * - Iron:      10.0 × 10⁻⁸ Ω·m (higher resistance metal)
 * - Nichrome:  100 × 10⁻⁸ = 1.0 × 10⁻⁶ Ω·m (high-resistivity alloy, heating elements)
 *
 * Zero React, DOM, or rendering imports.
 */

import { getAreaError, getLengthError, getVoltageError, RESISTIVITY_LIMITS } from './resistivityLimits'

export { RESISTIVITY_LIMITS }

export type MaterialId = 'copper' | 'aluminium' | 'iron' | 'nichrome'

export interface MaterialSpec {
  id: MaterialId
  name: string
  category: 'Conductor' | 'Alloy'
  resistivityOhmMeter: number
  description: string
  colorHex: string
}

export const MATERIALS: readonly MaterialSpec[] = [
  {
    id: 'copper',
    name: 'Copper',
    category: 'Conductor',
    resistivityOhmMeter: 1.62e-8,
    description: 'Very low resistivity. Used for household connecting wires.',
    colorHex: '#b87333',
  },
  {
    id: 'aluminium',
    name: 'Aluminium',
    category: 'Conductor',
    resistivityOhmMeter: 2.63e-8,
    description: 'Low resistivity, lightweight. Used for overhead transmission lines.',
    colorHex: '#94a3b8',
  },
  {
    id: 'iron',
    name: 'Iron',
    category: 'Conductor',
    resistivityOhmMeter: 10.0e-8,
    description: 'Higher resistivity than copper (about 6× higher).',
    colorHex: '#64748b',
  },
  {
    id: 'nichrome',
    name: 'Nichrome (Ni-Cr-Mn-Fe)',
    category: 'Alloy',
    resistivityOhmMeter: 100e-8, // 1.0e-6 Ω·m
    description: 'Very high resistivity (about 60× copper). Does not oxidize easily at high temperature; used in heaters and toasters.',
    colorHex: '#475569',
  },
] as const

export function getMaterial(id: MaterialId): MaterialSpec {
  const m = MATERIALS.find((mat) => mat.id === id)
  if (!m) throw new Error(`Unknown material ID: ${id}`)
  return m
}

export interface WireInput {
  materialId: MaterialId
  lengthM: number
  areaMm2: number
  supplyVoltageV: number
  switchClosed: boolean
}

export interface WireResult {
  material: MaterialSpec
  lengthM: number
  areaMm2: number
  areaM2: number
  diameterMm: number
  supplyVoltageV: number
  switchClosed: boolean
  resistanceOhm: number
  currentA: number
  resistorVoltageV: number
}

export class ResistivityValidationError extends Error {
  public readonly field: string

  constructor(field: string, message: string) {
    super(message)
    this.name = 'ResistivityValidationError'
    this.field = field
  }
}

export function validateWireInput(input: WireInput): void {
  const lErr = getLengthError(input.lengthM)
  if (lErr) throw new ResistivityValidationError('lengthM', lErr)
  const aErr = getAreaError(input.areaMm2)
  if (aErr) throw new ResistivityValidationError('areaMm2', aErr)
  const vErr = getVoltageError(input.supplyVoltageV)
  if (vErr) throw new ResistivityValidationError('supplyVoltageV', vErr)
}

/** Calculates diameter in mm from cross-sectional area A in mm²: A = π d² / 4 => d = sqrt(4A / π) */
export function areaMm2ToDiameterMm(areaMm2: number): number {
  return Math.sqrt((4 * areaMm2) / Math.PI)
}

/** Calculates wire resistance R = ρ * L / A */
export function calculateWireResistance(
  resistivityOhmMeter: number,
  lengthM: number,
  areaMm2: number
): number {
  const areaM2 = areaMm2 * 1e-6
  return (resistivityOhmMeter * lengthM) / areaM2
}

export function calculateWire(input: WireInput): WireResult {
  validateWireInput(input)
  const mat = getMaterial(input.materialId)
  const areaM2 = input.areaMm2 * 1e-6
  const diameterMm = areaMm2ToDiameterMm(input.areaMm2)
  const resistanceOhm = (mat.resistivityOhmMeter * input.lengthM) / areaM2

  if (!input.switchClosed) {
    return {
      material: mat,
      lengthM: input.lengthM,
      areaMm2: input.areaMm2,
      areaM2,
      diameterMm,
      supplyVoltageV: input.supplyVoltageV,
      switchClosed: false,
      resistanceOhm,
      currentA: 0,
      resistorVoltageV: 0,
    }
  }

  const currentA = input.supplyVoltageV / resistanceOhm
  return {
    material: mat,
    lengthM: input.lengthM,
    areaMm2: input.areaMm2,
    areaM2,
    diameterMm,
    supplyVoltageV: input.supplyVoltageV,
    switchClosed: true,
    resistanceOhm,
    currentA,
    resistorVoltageV: input.supplyVoltageV === 0 ? 0 : input.supplyVoltageV,
  }
}
