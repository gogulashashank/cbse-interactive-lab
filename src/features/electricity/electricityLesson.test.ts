import { describe, expect, it } from 'vitest'
import { calculateCircuit, fitSlopeOhm, type CircuitInput } from './ohmModel'
import { createOhmDrafts } from './ohmInputValidation'
import {
  addMeasurementPoint,
  createDataset,
  CONCEPT_CARDS,
  COMMON_MISTAKES,
  countCorrect,
  EMPTY_ANSWER,
  ELECTRICITY_PRACTICE_QUESTIONS,
  ELECTRICITY_WORKED_EXAMPLES,
  evaluatePracticeAnswer,
  evaluatePredictionTest,
  isSolutionUnlocked,
  noticeUnlocked,
  loadSetupOnExperiment,
  PREDICTIONS,
  selectPracticeQuestion,
  type ExperimentState,
} from './electricityContent'

describe('worked examples match their own inputs', () => {
  it('Example A: 9 V, 18 Ω → 0.5 A, 9 V across R', () => {
    const [a] = ELECTRICITY_WORKED_EXAMPLES
    expect(a.result.currentA).toBeCloseTo(0.5, 10)
    expect(a.result.resistorVoltageV).toBeCloseTo(9, 10)
    expect(a.result).toEqual(calculateCircuit(a.input))
    expect(a.steps[1].line).toContain('0.5 A')
  })
  it('Example B: 6 V with 10 Ω then 20 Ω → 0.6 A then 0.3 A', () => {
    const b = ELECTRICITY_WORKED_EXAMPLES[1]
    expect(b.result.currentA).toBeCloseTo(0.6, 10)
    expect(b.secondResult?.currentA).toBeCloseTo(0.3, 10)
    expect((b.secondResult?.currentA ?? 0) / b.result.currentA).toBeCloseTo(0.5, 10)
    expect(b.steps[0].line).toContain('0.6 A')
    expect(b.steps[1].line).toContain('0.3 A')
  })
})

describe('practice ladder', () => {
  const q = (id: string) => ELECTRICITY_PRACTICE_QUESTIONS.find((x) => x.id === id)!
  const num = (id: string, draft: string) =>
    evaluatePracticeAnswer(q(id), { ...EMPTY_ANSWER, draft, checked: true })
  const choice = (id: string, c: number | null) =>
    evaluatePracticeAnswer(q(id), { ...EMPTY_ANSWER, choice: c, checked: true })

  it('has six questions with unique ids, hints and worked solutions', () => {
    expect(ELECTRICITY_PRACTICE_QUESTIONS).toHaveLength(6)
    expect(new Set(ELECTRICITY_PRACTICE_QUESTIONS.map((x) => x.id)).size).toBe(6)
    for (const x of ELECTRICITY_PRACTICE_QUESTIONS) {
      expect(x.hint.length).toBeGreaterThan(10)
      expect(x.workedSolution).not.toMatch(/^Correct!/)
    }
  })
  it('Q3 matches the model: 12 V, 48 Ω → 0.25 A', () => {
    const n = q('q3')
    expect(n.kind === 'number' && n.setup && calculateCircuit(n.setup).currentA).toBeCloseTo(0.25, 10)
    expect(num('q3', '0.25').status).toBe('correct')
    expect(num('q3', '250').message).toContain('milliamperes')
    expect(num('q3', '4').message).toContain('R ÷ V')
    expect(num('q3', '576').message).toContain('multiplied')
    expect(num('q3', '9').status).toBe('incorrect')
    expect(num('q3', '  ').status).toBe('empty')
  })
  it('Q4 matches the model: 10 V and 0.5 A → 20 Ω', () => {
    const n = q('q4')
    const r = n.setup ? calculateCircuit(n.setup) : null
    expect(r?.currentA).toBeCloseTo(0.5, 10)
    expect(r?.resistorVoltageV).toBeCloseTo(10, 10)
    expect(num('q4', '20').status).toBe('correct')
    expect(num('q4', '5').message).toContain('multiplied')
  })
  it('Q5 graph points come from the model and the slope is 6 Ω', () => {
    const n = q('q5')
    expect(n.graph?.points).toHaveLength(3)
    for (const p of n.graph!.points) expect(p.voltageV / p.currentA).toBeCloseTo(6, 10)
    expect(fitSlopeOhm(n.graph!.points)).toBeCloseTo(6, 10)
    expect(num('q5', '6').status).toBe('correct')
    expect(num('q5', '0.17').message).toContain('ΔV ÷ ΔI')
  })
  it('choice questions match the model', () => {
    const open = calculateCircuit(q('q2').setup!)
    expect(open.currentA).toBe(0)
    expect(open.resistorVoltageV).toBe(0)
    expect(choice('q2', 1).status).toBe('correct')
    expect(choice('q2', 2).message).toContain('across the resistor')
    expect(choice('q1', 0).status).toBe('correct')
    expect(choice('q1', 1).status).toBe('incorrect')
    expect(choice('q6', 0).status).toBe('correct')
    expect(choice('q6', null).status).toBe('empty')
    expect(q('q6').setup).toBeNull()
  })
  it('worked solutions unlock only after a check and the score counts only correct checked answers', () => {
    expect(isSolutionUnlocked(EMPTY_ANSWER)).toBe(false)
    expect(isSolutionUnlocked({ ...EMPTY_ANSWER, checked: true })).toBe(true)
    expect(countCorrect({})).toBe(0)
    expect(countCorrect({ q3: { ...EMPTY_ANSWER, draft: '0.25', checked: false } })).toBe(0)
    expect(countCorrect({ q3: { ...EMPTY_ANSWER, draft: '0.25', checked: true }, q6: { ...EMPTY_ANSWER, choice: 1, checked: true } })).toBe(1)
  })
})

