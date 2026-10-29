import {
  calculateSeriesParallel,
  type Arrangement,
  type BranchReading,
  type SPInput,
  type SPResult,
} from './spModel'
import {
  createSPDrafts,
  formatOhmNumber,
  parseOhmDraft,
  type SPDrafts,
} from './spInputValidation'

export type SPPresentationMode = 'reading' | 'immersive'
export type SPQuestionId = 'sp-q1' | 'sp-q2' | 'sp-q3' | 'sp-q4' | 'sp-q5' | 'sp-q6'

/* ------------------------------ Source Metadata ------------------------------ */

export const SP_SOURCE_METADATA = {
  reviewStatus: 'Provisional — educator and curriculum review pending',
  ncertReference:
    'NCERT Class 10 Science, chapter “Electricity”, sections on Resistors in Series and Resistors in Parallel. Specific session and edition to be confirmed by curriculum reviewer.',
  secondaryReference:
    'OpenStax University Physics Vol. 2, Section 10.3 (Resistors in Series and Parallel).',
  questionOrigin:
    'All questions, explanations and comparison activities are original pedagogical designs. No unreviewed textbook exercises are copied.',
} as const

/* ------------------------------ Stage 1: Prediction ------------------------------ */

export interface SPPredictionSpec {
  id: 'add-resistor-current'
  heading: string
  prompt: string
  options: readonly string[]
  correctOptionIndex: number
  startSetup: SPInput
}

export const SP_PREDICTION: SPPredictionSpec = {
  id: 'add-resistor-current',
  heading: 'Core Question · Does adding another resistor always reduce the current?',
  prompt:
    'You have a 6 V battery connected to a single 6 Ω resistor. The current is 1 A. If you connect a second 6 Ω resistor to the circuit, must the total current supplied by the battery decrease?',
  options: [
    'Yes, adding any resistor always increases total resistance, so supply current must decrease.',
    'No. If connected in series the current decreases (to 0.5 A), but if connected in parallel, the current actually increases (to 2 A)!',
    'No, adding a resistor never changes the supply current because the battery voltage is fixed.',
  ],
  correctOptionIndex: 1,
  startSetup: {
    arrangement: 'single',
    supplyVoltageV: 6,
    resistance1Ohm: 6,
    resistance2Ohm: 6,
    switchClosed: true,
  },
}

/* ------------------------------ Stage 4: Comparison Table Data ------------------------------ */

export interface ComparisonRow {
  arrangement: Arrangement
  label: string
  description: string
  reqOhm: number
  supplyCurrentA: number
  r1Reading: BranchReading
  r2Reading: BranchReading | null
  voltageRule: string
  currentRule: string
}

export function buildComparisonData(
  v = 6,
  r1 = 6,
  r2 = 6,
  closed = true
): readonly ComparisonRow[] {
  const single = calculateSeriesParallel({
    arrangement: 'single',
    supplyVoltageV: v,
    resistance1Ohm: r1,
    resistance2Ohm: r2,
    switchClosed: closed,
  })
  const series = calculateSeriesParallel({
    arrangement: 'series',
    supplyVoltageV: v,
    resistance1Ohm: r1,
    resistance2Ohm: r2,
    switchClosed: closed,
  })
  const parallel = calculateSeriesParallel({
    arrangement: 'parallel',
    supplyVoltageV: v,
    resistance1Ohm: r1,
    resistance2Ohm: r2,
    switchClosed: closed,
  })

  return [
    {
      arrangement: 'single',
      label: 'One Resistor (R₁ only)',
      description: 'Single path for charge.',
      reqOhm: single.equivalentResistanceOhm,
      supplyCurrentA: single.supplyCurrentA,
      r1Reading: single.resistor1,
      r2Reading: null,
      voltageRule: 'V₁ = V_supply',
      currentRule: 'I = I₁',
    },
    {
      arrangement: 'series',
      label: 'Two Resistors in Series',
      description: 'One single path: charge must pass through R₁ THEN R₂.',
      reqOhm: series.equivalentResistanceOhm,
      supplyCurrentA: series.supplyCurrentA,
      r1Reading: series.resistor1,
      r2Reading: series.resistor2,
      voltageRule: 'V₁ + V₂ = V_supply',
      currentRule: 'I_supply = I₁ = I₂ (same current everywhere)',
    },
    {
      arrangement: 'parallel',
      label: 'Two Resistors in Parallel',
      description: 'Two separate paths: charge splits at the junction.',
      reqOhm: parallel.equivalentResistanceOhm,
      supplyCurrentA: parallel.supplyCurrentA,
      r1Reading: parallel.resistor1,
      r2Reading: parallel.resistor2,
      voltageRule: 'V₁ = V₂ = V_supply (same voltage across both)',
      currentRule: 'I_supply = I₁ + I₂ (currents add up)',
    },
  ]
}

