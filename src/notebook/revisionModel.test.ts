import { describe, expect, it } from 'vitest'
import { findMissingTranslations } from '../kit/i18n'
import {
  computeBoardPaperScore,
  filterRevisionEntries,
  getAllRevisionEntries,
} from './revisionModel'

describe('CBSE Board Exam Simulator & Revision Workbook Model', () => {
  it('aggregates all 28 pilot notebooks (21 Class 10 + 7 Class 9) with complete en/hi translations', () => {
    const entries = getAllRevisionEntries()
    expect(entries).toHaveLength(28)

    const class10 = entries.filter((e) => e.classLevel === 10)
    const class9 = entries.filter((e) => e.classLevel === 9)
    expect(class10).toHaveLength(21)
    expect(class9).toHaveLength(7)

    for (const entry of entries) {
      expect(findMissingTranslations(entry)).toEqual([])
      expect(entry.governingFormula.length).toBeGreaterThan(2)
      expect(entry.hotsTask.rubricPoints).toHaveLength(3)
    }
  })

  it('filters revision entries by class level, thread, search query, and flagged bookmarks', () => {
    const entries = getAllRevisionEntries()

    const onlyClass9 = filterRevisionEntries(entries, {
      classLevel: 9,
      threadId: 'all',
      searchQuery: '',
    })
    expect(onlyClass9).toHaveLength(7)

    const onlyOptics = filterRevisionEntries(entries, {
      classLevel: 'all',
      threadId: 'conventions-and-inversions',
      searchQuery: '',
    })
    expect(onlyOptics).toHaveLength(6)

    const searchSolenoid = filterRevisionEntries(entries, {
      classLevel: 'all',
      threadId: 'all',
      searchQuery: 'solenoid',
    })
    expect(searchSolenoid.some((e) => e.conceptId === 'magnetic-field-solenoid')).toBe(true)

    const flagged = filterRevisionEntries(entries, {
      classLevel: 'all',
      threadId: 'all',
      searchQuery: '',
      flaggedOnly: true,
      flaggedIds: new Set(['lens-power-dioptre', 'archimedes-buoyancy-float']),
    })
    expect(flagged).toHaveLength(2)
  })

  it('strictly separates deterministic Auto-Graded scores from Self-Assessed written rubric checks and tracks mistakes', () => {
    const entries = getAllRevisionEntries().slice(0, 2)
    const [e1, e2] = entries

    const summary = computeBoardPaperScore(entries, {
      [e1.conceptId]: {
        numericalChoice: e1.boardNumerical.correctIndex,
        numericalLocked: true,
        claimChoice: e1.hotsTask.correctClaimIndex,
        claimLocked: true,
        writtenExplanation: 'Detailed physics reasoning...',
        rubricChecked: [true, true, false],
      },
      [e2.conceptId]: {
        // Deliberately wrong numerical choice
        numericalChoice: (e2.boardNumerical.correctIndex + 1) % e2.boardNumerical.options.length,
        numericalLocked: true,
        claimChoice: e2.hotsTask.correctClaimIndex,
        claimLocked: true,
        writtenExplanation: 'Checked all 3 rubric boxes myself',
        rubricChecked: [true, true, true],
      },
    })

    // Auto-graded: 1/2 numericals + 2/2 claims = 3/4
    expect(summary.autoGradedNumericalCorrect).toBe(1)
    expect(summary.autoGradedClaimCorrect).toBe(2)
    expect(summary.totalAutoGradedCorrect).toBe(3)
    expect(summary.totalAutoGradedPossible).toBe(4)

    // Self-assessed rubric points are reported separately (2 + 3 = 5/6) and never inflate the 3/4 auto-graded score
    expect(summary.selfAssessedRubricChecked).toBe(5)
    expect(summary.selfAssessedRubricPossible).toBe(6)

    // Mistake tracker records e2 because its auto-graded numerical was missed
    expect(summary.weakConceptIds).toEqual([e2.conceptId])
  })
})
