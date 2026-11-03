import { describe, expect, it } from 'vitest'
import { findMissingTranslations } from '../kit/i18n'
import { resolveStandaloneRoute } from '../platform/routeRegistry'
import { CONCEPTS, getConceptById, getPilotConcepts, THREADS } from './registry'

describe('Concept Registry Integrity', () => {
  it('has unique concept ids and valid thread associations', () => {
    const ids = new Set<string>()
    const threadIds = new Set(THREADS.map((t) => t.id))

    CONCEPTS.forEach((c) => {
      expect(ids.has(c.id)).toBe(false)
      ids.add(c.id)
      expect(threadIds.has(c.thread)).toBe(true)
    })
  })

  it('has valid prerequisites with no broken references', () => {
    CONCEPTS.forEach((c) => {
      c.prerequisites.forEach((pId) => {
        expect(getConceptById(pId)).toBeDefined()
        expect(pId).not.toBe(c.id)
      })
    })
  })

  it('contains no cycles in prerequisites', () => {
    function checkCycle(id: string, visited: Set<string>): boolean {
      if (visited.has(id)) return true
      visited.add(id)
      const concept = getConceptById(id)
      if (!concept) return false
      for (const p of concept.prerequisites) {
        if (checkCycle(p, new Set(visited))) return true
      }
      return false
    }

    CONCEPTS.forEach((c) => {
      expect(checkCycle(c.id, new Set())).toBe(false)
    })
  })

  it('every pilot concept and thread has complete en and hi translations', () => {
    THREADS.forEach((t) => {
      const missing = findMissingTranslations(t)
      expect(missing).toEqual([])
    })

    const pilot = getPilotConcepts()
    expect(pilot.length).toBe(16)

    pilot.forEach((c) => {
      const missing = findMissingTranslations(c)
      expect(missing).toEqual([])
    })
  })

  it('deep dive routes map to valid platform routes', () => {
    CONCEPTS.forEach((c) => {
      if (c.deepDiveRoute && c.deepDiveRoute !== '/') {
        const route = resolveStandaloneRoute(c.deepDiveRoute)
        expect(route).toBeDefined()
      }
    })
  })
})
