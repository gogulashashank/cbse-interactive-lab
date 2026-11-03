/**
 * Tiny i18n helper for the concept cards (no runtime dependency).
 *
 * Every user-facing string is stored as a `Localized` value next to its
 * translation, so content files stay the single source of truth.
 */

export type Lang = 'en' | 'hi'
export type Localized<T = string> = Record<Lang, T>

export const LANGS: readonly Lang[] = ['en', 'hi']
export const LANG_STORAGE_KEY = 'cil.lang'

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'hi'
}

/** Resolves a localized value. Falls back to English if a translation is empty. */
export function t<T>(localized: Localized<T>, lang: Lang): T {
  const value = localized[lang]
  if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
    return localized.en
  }
  return value
}

/** Replaces `{name}` placeholders in a template string. Unknown keys are left as-is. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
  )
}

export interface InitialLangSources {
  /** Value of the `?lang=` query parameter, if any. Wins over everything. */
  queryParam?: string | null
  /** Value previously stored in localStorage under `cil.lang`. */
  stored?: string | null
  /** `navigator.language`, e.g. "hi-IN". */
  navigatorLanguage?: string | null
}

/** Picks the starting language: query param → stored choice → browser language → English. */
export function resolveInitialLang(sources: InitialLangSources): Lang {
  const query = sources.queryParam?.trim().toLowerCase()
  if (isLang(query)) return query
  if (isLang(sources.stored)) return sources.stored
  const nav = sources.navigatorLanguage?.trim().toLowerCase() ?? ''
  return nav.startsWith('hi') ? 'hi' : 'en'
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function looksLocalized(value: Record<string, unknown>): boolean {
  return 'en' in value || 'hi' in value
}

/**
 * Recursively walks any value and returns the paths of Localized entries that
 * are missing a language or have an empty string. A "Localized" entry is any
 * plain object with an `en` or `hi` key. Non-string translations
 * (`Localized<T>`) are checked recursively.
 */
export function findMissingTranslations(value: unknown, path = '$'): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => findMissingTranslations(item, `${path}[${index}]`))
  }
  if (!isPlainObject(value)) return []

  if (looksLocalized(value)) {
    const problems: string[] = []
    for (const lang of LANGS) {
      const entry = value[lang]
      const entryPath = `${path}.${lang}`
      if (entry === undefined || entry === null) problems.push(`${entryPath} (missing)`)
      else if (typeof entry === 'string') {
        if (entry.trim() === '') problems.push(`${entryPath} (empty)`)
      } else problems.push(...findMissingTranslations(entry, entryPath))
    }
    return problems
  }

  return Object.entries(value).flatMap(([key, child]) => findMissingTranslations(child, `${path}.${key}`))
}

/** Collects every string of one language from a content tree (used by readability tests). */
export function collectStrings(value: unknown, lang: Lang): string[] {
  if (typeof value === 'string') return []
  if (Array.isArray(value)) return value.flatMap((item) => collectStrings(item, lang))
  if (!isPlainObject(value)) return []
  if (looksLocalized(value)) {
    const entry = value[lang]
    return typeof entry === 'string' ? [entry] : collectStrings(entry, lang)
  }
  return Object.values(value).flatMap((child) => collectStrings(child, lang))
}
