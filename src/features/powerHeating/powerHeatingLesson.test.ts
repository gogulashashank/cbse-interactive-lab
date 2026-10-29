import { describe, expect, it } from 'vitest'
import {
  calculateHeatingCircuit,
  calculatePowerFromVoltage,
  calculateHeatEnergy,
  type HeatingCircuitInput,
} from './powerHeatingModel'
import {
  applyHeatingDraftEdit,
  createHeatingDrafts,
  formatHeatingNumber,
} from './powerHeatingInputValidation'
import {
  EMPTY_PH_ANSWER,
  evaluatePowerHeatingPracticeAnswer,
  loadHeatingSetup,
  POWER_HEATING_DISCOVERIES,
  POWER_HEATING_MISCONCEPTIONS,
  POWER_HEATING_PRACTICE_QUESTIONS,
  POWER_HEATING_PREDICTIONS,
  POWER_HEATING_WORKED_EXAMPLES,
  type PowerHeatingExperimentState,
  type PowerHeatingPracticeAnswer,
} from './powerHeatingContent'

describe('powerHeatingContent — Guided Discoveries', () => {
  it('has 3 discoveries matching the physical laws', () => {
    expect(POWER_HEATING_DISCOVERIES).toHaveLength(3)

    // Discovery 1: Double Voltage (6 V -> 12 V on 6 Ω)
    const disc1 = POWER_HEATING_DISCOVERIES[0]
    expect(disc1.id).toBe('disc-voltage')
    const res1 = calculateHeatingCircuit(disc1.setup)
    expect(res1.supplyVoltageV).toBe(12.0)
    expect(res1.resistanceOhm).toBe(6.0)
    expect(res1.currentA).toBeCloseTo(2.0, 5)
    expect(res1.powerW).toBeCloseTo(24.0, 5)
    expect(calculateHeatEnergy(res1.powerW, disc1.targetDurationS)).toBe(240.0)

    // Baseline comparison
    const baseP = calculatePowerFromVoltage(6.0, 6.0)
    expect(res1.powerW / baseP).toBeCloseTo(4.0, 5) // 4x power

    // Discovery 2: Double Duration (10 s -> 20 s at 6 V, 6 Ω)
    const disc2 = POWER_HEATING_DISCOVERIES[1]
    expect(disc2.id).toBe('disc-duration')
    const res2 = calculateHeatingCircuit(disc2.setup)
    expect(res2.powerW).toBeCloseTo(6.0, 5)
    expect(calculateHeatEnergy(res2.powerW, disc2.targetDurationS)).toBe(120.0) // 2x heat

    // Discovery 3: Double Resistance (6 Ω -> 12 Ω at 6 V)
    const disc3 = POWER_HEATING_DISCOVERIES[2]
    expect(disc3.id).toBe('disc-resistance')
    const res3 = calculateHeatingCircuit(disc3.setup)
    expect(res3.currentA).toBeCloseTo(0.5, 5)
    expect(res3.powerW).toBeCloseTo(3.0, 5)
    expect(calculateHeatEnergy(res3.powerW, disc3.targetDurationS)).toBe(30.0) // 0.5x heat & power
  })

  it('contains the targeted misconception distinguishing fixed voltage from fixed current', () => {
    expect(POWER_HEATING_MISCONCEPTIONS).toHaveLength(3)
    const primaryMisc = POWER_HEATING_MISCONCEPTIONS[0]
    expect(primaryMisc.title).toContain('Higher resistance always creates more heat')
    expect(primaryMisc.correctPhysics).toContain('P = V²/R')
    expect(primaryMisc.correctPhysics).toContain('P = I²R')
  })

  it('has 3 predictions covering voltage scaling, duration scaling, and resistance scaling', () => {
    expect(POWER_HEATING_PREDICTIONS).toHaveLength(3)
    expect(POWER_HEATING_PREDICTIONS[0].correctOptionIndex).toBe(0) // Quadruples
    expect(POWER_HEATING_PREDICTIONS[1].correctOptionIndex).toBe(0) // Heat doubles, power constant
    expect(POWER_HEATING_PREDICTIONS[2].correctOptionIndex).toBe(0) // Power halves to 3 W
  })

  it('has 2 fully-worked examples including the acceptance test comparison', () => {
    expect(POWER_HEATING_WORKED_EXAMPLES).toHaveLength(2)

    // Example 1: 6 V vs 12 V
    const ex1 = POWER_HEATING_WORKED_EXAMPLES[0]
    expect(ex1.steps).toHaveLength(6)
    expect(ex1.steps[0].result).toBe('1.0 A')
    expect(ex1.steps[1].result).toBe('6.0 W')
    expect(ex1.steps[2].result).toBe('60 J')
    expect(ex1.steps[3].result).toBe('2.0 A')
    expect(ex1.steps[4].result).toBe('24.0 W')
    expect(ex1.steps[5].result).toBe('240 J')

    // Example 2: NCERT 12.11 (20 Ω iron, 5 A, 30 s)
    const ex2 = POWER_HEATING_WORKED_EXAMPLES[1]
    expect(ex2.steps[1].result).toBe('15,000 J')
    expect(ex2.steps[2].result).toBe('15 kJ')
  })
})

