import {
  calculateCircuit,
  fitSlopeOhm,
  type CircuitInput,
  type CircuitResult,
  type MeasurementPoint,
} from './ohmModel'
import {
  createOhmDrafts,
  INITIAL_CIRCUIT_INPUT,
  formatOhmNumber,
  parseOhmDraft,
  type OhmDrafts,
} from './ohmInputValidation'

export type ElectricityPresentationMode = 'reading' | 'immersive'

/* ------------------------------ Source metadata ------------------------------ */

export const ELECTRICITY_SOURCE_METADATA = {
  reviewStatus: 'Provisional — educator and curriculum review pending',
  ncertReference:
    'NCERT Class 10 Science, chapter “Electricity” (Ohm’s law). The edition, chapter number and section numbers have NOT been verified for this prototype and must be confirmed by a reviewer.',
  cbseSession: 'CBSE session not yet selected — to be confirmed during curriculum review.',
  questionOrigin:
    'All questions and explanations are original. No exact textbook questions are reproduced.',
} as const

/* ------------------------------ Predictions ------------------------------ */

export type PredictionId = 'double-voltage' | 'double-resistance'

export interface PredictionSpec {
  id: PredictionId
  heading: string
  prompt: string
  options: readonly string[]
  correctOptionIndex: number
  /** Starting circuit the student tests from. */
  startSetup: CircuitInput
  /** Which quantity the student must double. */
  changes: 'supplyVoltageV' | 'resistanceOhm'
  /** Expected current ratio I_now / I_start when only that quantity doubles. */
  expectedCurrentRatio: number
}

export const PREDICTIONS: readonly [PredictionSpec, PredictionSpec] = [
  {
    id: 'double-voltage',
    heading: 'Prediction 1 · Double the voltage',
    prompt:
      'The resistance stays at 6 Ω. If you double the supply voltage from 3 V to 6 V, what happens to the current?',
    options: [
      'The current becomes half as large.',
      'The current becomes twice as large.',
      'The current stays the same.',
    ],
    correctOptionIndex: 1,
    startSetup: { supplyVoltageV: 3, resistanceOhm: 6, switchClosed: true },
    changes: 'supplyVoltageV',
    expectedCurrentRatio: 2,
  },
  {
    id: 'double-resistance',
    heading: 'Prediction 2 · Double the resistance',
    prompt:
      'The supply stays at 6 V. If you double the resistance from 6 Ω to 12 Ω, what happens to the current?',
    options: [
      'The current becomes twice as large.',
      'The current becomes half as large.',
      'The current stays the same.',
    ],
    correctOptionIndex: 1,
    startSetup: { supplyVoltageV: 6, resistanceOhm: 6, switchClosed: true },
    changes: 'resistanceOhm',
    expectedCurrentRatio: 0.5,
  },
]

export interface PredictionBaseline {
  predictionId: PredictionId
  setup: CircuitInput
  currentA: number
}

export interface PredictionTestOutcome {
  status: 'not_started' | 'waiting' | 'tested'
  message: string
  ratio: number | null
  matchesChoice: boolean | null
}

/**
 * Feedback is based on what the circuit actually is now compared with the
 * starting setup the student loaded, never on a canned answer.
 */
