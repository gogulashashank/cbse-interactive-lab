import {
  BILLING_GLOBAL_LIMITS,
  validateBillingDays,
  validateHoursPerDay,
  validateTariffRate,
} from './billingLimits'
import type { HouseholdBillingInput } from './billingModel'

export interface BillingDrafts {
  billingDays: string
  tariffRate: string
  applianceHours: Record<string, string>
}

export interface BillingValidationErrors {
  billingDays?: string
  tariffRate?: string
  applianceHours?: Record<string, string>
}

export function createBillingDrafts(input: HouseholdBillingInput): BillingDrafts {
  const applianceHours: Record<string, string> = {}
  for (const app of input.appliances) {
    applianceHours[app.id] = app.hoursPerDay.toString()
  }

  return {
    billingDays: input.billingDays.toString(),
    tariffRate: input.tariffRateRupeesPerKWh.toString(),
    applianceHours,
  }
}

export function parseDraftNumber(raw: string): number | null {
  const trimmed = raw.trim()
  if (trimmed === '') return null
  const num = Number(trimmed)
  return Number.isFinite(num) ? num : null
}

export function formatBillingRupees(value: number, decimals: number = 2): string {
  if (!Number.isFinite(value)) return '—'
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatBillingUnits(value: number, decimals: number = 2): string {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString('en-IN', { maximumFractionDigits: decimals })
  }
  return Number(value.toFixed(decimals)).toString()
}

export function applyBillingDaysEdit(
  currentInput: HouseholdBillingInput,
  currentDrafts: BillingDrafts,
  rawDays: string
): {
  input: HouseholdBillingInput
  drafts: BillingDrafts
  error?: string
} {
  const newDrafts = { ...currentDrafts, billingDays: rawDays }
  const parsed = parseDraftNumber(rawDays)

  if (parsed === null) {
    return {
      input: currentInput,
      drafts: newDrafts,
      error: 'Enter a valid number of days.',
    }
  }

  try {
    validateBillingDays(parsed)
    return {
      input: { ...currentInput, billingDays: parsed },
      drafts: newDrafts,
    }
  } catch (err) {
    return {
      input: currentInput,
      drafts: newDrafts,
      error:
        err instanceof Error
          ? err.message
          : `Billing days must be between ${BILLING_GLOBAL_LIMITS.billingDays.min} and ${BILLING_GLOBAL_LIMITS.billingDays.max}.`,
    }
  }
}

export function applyTariffRateEdit(
  currentInput: HouseholdBillingInput,
  currentDrafts: BillingDrafts,
  rawRate: string
): {
  input: HouseholdBillingInput
  drafts: BillingDrafts
  error?: string
} {
  const newDrafts = { ...currentDrafts, tariffRate: rawRate }
  const parsed = parseDraftNumber(rawRate)

  if (parsed === null) {
    return {
      input: currentInput,
      drafts: newDrafts,
      error: 'Enter a valid tariff rate.',
    }
  }

  try {
    validateTariffRate(parsed)
    return {
      input: { ...currentInput, tariffRateRupeesPerKWh: parsed },
      drafts: newDrafts,
    }
  } catch (err) {
    return {
      input: currentInput,
      drafts: newDrafts,
      error:
        err instanceof Error
          ? err.message
          : `Tariff rate must be between ₹${BILLING_GLOBAL_LIMITS.tariffRate.min} and ₹${BILLING_GLOBAL_LIMITS.tariffRate.max}.`,
    }
  }
}

export function applyApplianceHoursEdit(
  currentInput: HouseholdBillingInput,
  currentDrafts: BillingDrafts,
  applianceId: string,
  rawHours: string
): {
  input: HouseholdBillingInput
  drafts: BillingDrafts
  error?: string
} {
  const newHoursDrafts = { ...currentDrafts.applianceHours, [applianceId]: rawHours }
  const newDrafts = { ...currentDrafts, applianceHours: newHoursDrafts }
  const parsed = parseDraftNumber(rawHours)

  if (parsed === null) {
    return {
      input: currentInput,
      drafts: newDrafts,
      error: 'Enter a valid daily usage duration.',
    }
  }

  try {
    validateHoursPerDay(parsed)
    const updatedAppliances = currentInput.appliances.map((app) =>
      app.id === applianceId ? { ...app, hoursPerDay: parsed } : app
    )
    return {
      input: { ...currentInput, appliances: updatedAppliances },
      drafts: newDrafts,
    }
  } catch (err) {
    return {
      input: currentInput,
      drafts: newDrafts,
      error:
        err instanceof Error
          ? err.message
          : `Hours per day must be between ${BILLING_GLOBAL_LIMITS.hoursPerDay.min} and ${BILLING_GLOBAL_LIMITS.hoursPerDay.max}.`,
    }
  }
}
