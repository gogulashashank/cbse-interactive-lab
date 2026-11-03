/**
 * Shared learner preferences (language + classroom/projector mode).
 *
 * A tiny external store read via useSyncExternalStore, so every toggle and
 * card stays in sync without a context provider or i18n library.
 */
import { useSyncExternalStore } from 'react'
import { LANG_STORAGE_KEY, resolveInitialLang, type Lang } from './i18n'
import { safeGetItem, safeSetItem } from './storage'

export const PROJECTOR_STORAGE_KEY = 'cil.projector'

export interface Prefs {
  lang: Lang
  projector: boolean
}

/** `?projector=1|true|on` enables, `0|false|off` disables; anything else falls back to storage. */
export function resolveInitialProjector(queryParam: string | null | undefined, stored: string | null): boolean {
  const q = queryParam?.trim().toLowerCase()
  if (q === '1' || q === 'true' || q === 'on') return true
  if (q === '0' || q === 'false' || q === 'off') return false
  return stored === '1'
}

function readInitialPrefs(): Prefs {
  const params =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
  const lang = resolveInitialLang({
    queryParam: params.get('lang'),
    stored: safeGetItem(LANG_STORAGE_KEY),
    navigatorLanguage: typeof navigator !== 'undefined' ? navigator.language : null,
  })
  const projector = resolveInitialProjector(params.get('projector'), safeGetItem(PROJECTOR_STORAGE_KEY))
  // A query-param choice (e.g. from a shared link) is remembered.
  if (params.has('lang')) safeSetItem(LANG_STORAGE_KEY, lang)
  if (params.has('projector')) safeSetItem(PROJECTOR_STORAGE_KEY, projector ? '1' : '0')
  return { lang, projector }
}

let prefs: Prefs | null = null
const listeners = new Set<() => void>()

function getPrefs(): Prefs {
  if (prefs === null) {
    prefs = readInitialPrefs()
    applyDocumentLang(prefs.lang)
  }
  return prefs
}

function applyDocumentLang(lang: Lang) {
  if (typeof document !== 'undefined') document.documentElement.lang = lang
}

function update(next: Partial<Prefs>) {
  prefs = { ...getPrefs(), ...next }
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function setLang(lang: Lang) {
  safeSetItem(LANG_STORAGE_KEY, lang)
  applyDocumentLang(lang)
  update({ lang })
}

export function setProjector(projector: boolean) {
  safeSetItem(PROJECTOR_STORAGE_KEY, projector ? '1' : '0')
  update({ projector })
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(subscribe, getPrefs, getPrefs)
}

export function useLang(): Lang {
  return usePrefs().lang
}