/* ------------------------------ Misconceptions & Explanations ------------------------------ */

export const SP_MISCONCEPTIONS = [
  {
    myth: '“Adding a resistor always adds more resistance and makes the current smaller.”',
    reality:
      'Only in series! In parallel, adding another resistor opens a second independent path for charges to flow. Opening another door allows more people through per second: total resistance drops and supply current increases.',
  },
  {
    myth: '“In a parallel circuit, current always splits equally into two halves (50% / 50%).”',
    reality:
      'Current splits equally ONLY when the two branch resistors are identical. When branches have unequal resistance, both still get the exact same voltage, but the smaller resistor takes the larger share of current (I = V / R).',
  },
  {
    myth: '“In series, the second resistor gets less current because the first one used some up.”',
    reality:
      'Charge is conserved and cannot vanish. In a single loop with no junctions, every electron passing through R₁ must also pass through R₂. Current is the rate of flow and is identical everywhere in a series loop.',
  },
  {
    myth: '“Voltage is divided equally in every series circuit.”',
    reality:
      'Voltage divides equally only if R₁ = R₂. In series, the larger resistor takes a larger share of the voltage: V₁ = I·R₁ and V₂ = I·R₂.',
  },
] as const

/* ------------------------------ Worked Examples ------------------------------ */

export interface SPWorkedExample {
  id: string
  badge: string
  title: string
  scenario: string
  setup: SPInput
  result: SPResult
  steps: readonly { heading: string; line: string; note: string }[]
}

function buildWorkedExamples(): readonly [SPWorkedExample, SPWorkedExample] {
  // Example 1: Series with unequal resistors (3 Ω and 6 Ω on 9 V)
  const ex1Input: SPInput = {
    arrangement: 'series',
    supplyVoltageV: 9,
    resistance1Ohm: 3,
    resistance2Ohm: 6,
    switchClosed: true,
  }
  const ex1Res = calculateSeriesParallel(ex1Input)

  const ex1: SPWorkedExample = {
    id: 'ex-series-unequal',
    badge: 'Worked Example A · Series Circuit (Unequal Resistors)',
    title: '3 Ω and 6 Ω in Series connected to 9 V',
    scenario:
      'Two resistors of 3 Ω and 6 Ω are connected in series across a 9 V supply. Find total resistance, supply current, and the voltage across each resistor.',
    setup: ex1Input,
    result: ex1Res,
    steps: [
      {
        heading: 'Step 1: Equivalent resistance (R_eq)',
        line: 'R_eq = R₁ + R₂ = 3 Ω + 6 Ω = 9 Ω',
        note: 'In series, resistances simply add up.',
      },
      {
        heading: 'Step 2: Circuit current (I)',
        line: `I = V_supply ÷ R_eq = 9 V ÷ 9 Ω = ${formatOhmNumber(ex1Res.supplyCurrentA)} A`,
        note: 'This same 1 A flows through both resistors.',
      },
      {
        heading: 'Step 3: Voltage drop across each resistor',
        line: `V₁ = I × R₁ = 1 A × 3 Ω = 3 V;   V₂ = I × R₂ = 1 A × 6 Ω = 6 V`,
        note: 'Notice V₁ + V₂ = 3 V + 6 V = 9 V (matches the supply). The bigger resistor gets the bigger voltage share!',
      },
    ],
  }

  // Example 2: Parallel with unequal resistors (6 Ω and 12 Ω on 6 V)
  const ex2Input: SPInput = {
    arrangement: 'parallel',
    supplyVoltageV: 6,
    resistance1Ohm: 6,
    resistance2Ohm: 12,
    switchClosed: true,
  }
  const ex2Res = calculateSeriesParallel(ex2Input)

  const ex2: SPWorkedExample = {
    id: 'ex-parallel-unequal',
    badge: 'Worked Example B · Parallel Circuit (Unequal Resistors)',
    title: '6 Ω and 12 Ω in Parallel connected to 6 V',
    scenario:
      'Two resistors of 6 Ω and 12 Ω are connected in parallel across a 6 V supply. Find total resistance, the current in each branch, and total supply current.',
    setup: ex2Input,
    result: ex2Res,
    steps: [
      {
        heading: 'Step 1: Equivalent resistance (R_eq)',
        line: '1/R_eq = 1/6 + 1/12 = (2 + 1)/12 = 3/12 = 1/4 Ω⁻¹  ⇒  R_eq = 4 Ω',
        note: 'Or product over sum: (6 × 12) ÷ (6 + 12) = 72 ÷ 18 = 4 Ω. R_eq is smaller than either branch resistor!',
      },
      {
        heading: 'Step 2: Branch currents (both branches see full 6 V)',
        line: `I₁ = V ÷ R₁ = 6 V ÷ 6 Ω = 1 A;   I₂ = V ÷ R₂ = 6 V ÷ 12 Ω = 0.5 A`,
        note: 'The 6 Ω branch allows twice as much flow as the 12 Ω branch.',
      },
      {
        heading: 'Step 3: Total supply current',
        line: `I_total = I₁ + I₂ = 1 A + 0.5 A = ${formatOhmNumber(ex2Res.supplyCurrentA)} A (or V ÷ R_eq = 6 V ÷ 4 Ω = 1.5 A)`,
        note: 'Currents at the junction add up. The supply delivers 1.5 A.',
      },
    ],
  }

  return [ex1, ex2]
}