export function evaluatePredictionTest(
  spec: PredictionSpec,
  baseline: PredictionBaseline | null,
  current: CircuitInput,
  choiceIndex: number | null
): PredictionTestOutcome {
  if (!baseline || baseline.predictionId !== spec.id) {
    return {
      status: 'not_started',
      message: 'Press “Set up the starting circuit” to begin the test.',
      ratio: null,
      matchesChoice: null,
    }
  }
  const nowResult = calculateCircuit(current)
  const other = spec.changes === 'supplyVoltageV' ? 'resistanceOhm' : 'supplyVoltageV'
  const changedQty = spec.changes
  const startValue = baseline.setup[changedQty]
  const nowValue = current[changedQty]
  const otherUnchanged = Math.abs(current[other] - baseline.setup[other]) < 1e-9
  const doubled = Math.abs(nowValue - 2 * startValue) < 1e-9
  const unit = spec.changes === 'supplyVoltageV' ? 'V' : 'Ω'
  const qtyName = spec.changes === 'supplyVoltageV' ? 'supply voltage' : 'resistance'

  if (!current.switchClosed) {
    return {
      status: 'waiting',
      message: 'The switch is open, so there is no current. Close the switch to test.',
      ratio: null,
      matchesChoice: null,
    }
  }
  if (!otherUnchanged || !doubled) {
    return {
      status: 'waiting',
      message: `Now double the ${qtyName}: set it to ${formatOhmNumber(2 * startValue)} ${unit} and keep the other quantity unchanged. Right now it is ${formatOhmNumber(nowValue)} ${unit}.`,
      ratio: null,
      matchesChoice: null,
    }
  }
  const ratio = nowResult.currentA / baseline.currentA
  const matchesChoice = choiceIndex === null ? null : choiceIndex === spec.correctOptionIndex
  const verb = ratio > 1 ? 'doubled' : 'halved'
  const choiceNote =
    matchesChoice === null
      ? 'Choose a prediction above to compare it with this result.'
      : matchesChoice
        ? 'This matches your prediction.'
        : 'This is different from your prediction — look again at the readings.'
  return {
    status: 'tested',
    message: `You doubled the ${qtyName} from ${formatOhmNumber(startValue)} ${unit} to ${formatOhmNumber(nowValue)} ${unit}. The current went from ${formatOhmNumber(baseline.currentA)} A to ${formatOhmNumber(nowResult.currentA)} A, so it ${verb}. ${choiceNote}`,
    ratio,
    matchesChoice,
  }
}

/* ------------------------------ Worked examples ------------------------------ */

export interface ElectricityWorkedExample {
  id: 'example-current' | 'example-resistance-doubled'
  badge: string
  title: string
  scenario: string
  input: CircuitInput
  result: CircuitResult
  /** Second fixed circuit for the “double R” comparison, else null. */
  secondInput: CircuitInput | null
  secondResult: CircuitResult | null
  steps: readonly { heading: string; line: string; note: string }[]
}

function buildWorkedExamples(): readonly [ElectricityWorkedExample, ElectricityWorkedExample] {
  const aIn: CircuitInput = { supplyVoltageV: 9, resistanceOhm: 18, switchClosed: true }
  const aRes = calculateCircuit(aIn)

  const bIn1: CircuitInput = { supplyVoltageV: 6, resistanceOhm: 10, switchClosed: true }
  const bIn2: CircuitInput = { supplyVoltageV: 6, resistanceOhm: 20, switchClosed: true }
  const bRes1 = calculateCircuit(bIn1)
  const bRes2 = calculateCircuit(bIn2)

  const a: ElectricityWorkedExample = {
    id: 'example-current',
    badge: 'Worked Example A · Find the current',
    title: 'A 9 V supply across an 18 Ω resistor',
    scenario:
      'The switch is closed. The supply is 9 V and the resistor is 18 Ω. What does the ammeter read?',
    input: aIn,
    result: aRes,
    secondInput: null,
    secondResult: null,
    steps: [
      {
        heading: 'Write what is known',
        line: `V = ${formatOhmNumber(aIn.supplyVoltageV)} V,   R = ${formatOhmNumber(aIn.resistanceOhm)} Ω`,
        note: 'The ammeter is in series, so it shows the current through the resistor.',
      },
      {
        heading: 'Use V = I R, so I = V / R',
        line: `I = ${formatOhmNumber(aIn.supplyVoltageV)} V ÷ ${formatOhmNumber(aIn.resistanceOhm)} Ω = ${formatOhmNumber(aRes.currentA)} A`,
        note: 'Volts divided by ohms gives amperes.',
      },
      {
        heading: 'Check the voltmeter',
        line: `V across R = I × R = ${formatOhmNumber(aRes.currentA)} A × ${formatOhmNumber(aIn.resistanceOhm)} Ω = ${formatOhmNumber(aRes.resistorVoltageV)} V`,
        note: 'With ideal wires, the voltmeter across the resistor reads the full supply voltage.',
      },
    ],
  }

  const b: ElectricityWorkedExample = {
    id: 'example-resistance-doubled',
    badge: 'Worked Example B · Double the resistance',
    title: 'The same 6 V supply with 10 Ω, then 20 Ω',
    scenario:
      'Keep the supply at 6 V. First use a 10 Ω resistor, then replace it with a 20 Ω resistor. How does the current change?',
    input: bIn1,
    result: bRes1,
    secondInput: bIn2,
    secondResult: bRes2,
    steps: [
      {
        heading: 'Current with 10 Ω',
        line: `I₁ = ${formatOhmNumber(bIn1.supplyVoltageV)} V ÷ ${formatOhmNumber(bIn1.resistanceOhm)} Ω = ${formatOhmNumber(bRes1.currentA)} A`,
        note: 'This is the starting circuit.',
      },
      {
        heading: 'Current with 20 Ω',
        line: `I₂ = ${formatOhmNumber(bIn2.supplyVoltageV)} V ÷ ${formatOhmNumber(bIn2.resistanceOhm)} Ω = ${formatOhmNumber(bRes2.currentA)} A`,
        note: 'The supply voltage has not changed; only R has.',
      },
      {
        heading: 'Compare',
        line: `I₂ ÷ I₁ = ${formatOhmNumber(bRes2.currentA)} ÷ ${formatOhmNumber(bRes1.currentA)} = ${formatOhmNumber(bRes2.currentA / bRes1.currentA)}`,
        note: 'Doubling the resistance at a fixed voltage halves the current.',
      },
    ],
  }
  return [a, b]
}

