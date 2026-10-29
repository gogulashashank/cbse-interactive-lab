import type { HeatingCircuitInput } from './powerHeatingModel'

export type PowerHeatingPresentationMode = 'reading' | 'immersive'
export type PowerHeatingQuestionId = 'ph-q1' | 'ph-q2' | 'ph-q3' | 'ph-q4' | 'ph-q5' | 'ph-q6'

/* ------------------------------ Source Metadata ------------------------------ */

export const POWER_HEATING_SOURCE_METADATA = {
  reviewStatus: 'Provisional — educator and curriculum review pending',
  ncertReference:
    'NCERT Class 10 Science, Chapter “Electricity”, Section 12.7 (Heating Effect of Electric Current: H = I²Rt) and Section 12.8 (Electric Power: P = VI = I²R = V²/R).',
  secondaryReference:
    'OpenStax University Physics Vol. 2, Section 9.5 (Electrical Energy and Power).',
  modelAssumptions:
    'Ideal voltage source, ideal ammeter (0 Ω resistance), ideal voltmeter (infinite resistance), constant resistance during heating (temperature coefficient not modeled), zero heat loss to surroundings (pure Joule heating conversion H = Pt).',
  displayNotice:
    'Energy transferred is represented directly as an accumulating bar in Joules. Temperature and incandescence (red glow) are intentionally not simulated without thermodynamic heat capacity and convective cooling models.',
  questionOrigin:
    'All conceptual questions, numerical problems, and guided discoveries are original pedagogical items created for this interactive lesson.',
} as const

/* ------------------------------ Predictions ------------------------------ */

export interface PowerHeatingPrediction {
  id: 'voltage-quad-prediction' | 'duration-prediction' | 'resistance-power-prediction'
  heading: string
  prompt: string
  options: readonly string[]
  correctOptionIndex: number
}

