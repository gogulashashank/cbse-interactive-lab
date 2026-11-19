import { CONCEPTS, type ConceptRecord } from '../concepts/registry'
import type { StandaloneRouteId } from '../platform/routeRegistry'

/**
 * Returns the interactive mental-model concept notebooks (`/learn/<id>`)
 * that pair directly with a standalone chapter workbench route.
 */
export function getRelatedNotebooksForRoute(routeId: StandaloneRouteId): readonly ConceptRecord[] {
  if (routeId === 'revision') {
    return []
  }
  if (routeId === 'safety') {
    const safetyIds = new Set([
      'series-parallel-failure',
      'fixed-voltage-vs-current',
      'electrical-energy-transfer',
    ])
    return CONCEPTS.filter((c) => c.status === 'pilot' && safetyIds.has(c.id))
  }

  const targetPath = `/${routeId}`
  const directMatches = CONCEPTS.filter(
    (c) => c.status === 'pilot' && c.deepDiveRoute === targetPath
  )
  if (directMatches.length > 0) return directMatches

  if (routeId === 'alternative') {
    return CONCEPTS.filter(
      (c) => c.status === 'pilot' && c.thread === 'conventions-and-inversions'
    )
  }
  return []
}
