/**
 * Story-Driven Lesson Content, Stage Transition Logic, Practice Sequence &
 * Misconception-Specific Assessment for `/learn/lens-power-dioptre`.
 *
 * Pedagogical Progression:
 * Stage A: Predict — Qualitative prediction (Lens A vs Lens B) with zero focal-length or power answer leakage.
 * Stage B: Experiment — Switch between Lens A (+20 cm) & Lens B (+40 cm), measure with ruler, compare overlay.
 * Stage C: Discover — Inverse relationship between focal length f and bending strength (Power P).
 * Stage D: Calculate — P = 1 / f (in metres), explicit cm -> m conversion, ruler-vs-model distinction.
 * Stage E: Contrast — Concave diverging lens, dashed backward extensions to virtual focus F1, negative power.
 * Stage F: Apply — 6-question varied practice ladder with misconception-specific diagnostics & progressive hints.
 */

import {
  calculateLensPowerModel,
  formatSignedValue,
  type LensPowerModelResult,
} from './lensPowerModel'

export const LENS_POWER_SOURCE_METADATA = {
  curriculum: 'CBSE Class 10 Science — Chapter 9: Light – Reflection and Refraction',
  sectionRef: 'Section 9.3.8: Power of a Lens (NCERT Rationalised 2023–24 / 2024–25 Edition, Eq. 9.11)',
  verificationStatus:
    'Checked against NCERT Class 10 Science Chapter 9 (§9.3.8, P = 1/f in metres, 1 D = 1 m⁻¹, New Cartesian Sign Convention: f > 0 and P > 0 for convex lens; f < 0 and P < 0 for concave lens). Provisional prototype pending formal educator review.',
} as const

export type LensPowerStageId =
  | 'predict'
  | 'experiment'
  | 'discover'
  | 'calculate'
  | 'contrast'
  | 'apply'

export interface LensPowerStageMeta {
  id: LensPowerStageId
  stepNumber: number
  shortLabel: string
  title: string
}

export const LENS_POWER_STAGES: readonly LensPowerStageMeta[] = [
  { id: 'predict', stepNumber: 1, shortLabel: 'A. Predict', title: 'Commit to a Prediction' },
  { id: 'experiment', stepNumber: 2, shortLabel: 'B. Experiment', title: 'Measure & Compare on the Bench' },
  { id: 'discover', stepNumber: 3, shortLabel: 'C. Discover', title: 'Why Shorter Focal Length Means Stronger Bending' },
  { id: 'calculate', stepNumber: 4, shortLabel: 'D. Calculate', title: 'From Centimetres to Metres to Dioptres (P = 1/f)' },
  { id: 'contrast', stepNumber: 5, shortLabel: 'E. Contrast', title: 'Diverging Concave Lens & Negative Power' },
  { id: 'apply', stepNumber: 6, shortLabel: 'F. Apply', title: 'Targeted Practice Sequence' },
]

export interface PresetLensSpec {
  id: 'lens-a' | 'lens-b' | 'concave-c'
  /** Label shown BEFORE prediction is committed (no numerical focal length leakage) */
  unrevealedLabel: string
  /** Label shown AFTER prediction is committed */
  revealedLabel: string
  shortTag: string
  focalLengthCm: number
  description: string
  model: LensPowerModelResult
}

export const PRESET_LENSES: Record<'lens-a' | 'lens-b' | 'concave-c', PresetLensSpec> = {
  'lens-a': {
    id: 'lens-a',
    unrevealedLabel: 'Lens A · More Strongly Curved Convex',
    revealedLabel: 'Lens A · Convex (f = +20 cm)',
    shortTag: 'f = +20 cm',
    focalLengthCm: 20,
    description: 'Steeper curvature converging lens (same optical glass)',
    model: calculateLensPowerModel({ focalLengthCm: 20 }),
  },
  'lens-b': {
    id: 'lens-b',
    unrevealedLabel: 'Lens B · More Gently Curved Convex',
    revealedLabel: 'Lens B · Convex (f = +40 cm)',
    shortTag: 'f = +40 cm',
    focalLengthCm: 40,
    description: 'Flatter curvature converging lens (same optical glass)',
    model: calculateLensPowerModel({ focalLengthCm: 40 }),
  },
  'concave-c': {
    id: 'concave-c',
    unrevealedLabel: 'Lens C · Diverging Concave',
    revealedLabel: 'Lens C · Concave (f = −25 cm)',
    shortTag: 'f = −25 cm',
    focalLengthCm: -25,
    description: 'Spreads parallel rays outward from virtual focus F₁',
    model: calculateLensPowerModel({ focalLengthCm: -25 }),
  },
}