describe('learning scaffolds', () => {
  it('has three concept cards with a plain name and the NCERT term', () => {
    expect(CONCEPT_CARDS.map((c) => c.id)).toEqual(['current', 'voltage', 'resistance'])
    for (const c of CONCEPT_CARDS) {
      expect(c.plainName.length).toBeGreaterThan(3)
      expect(c.ncertTerm).toMatch(/\(/)
    }
  })
  it('notice prompts unlock only with enough measured points', () => {
    expect(noticeUnlocked(0)).toEqual([false, false, false])
    expect(noticeUnlocked(2)).toEqual([true, true, false])
    expect(noticeUnlocked(3)).toEqual([true, true, true])
  })
  it('lists common mistakes', () => {
    expect(COMMON_MISTAKES.length).toBeGreaterThanOrEqual(4)
  })
})

describe('state independence', () => {
  const custom: CircuitInput = { supplyVoltageV: 4.5, resistanceOhm: 22, switchClosed: true }
  const start: ExperimentState = {
    circuit: custom,
    drafts: createOhmDrafts(custom),
    selectedQuestionId: 'q3',
  }
  it('selecting any question never changes the circuit', () => {
    for (const x of ELECTRICITY_PRACTICE_QUESTIONS) {
      const s2 = selectPracticeQuestion(start, x.id)
      expect(s2.selectedQuestionId).toBe(x.id)
      expect(s2.circuit).toEqual(custom)
      expect(s2.drafts).toEqual(start.drafts)
    }
  })
  it('only an explicit load applies the question inputs, including the switch', () => {
    const q2 = ELECTRICITY_PRACTICE_QUESTIONS.find((x) => x.id === 'q2')!
    const loaded = loadSetupOnExperiment(start, q2.setup!)
    expect(loaded.circuit).toEqual({ supplyVoltageV: 12, resistanceOhm: 10, switchClosed: false })
    expect(loaded.drafts.supplyVoltageV).toBe('12')
  })
})

describe('prediction feedback uses the tested setup', () => {
  const [pv, pr] = PREDICTIONS
  const baseV = { predictionId: pv.id, setup: pv.startSetup, currentA: calculateCircuit(pv.startSetup).currentA }
  it('waits until the student has really doubled the voltage', () => {
    expect(evaluatePredictionTest(pv, null, pv.startSetup, 1).status).toBe('not_started')
    expect(evaluatePredictionTest(pv, baseV, pv.startSetup, 1).status).toBe('waiting')
    expect(evaluatePredictionTest(pv, baseV, { ...pv.startSetup, supplyVoltageV: 6, resistanceOhm: 7 }, 1).status).toBe('waiting')
    expect(evaluatePredictionTest(pv, baseV, { ...pv.startSetup, supplyVoltageV: 6, switchClosed: false }, 1).status).toBe('waiting')
  })
  it('reports the real ratio when voltage is doubled', () => {
    const out = evaluatePredictionTest(pv, baseV, { ...pv.startSetup, supplyVoltageV: 6 }, 1)
    expect(out.status).toBe('tested')
    expect(out.ratio).toBeCloseTo(2, 10)
    expect(out.matchesChoice).toBe(true)
    expect(evaluatePredictionTest(pv, baseV, { ...pv.startSetup, supplyVoltageV: 6 }, 0).matchesChoice).toBe(false)
  })
  it('reports the real ratio when resistance is doubled', () => {
    const base = { predictionId: pr.id, setup: pr.startSetup, currentA: calculateCircuit(pr.startSetup).currentA }
    const out = evaluatePredictionTest(pr, base, { ...pr.startSetup, resistanceOhm: 12 }, 1)
    expect(out.ratio).toBeCloseTo(0.5, 10)
    expect(out.matchesChoice).toBe(true)
  })
})

describe('measurement datasets', () => {
  it('collects same-resistance points and never mixes resistances', () => {
    let ds = createDataset(6)
    const add = (v: number, r: number, closed = true) => {
      const out = addMeasurementPoint(ds, calculateCircuit({ supplyVoltageV: v, resistanceOhm: r, switchClosed: closed }))
      ds = out.dataset
      return out.status
    }
    expect(add(3, 6)).toBe('added')
    expect(add(6, 6)).toBe('added')
    expect(add(6, 6)).toBe('duplicate')
    expect(add(6, 12)).toBe('resistance_mismatch')
    expect(add(9, 6, false)).toBe('switch_open')
    expect(ds.points).toHaveLength(2)
    expect(ds.points.every((p) => Math.abs(p.voltageV / p.currentA - 6) < 1e-9)).toBe(true)
  })
})