export const ELECTRICITY_WORKED_EXAMPLES = buildWorkedExamples()

/* ------------------------------ Learn first: simple ideas ------------------------------ */

export interface ConceptCard {
  id: 'current' | 'voltage' | 'resistance'
  plainName: string
  ncertTerm: string
  unit: string
  meaning: string
  picture: string
  meter: string
  checkQuestion: string
  checkAnswer: string
}

export const CONCEPT_CARDS: readonly ConceptCard[] = [
  {
    id: 'current',
    plainName: 'How much charge flows',
    ncertTerm: 'Electric current (I)',
    unit: 'ampere (A)',
    meaning: 'Current is the flow of electric charge. It tells us how much charge passes a point each second.',
    picture: 'Think of water in a pipe. Current is how much water passes each second.',
    meter: 'Measured with an ammeter. Connect it in series, in the path of the flow.',
    checkQuestion: 'Which meter measures current, and how is it connected?',
    checkAnswer: 'The ammeter, in series with the resistor.',
  },
  {
    id: 'voltage',
    plainName: 'The push on the charge',
    ncertTerm: 'Potential difference (V)',
    unit: 'volt (V)',
    meaning: 'Voltage is the push that makes charge move. A battery or supply gives this push.',
    picture: 'Think of a water tank on a roof. A taller tank gives a bigger push to the water.',
    meter: 'Measured with a voltmeter. Connect it across the part you want to measure.',
    checkQuestion: 'Where do you connect a voltmeter to measure the voltage across a resistor?',
    checkAnswer: 'Across the resistor, on both of its ends. This is called parallel.',
  },
  {
    id: 'resistance',
    plainName: 'How hard it is to flow',
    ncertTerm: 'Resistance (R)',
    unit: 'ohm (Ω)',
    meaning: 'Resistance is how much a material holds back the flow of charge.',
    picture: 'Think of a thin, rough pipe. It is harder for water to flow through it.',
    meter: 'We find it from V and I. A bigger resistance means a smaller current for the same push.',
    checkQuestion: 'The push stays the same, but the pipe gets harder to flow through. What happens to the flow?',
    checkAnswer: 'The flow becomes smaller. In a circuit: R goes up, so I goes down.',
  },
]

/* ------------------------------ Notice: guided reading of the graph ------------------------------ */

export interface NoticePrompt {
  id: string
  question: string
  conclusion: string
  pointsNeeded: number
}

