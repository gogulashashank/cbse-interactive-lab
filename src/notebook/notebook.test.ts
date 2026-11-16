import { describe, expect, it } from 'vitest'
import { STANDALONE_ROUTES } from '../platform/routeRegistry'
import { getRelatedNotebooksForRoute } from './relatedNotebooks'

describe('Notebook Cross-Navigation & Route Mapping', () => {
  it('maps every standalone chapter workbench to its related mental-model concept notebooks', () => {
    const workbenches = STANDALONE_ROUTES.filter((r) => r.id !== 'learn')
    expect(workbenches.length).toBe(7)

    for (const wb of workbenches) {
      const related = getRelatedNotebooksForRoute(wb.id)
      expect(related.length).toBeGreaterThanOrEqual(1)
      for (const concept of related) {
        expect(concept.status).toBe('pilot')
      }
    }
  })
})