export type PredictionChoiceId = 'lens-a-closer' | 'lens-b-closer' | 'both-same'

export interface PredictionOptionSpec {
  id: PredictionChoiceId
  /** Qualitative label shown in Stage A (never leaks +20 cm or +40 cm before commitment) */
  label: string
  /** Short summary shown in Stage B reminder banner */
  shortSummary: string
}

export const INITIAL_PREDICTION_OPTIONS: readonly PredictionOptionSpec[] = [
  {
    id: 'lens-a-closer',
    label:
      'Lens A (more strongly curved convex surface of the same glass) will bend parallel rays more sharply and bring them together closer to the optical centre O.',
    shortSummary: 'Lens A brings parallel rays together closer to O',
  },
  {
    id: 'lens-b-closer',
    label:
      'Lens B (more gently curved convex surface of the same glass) will bring parallel rays together closer to the optical centre O.',
    shortSummary: 'Lens B brings parallel rays together closer to O',
  },
  {
    id: 'both-same',
    label:
      'Both convex lenses will bring the incoming parallel rays together at the exact same distance from O.',
    shortSummary: 'Both lenses focus at the same distance from O',
  },
]

export interface PredictionEvaluation {
  choice: PredictionChoiceId
  isCorrect: boolean
  headline: string
  explanation: string
  nextActionPrompt: string
}

export function evaluateInitialPrediction(choice: PredictionChoiceId): PredictionEvaluation {
  if (choice === 'lens-a-closer') {
    return {
      choice,
      isCorrect: true,
      headline: 'Your prediction matches the optical bench!',
      explanation:
        'The same incoming parallel beam meets closer to Lens A (at F₂ = +20 cm from O) than to Lens B (at F₂ = +40 cm from O).',
      nextActionPrompt:
        'Now move to Stage B: slide the bench ruler caliper to measure both focal distances and use the comparison overlay.',
    }
  }
  if (choice === 'lens-b-closer') {
    return {
      choice,
      isCorrect: false,
      headline: 'Look closely at where the rays cross the axis on the bench.',
      explanation:
        'The gentler Lens B lets the rays travel farther (+40 cm) before meeting. The more strongly curved Lens A brings the same parallel beam together closer to O (+20 cm).',
      nextActionPrompt:
        'Switch between Lens A and Lens B or enable “Compare Both Lenses” on the bench to inspect both crossing points.',
    }
  }
  return {
    choice,
    isCorrect: false,
    headline: 'Two lenses with different curvatures of the same glass do not focus at the same distance.',
    explanation:
      'Parallel rays passing through Lens A meet at +20 cm from O, whereas parallel rays passing through Lens B meet at +40 cm from O.',
    nextActionPrompt:
      'Use the bench ruler in Stage B to measure both crossing points directly.',
  }
}

export type PracticeQuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6'

export interface PracticeQuestionSpec {
  id: PracticeQuestionId
  stepNumber: number
  categoryLabel: string
  prompt: string
  kind: 'choice' | 'number-and-reason' | 'number' | 'structured-explanation'
  options?: readonly string[]
  correctOptionIndex?: number
  expectedNumber?: number
  numberTolerance?: number
  unitLabel?: string
  followUpQuestion?: string
  followUpOptions?: readonly string[]
  correctFollowUpIndex?: number
  /** For 'structured-explanation' (Q6): transparent rubric items for self-checking written prose */
  selfCheckRubric?: readonly string[]
  hints: readonly [string, string]
  workedSolution: {
    formula: string
    substitution: string
    conclusion: string
  }
  /** Optional bench configuration so the student can inspect the question setup without altering assessment state */
  benchFocalLengthCm: number
}