export const NOTICE_PROMPTS: readonly NoticePrompt[] = [
  {
    id: 'notice-ratio',
    question: 'Compare two rows of your table. When V becomes 2 times, what happens to I?',
    conclusion:
      'I also becomes 2 times. V and I go up together in the same ratio. We say current is directly proportional to voltage (this is Ohm’s law).',
    pointsNeeded: 2,
  },
  {
    id: 'notice-vi',
    question: 'Look at the last column, V ÷ I. What do you see?',
    conclusion: 'It is the same number in every row. That number is the resistance R of this resistor.',
    pointsNeeded: 2,
  },
  {
    id: 'notice-line',
    question: 'What shape do the points make? What does the slope tell you?',
    conclusion:
      'The points lie on a straight line. The slope (ΔV ÷ ΔI) is R. A straight V–I line means R stays constant, which is true only when the temperature stays the same.',
    pointsNeeded: 3,
  },
]

/** A prompt unlocks only when the student has collected enough real points. */
export function noticeUnlocked(pointCount: number): boolean[] {
  return NOTICE_PROMPTS.map((n) => pointCount >= n.pointsNeeded)
}

/* ------------------------------ Common mistakes ------------------------------ */

export const COMMON_MISTAKES: readonly { mistake: string; better: string }[] = [
  {
    mistake: 'I divide R by V to get the current.',
    better: 'Voltage goes on top: I = V ÷ R. Check the unit: V ÷ Ω gives A.',
  },
  {
    mistake: 'Current is used up as it goes round the circuit.',
    better: 'In this one-loop circuit, the current is the same everywhere. The ammeter shows the same value at any point in the loop.',
  },
  {
    mistake: 'My answer is 250. The ammeter shows 250 A.',
    better: 'Check the unit. 250 mA is 0.25 A. Divide milliamperes by 1000 to get amperes.',
  },
  {
    mistake: 'The voltmeter across the resistor still reads the supply voltage when the switch is open.',
    better: 'With the switch open, no current flows. So V = I × R = 0 across the resistor.',
  },
  {
    mistake: 'V = I R is true for every conductor.',
    better: 'It works with a constant R, which needs a constant temperature. A bulb filament gets hot, so its R changes.',
  },
]

/* ------------------------------ Practice ladder ------------------------------ */

export type ElectricityQuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6'

interface QuestionBase {
  id: ElectricityQuestionId
  level: 'Easy' | 'Medium' | 'Think'
  title: string
  prompt: string
  hint: string
  workedSolution: string
  /** Circuit applied only by the explicit “Load on Experiment” action; null = nothing to load. */
  setup: CircuitInput | null
  /** Optional graph shown with the question. */
  graph?: { resistanceOhm: number; points: readonly MeasurementPoint[] }
}

export interface ChoiceQuestion extends QuestionBase {
  kind: 'choice'
  options: readonly string[]
  correctOptionIndex: number
  optionFeedback: readonly string[]
}

export interface NumberTrap {
  value: number
  tolerance: number
  message: string
}

export interface NumberQuestion extends QuestionBase {
  kind: 'number'
  inputLabel: string
  expected: number
  tolerance: number
  traps: readonly NumberTrap[]
  correctMessage: string
}

export type PracticeQuestion = ChoiceQuestion | NumberQuestion

const Q3_SETUP: CircuitInput = { supplyVoltageV: 12, resistanceOhm: 48, switchClosed: true }
const Q3_RESULT = calculateCircuit(Q3_SETUP)
const Q4_SETUP: CircuitInput = { supplyVoltageV: 10, resistanceOhm: 20, switchClosed: true }
const Q4_RESULT = calculateCircuit(Q4_SETUP)
const Q5_VOLTAGES = [3, 6, 9]
const Q5_POINTS: MeasurementPoint[] = Q5_VOLTAGES.map((v) => {
  const r = calculateCircuit({ supplyVoltageV: v, resistanceOhm: 6, switchClosed: true })
  return { currentA: r.currentA, voltageV: r.resistorVoltageV }
})
const Q5_SLOPE = fitSlopeOhm(Q5_POINTS) as number
const Q2_SETUP: CircuitInput = { supplyVoltageV: 12, resistanceOhm: 10, switchClosed: false }