export const SP_WORKED_EXAMPLES = buildWorkedExamples()

/* ------------------------------ Practice Questions ------------------------------ */

export interface SPQuestionBase {
  id: SPQuestionId
  level: 'Easy' | 'Medium' | 'Think'
  title: string
  prompt: string
  hint: string
  workedSolution: string
  setup: SPInput | null
}

export interface SPChoiceQuestion extends SPQuestionBase {
  kind: 'choice'
  options: readonly string[]
  correctOptionIndex: number
  optionFeedback: readonly string[]
}

export interface SPNumberQuestion extends SPQuestionBase {
  kind: 'number'
  inputLabel: string
  expected: number
  tolerance: number
  traps: readonly { value: number; tolerance: number; message: string }[]
  correctMessage: string
}

export type SPPracticeQuestion = SPChoiceQuestion | SPNumberQuestion

export const SP_PRACTICE_QUESTIONS: readonly SPPracticeQuestion[] = [
  {
    id: 'sp-q1',
    kind: 'choice',
    level: 'Easy',
    title: 'Question 1 · Same current or same voltage?',
    prompt:
      'In a series circuit with two resistors of different values (4 Ω and 8 Ω), which statement is true about the current and voltage?',
    hint: 'In series there is only one loop. Where can charge go? Does it have another path?',
    setup: {
      arrangement: 'series',
      supplyVoltageV: 6,
      resistance1Ohm: 4,
      resistance2Ohm: 8,
      switchClosed: true,
    },
    options: [
      'The current is the same through both resistors, but the 8 Ω resistor has twice the voltage across it.',
      'The voltage is the same across both resistors, but the 4 Ω resistor has more current.',
      'The current splits equally between both resistors.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Correct! In series there is only one pathway, so current is identical through both. Since V = I·R, the 8 Ω resistor drops twice as much voltage.',
      'Incorrect. That describes a parallel circuit! In series, voltage divides and current is the same.',
      'Incorrect. Current cannot split because there are no junctions in a simple series loop.',
    ],
    workedSolution:
      'In a series connection, every charge that passes through R₁ must also pass through R₂; hence current I is identical through both. Using V = I·R, the voltage across each resistor is proportional to its resistance, so the 8 Ω resistor has twice the voltage drop of the 4 Ω resistor.',
  },
  {
    id: 'sp-q2',
    kind: 'number',
    level: 'Easy',
    title: 'Question 2 · Equivalent resistance in series',
    prompt:
      'Two resistors with R₁ = 5 Ω and R₂ = 15 Ω are connected in series. What is the equivalent resistance of the combination in ohms (Ω)?',
    hint: 'For series resistors, simply add the resistances: R_eq = R₁ + R₂.',
    setup: {
      arrangement: 'series',
      supplyVoltageV: 6,
      resistance1Ohm: 5,
      resistance2Ohm: 15,
      switchClosed: true,
    },
    inputLabel: 'Equivalent resistance R_eq (in ohms, Ω)',
    expected: 20,
    tolerance: 0.1,
    traps: [
      {
        value: (5 * 15) / (5 + 15),
        tolerance: 0.1,
        message: 'That is the parallel formula (3.75 Ω). For series, add them: R₁ + R₂.',
      },
      {
        value: 10,
        tolerance: 0.1,
        message: 'Do not take the average! In series, total resistance is the sum R₁ + R₂.',
      },
    ],
    correctMessage: 'Correct! In series, R_eq = R₁ + R₂ = 5 Ω + 15 Ω = 20 Ω.',
    workedSolution:
      'For resistors connected in series: R_eq = R₁ + R₂ = 5 Ω + 15 Ω = 20 Ω. The total resistance is always greater than any individual resistor in the chain.',
  },
  {
    id: 'sp-q3',
    kind: 'number',
    level: 'Medium',
    title: 'Question 3 · Equivalent resistance in parallel',
    prompt:
      'Two resistors with R₁ = 10 Ω and R₂ = 10 Ω are connected in parallel. What is their combined equivalent resistance in ohms (Ω)?',
    hint: 'Use 1/R_eq = 1/R₁ + 1/R₂. When two identical resistors are in parallel, the total resistance is half of one!',
    setup: {
      arrangement: 'parallel',
      supplyVoltageV: 6,
      resistance1Ohm: 10,
      resistance2Ohm: 10,
      switchClosed: true,
    },
    inputLabel: 'Equivalent resistance R_eq (in ohms, Ω)',
    expected: 5,
    tolerance: 0.05,
    traps: [
      {
        value: 20,
        tolerance: 0.1,
        message: 'That is 10 + 10 for series! In parallel, adding a path lowers total resistance.',
      },
      {
        value: 0.2,
        tolerance: 0.01,
        message: 'You found 1/R_eq = 1/10 + 1/10 = 2/10 = 0.2. Remember to take the reciprocal to find R_eq = 10/2 = 5 Ω!',
      },
    ],
    correctMessage: 'Correct! 1/R_eq = 1/10 + 1/10 = 2/10, so R_eq = 10/2 = 5 Ω.',
    workedSolution:
      'Using the parallel formula: 1/R_eq = 1/R₁ + 1/R₂ = 1/10 + 1/10 = 2/10 Ω⁻¹. Taking the reciprocal: R_eq = 10/2 = 5 Ω. Two equal resistors in parallel always give half of one resistor’s value.',
  },
  {
    id: 'sp-q4',
    kind: 'number',
    level: 'Medium',
    title: 'Question 4 · Branch currents in parallel',
    prompt:
      'A 6 V battery is connected to a parallel pair of resistors: R₁ = 6 Ω and R₂ = 12 Ω. What is the current flowing through branch R₁ (the 6 Ω resistor) in amperes (A)?',
    hint: 'In parallel, both branches receive the full 6 V supply. Use I₁ = V_supply ÷ R₁.',
    setup: {
      arrangement: 'parallel',
      supplyVoltageV: 6,
      resistance1Ohm: 6,
      resistance2Ohm: 12,
      switchClosed: true,
    },
    inputLabel: 'Branch current I₁ (in amperes, A)',
    expected: 1.0,
    tolerance: 0.05,
    traps: [
      {
        value: 0.5,
        tolerance: 0.05,
        message: 'That is the current through R₂ (6 V ÷ 12 Ω = 0.5 A). The question asks for branch R₁ (6 Ω).',
      },
      {
        value: 1.5,
        tolerance: 0.05,
        message: 'That is the total supply current (1 A + 0.5 A = 1.5 A). The question asks for branch 1 only.',
      },
      {
        value: 0.75,
        tolerance: 0.05,
        message: 'Current does NOT split 50/50 because the resistors are not equal! The smaller 6 Ω branch draws more current.',
      },
    ],
    correctMessage: 'Correct! The 6 Ω resistor gets the full 6 V, so I₁ = 6 V ÷ 6 Ω = 1.0 A.',
    workedSolution:
      'In a parallel circuit, each branch connects directly across the 6 V terminals. By Ohm’s law for branch 1: I₁ = V ÷ R₁ = 6 V ÷ 6 Ω = 1.0 A. (Branch 2 carries I₂ = 6 V ÷ 12 Ω = 0.5 A; total current from battery is 1.5 A).',
  },
  {
    id: 'sp-q5',
    kind: 'choice',
    level: 'Think',
    title: 'Question 5 · Does current split equally?',
    prompt:
      'A 12 V supply powers two parallel branches: Branch A has R_A = 4 Ω and Branch B has R_B = 12 Ω. How does the current split between them?',
    hint: 'Both branches see 12 V. Calculate I_A = 12/4 and I_B = 12/12. Which branch takes more charge?',
    setup: {
      arrangement: 'parallel',
      supplyVoltageV: 12,
      resistance1Ohm: 4,
      resistance2Ohm: 12,
      switchClosed: true,
    },
    options: [
      'Branch A (4 Ω) carries 3 A while Branch B (12 Ω) carries 1 A. The smaller resistance carries 3 times more current.',
      'Both branches carry 2 A each, because current always divides equally at any parallel junction.',
      'Branch B (12 Ω) carries 3 A because a bigger resistor pulls more electricity from the battery.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Correct! Both branches have 12 V across them. I_A = 12 V ÷ 4 Ω = 3 A; I_B = 12 V ÷ 12 Ω = 1 A. Charge takes the path of least resistance!',
      'Incorrect. Current splits equally ONLY when resistances are identical. Here 4 Ω is 3 times easier to flow through than 12 Ω.',
      'Incorrect. Resistance opposes current. A larger resistance allows LESS current for the same voltage push.',
    ],
    workedSolution:
      'Because the branches are in parallel, each experiences the full 12 V potential difference. I_A = 12 V ÷ 4 Ω = 3 A, and I_B = 12 V ÷ 12 Ω = 1 A. The 4 Ω branch has 1/3 the resistance, so it carries 3× as much current. Total battery current is 3 A + 1 A = 4 A.',
  },
  {
    id: 'sp-q6',
    kind: 'choice',
    level: 'Think',
    title: 'Question 6 · What happens when one branch disconnects?',
    prompt:
      'Two lamps are connected in parallel in a home circuit. If one lamp burns out (open circuit on that branch), what happens to the other lamp?',
    hint: 'Think about how parallel branches connect to the supply terminals. Does the remaining lamp still have a complete circuit across the voltage?',
    setup: null,
    options: [
      'The other lamp stays lit with the exact same brightness, because its branch voltage is still unchanged.',
      'The other lamp goes completely dark because the whole circuit is broken.',
      'The other lamp burns twice as bright because it gets all the voltage.',
    ],
    correctOptionIndex: 0,
    optionFeedback: [
      'Correct! In parallel, each appliance connects directly across the full mains voltage. If one path opens, the other path remains fully connected and independent.',
      'Incorrect. That happens in a series circuit (like old holiday fairy lights)! In parallel, each path is independent.',
      'Incorrect. The voltage across the remaining lamp is still the same fixed mains voltage, so its current and brightness stay normal.',
    ],
    workedSolution:
      'This is why household appliances are wired in parallel: each branch is independent and receives the full supply voltage. If one branch is switched off or burns out, current through the other branch continues completely unaffected.',
  },
]

/* ------------------------------ Practice State Helpers ------------------------------ */

export interface SPPracticeAnswer {
  draft: string
  choice: number | null
  checked: boolean
  hintShown: boolean
}

export const EMPTY_SP_ANSWER: SPPracticeAnswer = {
  draft: '',
  choice: null,
  checked: false,
  hintShown: false,
}

export function evaluateSPPracticeAnswer(
  q: SPPracticeQuestion,
  ans: SPPracticeAnswer
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

  const val = parseOhmDraft(ans.draft)
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
    message: 'Not quite. Check the formula, substitute carefully, and try the hint if stuck.',
  }
}

export interface SPExperimentState {
  circuit: SPInput
  drafts: SPDrafts
  selectedQuestionId: SPQuestionId
}

export function selectSPQuestion(
  state: SPExperimentState,
  questionId: SPQuestionId
): SPExperimentState {
  return { ...state, selectedQuestionId: questionId }
}

export function loadSPSetupOnExperiment(
  state: SPExperimentState,
  setup: SPInput
): SPExperimentState {
  return {
    ...state,
    circuit: { ...setup },
    drafts: createSPDrafts(setup),
  }
}
