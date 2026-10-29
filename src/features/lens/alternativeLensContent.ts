import {
  calculateConvexLens,
  type ConvexLensInput,
  type ConvexLensResult,
} from './convexLensModel'
import {
  createDraftsFromLensInput,
  formatLensNumber,
  formatSignedCm,
  parseLensNumericDraft,
  type LensInputDrafts,
} from './lensInputValidation'

export type AlternativePresentationMode = 'reading' | 'immersive'
export type PracticeQuestionId = 'numerical-q1' | 'conceptual-q2'

export interface WorkedExampleSpec {
  id: 'real-image-example' | 'virtual-image-example'
  badge: string
  title: string
  scenarioSummary: string
  input: ConvexLensInput
  result: ConvexLensResult
  steps: readonly {
    heading: string
    formula: string
    substitution: string
    conclusion: string
  }[]
}

export interface NumericalPracticeQuestion {
  id: 'numerical-q1'
  kind: 'numerical'
  title: string
  prompt: string
  unitLabel: string
  benchSetup: ConvexLensInput
  expectedVCm: number
  toleranceCm: number
  signTrapVCm: number
  correctExplanation: string
  signTrapFeedback: string
  generalHint: string
}

export interface ConceptualPracticeQuestion {
  id: 'conceptual-q2'
  kind: 'conceptual'
  title: string
  prompt: string
  benchSetup: ConvexLensInput
  options: readonly string[]
  correctOptionIndex: number
  correctExplanation: string
  optionFeedback: readonly string[]
}

export type AlternativePracticeQuestion =
  | NumericalPracticeQuestion
  | ConceptualPracticeQuestion

const REAL_EXAMPLE_INPUT: ConvexLensInput = {
  focalLengthCm: 15,
  objectDistanceCm: 20,
  objectHeightCm: 3,
  screenDistanceCm: 60,
}

const VIRTUAL_EXAMPLE_INPUT: ConvexLensInput = {
  focalLengthCm: 15,
  objectDistanceCm: 10,
  objectHeightCm: 3,
  screenDistanceCm: 30,
}