export const ELECTRICITY_PRACTICE_QUESTIONS: readonly PracticeQuestion[] = [
  {
    id: 'q1',
    kind: 'choice',
    level: 'Easy',
    title: 'Question 1 · Which meter?',
    prompt: 'You want to measure the current through the resistor. How do you connect the meter?',
    hint: 'Current is the flow. To measure the flow, the charge must pass through the meter.',
    setup: INITIAL_CIRCUIT_INPUT,
    options: [
      'Use an ammeter in series with the resistor.',
      'Use an ammeter across the resistor.',
      'Use a voltmeter in series with the resistor.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Yes. The ammeter goes in series, so the same charge flows through it.',
      'Not quite. An ammeter across the resistor is the wrong connection. It must be in the path of the flow, in series.',
      'Not quite. A voltmeter measures the push (voltage) and goes across a part, not in series.',
    ],
    workedSolution:
      'Current is the flow of charge, so the meter must sit in the path of the flow. That means an ammeter in series. A voltmeter is different: it goes across the part, in parallel.',
  },
  {
    id: 'q2',
    kind: 'choice',
    level: 'Easy',
    title: 'Question 2 · The open switch',
    prompt:
      'The supply is set to 12 V and the resistor is 10 Ω, but the switch is open. What do the ammeter and the voltmeter across the resistor show?',
    hint: 'An open switch breaks the path. What happens to the flow? Then use V = I × R across the resistor.',
    setup: Q2_SETUP,
    options: [
      'Ammeter 1.2 A; voltmeter 12 V.',
      'Ammeter 0 A; voltmeter 0 V.',
      'Ammeter 0 A; voltmeter 12 V.',
    ],
    correctOptionIndex: 1,
    optionFeedback: [
      'I = V ÷ R works only when the circuit is closed. With the switch open there is no complete path, so no current flows.',
      'Yes. No current flows, so the ammeter reads 0 A. The voltmeter is across the resistor, and V = I × R = 0 there.',
      'The ammeter is right. Check the voltmeter: it is across the resistor, not across the supply. With no current, V = I × R = 0.',
    ],
    workedSolution:
      'An open switch breaks the circuit, so the current is 0 A. The voltmeter is across the resistor. With I = 0 A, V = I × R = 0 × 10 Ω = 0 V. The supply is still 12 V, but that voltage is across the open gap of the switch, not across the resistor.',
  },
  {
    id: 'q3',
    kind: 'number',
    level: 'Medium',
    title: 'Question 3 · Find the current',
    prompt: 'The switch is closed. The supply is 12 V and the resistor is 48 Ω. What does the ammeter show?',
    hint: 'Write I = V ÷ R. Put the voltage on top. Then check the unit.',
    setup: Q3_SETUP,
    inputLabel: 'Ammeter reading (in amperes, A)',
    expected: Q3_RESULT.currentA,
    tolerance: 0.005,
    traps: [
      { value: 250, tolerance: 1, message: 'That number is in milliamperes. The question asks for amperes. Divide by 1000.' },
      { value: 48 / 12, tolerance: 0.05, message: 'It looks like you did R ÷ V. Current is voltage divided by resistance: I = V ÷ R.' },
      { value: 12 * 48, tolerance: 0.5, message: 'It looks like you multiplied V and R. Use I = V ÷ R.' },
    ],
    correctMessage: `Correct! I = V ÷ R = ${formatOhmNumber(Q3_RESULT.currentA)} A.`,
    workedSolution: `Use I = V ÷ R. I = ${formatOhmNumber(Q3_SETUP.supplyVoltageV)} V ÷ ${formatOhmNumber(Q3_SETUP.resistanceOhm)} Ω = ${formatOhmNumber(Q3_RESULT.currentA)} A. This is ${formatOhmNumber(Q3_RESULT.currentA * 1000)} mA.`,
  },
  {
    id: 'q4',
    kind: 'number',
    level: 'Medium',
    title: 'Question 4 · Find the resistance',
    prompt: 'The voltmeter across the resistor reads 10 V. The ammeter reads 0.5 A. What is the resistance?',
    hint: 'V = I × R. So R = V ÷ I. Put the number from the voltmeter on top.',
    setup: Q4_SETUP,
    inputLabel: 'Resistance (in ohms, Ω)',
    expected: Q4_RESULT.resistanceOhm,
    tolerance: 0.05,
    traps: [
      { value: 10 * 0.5, tolerance: 0.05, message: 'It looks like you multiplied V and I. Resistance is voltage divided by current: R = V ÷ I.' },
      { value: 0.5 / 10, tolerance: 0.001, message: 'It looks like you did I ÷ V. Turn it over: R = V ÷ I.' },
    ],
    correctMessage: `Correct! R = V ÷ I = ${formatOhmNumber(Q4_RESULT.resistanceOhm)} Ω.`,
    workedSolution: `From V = I × R we get R = V ÷ I. R = ${formatOhmNumber(Q4_RESULT.resistorVoltageV)} V ÷ ${formatOhmNumber(Q4_RESULT.currentA)} A = ${formatOhmNumber(Q4_RESULT.resistanceOhm)} Ω.`,
  },
  {
    id: 'q5',
    kind: 'number',
    level: 'Medium',
    title: 'Question 5 · Read the graph',
    prompt:
      'A student measured three points for one resistor and plotted V against I. Use the graph or the points to find the resistance. Hint: find the slope.',
    hint: 'Pick two points. Slope = (change in V) ÷ (change in I). Or just divide V by I for any one point.',
    setup: { supplyVoltageV: 6, resistanceOhm: 6, switchClosed: true },
    graph: { resistanceOhm: 6, points: Q5_POINTS },
    inputLabel: 'Resistance (in ohms, Ω)',
    expected: Q5_SLOPE,
    tolerance: 0.05,
    traps: [
      { value: 1 / Q5_SLOPE, tolerance: 0.01, message: 'It looks like you did ΔI ÷ ΔV. The slope of a V–I graph is ΔV ÷ ΔI.' },
    ],
    correctMessage: `Correct! The slope is ΔV ÷ ΔI = ${formatOhmNumber(Q5_SLOPE)} Ω.`,
    workedSolution: `Take the first and last points: (${formatOhmNumber(Q5_POINTS[0].currentA)} A, ${formatOhmNumber(Q5_POINTS[0].voltageV)} V) and (${formatOhmNumber(Q5_POINTS[2].currentA)} A, ${formatOhmNumber(Q5_POINTS[2].voltageV)} V). Slope = ΔV ÷ ΔI = (${formatOhmNumber(Q5_POINTS[2].voltageV - Q5_POINTS[0].voltageV)} V) ÷ (${formatOhmNumber(Q5_POINTS[2].currentA - Q5_POINTS[0].currentA)} A) = ${formatOhmNumber(Q5_SLOPE)} Ω. The slope is the resistance.`,
  },
  {
    id: 'q6',
    kind: 'choice',
    level: 'Think',
    title: 'Question 6 · When V = I R stops working',
    prompt:
      'For a bulb filament, the V–I graph bends. It is not a straight line. What is the best reason?',
    hint: 'V = I R gives a straight line only when R stays the same. What happens to a filament as current flows?',
    setup: null,
    options: [
      'The filament gets hot, so its resistance changes as the current changes.',
      'V = I R is never true.',
      'The ammeter stops working at high current.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Yes. The filament heats up, so R changes. V = I R with a constant R needs a constant temperature.',
      'Not quite. V = I R works well for a resistor at constant temperature. It is the constant R that fails for a hot filament.',
      'Not quite. The bend comes from the filament itself, not from the meter.',
    ],
    workedSolution:
      'A straight V–I line means R is constant. A bulb filament gets very hot as the current flows, and its resistance changes with temperature. So the graph bends. The rule V = I R with a constant R is for a conductor kept at constant temperature.',
  },
]