export const POWER_HEATING_PREDICTIONS: readonly PowerHeatingPrediction[] = [
  {
    id: 'voltage-quad-prediction',
    heading: 'Prediction 1 · Doubling Voltage',
    prompt:
      'A 6 Ω heating element is connected across a 6 V supply, producing 6 W of power and 60 J of heat in 10 seconds. If you double the supply voltage to 12 V, what happens to the power and total heat in 10 seconds?',
    options: [
      'Both power and heat quadruple (24 W and 240 J).',
      'Both power and heat double (12 W and 120 J).',
      'Power stays at 6 W, but heat doubles to 120 J.',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'duration-prediction',
    heading: 'Prediction 2 · Doubling Duration',
    prompt:
      'If that same 6 V supply and 6 Ω element are left on for 20 seconds instead of 10 seconds, what happens to the power and the total heat transferred?',
    options: [
      'Power stays unchanged at 6 W; total heat energy doubles to 120 J.',
      'Both power and heat double.',
      'Power halves because the energy is spread over twice the time.',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'resistance-power-prediction',
    heading: 'Prediction 3 · Doubling Resistance at Fixed Voltage',
    prompt:
      'A student assumes: “Higher resistance means more friction, so it must create more heat!” If you replace the 6 Ω element with a 12 Ω element at the same 6 V supply, does the heating rate (power) increase or decrease?',
    options: [
      'Heating rate (power) halves to 3 W, producing half as much heat.',
      'Heating rate (power) doubles to 12 W, producing twice as much heat.',
      'Heating rate stays identical because the voltage has not changed.',
    ],
    correctOptionIndex: 0,
  },
]

/* ------------------------------ Guided Discoveries ------------------------------ */

export interface PowerHeatingDiscovery {
  id: 'disc-voltage' | 'disc-duration' | 'disc-resistance'
  title: string
  subtitle: string
  fixedCondition: string
  actionLabel: string
  setup: HeatingCircuitInput
  targetDurationS: number
  beforeSummary: string
  afterSummary: string
  expectedDiscovery: string
  physicalReason: string
}

export const POWER_HEATING_DISCOVERIES: readonly PowerHeatingDiscovery[] = [
  {
    id: 'disc-voltage',
    title: 'Discovery 1 · Double the Voltage',
    subtitle: 'Observe how power and energy scale when voltage doubles.',
    fixedCondition: 'Resistance (6 Ω) and duration (10 s) kept unchanged',
    actionLabel: 'Set 12 V on 6 Ω (10 s)',
    setup: {
      supplyVoltageV: 12.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 0,
    },
    targetDurationS: 10,
    beforeSummary: '6 V on 6 Ω for 10 s: I = 1 A, P = 6 W, H = 60 J',
    afterSummary: '12 V on 6 Ω for 10 s: I = 2 A, P = 24 W, H = 240 J',
    expectedDiscovery:
      'Power quadruples (4×) and total heat energy quadruples (4×) in the same 10-second period.',
    physicalReason:
      'Because P = V²/R, doubling voltage doubles current AND doubles the push per coulomb, multiplying the rate of energy dissipation by 2 × 2 = 4.',
  },
  {
    id: 'disc-duration',
    title: 'Discovery 2 · Double the Duration',
    subtitle: 'Observe the distinction between rate of energy (power) and total accumulated energy.',
    fixedCondition: 'Voltage (6 V) and resistance (6 Ω) kept unchanged',
    actionLabel: 'Set 6 V on 6 Ω for 20 s',
    setup: {
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 0,
    },
    targetDurationS: 20,
    beforeSummary: '6 V on 6 Ω for 10 s: P = 6 W, H = 60 J',
    afterSummary: '6 V on 6 Ω for 20 s: P = 6 W, H = 120 J',
    expectedDiscovery:
      'Power stays constant at 6 W; total accumulated heat doubles from 60 J to 120 J.',
    physicalReason:
      'Power (P) is the rate of energy transfer per second (Joules per second = Watts). Running for twice as many seconds accumulates twice as much total energy (H = P × t).',
  },
  {
    id: 'disc-resistance',
    title: 'Discovery 3 · Double the Resistance at Constant Voltage',
    subtitle: 'See what happens when resistance is doubled on a constant voltage supply.',
    fixedCondition: 'Voltage (6 V) and duration (10 s) kept unchanged',
    actionLabel: 'Set 6 V on 12 Ω (10 s)',
    setup: {
      supplyVoltageV: 6.0,
      resistanceOhm: 12.0,
      switchClosed: true,
      elapsedTimeS: 0,
    },
    targetDurationS: 10,
    beforeSummary: '6 V on 6 Ω for 10 s: I = 1 A, P = 6 W, H = 60 J',
    afterSummary: '6 V on 12 Ω for 10 s: I = 0.5 A, P = 3 W, H = 30 J',
    expectedDiscovery:
      'Current halves to 0.5 A; power and accumulated heat both halve from 6 W to 3 W and 60 J to 30 J.',
    physicalReason:
      'At fixed voltage, P = V²/R. A higher resistance reduces the current flow more than enough to reduce total power dissipation.',
  },
]

/* ------------------------------ Misconceptions ------------------------------ */

export interface PowerHeatingMisconception {
  title: string
  badIntuition: string
  correctPhysics: string
  takeaway: string
}

export const POWER_HEATING_MISCONCEPTIONS: readonly PowerHeatingMisconception[] = [
  {
    title: 'Misconception 1: “Higher resistance always creates more heat”',
    badIntuition:
      'Students think of resistance as friction: if you have more resistance, the charges must rub harder and generate more heat.',
    correctPhysics:
      'The controlled condition determines the outcome! In parallel circuits or household mains where voltage V is fixed (220 V), P = V²/R: higher resistance reduces current and produces LESS heat. In series circuits where current I is fixed, P = I²R: higher resistance drops more voltage and produces MORE heat.',
    takeaway:
      'Always ask: “Is voltage fixed or is current fixed?” Household appliances run at fixed 220 V, so lower resistance devices (like a 2000 W geyser) draw more current and generate more heat than high resistance devices (like a 40 W bulb).',
  },
  {
    title: 'Misconception 2: Confusing Power with Energy',
    badIntuition:
      '“A 1000 W heater always uses more electricity than a 100 W bulb.”',
    correctPhysics:
      'Power is the instantaneous rate of energy conversion (Joules per second). Total energy transferred depends on both power and running time: H = P × t. A 100 W bulb running for 20 hours uses 2,000 watt-hours (2 kWh = 7,200,000 J), whereas a 1000 W heater running for only 5 minutes uses just 83.3 watt-hours (300,000 J).',
    takeaway:
      'Power (Watts) is how fast energy is converted; Energy (Joules) is the total quantity of work done or heat generated.',
  },
  {
    title: 'Misconception 3: Thinking a Resistor “Destroys” or “Consumes” Electric Current',
    badIntuition:
      '“Current enters the heating element, gets turned into heat, so less current comes out the other end.”',
    correctPhysics:
      'Charge is strictly conserved! Every electron that enters one end of the heating element leaves the other end. The ammeter reading is identical before and after the resistor. What is transferred is electrical potential energy, carried by the electric field and converted into thermal energy through microscopic collisions with lattice ions.',
    takeaway:
      'Current is NOT consumed. Energy is transferred.',
  },
]

/* ------------------------------ Worked Examples ------------------------------ */

export interface PowerHeatingWorkedExample {
  id: string
  title: string
  context: string
  given: Record<string, string>
  steps: readonly { step: string; formula: string; calc: string; result: string }[]
  finalAnswer: string
  benchSetup?: {
    supplyVoltageV: number
    resistanceOhm: number
    durationS: number
  }
}

export const POWER_HEATING_WORKED_EXAMPLES: readonly PowerHeatingWorkedExample[] = [
  {
    id: 'we-baseline-vs-double',
    title: 'Worked Example 1 · Comparing 6 V vs 12 V on a 6 Ω Element',
    context:
      'Demonstrating the acceptance test benchmarks: compare current, power, and 10-second heat generation when supply voltage is doubled from 6 V to 12 V on a 6 Ω heating element.',
    given: {
      'Condition A': 'V₁ = 6.0 V, R = 6.0 Ω, t = 10 s',
      'Condition B': 'V₂ = 12.0 V, R = 6.0 Ω, t = 10 s',
    },
    steps: [
      {
        step: '1. Calculate current for Condition A',
        formula: 'I₁ = V₁ / R',
        calc: '6.0 V / 6.0 Ω',
        result: '1.0 A',
      },
      {
        step: '2. Calculate power for Condition A',
        formula: 'P₁ = V₁ × I₁ = V₁² / R',
        calc: '6.0 V × 1.0 A',
        result: '6.0 W',
      },
      {
        step: '3. Calculate heat energy in 10 s for Condition A',
        formula: 'H₁ = P₁ × t',
        calc: '6.0 W × 10 s',
        result: '60 J',
      },
      {
        step: '4. Calculate current for Condition B (12 V)',
        formula: 'I₂ = V₂ / R',
        calc: '12.0 V / 6.0 Ω',
        result: '2.0 A',
      },
      {
        step: '5. Calculate power for Condition B',
        formula: 'P₂ = V₂ × I₂ = (12.0)² / 6.0',
        calc: '144 / 6.0',
        result: '24.0 W',
      },
      {
        step: '6. Calculate heat energy in 10 s for Condition B',
        formula: 'H₂ = P₂ × t',
        calc: '24.0 W × 10 s',
        result: '240 J',
      },
    ],
    finalAnswer:
      'Doubling the voltage doubles current (1 A → 2 A), quadruples power (6 W → 24 W), and quadruples total heat energy (60 J → 240 J).',
    benchSetup: {
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      durationS: 10,
    },
  },
  {
    id: 'we-ncert-iron',
    title: 'Worked Example 2 · NCERT Example 12.11 (Electric Iron Heating)',
    context:
      'An electric iron of resistance 20 Ω takes a current of 5 A. Calculate the heat developed in 30 seconds.',
    given: {
      Resistance: 'R = 20 Ω',
      Current: 'I = 5 A',
      Time: 't = 30 s',
    },
    steps: [
      {
        step: '1. Identify the Joule heating equation',
        formula: 'H = I² R t',
        calc: 'State Joule’s Law of Heating',
        result: 'Formula established',
      },
      {
        step: '2. Substitute given values',
        formula: 'H = (5 A)² × 20 Ω × 30 s',
        calc: '25 × 20 × 30',
        result: '15,000 J',
      },
      {
        step: '3. Convert to kilojoules (kJ)',
        formula: 'H (kJ) = H (J) / 1000',
        calc: '15,000 / 1000',
        result: '15 kJ',
      },
    ],
    finalAnswer:
      'The heat developed in 30 seconds is 15,000 J (or 15 kJ).',
  },
]

/* ------------------------------ Practice Questions ------------------------------ */

export interface PowerHeatingPracticeQuestion {
  id: PowerHeatingQuestionId
  title: string
  difficulty: 'Foundation' | 'Developing' | 'Board Standard' | 'Challenge'
  prompt: string
  options: readonly string[]
  correctIndex: number
  hint: string
  trapExplanation: string
  solutionSteps: readonly string[]
  benchSetup?: {
    supplyVoltageV: number
    resistanceOhm: number
    durationS: number
  }
}

export const POWER_HEATING_PRACTICE_QUESTIONS: readonly PowerHeatingPracticeQuestion[] = [
  {
    id: 'ph-q1',
    title: 'Question 1 · Direct Power Calculation (P = VI)',
    difficulty: 'Foundation',
    prompt:
      'An electrical component connected to a 10 V DC supply carries a steady current of 0.5 A. What is the power consumed by the component?',
    options: ['5 W', '20 W', '0.05 W', '2 W'],
    correctIndex: 0,
    hint: 'Power is the product of potential difference and current: P = V × I.',
    trapExplanation:
      'Do not divide 10 by 0.5 (which gives resistance R = 20 Ω). Power is product P = V × I = 5 W.',
    solutionSteps: [
      'Given: V = 10 V, I = 0.5 A',
      'Formula: P = V × I',
      'Calculation: P = 10 V × 0.5 A = 5 W',
    ],
  },
  {
    id: 'ph-q2',
    title: 'Question 2 · Energy Converted Over Time (H = Pt)',
    difficulty: 'Foundation',
    prompt:
      'A small electric heater with a power rating of 24 W is operated continuously for 10 seconds. How much heat energy does it transfer?',
    options: ['240 J', '2.4 J', '24 J', '144 J'],
    correctIndex: 0,
    hint: 'Total heat energy H = Power (P) × Time (t). Note that 1 W = 1 J/s.',
    trapExplanation:
      'Check units: Watts × seconds = Joules. 24 W × 10 s = 240 J.',
    solutionSteps: [
      'Given: P = 24 W, t = 10 s',
      'Formula: H = P × t',
      'Calculation: H = 24 W × 10 s = 240 J',
    ],
    benchSetup: {
      supplyVoltageV: 12.0,
      resistanceOhm: 6.0,
      durationS: 10,
    },
  },
  {
    id: 'ph-q3',
    title: 'Question 3 · Voltage Scaling (P = V²/R)',
    difficulty: 'Developing',
    prompt:
      'A heating element of constant resistance 10 Ω is connected across 6 V, consuming 3.6 W. If the voltage across this element is doubled to 12 V, what will be its new power consumption?',
    options: ['14.4 W', '7.2 W', '3.6 W', '28.8 W'],
    correctIndex: 0,
    hint: 'At constant resistance, power is proportional to the square of voltage: P ∝ V².',
    trapExplanation:
      'Common trap: Thinking power only doubles (7.2 W). Because both voltage and current double, power quadruples (2² = 4×), giving 3.6 × 4 = 14.4 W.',
    solutionSteps: [
      'Given: R = 10 Ω, V₁ = 6 V, V₂ = 12 V (doubled)',
      'Formula: P = V² / R',
      'Initial: P₁ = 6² / 10 = 36 / 10 = 3.6 W',
      'New: P₂ = 12² / 10 = 144 / 10 = 14.4 W',
      'Notice that P₂ / P₁ = 14.4 / 3.6 = 4',
    ],
    benchSetup: {
      supplyVoltageV: 12.0,
      resistanceOhm: 10.0,
      durationS: 10,
    },
  },
  {
    id: 'ph-q4',
    title: 'Question 4 · Household Parallel Circuit Comparison',
    difficulty: 'Board Standard',
    prompt:
      'Two heating resistors, R₁ = 4 Ω and R₂ = 12 Ω, are connected in parallel to the same 12 V power supply. Which resistor produces heat at a higher rate (greater power)?',
    options: [
      'The 4 Ω resistor produces 3 times more power (36 W vs 12 W).',
      'The 12 Ω resistor produces 3 times more power because its resistance is larger.',
      'Both produce identical power because they share the same 12 V supply.',
      'The 4 Ω resistor produces 16 W and the 12 Ω resistor produces 144 W.',
    ],
    correctIndex: 0,
    hint: 'In parallel, both resistors have the SAME voltage across them. Use P = V² / R.',
    trapExplanation:
      'The classic misconception is assuming higher resistance always produces more heat. At fixed voltage, P = V²/R, so smaller resistance draws more current and produces MORE heat.',
    solutionSteps: [
      'Both resistors are connected across V = 12 V.',
      'For R₁ = 4 Ω: P₁ = 12² / 4 = 144 / 4 = 36 W',
      'For R₂ = 12 Ω: P₂ = 12² / 12 = 144 / 12 = 12 W',
      'P₁ is three times larger than P₂.',
    ],
    benchSetup: {
      supplyVoltageV: 12.0,
      resistanceOhm: 4.0,
      durationS: 10,
    },
  },
  {
    id: 'ph-q5',
    title: 'Question 5 · Series Circuit Comparison (Fixed Current)',
    difficulty: 'Board Standard',
    prompt:
      'Two resistors, R₁ = 2 Ω and R₂ = 8 Ω, are connected in series. A constant current of 2 A flows through both. Which resistor dissipates more electrical power as heat?',
    options: [
      'The 8 Ω resistor (dissipates 32 W vs 8 W for the 2 Ω resistor).',
      'The 2 Ω resistor (dissipates more heat because lower resistance conducts easier).',
      'Both dissipate identical power because they carry the same current.',
      'The 2 Ω resistor dissipates 4 W and the 8 Ω resistor dissipates 16 W.',
    ],
    correctIndex: 0,
    hint: 'In series, both resistors carry the SAME current I = 2 A. Which formula isolates fixed current: P = I²R or P = V²/R?',
    trapExplanation:
      'Here current is fixed, not voltage! Since P = I²R, power is directly proportional to resistance when current is constant.',
    solutionSteps: [
      'Given: I = 2 A through both resistors in series.',
      'Formula: P = I² R',
      'For R₁ = 2 Ω: P₁ = (2)² × 2 = 4 × 2 = 8 W',
      'For R₂ = 8 Ω: P₂ = (2)² × 8 = 4 × 8 = 32 W',
      'The 8 Ω resistor dissipates 4 times more power.',
    ],
  },
  {
    id: 'ph-q6',
    title: 'Question 6 · Time Required for Target Heat Energy',
    difficulty: 'Challenge',
    prompt:
      'A heating element of resistance 4 Ω is connected across a 12 V DC source. How long must current flow to deliver exactly 360 J of heat energy?',
    options: ['10 seconds', '2.5 seconds', '30 seconds', '15 seconds'],
    correctIndex: 0,
    hint: 'First calculate the power P = V² / R. Then use t = H / P.',
    trapExplanation:
      'Make sure to compute power first: P = 12² / 4 = 36 W. Then t = 360 J / 36 W = 10 s.',
    solutionSteps: [
      'Given: V = 12 V, R = 4 Ω, Target H = 360 J',
      'Step 1: Calculate power P = V² / R = (12)² / 4 = 144 / 4 = 36 W',
      'Step 2: Relate heat energy and power: H = P × t',
      'Step 3: Solve for time: t = H / P = 360 J / 36 W = 10 s',
    ],
    benchSetup: {
      supplyVoltageV: 12.0,
      resistanceOhm: 4.0,
      durationS: 10,
    },
  },
]

/* ------------------------------ Practice Answer Helpers ------------------------------ */

export interface PowerHeatingPracticeAnswer {
  selectedOption: number | null
  checked: boolean
  showHint: boolean
  showTrap: boolean
  showSolution: boolean
}

export const EMPTY_PH_ANSWER: PowerHeatingPracticeAnswer = {
  selectedOption: null,
  checked: false,
  showHint: false,
  showTrap: false,
  showSolution: false,
}

export function evaluatePowerHeatingPracticeAnswer(
  q: PowerHeatingPracticeQuestion,
  ans: PowerHeatingPracticeAnswer
): { status: 'unanswered' | 'correct' | 'incorrect'; feedback: string } {
  if (ans.selectedOption === null) {
    return { status: 'unanswered', feedback: 'Select an option to check your answer.' }
  }
  if (ans.selectedOption === q.correctIndex) {
    return {
      status: 'correct',
      feedback: `Correct! ${q.solutionSteps[q.solutionSteps.length - 1]}`,
    }
  }
  return {
    status: 'incorrect',
    feedback: `Not quite. Review the hint or trap: ${q.trapExplanation}`,
  }
}

/* ------------------------------ Experiment State Helpers ------------------------------ */

export interface PowerHeatingExperimentState {
  circuit: HeatingCircuitInput
  targetDurationS: number
  isRunning: boolean
  energyHistory: { timeS: number; energyJ: number }[]
  selectedQuestionId: PowerHeatingQuestionId
}

export const INITIAL_PH_EXPERIMENT: PowerHeatingExperimentState = {
  circuit: {
    supplyVoltageV: 6.0,
    resistanceOhm: 6.0,
    switchClosed: true,
    elapsedTimeS: 0,
  },
  targetDurationS: 10,
  isRunning: false,
  energyHistory: [{ timeS: 0, energyJ: 0 }],
  selectedQuestionId: 'ph-q1',
}

export function loadHeatingSetup(
  state: PowerHeatingExperimentState,
  setup: { supplyVoltageV: number; resistanceOhm: number; durationS: number }
): PowerHeatingExperimentState {
  return {
    ...state,
    circuit: {
      ...state.circuit,
      supplyVoltageV: setup.supplyVoltageV,
      resistanceOhm: setup.resistanceOhm,
      switchClosed: true,
      elapsedTimeS: 0,
    },
    targetDurationS: setup.durationS,
    isRunning: false,
    energyHistory: [{ timeS: 0, energyJ: 0 }],
  }
}
