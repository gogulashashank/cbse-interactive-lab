import {
  type FuseRating,
  type SafetyFaultMode,
  STANDARD_FUSE_RATINGS,
} from './safetyLimits'

export interface DomesticCircuitFormDraft {
  fuseRatingA: string
  faultMode: SafetyFaultMode
  earthingConnected: boolean
  userTouchingChassis: boolean
  applianceStates: Record<string, boolean>
}

export interface ValidationIssues {
  fuseRatingError?: string
  generalError?: string
}

export function parseFuseRating(raw: string): { value: FuseRating; error?: string } {
  const parsed = Number(raw)
  if (isNaN(parsed) || !STANDARD_FUSE_RATINGS.includes(parsed as FuseRating)) {
    return {
      value: 5,
      error: `Please select a standard fuse rating (${STANDARD_FUSE_RATINGS.join(', ')} A).`,
    }
  }
  return { value: parsed as FuseRating }
}

export function validateFormDraft(draft: DomesticCircuitFormDraft): ValidationIssues {
  const issues: ValidationIssues = {}
  const { error } = parseFuseRating(draft.fuseRatingA)
  if (error) {
    issues.fuseRatingError = error
  }
  return issues
}

export const INITIAL_FORM_DRAFT: DomesticCircuitFormDraft = {
  fuseRatingA: '5',
  faultMode: 'none',
  earthingConnected: true,
  userTouchingChassis: false,
  applianceStates: {
    bulb: true,
    fan: true,
    tv: false,
    refrigerator: true,
    iron: false,
    geyser: false,
  },
}