function buildWorkedExamples(): readonly [WorkedExampleSpec, WorkedExampleSpec] {
  const realRes = calculateConvexLens(REAL_EXAMPLE_INPUT)
  const virtRes = calculateConvexLens(VIRTUAL_EXAMPLE_INPUT)

  const realExample: WorkedExampleSpec = {
    id: 'real-image-example',
    badge: 'Worked Example A · Real & Inverted Image (|u| > f)',
    title: 'Projecting an Enlarged Real Candle Image onto a Screen',
    scenarioSummary: `A ${formatLensNumber(REAL_EXAMPLE_INPUT.objectHeightCm)} cm tall candle flame is placed at |u| = ${formatLensNumber(REAL_EXAMPLE_INPUT.objectDistanceCm)} cm (between F₁ and 2F₁) in front of a convex lens of focal length f = +${formatLensNumber(REAL_EXAMPLE_INPUT.focalLengthCm)} cm.`,
    input: REAL_EXAMPLE_INPUT,
    result: realRes,
    steps: [
      {
        heading: 'Apply New Cartesian Sign Convention (NCERT Section 9.3.6)',
        formula: 'u = −|u|,   f = +f of the convex lens,   h = +object height',
        substitution: `u = ${formatSignedCm(realRes.uCm)},   f = +${formatLensNumber(realRes.fCm)} cm,   h = +${formatLensNumber(realRes.objectHeightCm)} cm`,
        conclusion: 'Object is to the left of optical centre O(0,0), so u is negative.',
      },
      {
        heading: 'Solve Thin-Lens Formula for Image Position v (NCERT Section 9.3.7)',
        formula: '1/v − 1/u = 1/f   ⇒   1/v = 1/f + 1/u = (u + f) / (u · f)',
        substitution: `1/v = 1/(+15) + 1/(−20) = (4 − 3) / 60 = +1 / 60 cm⁻¹   ⇒   v = ${formatSignedCm(realRes.vCm ?? 0)}`,
        conclusion: `Positive v = ${formatSignedCm(realRes.vCm ?? 0)} means refracted rays physically converge on the right side of the lens and can be caught on a screen at +${formatLensNumber(realRes.vCm ?? 0)} cm.`,
      },
      {
        heading: 'Linear Magnification m & Image Height h′ (NCERT Section 9.3.7)',
        formula: "m = v / u,   h' = m · h",
        substitution: `m = (+60) / (−20) = ${formatLensNumber(realRes.magnification ?? 0, 2)},   h' = (${formatLensNumber(realRes.magnification ?? 0, 2)}) × 3 cm = ${formatSignedCm(realRes.imageHeightCm ?? 0)}`,
        conclusion: 'Negative m and h′ indicate a real, inverted image that is 3× enlarged.',
      },
    ],
  }

  const virtualExample: WorkedExampleSpec = {
    id: 'virtual-image-example',
    badge: 'Worked Example B · Virtual & Erect Image (|u| < f)',
    title: 'Using the Same Convex Lens as a Simple Magnifying Glass',
    scenarioSummary: `The same ${formatLensNumber(VIRTUAL_EXAMPLE_INPUT.objectHeightCm)} cm object is moved closer to |u| = ${formatLensNumber(VIRTUAL_EXAMPLE_INPUT.objectDistanceCm)} cm (between focus F₁ and optical centre O) in front of the f = +${formatLensNumber(VIRTUAL_EXAMPLE_INPUT.focalLengthCm)} cm convex lens.`,
    input: VIRTUAL_EXAMPLE_INPUT,
    result: virtRes,
    steps: [
      {
        heading: 'Apply New Cartesian Sign Convention (NCERT Section 9.3.6)',
        formula: 'u = −|u|,   f = +f of the convex lens,   h = +object height',
        substitution: `u = ${formatSignedCm(virtRes.uCm)},   f = +${formatLensNumber(virtRes.fCm)} cm,   h = +${formatLensNumber(virtRes.objectHeightCm)} cm`,
        conclusion: 'Here |u| = 10 cm is strictly less than f = 15 cm (object is inside F₁).',
      },
      {
        heading: 'Solve Thin-Lens Formula for Image Position v (NCERT Section 9.3.7)',
        formula: '1/v = 1/f + 1/u = (u + f) / (u · f)',
        substitution: `1/v = 1/(+15) + 1/(−10) = (2 − 3) / 30 = −1 / 30 cm⁻¹   ⇒   v = ${formatSignedCm(virtRes.vCm ?? 0)}`,
        conclusion: `Negative v = ${formatSignedCm(virtRes.vCm ?? 0)} means refracted rays diverge on the right side and only appear to meet at 30 cm on the object side (left of O). Cannot be caught on a screen.`,
      },
      {
        heading: 'Linear Magnification m & Image Height h′ (NCERT Section 9.3.7)',
        formula: "m = v / u,   h' = m · h",
        substitution: `m = (−30) / (−10) = +${formatLensNumber(virtRes.magnification ?? 0, 2)},   h' = (+${formatLensNumber(virtRes.magnification ?? 0, 2)}) × 3 cm = ${formatSignedCm(virtRes.imageHeightCm ?? 0)}`,
        conclusion: 'Positive m = +3 and h′ = +9 cm indicate an erect, 3× magnified virtual image seen by looking through the lens.',
      },
    ],
  }

  return [realExample, virtualExample] as const
}

export const ALTERNATIVE_WORKED_EXAMPLES: readonly [
  WorkedExampleSpec,
  WorkedExampleSpec,
] = buildWorkedExamples()

const NUMERICAL_Q1_SETUP: ConvexLensInput = {
  focalLengthCm: 15,
  objectDistanceCm: 45,
  objectHeightCm: 4,
  screenDistanceCm: 22.5,
}
const NUMERICAL_Q1_RESULT = calculateConvexLens(NUMERICAL_Q1_SETUP)

const CONCEPTUAL_Q2_SETUP: ConvexLensInput = {
  focalLengthCm: 15,
  objectDistanceCm: 9,
  objectHeightCm: 3,
  screenDistanceCm: 25,
}
const CONCEPTUAL_Q2_RESULT = calculateConvexLens(CONCEPTUAL_Q2_SETUP)

