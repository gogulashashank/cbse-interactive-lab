import { describe, expect, it } from 'vitest'
import { findMissingTranslations } from '../kit/i18n'
import { resolveStandaloneRoute } from '../platform/routeRegistry'
import { CONCEPTS, getConceptById, getPilotConcepts, THREADS } from './registry'
import { RATE_VS_TOTAL_CONTENT } from './rateVsTotal/content'
import { SQUARES_AND_INVERSES_CONTENT } from './squaresAndInverses/content'
import { CONTROLLED_EXPERIMENTS_CONTENT } from './controlledExperiments/content'
import { ENERGY_CONSERVATION_CONTENT } from './energyConservation/content'
import { CONVENTIONS_AND_INVERSIONS_CONTENT } from './conventionsAndInversions/content'

const ALL_CONTENT = {
  ...RATE_VS_TOTAL_CONTENT,
  ...SQUARES_AND_INVERSES_CONTENT,
  ...CONTROLLED_EXPERIMENTS_CONTENT,
  ...ENERGY_CONSERVATION_CONTENT,
  ...CONVENTIONS_AND_INVERSIONS_CONTENT,
}

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
    expect(pilot.length).toBe(20)

    pilot.forEach((c) => {
      const missing = findMissingTranslations(c)
      expect(missing).toEqual([])
      const content = ALL_CONTENT[c.id]
      expect(content).toBeDefined()
      expect(findMissingTranslations(content)).toEqual([])
      expect(content.predictOptions.length).toBeGreaterThanOrEqual(2)
      expect(content.examQuestions.length).toBeGreaterThanOrEqual(1)
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
