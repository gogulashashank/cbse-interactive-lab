import { describe, expect, it } from 'vitest'
import { findMissingTranslations } from '../kit/i18n'
import {
  evaluateWorkbenchLabRecord,
  WORKBENCH_LAB_RECORDS,
  WORKBENCH_ROUTE_IDS,
} from './workbenchLabRecords'

describe('Standalone Workbench Guided Lab Record Sheets', () => {
  it('provides complete bilingual (en/hi) lab protocols, viva traps, and 3-point rubrics for all 7 standalone workbenches', () => {
    expect(WORKBENCH_ROUTE_IDS).toHaveLength(7)

    for (const routeId of WORKBENCH_ROUTE_IDS) {
      const record = WORKBENCH_LAB_RECORDS[routeId]
      expect(record, `Missing lab record for ${routeId}`).toBeDefined()
      expect(record.routeId).toBe(routeId)
      expect(findMissingTranslations(record)).toEqual([])
      expect(record.procedureSteps).toHaveLength(3)
      expect(record.observationCheck.correctIndex).toBeGreaterThanOrEqual(0)
      expect(record.observationCheck.correctIndex).toBeLessThan(
        record.observationCheck.options.length
      )
      expect(record.hotsClaimAndRubric.correctClaimIndex).toBeGreaterThanOrEqual(0)
      expect(record.hotsClaimAndRubric.correctClaimIndex).toBeLessThan(
        record.hotsClaimAndRubric.claimOptions.length
      )
      expect(record.hotsClaimAndRubric.rubricPoints).toHaveLength(3)
    }
  })

  it('strictly separates deterministic Auto-Graded score (X/2) from Self-Assessed written rubric score (Y/3)', () => {
    const record = WORKBENCH_LAB_RECORDS.electricity

    // Case 1: Only self-assessed rubric checked, auto-graded items wrong/unlocked
    const selfOnly = evaluateWorkbenchLabRecord(record, {
      observationChoice: 1,
      observationLocked: true,
      writtenConclusion: 'Entered free text and checked all 3 rubric boxes',
      rubricChecked: [true, true, true],
    })
    expect(selfOnly.autoGradedScore).toBe(0)
    expect(selfOnly.autoGradedPossible).toBe(2)
    expect(selfOnly.selfAssessedRubricScore).toBe(3)
    expect(selfOnly.selfAssessedRubricPossible).toBe(3)

    // Case 2: Both auto-graded items correct + 2 rubric boxes checked
    const fullAuto = evaluateWorkbenchLabRecord(record, {
      observationChoice: record.observationCheck.correctIndex,
      observationLocked: true,
      claimChoice: record.hotsClaimAndRubric.correctClaimIndex,
      claimLocked: true,
      rubricChecked: [true, false, true],
    })
    expect(fullAuto.observationCorrect).toBe(true)
    expect(fullAuto.claimCorrect).toBe(true)
    expect(fullAuto.autoGradedScore).toBe(2)
    expect(fullAuto.selfAssessedRubricScore).toBe(2)
  })
})