export const NUMERICAL_PRACTICE_QUESTION: NumericalPracticeQuestion = {
  id: 'numerical-q1',
  kind: 'numerical',
  title: 'Question 1 (Numerical) · Finding the Sharp Screen Position Beyond 2F₁',
  prompt:
    'A 4 cm tall object is placed at |u| = 45 cm (so u = −45 cm) in front of a convex lens of focal length f = +15 cm. Calculate the signed image position v (in cm) where a paper screen must be placed to catch a sharp image.',
  unitLabel: 'cm',
  benchSetup: NUMERICAL_Q1_SETUP,
  expectedVCm: NUMERICAL_Q1_RESULT.vCm ?? 22.5,
  toleranceCm: 0.25,
  signTrapVCm: 11.25, // 1/15 + 1/45 = 4/45 => 11.25 cm if student mistakenly uses u = +45 cm
  correctExplanation: `Correct! Using 1/v − 1/u = 1/f with u = −45 cm and f = +15 cm gives 1/v = 1/15 + 1/(−45) = (3 − 1)/45 = +2/45 cm⁻¹, so v = +${formatLensNumber(NUMERICAL_Q1_RESULT.vCm ?? 22.5)} cm (between F₂ = +15 cm and 2F₂ = +30 cm, with magnification m = v/u = −0.5 and inverted height h' = −2 cm).`,
  signTrapFeedback:
    'Sign-convention check: 11.25 cm comes from substituting u = +45 cm instead of u = −45 cm. Because the object is to the left of O, u is negative (u = −45 cm), so 1/v = 1/15 − 1/45 = 2/45.',
  generalHint:
    'Substitute u = −45 cm and f = +15 cm into 1/v = 1/f + 1/u = 1/15 + 1/(−45), then take the reciprocal to find v in cm.',
}

export const CONCEPTUAL_PRACTICE_QUESTION: ConceptualPracticeQuestion = {
  id: 'conceptual-q2',
  kind: 'conceptual',
  title: 'Question 2 (Conceptual) · Why the Paper Screen Stays Blank Inside F₁',
  prompt:
    'A student places a small object at |u| = 9 cm in front of a convex lens of focal length f = +15 cm and slides a white paper screen between +10 cm and +60 cm on the right side of the lens. What will happen on the paper screen, and why?',
  benchSetup: CONCEPTUAL_Q2_SETUP,
  options: [
    'A sharp, diminished, inverted image will appear on the screen at v = +5.6 cm.',
    `No sharp image can be caught on the screen at any distance because |u| < f: the refracted rays diverge on the right side, while their backward extensions form an upright, magnified virtual image at v = ${formatSignedCm(CONCEPTUAL_Q2_RESULT.vCm ?? -22.5)} on the object side.`,
    'A sharp, upright image will appear on the screen at v = +22.5 cm on the right side.',
  ],
  correctOptionIndex: 1,
  correctExplanation: `Correct! Because |u| = 9 cm is inside the principal focus F₁ (f = 15 cm), 1/v = 1/15 + 1/(−9) = (3 − 5)/45 = −2/45 cm⁻¹, so v = ${formatSignedCm(CONCEPTUAL_Q2_RESULT.vCm ?? -22.5)} and m = +2.5. Refracted rays diverge on the right side, so a physical screen only shows a diffuse glow; the upright virtual image is viewed by looking back through the lens.`,
  optionFeedback: [
    'Check the sign of u: +5.625 cm comes from adding 1/15 + 1/9. With u = −9 cm, 1/v = 1/15 − 1/9 = −2/45 < 0, so the rays do not converge on the right side.',
    `Correct! Because |u| < f, the refracted rays diverge on the right side and trace back to a virtual, erect image at v = ${formatSignedCm(CONCEPTUAL_Q2_RESULT.vCm ?? -22.5)} (m = +${formatLensNumber(CONCEPTUAL_Q2_RESULT.magnification ?? 2.5)}×).`,
    'Although |v| = 22.5 cm, its sign is negative (v = −22.5 cm, on the object side). On the right side (+x) where the screen sits, the refracted rays are spreading apart.',
  ],
}