describe('powerHeatingContent — Practice Ladder & Evaluation', () => {
  it('has 6 comprehensive practice questions spanning Foundation to Challenge', () => {
    expect(POWER_HEATING_PRACTICE_QUESTIONS).toHaveLength(6)

    POWER_HEATING_PRACTICE_QUESTIONS.forEach((q) => {
      expect(q.prompt).toBeTruthy()
      expect(q.options.length).toBeGreaterThanOrEqual(3)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.hint).toBeTruthy()
      expect(q.trapExplanation).toBeTruthy()
      expect(q.solutionSteps.length).toBeGreaterThan(0)
    })
  })

  it('correctly validates user answers against the practice bank', () => {
    // Unanswered
    const q1 = POWER_HEATING_PRACTICE_QUESTIONS[0]
    const unans = evaluatePowerHeatingPracticeAnswer(q1, EMPTY_PH_ANSWER)
    expect(unans.status).toBe('unanswered')

    // Correct
    const correctAns: PowerHeatingPracticeAnswer = {
      selectedOption: q1.correctIndex,
      checked: true,
      showHint: false,
      showTrap: false,
      showSolution: false,
    }
    const evalCorrect = evaluatePowerHeatingPracticeAnswer(q1, correctAns)
    expect(evalCorrect.status).toBe('correct')
    expect(evalCorrect.feedback).toContain('Correct!')

    // Incorrect
    const wrongAns: PowerHeatingPracticeAnswer = {
      selectedOption: (q1.correctIndex + 1) % q1.options.length,
      checked: true,
      showHint: false,
      showTrap: false,
      showSolution: false,
    }
    const evalWrong = evaluatePowerHeatingPracticeAnswer(q1, wrongAns)
    expect(evalWrong.status).toBe('incorrect')
    expect(evalWrong.feedback).toContain('Not quite.')
  })

  it('correctly loads setups onto the experiment state without corrupting question selection', () => {
    const initialState: PowerHeatingExperimentState = {
      circuit: {
        supplyVoltageV: 6.0,
        resistanceOhm: 6.0,
        switchClosed: true,
        elapsedTimeS: 5,
      },
      targetDurationS: 10,
      isRunning: true,
      energyHistory: [{ timeS: 0, energyJ: 0 }, { timeS: 5, energyJ: 30 }],
      selectedQuestionId: 'ph-q4',
    }

    const updated = loadHeatingSetup(initialState, {
      supplyVoltageV: 12.0,
      resistanceOhm: 4.0,
      durationS: 15,
    })

    expect(updated.circuit.supplyVoltageV).toBe(12.0)
    expect(updated.circuit.resistanceOhm).toBe(4.0)
    expect(updated.circuit.elapsedTimeS).toBe(0)
    expect(updated.targetDurationS).toBe(15)
    expect(updated.isRunning).toBe(false)
    expect(updated.selectedQuestionId).toBe('ph-q4') // Preserved
  })
})

describe('powerHeatingInputValidation — Draft Edits & Limits', () => {
  it('creates drafts matching the circuit state and formats numbers properly', () => {
    const circuit: HeatingCircuitInput = {
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 0,
    }
    const drafts = createHeatingDrafts(circuit, 10)
    expect(drafts.supplyVoltageV).toBe('6')
    expect(drafts.resistanceOhm).toBe('6')
    expect(drafts.targetDurationS).toBe('10')

    expect(formatHeatingNumber(6.0)).toBe('6')
    expect(formatHeatingNumber(2.456, 2)).toBe('2.46')
    expect(formatHeatingNumber(15000, 1)).toBe('15,000')
  })

  it('applies valid draft edits cleanly', () => {
    const circuit: HeatingCircuitInput = {
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 0,
    }
    const drafts = createHeatingDrafts(circuit, 10)

    const res = applyHeatingDraftEdit(circuit, drafts, 10, 'supplyVoltageV', '12.0')
    expect(res.input.supplyVoltageV).toBe(12.0)
    expect(res.drafts.supplyVoltageV).toBe('12.0')
    expect(res.errors.supplyVoltageV).toBeUndefined()
  })

  it('rejects out-of-range draft edits while preserving valid state', () => {
    const circuit: HeatingCircuitInput = {
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 0,
    }
    const drafts = createHeatingDrafts(circuit, 10)

    const res = applyHeatingDraftEdit(circuit, drafts, 10, 'supplyVoltageV', '99.0')
    expect(res.input.supplyVoltageV).toBe(6.0) // Kept previous valid value
    expect(res.drafts.supplyVoltageV).toBe('99.0') // Retained user typing
    expect(res.errors.supplyVoltageV).toBeDefined()
  })

  it('rejects malformed text strings without throwing an uncaught exception', () => {
    const circuit: HeatingCircuitInput = {
      supplyVoltageV: 6.0,
      resistanceOhm: 6.0,
      switchClosed: true,
      elapsedTimeS: 0,
    }
    const drafts = createHeatingDrafts(circuit, 10)

    const res = applyHeatingDraftEdit(circuit, drafts, 10, 'resistanceOhm', 'abc')
    expect(res.input.resistanceOhm).toBe(6.0)
    expect(res.errors.resistanceOhm).toBe('Enter a valid resistance.')
  })
})