export interface PracticeAnswer {
  draft: string
  choice: number | null
  checked: boolean
  hintShown: boolean
}

export const EMPTY_ANSWER: PracticeAnswer = { draft: '', choice: null, checked: false, hintShown: false }

export interface PracticeEvaluation {
  status: 'empty' | 'correct' | 'incorrect'
  message: string
}

export function evaluatePracticeAnswer(q: PracticeQuestion, answer: PracticeAnswer): PracticeEvaluation {
  if (q.kind === 'choice') {
    const c = answer.choice
    if (c === null || c < 0 || c >= q.options.length) {
      return { status: 'empty', message: 'Choose one answer before checking.' }
    }
    return {
      status: c === q.correctOptionIndex ? 'correct' : 'incorrect',
      message: q.optionFeedback[c],
    }
  }
  const value = parseOhmDraft(answer.draft)
  if (value === null) return { status: 'empty', message: 'Enter a number before checking.' }
  if (Math.abs(value - q.expected) <= q.tolerance) {
    return { status: 'correct', message: q.correctMessage }
  }
  const trap = q.traps.find((t) => Math.abs(value - t.value) <= t.tolerance)
  if (trap) return { status: 'incorrect', message: trap.message }
  return {
    status: 'incorrect',
    message: 'Not quite. Try the hint, write the formula, put in the numbers, and check the unit.',
  }
}

