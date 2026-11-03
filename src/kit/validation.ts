/**
 * Non-coercive numeric draft parsing for SliderField.
 *
 * Invalid typing never silently clamps: the caller keeps the last valid value
 * and shows the returned error next to the input.
 */

export type DraftError = 'empty' | 'not-a-number' | 'below-min' | 'above-max'

export type DraftResult = { ok: true; value: number } | { ok: false; error: DraftError }

export interface NumericBounds {
  min: number
  max: number
}

export function parseNumericDraft(draft: string, bounds: NumericBounds): DraftResult {
  // Accept a comma as decimal separator (common on Indian phone keyboards).
  const trimmed = draft.trim().replace(',', '.')
  if (trimmed === '') return { ok: false, error: 'empty' }
  if (!/^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i.test(trimmed)) return { ok: false, error: 'not-a-number' }
  const value = Number(trimmed)
  if (!Number.isFinite(value)) return { ok: false, error: 'not-a-number' }
  if (value < bounds.min) return { ok: false, error: 'below-min' }
  if (value > bounds.max) return { ok: false, error: 'above-max' }
  return { ok: true, value }
}

/** Removes float noise such as 0.30000000000000004 for display. */
export function tidyNumber(value: number, maxDecimals = 4): number {
  if (!Number.isFinite(value)) return 0
  return Number(value.toFixed(maxDecimals))
}

export function formatDraftError(error: DraftError, bounds: NumericBounds, lang: 'en' | 'hi'): string {
  switch (error) {
    case 'empty':
      return lang === 'hi' ? 'संख्या दर्ज करें' : 'Enter a number'
    case 'not-a-number':
      return lang === 'hi' ? 'सही संख्या दर्ज करें' : 'Enter a valid number'
    case 'below-min':
      return lang === 'hi' ? `कम से कम ${bounds.min} होना चाहिए` : `Must be at least ${bounds.min}`
    case 'above-max':
      return lang === 'hi' ? `अधिकतम ${bounds.max} हो सकता है` : `Must be at most ${bounds.max}`
  }
}

