import type { ConvexLensInput } from './convexLensModel'

export interface LensInputDrafts {
  focalLengthCm: string
  objectDistanceCm: string
  objectHeightCm: string
  screenDistanceCm: string
}

export type LensFieldErrors = Partial<Record<keyof ConvexLensInput, string>>

export type LensDraftValidationResult =
  | {
      isValid: true
      parsedInput: ConvexLensInput
      errors: LensFieldErrors
    }
  | {
      isValid: false
      parsedInput: null
      errors: LensFieldErrors
    }

export const LENS_UI_LIMITS = {
  focalLengthCm: { min: 5, max: 25, step: 1 },
  objectDistanceCm: { min: 4, max: 60, step: 0.5 },
  objectHeightCm: { min: 1, max: 8, step: 0.5 },
  screenDistanceCm: { min: 5, max: 75, step: 0.5 },
} as const

export const INITIAL_LENS_INPUT: ConvexLensInput = {
  focalLengthCm: 15,
  objectDistanceCm: 30,
  objectHeightCm: 4,
  screenDistanceCm: 30,
}

export interface LensCasePreset {
  id: string
  shortLabel: string
  ncertTitle: string
  description: string
  objectDistanceFactorOfF: number
}

export const NCERT_CONVEX_LENS_PRESETS: readonly LensCasePreset[] = [
  {
    id: 'beyond_2f',
    shortLabel: 'Beyond 2F₁ (|u| = 2.5f)',
    ncertTitle: 'Case 1 · Object Beyond 2F₁',
    description: 'Forms a real, inverted, diminished image between F₂ and 2F₂ on the screen.',
    objectDistanceFactorOfF: 2.5,
  },
  {
    id: 'at_2f',
    shortLabel: 'At 2F₁ (|u| = 2f)',
    ncertTitle: 'Case 2 · Object at 2F₁',
    description: 'Forms a real, inverted, same-size image at 2F₂ on the screen.',
    objectDistanceFactorOfF: 2.0,
  },
  {
    id: 'between_f_and_2f',
    shortLabel: 'Between F₁ & 2F₁ (|u| = 1.5f)',
    ncertTitle: 'Case 3 · Object Between F₁ and 2F₁',
    description: 'Forms a real, inverted, enlarged image beyond 2F₂ on the screen.',
    objectDistanceFactorOfF: 1.5,
  },
  {
    id: 'at_f',
    shortLabel: 'At Focus F₁ (|u| = f)',
    ncertTitle: 'Case 4 · Object at Principal Focus F₁',
    description: 'Refracted rays emerge parallel; image forms at infinity (cannot be caught on a screen at finite distance).',
    objectDistanceFactorOfF: 1.0,
  },
  {
    id: 'within_f',
    shortLabel: 'Inside F₁ (|u| = 0.6f)',
    ncertTitle: 'Case 5 · Object Between F₁ and Optical Centre O',
    description: 'Refracted rays diverge! Forms a virtual, erect, enlarged image on the object side—cannot be caught on a screen.',
    objectDistanceFactorOfF: 0.6,
  },
] as const

export function createDraftsFromLensInput(input: ConvexLensInput): LensInputDrafts {
  return {
    focalLengthCm: String(input.focalLengthCm),
    objectDistanceCm: String(input.objectDistanceCm),
    objectHeightCm: String(input.objectHeightCm),
    screenDistanceCm: String(input.screenDistanceCm),
  }
}

/**
 * Safely parses a string draft without coercing empty or whitespace-only strings to 0.
 */
export function parseLensNumericDraft(draft: string): number | null {
  const trimmed = draft.trim()
  if (trimmed === '') {
    return null
  }
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}

export function validateLensDrafts(drafts: LensInputDrafts): LensDraftValidationResult {
  const errors: LensFieldErrors = {}

  const f = parseLensNumericDraft(drafts.focalLengthCm)
  const dObj = parseLensNumericDraft(drafts.objectDistanceCm)
  const hObj = parseLensNumericDraft(drafts.objectHeightCm)
  const dScr = parseLensNumericDraft(drafts.screenDistanceCm)

  if (f === null) {
    errors.focalLengthCm = 'Enter a focal length f in cm.'
  } else if (f <= 0) {
    errors.focalLengthCm = 'Focal length f must be greater than 0 cm.'
  }

  if (dObj === null) {
    errors.objectDistanceCm = 'Enter an object distance |u| in cm.'
  } else if (dObj <= 0) {
    errors.objectDistanceCm = 'Object distance |u| must be greater than 0 cm.'
  }

  if (hObj === null) {
    errors.objectHeightCm = 'Enter an object height h in cm.'
  } else if (hObj <= 0) {
    errors.objectHeightCm = 'Object height h must be greater than 0 cm.'
  }

  if (dScr === null) {
    errors.screenDistanceCm = 'Enter a screen distance in cm.'
  } else if (dScr <= 0) {
    errors.screenDistanceCm = 'Screen distance must be greater than 0 cm.'
  }

  if (
    Object.keys(errors).length > 0 ||
    f === null ||
    dObj === null ||
    hObj === null ||
    dScr === null
  ) {
    return {
      isValid: false,
      parsedInput: null,
      errors,
    }
  }

  return {
    isValid: true,
    parsedInput: {
      focalLengthCm: f,
      objectDistanceCm: dObj,
      objectHeightCm: hObj,
      screenDistanceCm: dScr,
    },
    errors,
  }
}

export function formatSignedCm(value: number, maxFractionDigits = 1): string {
  const rounded = Number(value.toFixed(maxFractionDigits))
  if (Object.is(rounded, -0) || rounded === 0) {
    return '0 cm'
  }
  return rounded > 0 ? `+${rounded} cm` : `${rounded} cm`
}

export function formatLensNumber(value: number, maxFractionDigits = 2): string {
  const rounded = Number(value.toFixed(maxFractionDigits))
  return String(Object.is(rounded, -0) ? 0 : rounded)
}