export const ALTERNATIVE_PRACTICE_QUESTIONS: readonly [
  NumericalPracticeQuestion,
  ConceptualPracticeQuestion,
] = [NUMERICAL_Q1_QUESTION_ALIAS(), CONCEPTUAL_PRACTICE_QUESTION]

function NUMERICAL_Q1_QUESTION_ALIAS(): NumericalPracticeQuestion {
  return NUMERICAL_PRACTICE_QUESTION
}

export function evaluateNumericalPracticeAnswer(draft: string): {
  status: 'empty' | 'correct' | 'sign_trap' | 'incorrect'
  parsedValue: number | null
  message: string
} {
  const parsed = parseLensNumericDraft(draft)
  if (parsed === null) {
    return {
      status: 'empty',
      parsedValue: null,
      message: 'Enter a numeric value for v in cm before checking.',
    }
  }
  if (
    Math.abs(parsed - NUMERICAL_PRACTICE_QUESTION.expectedVCm) <=
    NUMERICAL_PRACTICE_QUESTION.toleranceCm
  ) {
    return {
      status: 'correct',
      parsedValue: parsed,
      message: NUMERICAL_PRACTICE_QUESTION.correctExplanation,
    }
  }
  if (
    Math.abs(Math.abs(parsed) - NUMERICAL_PRACTICE_QUESTION.signTrapVCm) <= 0.35
  ) {
    return {
      status: 'sign_trap',
      parsedValue: parsed,
      message: NUMERICAL_PRACTICE_QUESTION.signTrapFeedback,
    }
  }
  if (
    Math.abs(parsed - -NUMERICAL_PRACTICE_QUESTION.expectedVCm) <=
    NUMERICAL_PRACTICE_QUESTION.toleranceCm
  ) {
    return {
      status: 'sign_trap',
      parsedValue: parsed,
      message:
        'Check the sign of v: because |u| = 45 cm > f = 15 cm, the rays converge on the right (+x) side of the lens, so v is positive (+22.5 cm).',
    }
  }
  return {
    status: 'incorrect',
    parsedValue: parsed,
    message: NUMERICAL_PRACTICE_QUESTION.generalHint,
  }
}

export function evaluateConceptualPracticeAnswer(choiceIndex: number | null): {
  status: 'unselected' | 'correct' | 'incorrect'
  message: string
} {
  if (
    choiceIndex === null ||
    choiceIndex < 0 ||
    choiceIndex >= CONCEPTUAL_PRACTICE_QUESTION.options.length
  ) {
    return {
      status: 'unselected',
      message: 'Select one of the three explanations to check your answer.',
    }
  }
  const isCorrect =
    choiceIndex === CONCEPTUAL_PRACTICE_QUESTION.correctOptionIndex
  return {
    status: isCorrect ? 'correct' : 'incorrect',
    message: CONCEPTUAL_PRACTICE_QUESTION.optionFeedback[choiceIndex],
  }
}

export interface AlternativeBenchAndPracticeState {
  benchInput: ConvexLensInput
  drafts: LensInputDrafts
  selectedQuestionId: PracticeQuestionId
}

/**
 * Selecting a practice question changes only `selectedQuestionId` and leaves
 * `benchInput` and `drafts` untouched.
 */
export function selectPracticeQuestionState(
  state: AlternativeBenchAndPracticeState,
  nextQuestionId: PracticeQuestionId
): AlternativeBenchAndPracticeState {
  return {
    ...state,
    selectedQuestionId: nextQuestionId,
  }
}

/**
 * Only an explicit "Load on Bench" action updates `benchInput` and `drafts`.
 */
export function loadSetupOntoBenchState(
  state: AlternativeBenchAndPracticeState,
  targetSetup: ConvexLensInput
): AlternativeBenchAndPracticeState {
  return {
    ...state,
    benchInput: { ...targetSetup },
    drafts: createDraftsFromLensInput(targetSetup),
  }
}