export const LENS_POWER_PRACTICE_QUESTIONS: readonly PracticeQuestionSpec[] = [
  {
    id: 'q1',
    stepNumber: 1,
    categoryLabel: '1. Compare Lens Powers from Focal Lengths',
    prompt:
      'Two converging convex lenses have focal lengths f₁ = +15 cm and f₂ = +30 cm. Which lens has the greater optical power, and why?',
    kind: 'choice',
    options: [
      'The +15 cm lens, because the same incoming parallel beam meets closer to the lens (P = 1/f).',
      'The +30 cm lens, because a larger focal length means greater optical power.',
      'Both lenses have the same power because both are convex (+).',
      'Neither lens has power unless an object is placed inside F.',
    ],
    correctOptionIndex: 0,
    hints: [
      'Recall the bench comparison between Lens A (+20 cm) and Lens B (+40 cm): which lens brought the parallel beam together closer to O?',
      'Since P = 1 / f, focal length f is in the denominator. Halving the focal length (+15 cm vs +30 cm) doubles the optical power (+6.67 D vs +3.33 D).',
    ],
    workedSolution: {
      formula: 'P = 1 / f (in metres) = 100 / f (in cm)',
      substitution: 'P₁ = 100 / (+15 cm) = +6.67 D  |  P₂ = 100 / (+30 cm) = +3.33 D',
      conclusion:
        'The +15 cm lens has twice the optical power (+6.67 D) because it converges parallel light in half the distance.',
    },
    benchFocalLengthCm: 15,
  },
  {
    id: 'q2',
    stepNumber: 2,
    categoryLabel: '2. Convert Centimetres to Metres',
    prompt:
      'Before using P = 1 / f, focal length must be expressed in metres (since 1 D = 1 m⁻¹). What is a focal length of f = +25 cm expressed in metres?',
    kind: 'number',
    expectedNumber: 0.25,
    numberTolerance: 0.001,
    unitLabel: 'm',
    hints: [
      'There are 100 centimetres in 1 metre (100 cm = 1 m).',
      'Divide the centimetre value by 100: f(m) = 25 ÷ 100.',
    ],
    workedSolution: {
      formula: 'f (in m) = f (in cm) ÷ 100',
      substitution: 'f = +25 cm ÷ 100 = +0.25 m',
      conclusion: 'f = +0.25 m. Always convert cm to m first so you never divide 1 by centimetres.',
    },
    benchFocalLengthCm: 25,
  },
  {
    id: 'q3',
    stepNumber: 3,
    categoryLabel: '3. Calculate Power in Dioptres',
    prompt:
      'A convex lens converges parallel rays to a focus at f = +25 cm. Calculate its optical power P in dioptres (D), and select the physical reason.',
    kind: 'number-and-reason',
    expectedNumber: 4,
    numberTolerance: 0.05,
    unitLabel: 'D',
    followUpQuestion: 'Why is the answer +4.0 D rather than +0.04 D?',
    followUpOptions: [
      'Because 1 dioptre is 1 m⁻¹, so we convert 25 cm to 0.25 m first: P = 1 / 0.25 m = +4.0 D.',
      'Because we multiply focal length by 16 to get dioptres.',
      'Because centimetre values must be squared before taking the reciprocal.',
    ],
    correctFollowUpIndex: 0,
    hints: [
      'First convert f = +25 cm into metres: f = +0.25 m.',
      'Now compute P = 1 / f(m) = 1 / 0.25 (or 100 / 25).',
    ],
    workedSolution: {
      formula: 'P = 1 / f (in m)',
      substitution: 'f = +25 cm = +0.25 m  ⇒  P = 1 / (+0.25 m) = +4.0 D',
      conclusion: 'Optical power P = +4.0 D.',
    },
    benchFocalLengthCm: 25,
  },
  {
    id: 'q4',
    stepNumber: 4,
    categoryLabel: '4. Calculate Focal Length from Power',
    prompt:
      'An optician prescribes a corrective lens of power P = −2.5 D. What is the signed focal length f of this lens in centimetres (cm)?',
    kind: 'number',
    expectedNumber: -40,
    numberTolerance: 0.2,
    unitLabel: 'cm',
    hints: [
      'Use f (in metres) = 1 / P = 1 / (−2.5 D), keeping the negative sign.',
      'Once you have f in metres (−0.4 m), multiply by 100 to convert metres back into centimetres.',
    ],
    workedSolution: {
      formula: 'f (in m) = 1 / P  ⇒  f (in cm) = 100 / P',
      substitution: 'f (m) = 1 / (−2.5 D) = −0.40 m  ⇒  f (cm) = −0.40 × 100 = −40 cm',
      conclusion: 'Signed focal length f = −40 cm (a diverging concave lens).',
    },
    benchFocalLengthCm: -40,
  },
  {
    id: 'q5',
    stepNumber: 5,
    categoryLabel: '5. Interpret Positive vs Negative Sign',
    prompt:
      'Lens X has power +2.0 D and Lens Y has power −4.0 D. Which statement accurately interprets both the sign and strength of these lenses?',
    kind: 'choice',
    options: [
      'Lens X converges light (+), while Lens Y diverges light (−) and bends rays more strongly (|P| = 4.0 D > 2.0 D).',
      'Lens X is stronger than Lens Y because +2.0 is mathematically greater than −4.0.',
      'Both lenses converge light, but Lens Y forms an image behind the observer.',
      'A negative power means Lens Y absorbs light instead of refracting it.',
    ],
    correctOptionIndex: 0,
    hints: [
      'In optics, the + or − sign tells you the DIRECTION of bending (converging vs diverging), not whether the lens is weaker than zero.',
      'Compare the magnitudes |P|: |−4.0 D| = 4.0 D (|f| = 25 cm) bends rays more sharply than |+2.0 D| = 2.0 D (|f| = 50 cm).',
    ],
    workedSolution: {
      formula: 'Sign(P) → Converging (+) vs Diverging (−)  |  |P| = 1/|f| → Bending Strength',
      substitution: 'Lens X: f = +50 cm (converging)  |  Lens Y: f = −25 cm (diverging, sharper bending)',
      conclusion:
        'Negative sign means diverging (concave) with a virtual focus F₁; magnitude 4.0 D means Lens Y bends rays twice as strongly as Lens X.',
    },
    benchFocalLengthCm: -25,
  },
  {
    id: 'q6',
    stepNumber: 6,
    categoryLabel: '6. Explain an Observation in Words',
    prompt:
      'On the optical bench, parallel rays pass through a lens and spread outward. When you trace dashed lines backward from the outgoing rays, they meet at a point 20 cm to the left of the optical centre O. Complete the auto-graded structured claim (Part A) and write your own 1–2 sentence notebook explanation (Part B, self-assessed against the 3-point rubric).',
    kind: 'structured-explanation',
    options: [
      'It is a diverging (concave) lens with virtual principal focus F₁ at f = −20 cm (−0.20 m) and power P = −5.0 D.',
      'It is a converging (convex) lens with real focus at f = +20 cm and power P = +5.0 D.',
      'It is a diverging (concave) lens with power P = −0.05 D because 1 ÷ (−20) = −0.05.',
      'The dashed backward extensions are actual light rays travelling backward to the left.',
    ],
    correctOptionIndex: 0,
    selfCheckRubric: [
      '1. Identifies the lens as diverging (concave) because the outgoing actual rays spread apart.',
      '2. States that the dashed backward extensions locate a virtual focus F₁ on the incident side, so f = −20 cm = −0.20 m.',
      '3. Calculates power in metres: P = 1 / (−0.20 m) = −5.0 D.',
    ],
    hints: [
      'Actual rays diverge to the right; dashed lines are geometric backward extensions showing where the rays appear to originate (virtual focus F₁ on the left, so f < 0).',
      'Convert f = −20 cm to −0.20 m, then calculate P = 1 / (−0.20 m) = −5.0 D.',
    ],
    workedSolution: {
      formula: 'Virtual focus on incident side ⇒ f = −20 cm = −0.20 m  ⇒  P = 1 / f',
      substitution: 'P = 1 / (−0.20 m) = −5.0 D',
      conclusion:
        'Model Explanation: Because parallel incident rays spread outward after refraction, the lens is a diverging (concave) lens. Tracing the diverging rays backward with dashed construction lines locates the virtual principal focus F₁ at f = −20 cm = −0.20 m, giving an optical power of P = 1 / (−0.20 m) = −5.0 D.',
    },
    benchFocalLengthCm: -20,
  },
]

