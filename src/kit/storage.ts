/** localStorage access that never throws (private mode, quota, SSR/tests). */

export function safeGetItem(key: string): string | null {
  try {
    return typeof localStorage === 'undefined' ? null : localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value)
  } catch {
    // Storage unavailable — preference simply won't persist.
  }
}
