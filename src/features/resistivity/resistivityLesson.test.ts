import { describe, expect, it } from 'vitest'
import { calculateWire, type WireInput } from './resistivityModel'
import { createWireDrafts } from './resistivityInputValidation'
import {
  EMPTY_RES_ANSWER,
  evaluateResPracticeAnswer,
  GUIDED_DISCOVERIES,
  loadWireSetupOnExperiment,
  RESISTIVITY_PRACTICE_QUESTIONS,
  RESISTIVITY_PREDICTIONS,
  RESISTIVITY_WORKED_EXAMPLES,
  selectResQuestion,
  type ResistivityExperimentState,
} from './resistivityContent'

describe('resistivityContent — Guided Discoveries', () => {
  it('has 4 discoveries matching physical laws', () => {
    expect(GUIDED_DISCOVERIES).toHaveLength(4)

    const base = calculateWire(GUIDED_DISCOVERIES[0].setup)
    expect(base.resistanceOhm).toBeCloseTo(2.0, 8)

    const doubleL = calculateWire(GUIDED_DISCOVERIES[1].setup)
    expect(doubleL.resistanceOhm).toBeCloseTo(4.0, 8)
    expect(doubleL.resistanceOhm / base.resistanceOhm).toBeCloseTo(2.0, 8)

    const doubleA = calculateWire(GUIDED_DISCOVERIES[2].setup)
    expect(doubleA.resistanceOhm).toBeCloseTo(1.0, 8)
    expect(doubleA.resistanceOhm / base.resistanceOhm).toBeCloseTo(0.5, 8)

    const copper = calculateWire(GUIDED_DISCOVERIES[3].setup)
    expect(copper.resistanceOhm).toBeLessThan(0.1)
  })

  it('has 3 valid prediction questions', () => {
    expect(RESISTIVITY_PREDICTIONS).toHaveLength(3)
    expect(RESISTIVITY_PREDICTIONS[0].correctOptionIndex).toBe(0) // double length -> doubles
    expect(RESISTIVITY_PREDICTIONS[1].correctOptionIndex).toBe(1) // double area -> halves
    expect(RESISTIVITY_PREDICTIONS[2].correctOptionIndex).toBe(1) // resistivity unchanged
  })
})

describe('resistivityContent — Worked Examples', () => {
  it('Example A (Copper wire): L = 2 m, A = 0.5 mm² -> R = 0.0648 Ω', () => {
    const ex1 = RESISTIVITY_WORKED_EXAMPLES[0]
    expect(ex1.setup.materialId).toBe('copper')
    expect(ex1.result.resistanceOhm).toBeCloseTo(0.0648, 4)
    expect(ex1.result).toEqual(calculateWire(ex1.setup))
  })

  it('Example B (Nichrome identification): L = 1 m, A = 0.5 mm², R = 2.0 Ω -> ρ = 1.0e-6 Ω·m', () => {
    const ex2 = RESISTIVITY_WORKED_EXAMPLES[1]
    expect(ex2.setup.materialId).toBe('nichrome')
    expect(ex2.result.resistanceOhm).toBeCloseTo(2.0, 8)
    expect(ex2.result).toEqual(calculateWire(ex2.setup))
  })
})