/** A worked solution unlocks only after the student has pressed “Check answer” once. */
export function isSolutionUnlocked(answer: PracticeAnswer): boolean {
  return answer.checked
}

export function countCorrect(answers: Partial<Record<ElectricityQuestionId, PracticeAnswer>>): number {
  return ELECTRICITY_PRACTICE_QUESTIONS.filter((q) => {
    const a = answers[q.id]
    return a?.checked === true && evaluatePracticeAnswer(q, a).status === 'correct'
  }).length
}

/* ------------------------------ Experiment + practice state ------------------------------ */

export interface ExperimentState {
  circuit: CircuitInput
  drafts: OhmDrafts
  selectedQuestionId: ElectricityQuestionId
}

/** Selecting a question changes only `selectedQuestionId`. */
export function selectPracticeQuestion(
  state: ExperimentState,
  questionId: ElectricityQuestionId
): ExperimentState {
  return { ...state, selectedQuestionId: questionId }
}

/** Only this explicit action applies a setup (“Load on Experiment”). */
export function loadSetupOnExperiment(
  state: ExperimentState,
  setup: CircuitInput
): ExperimentState {
  return { ...state, circuit: { ...setup }, drafts: createOhmDrafts(setup) }
}

/* ------------------------------ Measurement datasets ------------------------------ */

export interface MeasurementDataset {
  /** Every point in this dataset was taken at exactly this resistance. */
  resistanceOhm: number
  points: readonly MeasurementPoint[]
}

export type AddPointStatus =
  | 'added'
  | 'duplicate'
  | 'switch_open'
  | 'resistance_mismatch'

export function createDataset(resistanceOhm: number): MeasurementDataset {
  return { resistanceOhm, points: [] }
}

/**
 * Adds the current meter readings only when the switch is closed and the
 * resistance matches the dataset. Different resistances are never mixed.
 */
export function addMeasurementPoint(
  dataset: MeasurementDataset,
  result: CircuitResult
): { dataset: MeasurementDataset; status: AddPointStatus } {
  if (!result.switchClosed) return { dataset, status: 'switch_open' }
  if (Math.abs(result.resistanceOhm - dataset.resistanceOhm) > 1e-9) {
    return { dataset, status: 'resistance_mismatch' }
  }
  const isDuplicate = dataset.points.some(
    (p) => Math.abs(p.voltageV - result.resistorVoltageV) < 1e-9
  )
  if (isDuplicate) return { dataset, status: 'duplicate' }
  const next = [...dataset.points, { currentA: result.currentA, voltageV: result.resistorVoltageV }]
  next.sort((p, q) => p.currentA - q.currentA)
  return { dataset: { ...dataset, points: next }, status: 'added' }
}
