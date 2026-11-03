/** Number formatting for student-facing readouts (Indian digit grouping, no NaN). */

const SUPERSCRIPT: Record<string, string> = {
  '-': '⁻',
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
}

/** Formats with en-IN grouping (1,00,000). Non-finite values render as an em dash. */
export function formatNumber(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return '—'
  return value.toLocaleString('en-IN', { maximumFractionDigits: maxDecimals })
}

/**
 * Formats large or tiny values in board-exam style scientific notation,
 * e.g. 3600000 → "3.6 × 10⁶". Values in [0.01, 100000) use plain formatting.
 */
export function formatScientific(value: number, significant = 3): string {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  if (abs === 0 || (abs >= 0.01 && abs < 100000)) return formatNumber(value, 2)
  const exponent = Math.floor(Math.log10(abs))
  let mantissa = Number((value / 10 ** exponent).toPrecision(significant))
  let exp = exponent
  if (Math.abs(mantissa) >= 10) {
    mantissa = Number((mantissa / 10).toPrecision(significant))
    exp += 1
  }
  const sup = String(exp)
    .split('')
    .map((ch) => SUPERSCRIPT[ch] ?? ch)
    .join('')
  return `${mantissa} × 10${sup}`
}
