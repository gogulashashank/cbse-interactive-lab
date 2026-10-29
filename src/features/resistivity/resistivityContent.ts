import {
  calculateWire,
  type WireInput,
  type WireResult,
} from './resistivityModel'
import {
  createWireDrafts,
  formatWireNumber,
  parseDraftNumber,
  type WireDrafts,
} from './resistivityInputValidation'

export type ResistivityPresentationMode = 'reading' | 'immersive'
export type ResistivityQuestionId = 'res-q1' | 'res-q2' | 'res-q3' | 'res-q4' | 'res-q5' | 'res-q6'

/* ------------------------------ Source Metadata ------------------------------ */

export const RESISTIVITY_SOURCE_METADATA = {
  reviewStatus: 'Provisional — educator and curriculum review pending',
  ncertReference:
    'NCERT Class 10 Science, Chapter “Electricity”, Section on Factors on which the Resistance of a Conductor Depends (R = ρL/A) and Table of Electrical Resistivity of Substances at 20 °C.',
  secondaryReference:
    'OpenStax University Physics Vol. 2, Section 9.3 (Resistivity and Resistance).',
  statedTemperature: '20 °C (constant)',
  idealCalculationNotice:
    'Ideal calculation only. The model ignores source current limits and wire heating. Do not reproduce this setup with a real power supply.',
  questionOrigin:
    'All conceptual questions, numerical problems, and guided discoveries are original pedagogical items created for this interactive lesson.',
} as const

/* ------------------------------ Predictions ------------------------------ */

export interface ResistivityPrediction {
  id: 'length-prediction' | 'area-prediction' | 'resistivity-prediction'
  heading: string
  prompt: string
  options: readonly string[]
  correctOptionIndex: number
}

