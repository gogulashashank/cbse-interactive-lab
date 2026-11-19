import { describe, expect, it } from 'vitest'
import { getPilotConcepts } from '../concepts/registry'
import { findMissingTranslations } from '../kit/i18n'
import { resolveStandaloneRoute, STANDALONE_ROUTES } from '../platform/routeRegistry'
import { getRelatedNotebooksForRoute } from './relatedNotebooks'
import { STORY_NOTEBOOK_STAGES, STORY_STAGE_SUPPLEMENTS } from './storyCurricula'

describe('Notebook Cross-Navigation & Route Mapping', () => {
  it('maps every standalone chapter workbench to its related mental-model concept notebooks', () => {
    const workbenches = STANDALONE_ROUTES.filter((r) => r.id !== 'learn' && r.id !== 'revision')
    expect(workbenches.length).toBe(7)

    for (const wb of workbenches) {
      const related = getRelatedNotebooksForRoute(wb.id)
      expect(related.length).toBeGreaterThanOrEqual(1)
      for (const concept of related) {
        expect(concept.status).toBe('pilot')
      }
    }
  })

  it('routes "/" and "/learn/*" to the Illustrated Science Notebook Shelf and "/book" to the 3D Book Studio', () => {
    expect(resolveStandaloneRoute('/')?.id).toBe('learn')
    expect(resolveStandaloneRoute('/learn')?.id).toBe('learn')
    expect(resolveStandaloneRoute('/learn/lens-power-dioptre')?.id).toBe('learn')
    expect(resolveStandaloneRoute('/book')).toBeNull()
  })

  it('provides a complete 6-stage Story-Driven Notebook curriculum (Predict → Experiment → Discover → Calculate → Contrast → Apply) for all 36 pilot lessons', () => {
    expect(STORY_NOTEBOOK_STAGES).toHaveLength(6)
    expect(STORY_NOTEBOOK_STAGES.map((s) => s.id)).toEqual([
      'predict',
      'experiment',
      'discover',
      'calculate',
      'contrast',
      'apply',
    ])

    const pilots = getPilotConcepts()
    expect(pilots).toHaveLength(36)

    for (const pilot of pilots) {
      if (pilot.id === 'lens-power-dioptre') continue
      const supp =
        STORY_STAGE_SUPPLEMENTS[pilot.id as keyof typeof STORY_STAGE_SUPPLEMENTS]
      expect(supp, `Missing 6-stage supplement for ${pilot.id}`).toBeDefined()
      expect(findMissingTranslations(supp)).toEqual([])
      expect(supp.experimentProtocol.steps.length).toBeGreaterThanOrEqual(2)
      expect(supp.experimentProtocol.observationCheck.correctIndex).toBeGreaterThanOrEqual(0)
      expect(supp.experimentProtocol.observationCheck.correctIndex).toBeLessThan(
        supp.experimentProtocol.observationCheck.options.length
      )
      expect(supp.workedNumerical.given.length).toBeGreaterThanOrEqual(1)
      expect(supp.hotsReasoningTask.correctClaimIndex).toBeGreaterThanOrEqual(0)
      expect(supp.hotsReasoningTask.correctClaimIndex).toBeLessThan(
        supp.hotsReasoningTask.claimOptions.length
      )
      expect(supp.hotsReasoningTask.rubricPoints).toHaveLength(3)
    }
  })
})
