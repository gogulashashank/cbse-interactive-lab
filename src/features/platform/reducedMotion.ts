import { useEffect, useState } from 'react'

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Safely reads whether the environment currently requests reduced motion.
 */
export function getInitialReducedMotion(
  matchMediaFn?: ((query: string) => { matches: boolean }) | undefined
): boolean {
  const fn =
    matchMediaFn ??
    (typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia.bind(window)
      : undefined)

  if (!fn) return false
  try {
    return Boolean(fn(REDUCED_MOTION_QUERY)?.matches)
  } catch {
    return false
  }
}

/**
 * React hook that initializes reduced-motion state from `prefers-reduced-motion: reduce`,
 * listens for system/browser preference changes, and allows an explicit user toggle override.
 */
export function useReducedMotionPreference(): [boolean, (next: boolean | ((prev: boolean) => boolean)) => void] {
  const [stillMode, setStillMode] = useState<boolean>(() => getInitialReducedMotion())

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    let mql: MediaQueryList
    try {
      mql = window.matchMedia(REDUCED_MOTION_QUERY)
    } catch {
      return
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setStillMode(Boolean(e.matches))
    }

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange)
      return () => mql.removeEventListener('change', handleChange)
    }
    return undefined
  }, [])

  return [stillMode, setStillMode]
}
