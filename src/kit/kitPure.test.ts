import { describe, expect, it } from 'vitest'
import { formatNumber, formatScientific } from './format'
import { isLang, resolveInitialLang, t, type Localized } from './i18n'
import { resolveInitialProjector } from './prefs'
import { buildDeepLink, buildShareMessage, buildWhatsAppUrl } from './share'
import { formatDraftError, parseNumericDraft } from './validation'

describe('i18n helpers', () => {
  it('identifies valid languages', () => {
    expect(isLang('en')).toBe(true)
    expect(isLang('hi')).toBe(true)
    expect(isLang('fr')).toBe(false)
    expect(isLang(null)).toBe(false)
  })

  it('translates with fallback to english', () => {
    const loc: Localized = { en: 'Hello', hi: 'नमस्ते' }
    expect(t(loc, 'en')).toBe('Hello')
    expect(t(loc, 'hi')).toBe('नमस्ते')

    const partial: Localized = { en: 'Fallback', hi: '' }
    expect(t(partial, 'hi')).toBe('Fallback')
  })

  it('resolves initial language in order: query param > storage > navigator > fallback', () => {
    expect(resolveInitialLang({ queryParam: 'hi', stored: 'en', navigatorLanguage: 'en-US' })).toBe('hi')
    expect(resolveInitialLang({ queryParam: 'invalid', stored: 'hi', navigatorLanguage: 'en-US' })).toBe('hi')
    expect(resolveInitialLang({ queryParam: null, stored: null, navigatorLanguage: 'hi-IN' })).toBe('hi')
    expect(resolveInitialLang({ queryParam: null, stored: null, navigatorLanguage: 'en-US' })).toBe('en')
    expect(resolveInitialLang({})).toBe('en')
  })
})

describe('prefs helpers', () => {
  it('resolves projector mode from query param and storage', () => {
    expect(resolveInitialProjector('1', null)).toBe(true)
    expect(resolveInitialProjector('true', null)).toBe(true)
    expect(resolveInitialProjector('0', '1')).toBe(false)
    expect(resolveInitialProjector(null, '1')).toBe(true)
    expect(resolveInitialProjector(null, '0')).toBe(false)
    expect(resolveInitialProjector(null, null)).toBe(false)
  })
})

describe('format helpers', () => {
  it('formats numbers with en-IN grouping', () => {
    expect(formatNumber(100000)).toBe('1,00,000')
    expect(formatNumber(12.345, 2)).toBe('12.35')
    expect(formatNumber(NaN)).toBe('—')
    expect(formatNumber(Infinity)).toBe('—')
  })

  it('formats scientific notation in board-exam style with superscripts', () => {
    expect(formatScientific(3600000)).toBe('3.6 × 10⁶')
    expect(formatScientific(1000)).toBe('1,000')
    expect(formatScientific(NaN)).toBe('—')
  })
})

describe('share helpers', () => {
  it('builds deep links without double slashes', () => {
    expect(buildDeepLink('https://cbse-interactive-lab.vercel.app/', '/learn/power-vs-energy')).toBe(
      'https://cbse-interactive-lab.vercel.app/learn/power-vs-energy'
    )
  })

  it('builds share messages and wa.me URLs', () => {
    const msg = buildShareMessage('Can you solve this?', 'https://example.com/learn')
    expect(msg).toBe('Can you solve this?\n\nhttps://example.com/learn')
    const wa = buildWhatsAppUrl(msg)
    expect(wa).toContain('https://wa.me/?text=')
    expect(wa).toContain(encodeURIComponent('Can you solve this?'))
  })
})

describe('validation helpers', () => {
  it('parses numeric drafts non-coercively', () => {
    const bounds = { min: 1, max: 10 }
    expect(parseNumericDraft('5', bounds)).toEqual({ ok: true, value: 5 })
    expect(parseNumericDraft('3,5', bounds)).toEqual({ ok: true, value: 3.5 })
    expect(parseNumericDraft('', bounds)).toEqual({ ok: false, error: 'empty' })
    expect(parseNumericDraft('abc', bounds)).toEqual({ ok: false, error: 'not-a-number' })
    expect(parseNumericDraft('0.5', bounds)).toEqual({ ok: false, error: 'below-min' })
    expect(parseNumericDraft('15', bounds)).toEqual({ ok: false, error: 'above-max' })

    expect(formatDraftError('below-min', bounds, 'en')).toContain('Must be at least 1')
    expect(formatDraftError('below-min', bounds, 'hi')).toContain('कम से कम 1')
  })
})