export const RESISTIVITY_PREDICTIONS: readonly ResistivityPrediction[] = [
  {
    id: 'length-prediction',
    heading: 'Prediction 1 · Changing Length',
    prompt:
      'You have a nichrome wire 1 meter long. If you replace it with another wire of the same material and same thickness, but 2 meters long, what will happen to the resistance?',
    options: [
      'Resistance will become twice as large (doubles).',
      'Resistance will become half as large.',
      'Resistance will stay the same because the material is the same.',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'area-prediction',
    heading: 'Prediction 2 · Changing Thickness (Area)',
    prompt:
      'You have a wire with cross-sectional area 0.5 mm². If you replace it with a thicker wire of 1.0 mm² of the same material and length, what happens to the resistance?',
    options: [
      'Resistance doubles because there is more metal.',
      'Resistance becomes half as large because a thicker wire provides a wider path for electrons.',
      'Resistance does not change.',
    ],
    correctOptionIndex: 1,
  },
  {
    id: 'resistivity-prediction',
    heading: 'Prediction 3 · Resistance vs Resistivity',
    prompt:
      'If you make a copper wire twice as long, does its electrical resistivity (ρ) increase, decrease, or remain unchanged?',
    options: [
      'It increases, because longer wires oppose flow more.',
      'It remains unchanged! Resistivity (ρ) is an intrinsic property of copper at 20 °C; only resistance (R) changes.',
      'It decreases, because resistivity is spread over more length.',
    ],
    correctOptionIndex: 1,
  },
]

/* ------------------------------ Guided Discoveries Presets ------------------------------ */

export interface GuidedDiscovery {
  id: string
  title: string
  label: string
  description: string
  setup: WireInput
}

export const GUIDED_DISCOVERIES: readonly GuidedDiscovery[] = [
  {
    id: 'base',
    title: 'Baseline Wire',
    label: '1. Baseline: Nichrome (1 m, 0.5 mm²)',
    description: 'R = 2.0 Ω. Benchmark for comparisons.',
    setup: {
      materialId: 'nichrome',
      lengthM: 1.0,
      areaMm2: 0.5,
      supplyVoltageV: 6.0,
      switchClosed: true,
    },
  },
  {
    id: 'double-length',
    title: 'Double Length (L = 2 m)',
    label: '2. Double Length (2 m, 0.5 mm²)',
    description: 'Keep area and material unchanged. Length doubles -> Resistance doubles to 4.0 Ω!',
    setup: {
      materialId: 'nichrome',
      lengthM: 2.0,
      areaMm2: 0.5,
      supplyVoltageV: 6.0,
      switchClosed: true,
    },
  },
  {
    id: 'double-area',
    title: 'Double Area (A = 1.0 mm²)',
    label: '3. Double Area (1 m, 1.0 mm²)',
    description: 'Keep length and material unchanged. Area doubles -> Resistance halves to 1.0 Ω!',
    setup: {
      materialId: 'nichrome',
      lengthM: 1.0,
      areaMm2: 1.0,
      supplyVoltageV: 6.0,
      switchClosed: true,
    },
  },
  {
    id: 'change-material',
    title: 'Switch to Copper Wire',
    label: '4. Change Material: Copper (1 m, 0.5 mm²)',
    description: 'Same geometry, but copper resistivity is ~60× lower than nichrome -> R drops to ~0.032 Ω!',
    setup: {
      materialId: 'copper',
      lengthM: 1.0,
      areaMm2: 0.5,
      supplyVoltageV: 6.0,
      switchClosed: true,
    },
  },
]

/* ------------------------------ Misconceptions ------------------------------ */

export const RESISTIVITY_MISCONCEPTIONS = [
  {
    myth: '“Making a wire longer increases its resistivity (ρ).”',
    reality:
      'Making a wire longer increases its RESISTANCE (R), but its RESISTIVITY (ρ) stays strictly unchanged! Resistivity is a characteristic property of the material at a given temperature, regardless of shape or size.',
  },
  {
    myth: '“Stretching a wire is the same as choosing a longer wire.”',
    reality:
      'When you stretch a fixed wire to double length, its volume is constant (V = L·A), so stretching also cuts its cross-sectional area in half, quadrupling its resistance (4×)! In this lesson we compare different ready-made wires with independently chosen lengths and areas.',
  },
  {
    myth: '“Doubling the diameter of a wire halves its resistance.”',
    reality:
      'Cross-sectional area depends on the square of diameter: A = π(d/2)² = πd²/4. Doubling the diameter quadruples the area (4×), which quarters the resistance (R/4)!',
  },
  {
    myth: '“All metals have the same resistivity since they are all conductors.”',
    reality:
      'Resistivity varies widely among metals: copper (1.62 × 10⁻⁸ Ω·m) conducts far better than iron (10.0 × 10⁻⁸ Ω·m), and nichrome alloy has ~60× higher resistivity, making it ideal for heaters because it resists current and does not melt or oxidize easily.',
  },
] as const

/* ------------------------------ Worked Examples ------------------------------ */

export interface ResistivityWorkedExample {
  id: string
  badge: string
  title: string
  scenario: string
  setup: WireInput
  result: WireResult
  steps: readonly { heading: string; line: string; note: string }[]
}

function buildWorkedExamples(): readonly [ResistivityWorkedExample, ResistivityWorkedExample] {
  // Example 1: Finding R of Copper wire
  const ex1Input: WireInput = {
    materialId: 'copper',
    lengthM: 2.0,
    areaMm2: 0.5,
    supplyVoltageV: 6.0,
    switchClosed: true,
  }
  const ex1Res = calculateWire(ex1Input)

  const ex1: ResistivityWorkedExample = {
    id: 'ex-copper-calc',
    badge: 'Worked Example A · Finding Wire Resistance',
    title: 'Resistance of a 2 m Copper Wire (Area 0.5 mm²)',
    scenario:
      'A copper wire has length L = 2.0 m and cross-sectional area A = 0.5 mm². The resistivity of copper at 20 °C is ρ = 1.62 × 10⁻⁸ Ω·m. Calculate its resistance.',
    setup: ex1Input,
    result: ex1Res,
    steps: [
      {
        heading: 'Step 1: Convert units to SI',
        line: 'L = 2.0 m;   A = 0.5 mm² = 0.5 × 10⁻⁶ m²;   ρ = 1.62 × 10⁻⁸ Ω·m',
        note: 'Always convert mm² to m²: 1 mm² = 10⁻⁶ m².',
      },
      {
        heading: 'Step 2: Apply R = ρ · (L / A)',
        line: 'R = (1.62 × 10⁻⁸ Ω·m × 2.0 m) ÷ (0.5 × 10⁻⁶ m²)',
        note: 'Group powers of 10: 10⁻⁸ / 10⁻⁶ = 10⁻².',
      },
      {
        heading: 'Step 3: Solve for R',
        line: `R = (3.24 × 10⁻⁸) ÷ (0.5 × 10⁻⁶) = 6.48 × 10⁻² Ω = ${formatWireNumber(ex1Res.resistanceOhm)} Ω`,
        note: 'Because copper has very low resistivity, connecting wires have negligible resistance.',
      },
    ],
  }

  // Example 2: Finding Resistivity ρ from measurements
  const ex2Input: WireInput = {
    materialId: 'nichrome',
    lengthM: 1.0,
    areaMm2: 0.5,
    supplyVoltageV: 6.0,
    switchClosed: true,
  }
  const ex2Res = calculateWire(ex2Input)

  const ex2: ResistivityWorkedExample = {
    id: 'ex-nichrome-calc',
    badge: 'Worked Example B · Calculating Material Resistivity',
    title: 'Finding Resistivity ρ of a 1 m Wire with R = 2.0 Ω',
    scenario:
      'A student tests a metal alloy wire of length L = 1.0 m and area A = 0.5 mm² (0.5 × 10⁻⁶ m²). The ammeter and voltmeter give resistance R = 2.0 Ω. What is the material’s resistivity ρ?',
    setup: ex2Input,
    result: ex2Res,
    steps: [
      {
        heading: 'Step 1: Rearrange R = ρ · L / A for resistivity ρ',
        line: 'ρ = (R × A) ÷ L',
        note: 'Resistivity has unit: (Ω × m²) / m = Ω·m.',
      },
      {
        heading: 'Step 2: Substitute values',
        line: 'ρ = (2.0 Ω × 0.5 × 10⁻⁶ m²) ÷ 1.0 m',
        note: 'Multiply R by cross-sectional area in m².',
      },
      {
        heading: 'Step 3: Calculate ρ and identify the material',
        line: 'ρ = 1.0 × 10⁻⁶ Ω·m (or 100 × 10⁻⁸ Ω·m)',
        note: 'Comparing with NCERT Table 12.2, this matches Nichrome alloy, widely used in heating coils!',
      },
    ],
  }

  return [ex1, ex2]
}

export const RESISTIVITY_WORKED_EXAMPLES = buildWorkedExamples()

/* ------------------------------ Practice Questions ------------------------------ */

export interface ResQuestionBase {
  id: ResistivityQuestionId
  level: 'Easy' | 'Medium' | 'Think'
  title: string
  prompt: string
  hint: string
  workedSolution: string
  setup: WireInput | null
}

export interface ResChoiceQuestion extends ResQuestionBase {
  kind: 'choice'
  options: readonly string[]
  correctOptionIndex: number
  optionFeedback: readonly string[]
}

export interface ResNumberQuestion extends ResQuestionBase {
  kind: 'number'
  inputLabel: string
  expected: number
  tolerance: number
  traps: readonly { value: number; tolerance: number; message: string }[]
  correctMessage: string
}

export type ResistivityPracticeQuestion = ResChoiceQuestion | ResNumberQuestion

export const RESISTIVITY_PRACTICE_QUESTIONS: readonly ResistivityPracticeQuestion[] = [
  {
    id: 'res-q1',
    kind: 'choice',
    level: 'Easy',
    title: 'Question 1 · Effect of Wire Length',
    prompt:
      'A cylindrical copper wire has resistance R. If you replace it with another copper wire of the same thickness but three times as long (3L), what is the resistance of the new wire?',
    hint: 'Look at R = ρL/A. Length L is in the numerator. What happens when L is multiplied by 3?',
    setup: {
      materialId: 'copper',
      lengthM: 3.0,
      areaMm2: 0.5,
      supplyVoltageV: 6.0,
      switchClosed: true,
    },
    options: [
      'The resistance becomes 3R (triples).',
      'The resistance becomes R/3 (one-third).',
      'The resistance stays R because the material has not changed.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Correct! Resistance is directly proportional to length (R ∝ L). Making the wire 3× longer creates three times as much opposition to flow, so resistance triples.',
      'Incorrect. Longer wires have MORE resistance, not less. Current has a longer path to traverse.',
      'Incorrect. While resistivity ρ stays the same, resistance R depends directly on geometry (L).',
    ],
    workedSolution:
      'According to R = ρL/A, resistance is directly proportional to length (R ∝ L) when material and area are constant. Therefore, replacing length L with 3L increases the resistance to 3R.',
  },
  {
    id: 'res-q2',
    kind: 'choice',
    level: 'Easy',
    title: 'Question 2 · Effect of Thickness (Cross-Sectional Area)',
    prompt:
      'Two wires of the same material and same length have cross-sectional areas A and 2A respectively. How do their resistances compare?',
    hint: 'Look at R = ρL/A. Area A is in the denominator. Does a thicker pipe give more or less resistance to water?',
    setup: {
      materialId: 'nichrome',
      lengthM: 1.0,
      areaMm2: 1.0,
      supplyVoltageV: 6.0,
      switchClosed: true,
    },
    options: [
      'The thicker wire (2A) has half the resistance of the thinner wire (R/2).',
      'The thicker wire (2A) has twice the resistance (2R).',
      'Both wires have the exact same resistance.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Correct! Resistance is inversely proportional to area (R ∝ 1/A). A thicker wire offers more parallel pathways for moving electrons, reducing resistance by half.',
      'Incorrect. Thicker wires have LESS resistance, just like wider roads allow cars to flow more easily.',
      'Incorrect. Resistance depends inversely on cross-sectional area.',
    ],
    workedSolution:
      'From R = ρL/A, resistance is inversely proportional to cross-sectional area (R ∝ 1/A). Doubling the area doubles the available space for electron drift, cutting the resistance in half (R_new = R/2).',
  },
  {
    id: 'res-q3',
    kind: 'number',
    level: 'Medium',
    title: 'Question 3 · Calculating Resistance of Nichrome Wire',
    prompt:
      'A nichrome wire of length L = 2.0 m has cross-sectional area A = 1.0 mm² (1.0 × 10⁻⁶ m²). Given the resistivity of nichrome is ρ = 1.0 × 10⁻⁶ Ω·m, calculate the resistance of this wire in ohms (Ω).',
    hint: 'Substitute into R = ρL/A. Note that ρ = 1.0 × 10⁻⁶ Ω·m and A = 1.0 × 10⁻⁶ m² cancel out nicely!',
    setup: {
      materialId: 'nichrome',
      lengthM: 2.0,
      areaMm2: 1.0,
      supplyVoltageV: 6.0,
      switchClosed: true,
    },
    inputLabel: 'Resistance R (in ohms, Ω)',
    expected: 2.0,
    tolerance: 0.05,
    traps: [
      {
        value: 1.0,
        tolerance: 0.05,
        message: 'Check length! Length is 2.0 m, not 1.0 m: R = (1.0e-6 × 2.0) / (1.0e-6) = 2.0 Ω.',
      },
      {
        value: 0.5,
        tolerance: 0.05,
        message: 'Did you divide L by something? R = ρL/A = (1.0e-6 × 2) / (1.0e-6) = 2.0 Ω.',
      },
    ],
    correctMessage: 'Correct! R = (1.0 × 10⁻⁶ × 2.0) ÷ (1.0 × 10⁻⁶) = 2.0 Ω.',
    workedSolution:
      'Using R = ρL/A: with L = 2.0 m, A = 1.0 × 10⁻⁶ m², and ρ = 1.0 × 10⁻⁶ Ω·m: R = (1.0 × 10⁻⁶ Ω·m × 2.0 m) ÷ (1.0 × 10⁻⁶ m²) = 2.0 Ω.',
  },
  {
    id: 'res-q4',
    kind: 'choice',
    level: 'Think',
    title: 'Question 4 · Exam Challenge: Doubling Wire Diameter',
    prompt:
      'A wire has resistance R. If you replace it with another wire of the same material and same length, but with DOUBLE the diameter (2d), what is the new resistance?',
    hint: 'Area of circle is A = π(d/2)². What happens to the area A when diameter d is multiplied by 2?',
    setup: null,
    options: [
      'The resistance becomes R/4 (one-quarter of the original).',
      'The resistance becomes R/2 (half of the original).',
      'The resistance stays the same because length has not changed.',
      'The resistance becomes 4R (four times larger).',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Correct! Doubling diameter multiplies cross-sectional area by 4 (A = πd²/4). Since R ∝ 1/A, the resistance becomes one-fourth: R/4!',
      'Incorrect! That is the common trap. Doubling diameter quadruples area (2² = 4), so resistance is divided by 4, not 2.',
      'Incorrect. Changing the diameter changes the thickness/area, which strongly changes resistance.',
      'Incorrect. A thicker wire has less resistance, not more.',
    ],
    workedSolution:
      'Cross-sectional area is related to diameter by A = πd²/4. When diameter doubles from d to 2d, area becomes A_new = π(2d)²/4 = 4A. Since R ∝ 1/A, the new resistance is R_new = R / 4.',
  },
  {
    id: 'res-q5',
    kind: 'choice',
    level: 'Medium',
    title: 'Question 5 · Resistance vs Resistivity when Cutting a Wire',
    prompt:
      'A uniform wire of resistance 10 Ω is cut into two equal halves. What is the resistance and resistivity of each half?',
    hint: 'Length of each piece is L/2. Does cutting a piece of copper turn it into a different material?',
    setup: null,
    options: [
      'Resistance is 5 Ω (halved), but resistivity (ρ) is completely unchanged.',
      'Both resistance and resistivity become half (5 Ω and ρ/2).',
      'Resistance stays 10 Ω, but resistivity doubles.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Correct! Because length is halved (L/2), resistance halves to 5 Ω. But resistivity ρ is an intrinsic property of the substance and does not depend on the length of the sample.',
      'Incorrect! Resistivity does NOT change when you cut a wire. The material is still the same material.',
      'Incorrect! Halving the length halves the resistance.',
    ],
    workedSolution:
      'Since R ∝ L, each half with length L/2 has resistance R/2 = 5 Ω. However, electrical resistivity (ρ) depends only on the nature of the material and its temperature, so ρ remains unchanged.',
  },
  {
    id: 'res-q6',
    kind: 'choice',
    level: 'Think',
    title: 'Question 6 · Why Nichrome for Toasters, Copper for Cables?',
    prompt:
      'Why is nichrome alloy used for electric heating elements (irons, toasters) while copper is used for electrical transmission wires?',
    hint: 'Think about who wants high resistance to generate heat and who wants low resistance to avoid losing energy!',
    setup: null,
    options: [
      'Nichrome has high resistivity and does not oxidize (burn) at red-hot temperatures, whereas copper has very low resistivity to minimize energy loss.',
      'Copper cannot conduct high voltages, while nichrome conducts without electrons.',
      'Nichrome has lower resistivity than copper, so it draws more energy.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Correct! Copper has low resistivity so connecting cords stay cool. Nichrome has ~60× higher resistivity to produce heat and resists oxidation at high temperatures.',
      'Incorrect. Copper conducts very well at all voltages.',
      'Incorrect. Nichrome has much higher resistivity than copper (~100 × 10⁻⁸ vs 1.62 × 10⁻⁸ Ω·m).',
    ],
    workedSolution:
      'Nichrome is an alloy with high resistivity (about 60 times that of copper) and high melting point, and it does not oxidize easily even when red hot. Copper has very low resistivity (1.62 × 10⁻⁸ Ω·m), ensuring negligible voltage drop and power loss in transmission and appliance leads.',
  },
]

/* ------------------------------ Practice Helpers ------------------------------ */

export interface ResPracticeAnswer {
  draft: string
  choice: number | null
  checked: boolean
  hintShown: boolean
}

export const EMPTY_RES_ANSWER: ResPracticeAnswer = {
  draft: '',
  choice: null,
  checked: false,
  hintShown: false,
}

export function evaluateResPracticeAnswer(
  q: ResistivityPracticeQuestion,
  ans: ResPracticeAnswer
): { status: 'empty' | 'correct' | 'incorrect'; message: string } {
  if (q.kind === 'choice') {
    if (ans.choice === null || ans.choice < 0 || ans.choice >= q.options.length) {
      return { status: 'empty', message: 'Choose an option before checking.' }
    }
    const isCorrect = ans.choice === q.correctOptionIndex
    return {
      status: isCorrect ? 'correct' : 'incorrect',
      message: q.optionFeedback[ans.choice],
    }
  }

  const val = parseDraftNumber(ans.draft)
  if (val === null) {
    return { status: 'empty', message: 'Enter a numeric answer before checking.' }
  }
  if (Math.abs(val - q.expected) <= q.tolerance) {
    return { status: 'correct', message: q.correctMessage }
  }
  const trap = q.traps.find((t) => Math.abs(val - t.value) <= t.tolerance)
  if (trap) {
    return { status: 'incorrect', message: trap.message }
  }
  return {
    status: 'incorrect',
    message: 'Not quite. Check the formula R = ρL/A, check your units, and use the hint if stuck.',
  }
}

export interface ResistivityExperimentState {
  wire: WireInput
  drafts: WireDrafts
  selectedQuestionId: ResistivityQuestionId
}

export function selectResQuestion(
  state: ResistivityExperimentState,
  questionId: ResistivityQuestionId
): ResistivityExperimentState {
  return { ...state, selectedQuestionId: questionId }
}

export function loadWireSetupOnExperiment(
  state: ResistivityExperimentState,
  setup: WireInput
): ResistivityExperimentState {
  return {
    ...state,
    wire: { ...setup },
    drafts: createWireDrafts(setup),
  }
}