export interface PracticeAttemptState {
  choiceIndex: number | null
  numericDraft: string
  followUpChoiceIndex: number | null
  writtenExplanationDraft: string
  submitted: boolean
  revealedHintCount: 0 | 1 | 2
  solutionRevealed: boolean
}

export const INITIAL_PRACTICE_ATTEMPT: PracticeAttemptState = {
  choiceIndex: null,
  numericDraft: '',
  followUpChoiceIndex: null,
  writtenExplanationDraft: '',
  submitted: false,
  revealedHintCount: 0,
  solutionRevealed: false,
}

export type EvaluationStatus = 'empty' | 'correct' | 'needs-reasoning' | 'misconception'

export interface PracticeEvaluationResult {
  status: EvaluationStatus
  headline: string
  feedback: string
  suggestReplayComparison?: boolean
}

/**
 * Evaluates a learner's submitted practice attempt and returns targeted,
 * misconception-specific diagnostic feedback rather than generic "Wrong answer".
 */
export function evaluateLensPowerPractice(
  question: PracticeQuestionSpec,
  attempt: PracticeAttemptState
): PracticeEvaluationResult {
  if (question.kind === 'choice' || question.kind === 'structured-explanation') {
    if (attempt.choiceIndex === null) {
      return {
        status: 'empty',
        headline: 'Select a structured statement first',
        feedback: 'Choose one of the statements above before checking your answer.',
      }
    }

    if (attempt.choiceIndex === question.correctOptionIndex) {
      return {
        status: 'correct',
        headline:
          question.kind === 'structured-explanation'
            ? 'Part A (Auto-Graded Claim) Correct — Self-Assess Your Part B Written Explanation Below'
            : 'Accurate scientific reasoning!',
        feedback: question.workedSolution.conclusion,
      }
    }

    // Specific misconception diagnostics per question
    if (question.id === 'q1') {
      if (attempt.choiceIndex === 1) {
        return {
          status: 'misconception',
          headline: 'Misconception Alert: Focal length and power are inversely related',
          feedback:
            'A larger focal length (+30 cm) means the lens takes a longer distance to bring parallel rays together—so it bends light LESS sharply. Compare the +15 cm and +30 cm lenses on the bench.',
          suggestReplayComparison: true,
        }
      }
      return {
        status: 'misconception',
        headline: 'Compare where the parallel beams meet',
        feedback:
          'Even though both lenses are convex (+), their focal lengths differ (+15 cm vs +30 cm). Shorter focal length means the beam meets closer to the lens and power is greater (P = 1/f).',
        suggestReplayComparison: true,
      }
    }

    if (question.id === 'q5') {
      if (attempt.choiceIndex === 1) {
        return {
          status: 'misconception',
          headline: 'Sign vs Magnitude Trap: −4.0 D is NOT weaker than +2.0 D!',
          feedback:
            'In optics, the minus sign (−) only indicates that the lens DIVERGES light (virtual focus F₁). The bending strength is given by the magnitude |P|: 4.0 D bends light twice as strongly as 2.0 D.',
        }
      }
      return {
        status: 'misconception',
        headline: 'Check what the + and − signs represent',
        feedback:
          'Positive power (+) means a converging lens; negative power (−) means a diverging lens. Magnitude |P| measures how strongly the lens bends light.',
      }
    }

    if (question.id === 'q6') {
      if (attempt.choiceIndex === 1) {
        return {
          status: 'misconception',
          headline: 'Sign Misconception: Diverging rays have a negative focal length',
          feedback:
            'Because actual rays spread outward and only dashed backward extensions meet at 20 cm on the left, the focus is virtual (f = −20 cm, P = −5.0 D), not +20 cm.',
        }
      }
      if (attempt.choiceIndex === 2) {
        return {
          status: 'misconception',
          headline: 'Unit Conversion Trap: You divided 1 by centimetres!',
          feedback:
            '1 ÷ (−20 cm) = −0.05 cm⁻¹, which is NOT in dioptres. Convert −20 cm to −0.20 m first: P = 1 / (−0.20 m) = −5.0 D.',
        }
      }
      return {
        status: 'misconception',
        headline: 'Actual Rays vs Dashed Backward Extensions',
        feedback:
          'Light never travels backward to the left here. The solid lines on the right are the actual diverging rays; the dashed lines are geometric construction lines traced back to the virtual focus F₁.',
      }
    }
  }

  // Numeric or Number-and-Reason questions (q2, q3, q4)
  const raw = attempt.numericDraft.trim()
  if (raw.length === 0) {
    return {
      status: 'empty',
      headline: 'Enter a numerical value',
      feedback: `Type your calculated number (in ${question.unitLabel ?? 'units'}) before checking.`,
    }
  }

  const val = Number(raw)
  if (!Number.isFinite(val)) {
    return {
      status: 'empty',
      headline: 'Invalid number format',
      feedback: 'Please enter a valid decimal or whole number (for example, 0.25, 4, or -40).',
    }
  }

  const target = question.expectedNumber!
  const tol = question.numberTolerance ?? 0.02

  if (question.id === 'q2') {
    if (Math.abs(val - 0.25) <= tol) {
      return {
        status: 'correct',
        headline: 'Correct metre conversion (+0.25 m)!',
        feedback: '25 cm ÷ 100 = +0.25 m. Now P = 1 / f can be applied directly in SI units.',
      }
    }
    if (Math.abs(val - 2500) <= 1) {
      return {
        status: 'misconception',
        headline: 'Unit Conversion Direction: You multiplied by 100 instead of dividing',
        feedback:
          '1 metre is larger than 1 centimetre (1 m = 100 cm), so a number in metres is 100 times smaller than the number in centimetres: 25 ÷ 100 = 0.25 m.',
      }
    }
    if (Math.abs(val - 2.5) <= 0.05) {
      return {
        status: 'misconception',
        headline: 'Decimal Place Slip: Divided by 10 instead of 100',
        feedback: 'There are 100 cm in 1 m (not 10). Shift the decimal point two places left: 25 cm = 0.25 m.',
      }
    }
    if (Math.abs(val - -0.25) <= tol) {
      return {
        status: 'misconception',
        headline: 'Sign Check: f = +25 cm is positive',
        feedback: 'The magnitude 0.25 m is right, but keep the positive sign (+0.25 m) for a convex lens.',
      }
    }
    return {
      status: 'misconception',
      headline: 'Check your centimetre-to-metre division',
      feedback: `Divide ${formatSignedValue(25, 0)} cm by 100 to convert centimetres into metres.`,
    }
  }

  if (question.id === 'q3') {
    const numRight = Math.abs(val - target) <= tol
    if (!numRight) {
      if (Math.abs(val - 0.04) <= 0.005) {
        return {
          status: 'misconception',
          headline: 'Centimetre Trap Detected: You used f = 25 cm directly in P = 1/f!',
          feedback:
            'Calculating 1 ÷ 25 gives 0.04 cm⁻¹, not dioptres! Because 1 D = 1 m⁻¹, you must first convert 25 cm → 0.25 m, then compute P = 1 ÷ 0.25 m = +4.0 D.',
        }
      }
      if (Math.abs(val - -4) <= tol) {
        return {
          status: 'misconception',
          headline: 'Sign Misconception: Convex lenses have positive power (+)',
          feedback:
            'Your magnitude (4.0 D) is right, but a converging convex lens brings rays to a real focus F₂ on the right (+25 cm), so its power is positive (+4.0 D).',
        }
      }
      return {
        status: 'misconception',
        headline: 'Recalculate P = 1 / f(m)',
        feedback: 'Convert f = +25 cm into metres (+0.25 m) and divide 1 by 0.25.',
      }
    }

    // Number is right (+4 D), now check conceptual follow-up reasoning!
    if (attempt.followUpChoiceIndex === null) {
      return {
        status: 'needs-reasoning',
        headline: 'Numerical value +4.0 D is correct! Now complete the conceptual follow-up below.',
        feedback: 'Select the reason why +4.0 D is correct instead of +0.04 D to finish this question.',
      }
    }
    if (attempt.followUpChoiceIndex !== question.correctFollowUpIndex) {
      return {
        status: 'needs-reasoning',
        headline: 'Your number (+4.0 D) is right, but check your unit-conversion reasoning!',
        feedback:
          'We do not square centimetres or multiply by 16. The factor of 100 comes strictly from 1 m = 100 cm in the definition 1 D = 1 m⁻¹.',
      }
    }
    return {
      status: 'correct',
      headline: 'Both numerical calculation (+4.0 D) and unit reasoning are spot on!',
      feedback: 'f = +25 cm = +0.25 m, so P = 1 / (+0.25 m) = +4.0 D.',
    }
  }

  if (question.id === 'q4') {
    if (Math.abs(val - -40) <= tol) {
      return {
        status: 'correct',
        headline: 'Correct signed focal length (f = −40 cm)!',
        feedback: 'f = 1 / (−2.5 D) = −0.40 m = −40 cm. The negative sign confirms a diverging concave lens.',
      }
    }
    if (Math.abs(val - 40) <= tol) {
      return {
        status: 'misconception',
        headline: 'Missing Negative Sign: Power is −2.5 D (diverging lens)',
        feedback:
          'Your magnitude (40 cm) is exact, but because P = −2.5 D is negative, the lens is concave with a virtual focus on the incident side: f = −40 cm.',
      }
    }
    if (Math.abs(val - -0.4) <= 0.02 || Math.abs(val - 0.4) <= 0.02) {
      return {
        status: 'misconception',
        headline: 'Unit Check: The question asks for focal length in centimetres (cm)',
        feedback:
          'f = −0.40 m is the correct focal length in METRES! Multiply −0.40 m by 100 to express the answer in centimetres (−40 cm).',
      }
    }
    return {
      status: 'misconception',
      headline: 'Use f(m) = 1 / P and then convert m → cm',
      feedback: 'First divide 1 by −2.5 D to get f in metres (−0.40 m), then multiply by 100 to get centimetres.',
    }
  }

  return {
    status: 'misconception',
    headline: 'Review the relation P = 1 / f(m)',
    feedback: question.workedSolution.conclusion,
  }
}

