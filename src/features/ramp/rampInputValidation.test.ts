import { describe, expect, it } from 'vitest'
import {
  createDraftsFromInput,
  formatDisplayNumber,
  INITIAL_RAMP_INPUT,
  parseNumericDraft,
  PRESET_2M_RAMP,
  PRESET_4M_RAMP,
  validateRampDrafts,
} from './rampInputValidation'

describe('Ramp UI Input Parsing & Validation Helpers (rampInputValidation)', () => {
  describe('parseNumericDraft', () => {
    it('returns null for empty or whitespace-only strings instead of converting to zero', () => {
      expect(parseNumericDraft('')).toBeNull()
      expect(parseNumericDraft('   ')).toBeNull()
    })

    it('parses valid integer and decimal strings accurately', () => {
      expect(parseNumericDraft('10')).toBe(10)
      expect(parseNumericDraft('1.5')).toBe(1.5)
      expect(parseNumericDraft(' 4.25 ')).toBe(4.25)
    })

    it('returns null for non-numeric or non-finite inputs', () => {
      expect(parseNumericDraft('abc')).toBeNull()
      expect(parseNumericDraft('NaN')).toBeNull()
      expect(parseNumericDraft('Infinity')).toBeNull()
    })
  })

  describe('validateRampDrafts', () => {
    it('accepts initial values and both preset configurations', () => {
      const initialOutcome = validateRampDrafts(createDraftsFromInput(INITIAL_RAMP_INPUT))
      expect(initialOutcome.isValid).toBe(true)
      expect(initialOutcome.parsedInput).toEqual({
        massKg: 10,
        heightM: 1,
        rampLengthM: 2,
      })

      const preset2m = validateRampDrafts(createDraftsFromInput(PRESET_2M_RAMP))
      expect(preset2m.isValid).toBe(true)

      const preset4m = validateRampDrafts(createDraftsFromInput(PRESET_4M_RAMP))
      expect(preset4m.isValid).toBe(true)
      expect(preset4m.parsedInput).toEqual({
        massKg: 10,
        heightM: 1,
        rampLengthM: 4,
      })
    })

    it('accepts the vertical-limit case where ramp length equals height', () => {
      const outcome = validateRampDrafts({
        massKg: '15',
        heightM: '2.5',
        rampLengthM: '2.5',
      })
      expect(outcome.isValid).toBe(true)
      expect(outcome.errors).toEqual({})
    })

    it('rejects empty fields without converting them to zero or altering other drafts', () => {
      const outcome = validateRampDrafts({
        massKg: '',
        heightM: '1',
        rampLengthM: '2',
      })
      expect(outcome.isValid).toBe(false)
      expect(outcome.parsedInput).toBeNull()
      expect(outcome.errors.massKg).toMatch(/Enter a mass between 1 kg and 50 kg/i)
      expect(outcome.errors.heightM).toBeUndefined()
      expect(outcome.errors.rampLengthM).toBeUndefined()
    })

    it('rejects values outside UI exploration limits (mass 1-50, height 0.5-3, length 0.5-8)', () => {
      const lowOutcome = validateRampDrafts({
        massKg: '0.5',
        heightM: '0.2',
        rampLengthM: '0.4',
      })
      expect(lowOutcome.isValid).toBe(false)
      expect(lowOutcome.errors.massKg).toMatch(/between 1 kg and 50 kg/i)
      expect(lowOutcome.errors.heightM).toMatch(/between 0.5 m and 3 m/i)
      expect(lowOutcome.errors.rampLengthM).toMatch(/between 0.5 m and 8 m/i)

      const highOutcome = validateRampDrafts({
        massKg: '55',
        heightM: '3.5',
        rampLengthM: '9',
      })
      expect(highOutcome.isValid).toBe(false)
      expect(highOutcome.errors.massKg).toMatch(/between 1 kg and 50 kg/i)
      expect(highOutcome.errors.heightM).toMatch(/between 0.5 m and 3 m/i)
      expect(highOutcome.errors.rampLengthM).toMatch(/between 0.5 m and 8 m/i)
    })

    it('rejects ramp length shorter than vertical height with a specific error message', () => {
      const outcome = validateRampDrafts({
        massKg: '10',
        heightM: '2.5',
        rampLengthM: '2.0',
      })
      expect(outcome.isValid).toBe(false)
      expect(outcome.parsedInput).toBeNull()
      expect(outcome.errors.heightM).toBeUndefined()
      expect(outcome.errors.rampLengthM).toMatch(
        /Ramp length \(2 m\) must be at least the vertical height \(2.5 m\)/i
      )
    })
  })

  describe('formatDisplayNumber', () => {
    it('formats decimals cleanly while stripping trailing zeros', () => {
      expect(formatDisplayNumber(98.1, 2)).toBe('98.1')
      expect(formatDisplayNumber(49.05, 2)).toBe('49.05')
      expect(formatDisplayNumber(24.525, 3)).toBe('24.525')
      expect(formatDisplayNumber(30.000000004, 1)).toBe('30')
    })
  })
})
