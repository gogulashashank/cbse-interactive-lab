import { describe, expect, it } from 'vitest'
import { calculateConvexLens, type ConvexLensInput } from './convexLensModel'
import { createDraftsFromLensInput } from './lensInputValidation'
import {
  ALTERNATIVE_WORKED_EXAMPLES,
  CONCEPTUAL_PRACTICE_QUESTION,
  evaluateConceptualPracticeAnswer,
  evaluateNumericalPracticeAnswer,
  loadSetupOntoBenchState,
  NUMERICAL_PRACTICE_QUESTION,
  selectPracticeQuestionState,
  type AlternativeBenchAndPracticeState,
} from './alternativeLensContent'

describe('Alternative Convex-Lens Lesson Content & State Independence', () => {
  it('computes real-image and virtual-image worked examples from their own fixed inputs independently of live bench state', () => {
    const [realExample, virtualExample] = ALTERNATIVE_WORKED_EXAMPLES

    // 1. Real-image worked example: f = 15 cm, |u| = 20 cm, h = 3 cm => v = +60 cm, m = -3, h' = -9 cm
    expect(realExample.id).toBe('real-image-example')
    expect(realExample.input).toEqual({
      focalLengthCm: 15,
      objectDistanceCm: 20,
      objectHeightCm: 3,
      screenDistanceCm: 60,
    })
    const expectedReal = calculateConvexLens(realExample.input)
    expect(realExample.result.regime).toBe('between_f_and_2f')
    expect(realExample.result.imageNature).toBe('real_inverted')
    expect(realExample.result.vCm).toBeCloseTo(60, 5)
    expect(realExample.result.magnification).toBeCloseTo(-3, 5)
    expect(realExample.result.imageHeightCm).toBeCloseTo(-9, 5)
    expect(realExample.result.vCm).toBe(expectedReal.vCm)
    expect(realExample.steps[1].substitution).toContain('+60 cm')

    // 2. Virtual-image worked example: f = 15 cm, |u| = 10 cm, h = 3 cm => v = -30 cm, m = +3, h' = +9 cm
    expect(virtualExample.id).toBe('virtual-image-example')
    expect(virtualExample.input).toEqual({
      focalLengthCm: 15,
      objectDistanceCm: 10,
      objectHeightCm: 3,
      screenDistanceCm: 30,
    })
    const expectedVirtual = calculateConvexLens(virtualExample.input)
    expect(virtualExample.result.regime).toBe('within_f')
    expect(virtualExample.result.imageNature).toBe('virtual_erect')
    expect(virtualExample.result.vCm).toBeCloseTo(-30, 5)
    expect(virtualExample.result.magnification).toBeCloseTo(3, 5)
    expect(virtualExample.result.imageHeightCm).toBeCloseTo(9, 5)
    expect(virtualExample.result.vCm).toBe(expectedVirtual.vCm)
    expect(virtualExample.steps[1].substitution).toContain('-30 cm')
  })

  it('matches numerical and conceptual practice question solutions against calculateConvexLens', () => {
    // Question 1 (Numerical): |u| = 45 cm, f = 15 cm => v = +22.5 cm
    const q1Model = calculateConvexLens(NUMERICAL_PRACTICE_QUESTION.benchSetup)
    expect(q1Model.regime).toBe('beyond_2f')
    expect(q1Model.imageNature).toBe('real_inverted')
    expect(q1Model.vCm).toBeCloseTo(22.5, 5)
    expect(NUMERICAL_PRACTICE_QUESTION.expectedVCm).toBeCloseTo(22.5, 5)

    expect(evaluateNumericalPracticeAnswer('22.5').status).toBe('correct')
    expect(evaluateNumericalPracticeAnswer('+22.5').status).toBe('correct')
    expect(evaluateNumericalPracticeAnswer('11.25').status).toBe('sign_trap')
    expect(evaluateNumericalPracticeAnswer('-22.5').status).toBe('sign_trap')
    expect(evaluateNumericalPracticeAnswer('40').status).toBe('incorrect')
    expect(evaluateNumericalPracticeAnswer('   ').status).toBe('empty')

    // Question 2 (Conceptual): |u| = 9 cm, f = 15 cm => v = -22.5 cm (virtual, erect, m = +2.5)
    const q2Model = calculateConvexLens(CONCEPTUAL_PRACTICE_QUESTION.benchSetup)
    expect(q2Model.regime).toBe('within_f')
    expect(q2Model.imageNature).toBe('virtual_erect')
    expect(q2Model.canCatchOnScreen).toBe(false)
    expect(q2Model.vCm).toBeCloseTo(-22.5, 5)
    expect(q2Model.magnification).toBeCloseTo(2.5, 5)

    expect(evaluateConceptualPracticeAnswer(null).status).toBe('unselected')
    expect(
      evaluateConceptualPracticeAnswer(
        CONCEPTUAL_PRACTICE_QUESTION.correctOptionIndex
      ).status
    ).toBe('correct')
    expect(evaluateConceptualPracticeAnswer(0).status).toBe('incorrect')
    expect(evaluateConceptualPracticeAnswer(2).status).toBe('incorrect')
  })

  it('keeps optical-bench state untouched when selecting a practice question and updates bench only on explicit Load on Bench', () => {
    const customBenchSetup: ConvexLensInput = {
      focalLengthCm: 18,
      objectDistanceCm: 36,
      objectHeightCm: 4.5,
      screenDistanceCm: 36,
    }

    const initialState: AlternativeBenchAndPracticeState = {
      benchInput: customBenchSetup,
      drafts: createDraftsFromLensInput(customBenchSetup),
      selectedQuestionId: 'numerical-q1',
    }

    // Selecting Question 2 (conceptual) MUST NOT change benchInput or drafts
    const afterSelectQ2 = selectPracticeQuestionState(
      initialState,
      'conceptual-q2'
    )
    expect(afterSelectQ2.selectedQuestionId).toBe('conceptual-q2')
    expect(afterSelectQ2.benchInput).toEqual(customBenchSetup)
    expect(afterSelectQ2.drafts).toEqual(initialState.drafts)

    // Selecting Question 1 (numerical) again MUST NOT change benchInput or drafts
    const afterSelectQ1 = selectPracticeQuestionState(
      afterSelectQ2,
      'numerical-q1'
    )
    expect(afterSelectQ1.selectedQuestionId).toBe('numerical-q1')
    expect(afterSelectQ1.benchInput).toEqual(customBenchSetup)
    expect(afterSelectQ1.drafts).toEqual(initialState.drafts)

    // Only explicit loadSetupOntoBenchState updates the bench to the question's setup
    const afterExplicitLoad = loadSetupOntoBenchState(
      afterSelectQ2,
      CONCEPTUAL_PRACTICE_QUESTION.benchSetup
    )
    expect(afterExplicitLoad.benchInput).toEqual(
      CONCEPTUAL_PRACTICE_QUESTION.benchSetup
    )
    expect(afterExplicitLoad.drafts.objectDistanceCm).toBe('9')
    expect(afterExplicitLoad.drafts.focalLengthCm).toBe('15')
  })
})