export function countCompletedPractice(
  attempts: Record<PracticeQuestionId, PracticeAttemptState>
): number {
  return LENS_POWER_PRACTICE_QUESTIONS.filter((q) => {
    const a = attempts[q.id]
    if (!a?.submitted) return false
    return evaluateLensPowerPractice(q, a).status === 'correct'
  }).length
}

/**
 * Pure state-transition helper for moving between lesson stages.
 * Guarantees that returning from the concave stage (Stage E) to earlier convex stages
 * (Stages A, B, C, D) restores an appropriate convex configuration so stale negative
 * concave values never appear beside convex explanations.
 */
export interface BenchTransitionState {
  activeStage: LensPowerStageId
  activePresetId: 'lens-a' | 'lens-b' | 'concave-c' | 'custom'
  focalLengthCm: number
  focalDraft: string
  compareOverlayActive: boolean
}

export function computeStageTransition(
  current: BenchTransitionState,
  nextStage: LensPowerStageId
): BenchTransitionState {
  // Entering Stage E (Contrast): switch to concave lens (-25 cm) and turn off convex comparison overlay
  if (nextStage === 'contrast') {
    if (current.focalLengthCm > 0) {
      return {
        activeStage: 'contrast',
        activePresetId: 'concave-c',
        focalLengthCm: -25,
        focalDraft: '25',
        compareOverlayActive: false,
      }
    }
    return {
      ...current,
      activeStage: 'contrast',
      compareOverlayActive: false,
    }
  }

  // Returning to Stage A, B, or C from a concave (f < 0) or custom lens: restore Lens A (+20 cm)
  if (nextStage === 'predict' || nextStage === 'experiment' || nextStage === 'discover') {
    if (current.focalLengthCm < 0 || (nextStage === 'predict' && current.focalLengthCm !== 20 && current.focalLengthCm !== 40)) {
      return {
        activeStage: nextStage,
        activePresetId: 'lens-a',
        focalLengthCm: 20,
        focalDraft: '20',
        compareOverlayActive: false,
      }
    }
    return {
      ...current,
      activeStage: nextStage,
    }
  }

  // Entering Stage D (Calculate): if currently on a negative concave lens, restore worked example +25 cm convex
  if (nextStage === 'calculate' && current.focalLengthCm < 0) {
    return {
      activeStage: 'calculate',
      activePresetId: 'custom',
      focalLengthCm: 25,
      focalDraft: '25',
      compareOverlayActive: false,
    }
  }

  return {
    ...current,
    activeStage: nextStage,
  }
}