describe('resistivityContent — Practice Ladder', () => {
  const getQ = (id: string) => RESISTIVITY_PRACTICE_QUESTIONS.find((q) => q.id === id)!

  it('contains 6 questions with hints and no solution leaks', () => {
    expect(RESISTIVITY_PRACTICE_QUESTIONS).toHaveLength(6)
    for (const q of RESISTIVITY_PRACTICE_QUESTIONS) {
      expect(q.hint.length).toBeGreaterThan(10)
      expect(q.workedSolution).not.toMatch(/^Correct!/)
    }
  })

  it('Q1 (choice - length triples): 3R', () => {
    const q1 = getQ('res-q1')
    expect(evaluateResPracticeAnswer(q1, { ...EMPTY_RES_ANSWER, choice: 0 }).status).toBe('correct')
    expect(evaluateResPracticeAnswer(q1, { ...EMPTY_RES_ANSWER, choice: 1 }).status).toBe('incorrect')
  })

  it('Q2 (choice - area doubles): R/2', () => {
    const q2 = getQ('res-q2')
    expect(evaluateResPracticeAnswer(q2, { ...EMPTY_RES_ANSWER, choice: 0 }).status).toBe('correct')
    expect(evaluateResPracticeAnswer(q2, { ...EMPTY_RES_ANSWER, choice: 1 }).status).toBe('incorrect')
  })

  it('Q3 (number - nichrome calculation): 2.0 Ω with traps', () => {
    const q3 = getQ('res-q3')
    expect(evaluateResPracticeAnswer(q3, { ...EMPTY_RES_ANSWER, draft: '2.0' }).status).toBe('correct')
    expect(evaluateResPracticeAnswer(q3, { ...EMPTY_RES_ANSWER, draft: '1.0' }).message).toContain('Check length')
    expect(evaluateResPracticeAnswer(q3, { ...EMPTY_RES_ANSWER, draft: '0.5' }).status).toBe('incorrect')
  })

  it('Q4 (choice - doubling diameter): R/4 (exam challenge)', () => {
    const q4 = getQ('res-q4')
    expect(evaluateResPracticeAnswer(q4, { ...EMPTY_RES_ANSWER, choice: 0 }).status).toBe('correct')
    expect(evaluateResPracticeAnswer(q4, { ...EMPTY_RES_ANSWER, choice: 1 }).message).toContain('common trap')
  })

  it('Q5 (choice - cutting wire into two halves): R/2, rho unchanged', () => {
    const q5 = getQ('res-q5')
    expect(evaluateResPracticeAnswer(q5, { ...EMPTY_RES_ANSWER, choice: 0 }).status).toBe('correct')
    expect(evaluateResPracticeAnswer(q5, { ...EMPTY_RES_ANSWER, choice: 1 }).status).toBe('incorrect')
  })

  it('Q6 (choice - Nichrome vs Copper properties): high resistivity and non-oxidizing', () => {
    const q6 = getQ('res-q6')
    expect(evaluateResPracticeAnswer(q6, { ...EMPTY_RES_ANSWER, choice: 0 }).status).toBe('correct')
    expect(evaluateResPracticeAnswer(q6, { ...EMPTY_RES_ANSWER, choice: 1 }).status).toBe('incorrect')
  })
})

describe('resistivityContent — State Independence', () => {
  const customWire: WireInput = {
    materialId: 'iron',
    lengthM: 4.5,
    areaMm2: 0.8,
    supplyVoltageV: 8.0,
    switchClosed: true,
  }

  const startState: ResistivityExperimentState = {
    wire: customWire,
    drafts: createWireDrafts(customWire),
    selectedQuestionId: 'res-q1',
  }

  it('selecting any question preserves live wire state and drafts', () => {
    for (const q of RESISTIVITY_PRACTICE_QUESTIONS) {
      const next = selectResQuestion(startState, q.id)
      expect(next.selectedQuestionId).toBe(q.id)
      expect(next.wire).toEqual(customWire)
      expect(next.drafts).toEqual(startState.drafts)
    }
  })

  it('only explicit loadWireSetupOnExperiment updates the wire setup', () => {
    const targetSetup: WireInput = {
      materialId: 'copper',
      lengthM: 2.0,
      areaMm2: 1.2,
      supplyVoltageV: 5.0,
      switchClosed: false,
    }
    const updated = loadWireSetupOnExperiment(startState, targetSetup)
    expect(updated.wire).toEqual(targetSetup)
    expect(updated.drafts.lengthM).toBe('2')
    expect(updated.drafts.areaMm2).toBe('1.2')
  })
})
