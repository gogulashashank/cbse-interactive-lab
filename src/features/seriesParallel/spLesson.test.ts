import { describe, expect, it } from 'vitest'
import { calculateSeriesParallel, type SPInput } from './spModel'
import { createSPDrafts } from './spInputValidation'
import {
  buildComparisonData,
  EMPTY_SP_ANSWER,
  evaluateSPPracticeAnswer,
  loadSPSetupOnExperiment,
  selectSPQuestion,
  SP_PRACTICE_QUESTIONS,
  SP_PREDICTION,
  SP_WORKED_EXAMPLES,
  type SPExperimentState,
} from './spContent'

describe('spContent — Comparison Table', () => {
  it('has a well-formed prediction question', () => {
    expect(SP_PREDICTION.options).toHaveLength(3)
    expect(SP_PREDICTION.correctOptionIndex).toBe(1)
    expect(SP_PREDICTION.startSetup.arrangement).toBe('single')
  })

  it('generates the exact baseline comparison at 6 V with 6 Ω resistors', () => {
    const rows = buildComparisonData(6, 6, 6, true)
    expect(rows).toHaveLength(3)

    // Single: 6 Ω, 1 A
    const single = rows[0]
    expect(single.arrangement).toBe('single')
    expect(single.reqOhm).toBeCloseTo(6, 10)
    expect(single.supplyCurrentA).toBeCloseTo(1, 10)
    expect(single.r1Reading.currentA).toBeCloseTo(1, 10)
    expect(single.r2Reading).toBeNull()

    // Series: 12 Ω, 0.5 A
    const series = rows[1]
    expect(series.arrangement).toBe('series')
    expect(series.reqOhm).toBeCloseTo(12, 10)
    expect(series.supplyCurrentA).toBeCloseTo(0.5, 10)
    expect(series.r1Reading.currentA).toBeCloseTo(0.5, 10)
    expect(series.r2Reading?.currentA).toBeCloseTo(0.5, 10)
    expect(series.r1Reading.voltageV).toBeCloseTo(3, 10)
    expect(series.r2Reading?.voltageV).toBeCloseTo(3, 10)

    // Parallel: 3 Ω, 2 A
    const parallel = rows[2]
    expect(parallel.arrangement).toBe('parallel')
    expect(parallel.reqOhm).toBeCloseTo(3, 10)
    expect(parallel.supplyCurrentA).toBeCloseTo(2, 10)
    expect(parallel.r1Reading.currentA).toBeCloseTo(1, 10)
    expect(parallel.r2Reading?.currentA).toBeCloseTo(1, 10)
    expect(parallel.r1Reading.voltageV).toBeCloseTo(6, 10)
    expect(parallel.r2Reading?.voltageV).toBeCloseTo(6, 10)
  })
})

describe('spContent — Worked Examples', () => {
  it('Example A (Series unequal): 9 V, 3 Ω + 6 Ω -> Req = 9 Ω, I = 1 A, V1 = 3 V, V2 = 6 V', () => {
    const ex1 = SP_WORKED_EXAMPLES[0]
    expect(ex1.setup.arrangement).toBe('series')
    expect(ex1.result.equivalentResistanceOhm).toBeCloseTo(9, 10)
    expect(ex1.result.supplyCurrentA).toBeCloseTo(1, 10)
    expect(ex1.result.resistor1.voltageV).toBeCloseTo(3, 10)
    expect(ex1.result.resistor2?.voltageV).toBeCloseTo(6, 10)
    expect(ex1.result).toEqual(calculateSeriesParallel(ex1.setup))
  })

  it('Example B (Parallel unequal): 6 V, 6 Ω || 12 Ω -> Req = 4 Ω, I1 = 1 A, I2 = 0.5 A, I_total = 1.5 A', () => {
    const ex2 = SP_WORKED_EXAMPLES[1]
    expect(ex2.setup.arrangement).toBe('parallel')
    expect(ex2.result.equivalentResistanceOhm).toBeCloseTo(4, 10)
    expect(ex2.result.resistor1.currentA).toBeCloseTo(1.0, 10)
    expect(ex2.result.resistor2?.currentA).toBeCloseTo(0.5, 10)
    expect(ex2.result.supplyCurrentA).toBeCloseTo(1.5, 10)
    expect(ex2.result).toEqual(calculateSeriesParallel(ex2.setup))
  })
})

