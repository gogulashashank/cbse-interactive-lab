import { describe, expect, it } from 'vitest'
import {
  createDraftsFromLensInput,
  formatLensNumber,
  formatSignedCm,
  INITIAL_LENS_INPUT,
  parseLensNumericDraft,
  validateLensDrafts,
} from './lensInputValidation'

describe('lensInputValidation', () => {
  it('validates INITIAL_LENS_INPUT drafts cleanly', () => {
    const drafts = createDraftsFromLensInput(INITIAL_LENS_INPUT)
    const res = validateLensDrafts(drafts)
    expect(res.isValid).toBe(true)
    if (res.isValid) {
      expect(res.parsedInput).toEqual(INITIAL_LENS_INPUT)
    }
  })

  it('does not coerce empty or whitespace strings to 0', () => {
    expect(parseLensNumericDraft('')).toBeNull()
    expect(parseLensNumericDraft('   ')).toBeNull()
    expect(parseLensNumericDraft('abc')).toBeNull()
    expect(parseLensNumericDraft('15.5')).toBe(15.5)
  })

  it('reports field-specific errors for empty or non-positive drafts', () => {
    const res = validateLensDrafts({
      focalLengthCm: '',
      objectDistanceCm: '-5',
      objectHeightCm: '0',
      screenDistanceCm: '30',
    })
    expect(res.isValid).toBe(false)
    expect(res.errors.focalLengthCm).toBeDefined()
    expect(res.errors.objectDistanceCm).toBeDefined()
    expect(res.errors.objectHeightCm).toBeDefined()
    expect(res.errors.screenDistanceCm).toBeUndefined()
  })

  it('formats signed Cartesian coordinates and numbers clearly', () => {
    expect(formatSignedCm(-30)).toBe('-30 cm')
    expect(formatSignedCm(22.5)).toBe('+22.5 cm')
    expect(formatSignedCm(0)).toBe('0 cm')
    expect(formatLensNumber(-0.5, 2)).toBe('-0.5')
  })
})