describe('spContent — Practice Ladder', () => {
  const getQ = (id: string) => SP_PRACTICE_QUESTIONS.find((q) => q.id === id)!

  it('contains 6 well-formed questions without leaked solutions', () => {
    expect(SP_PRACTICE_QUESTIONS).toHaveLength(6)
    for (const q of SP_PRACTICE_QUESTIONS) {
      expect(q.hint.length).toBeGreaterThan(10)
      expect(q.workedSolution).not.toMatch(/^Correct!/)
    }
  })

  it('Q1 (choice - series rules): current same, voltage divides', () => {
    const q1 = getQ('sp-q1')
    expect(evaluateSPPracticeAnswer(q1, { ...EMPTY_SP_ANSWER, choice: 0 }).status).toBe('correct')
    expect(evaluateSPPracticeAnswer(q1, { ...EMPTY_SP_ANSWER, choice: 1 }).status).toBe('incorrect')
    expect(evaluateSPPracticeAnswer(q1, { ...EMPTY_SP_ANSWER, choice: null }).status).toBe('empty')
  })

  it('Q2 (number - Req series): 5 Ω + 15 Ω = 20 Ω', () => {
    const q2 = getQ('sp-q2')
    expect(evaluateSPPracticeAnswer(q2, { ...EMPTY_SP_ANSWER, draft: '20' }).status).toBe('correct')
    expect(evaluateSPPracticeAnswer(q2, { ...EMPTY_SP_ANSWER, draft: '3.75' }).message).toContain('parallel formula')
    expect(evaluateSPPracticeAnswer(q2, { ...EMPTY_SP_ANSWER, draft: '10' }).message).toContain('average')
  })

  it('Q3 (number - Req parallel): 10 Ω || 10 Ω = 5 Ω', () => {
    const q3 = getQ('sp-q3')
    expect(evaluateSPPracticeAnswer(q3, { ...EMPTY_SP_ANSWER, draft: '5' }).status).toBe('correct')
    expect(evaluateSPPracticeAnswer(q3, { ...EMPTY_SP_ANSWER, draft: '20' }).message).toContain('series')
    expect(evaluateSPPracticeAnswer(q3, { ...EMPTY_SP_ANSWER, draft: '0.2' }).message).toContain('reciprocal')
  })

  it('Q4 (number - branch current): 6 V / 6 Ω = 1.0 A', () => {
    const q4 = getQ('sp-q4')
    expect(evaluateSPPracticeAnswer(q4, { ...EMPTY_SP_ANSWER, draft: '1.0' }).status).toBe('correct')
    expect(evaluateSPPracticeAnswer(q4, { ...EMPTY_SP_ANSWER, draft: '0.5' }).message).toContain('R₂')
    expect(evaluateSPPracticeAnswer(q4, { ...EMPTY_SP_ANSWER, draft: '1.5' }).message).toContain('total')
  })

  it('Q5 (choice - unequal current split): 4 Ω gets 3 A, 12 Ω gets 1 A', () => {
    const q5 = getQ('sp-q5')
    expect(evaluateSPPracticeAnswer(q5, { ...EMPTY_SP_ANSWER, choice: 0 }).status).toBe('correct')
    expect(evaluateSPPracticeAnswer(q5, { ...EMPTY_SP_ANSWER, choice: 1 }).status).toBe('incorrect')
  })

  it('Q6 (choice - home wiring branch disconnects): other lamp stays lit', () => {
    const q6 = getQ('sp-q6')
    expect(evaluateSPPracticeAnswer(q6, { ...EMPTY_SP_ANSWER, choice: 0 }).status).toBe('correct')
    expect(evaluateSPPracticeAnswer(q6, { ...EMPTY_SP_ANSWER, choice: 1 }).status).toBe('incorrect')
  })
})

describe('spContent — State Independence', () => {
  const customCircuit: SPInput = {
    arrangement: 'parallel',
    supplyVoltageV: 11,
    resistance1Ohm: 25,
    resistance2Ohm: 75,
    switchClosed: true,
  }

  const startState: SPExperimentState = {
    circuit: customCircuit,
    drafts: createSPDrafts(customCircuit),
    selectedQuestionId: 'sp-q1',
  }

  it('selecting any practice question preserves the circuit and drafts untouched', () => {
    for (const q of SP_PRACTICE_QUESTIONS) {
      const next = selectSPQuestion(startState, q.id)
      expect(next.selectedQuestionId).toBe(q.id)
      expect(next.circuit).toEqual(customCircuit)
      expect(next.drafts).toEqual(startState.drafts)
    }
  })

  it('only explicit loadSPSetupOnExperiment updates the circuit', () => {
    const targetSetup: SPInput = {
      arrangement: 'series',
      supplyVoltageV: 8,
      resistance1Ohm: 12,
      resistance2Ohm: 24,
      switchClosed: false,
    }
    const updated = loadSPSetupOnExperiment(startState, targetSetup)
    expect(updated.circuit).toEqual(targetSetup)
    expect(updated.drafts.supplyVoltageV).toBe('8')
    expect(updated.drafts.resistance1Ohm).toBe('12')
    expect(updated.drafts.resistance2Ohm).toBe('24')
  })
})
