import { describe, expect, it } from 'vitest'
import {
  calculateApplianceEnergyKWh,
  calculateEnergyCost,
  convertKWhToJoules,
} from './billingModel'
import {
  applyApplianceHoursEdit,
  applyBillingDaysEdit,
  applyTariffRateEdit,
  createBillingDrafts,
  formatBillingRupees,
  formatBillingUnits,
} from './billingInputValidation'
import {
  BILLING_DISCOVERIES,
  BILLING_MISCONCEPTIONS,
  BILLING_PRACTICE_QUESTIONS,
  BILLING_PREDICTIONS,
  BILLING_WORKED_EXAMPLES,
  createInitialBillingState,
  EMPTY_BILLING_ANSWER,
  evaluateBillingPracticeAnswer,
  loadBillingSetup,
  type BillingExperimentState,
  type BillingPracticeAnswer,
} from './billingContent'

describe('billingContent — Guided Discoveries & Concept Validity', () => {
  it('has 3 guided discoveries matching core pedagogical themes', () => {
    expect(BILLING_DISCOVERIES).toHaveLength(3)

    // Discovery 1: Geyser vs Refrigerator
    const disc1 = BILLING_DISCOVERIES[0]
    expect(disc1.id).toBe('disc-duration-vs-power')
    const geyserKWh = calculateApplianceEnergyKWh(2000, 1, 30, 1)
    const fridgeKWh = calculateApplianceEnergyKWh(200, 24, 30, 1)
    expect(geyserKWh).toBe(60.0)
    expect(fridgeKWh).toBe(144.0)
    expect(fridgeKWh / geyserKWh).toBe(2.4)

    // Discovery 2: Tariff scaling
    const disc2 = BILLING_DISCOVERIES[1]
    expect(disc2.id).toBe('disc-tariff-scaling')
    const cost5 = calculateEnergyCost(200, 5.0)
    const cost10 = calculateEnergyCost(200, 10.0)
    expect(cost10 / cost5).toBe(2.0)

    // Discovery 3: Joules conversion
    const disc3 = BILLING_DISCOVERIES[2]
    expect(disc3.id).toBe('disc-joules-conversion')
    const ironKWh = calculateApplianceEnergyKWh(1000, 1, 30, 1)
    expect(ironKWh).toBe(30.0)
    expect(convertKWhToJoules(ironKWh)).toBe(1.08e8) // 108 million Joules
  })

  it('contains the 3 targeted misconceptions resolving units and billing myths', () => {
    expect(BILLING_MISCONCEPTIONS).toHaveLength(3)
    const [m1, m2, m3] = BILLING_MISCONCEPTIONS
    expect(m1.title).toContain('charges us for electric current or power')
    expect(m1.correctPhysics).toContain('E = P × t')
    expect(m2.title).toContain('high-power appliance always costs more')
    expect(m3.title).toContain('1 Unit = 1 Watt')
  })

  it('has 3 pre-lesson predictions with realistic pedagogical options', () => {
    expect(BILLING_PREDICTIONS).toHaveLength(3)
    BILLING_PREDICTIONS.forEach((pred) => {
      expect(pred.heading).toBeTruthy()
      expect(pred.prompt).toBeTruthy()
      expect(pred.options).toHaveLength(3)
      expect(pred.correctOptionIndex).toBe(0)
    })
  })

  it('has 2 fully-worked examples including NCERT Example 12.12', () => {
    expect(BILLING_WORKED_EXAMPLES).toHaveLength(2)

    // Example 1: NCERT 12.12
    const ex1 = BILLING_WORKED_EXAMPLES[0]
    expect(ex1.id).toBe('we-ncert-refrigerator-12-12')
    expect(ex1.steps[0].result).toContain('96 kWh')
    expect(ex1.steps[2].result).toBe('₹ 288.00')

    // Example 2: Multi-appliance
    const ex2 = BILLING_WORKED_EXAMPLES[1]
    expect(ex2.steps[3].result).toContain('4.73 kWh/day')
    expect(ex2.steps[4].result).toContain('141.9 kWh')
    expect(ex2.steps[5].result).toBe('₹ 922.35')
  })
})

describe('billingContent — Practice Ladder & Evaluation', () => {
  it('has 6 graded practice questions spanning Foundation to Challenge', () => {
    expect(BILLING_PRACTICE_QUESTIONS).toHaveLength(6)

    BILLING_PRACTICE_QUESTIONS.forEach((q) => {
      expect(q.prompt).toBeTruthy()
      expect(q.options.length).toBeGreaterThanOrEqual(3)
      expect(q.correctIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctIndex).toBeLessThan(q.options.length)
      expect(q.hint).toBeTruthy()
      expect(q.trapExplanation).toBeTruthy()
      expect(q.solutionSteps.length).toBeGreaterThan(0)
    })
  })

  it('evaluates answers correctly with hints and traps', () => {
    const q1 = BILLING_PRACTICE_QUESTIONS[0]

    // Unanswered
    const unans = evaluateBillingPracticeAnswer(q1, EMPTY_BILLING_ANSWER)
    expect(unans.status).toBe('unanswered')

    // Correct
    const correctAns: BillingPracticeAnswer = {
      selectedOption: q1.correctIndex,
      checked: true,
      showHint: false,
      showTrap: false,
      showSolution: false,
    }
    const evalCorrect = evaluateBillingPracticeAnswer(q1, correctAns)
    expect(evalCorrect.status).toBe('correct')
    expect(evalCorrect.feedback).toContain('Correct!')

    // Incorrect
    const wrongAns: BillingPracticeAnswer = {
      selectedOption: (q1.correctIndex + 1) % q1.options.length,
      checked: true,
      showHint: false,
      showTrap: false,
      showSolution: false,
    }
    const evalWrong = evaluateBillingPracticeAnswer(q1, wrongAns)
    expect(evalWrong.status).toBe('incorrect')
    expect(evalWrong.feedback).toContain('Not quite.')
  })

  it('loads setups onto state cleanly without losing selected question', () => {
    const initialState: BillingExperimentState = {
      ...createInitialBillingState(),
      selectedQuestionId: 'bill-q4',
    }

    const updated = loadBillingSetup(initialState, {
      setupAppliances: [{ id: 'geyser', hoursPerDay: 3, enabled: true }],
      billingDays: 60,
      tariffRate: 8.0,
    })

    expect(updated.household.billingDays).toBe(60)
    expect(updated.household.tariffRateRupeesPerKWh).toBe(8.0)
    const geyser = updated.household.appliances.find((a) => a.id === 'geyser')!
    expect(geyser.hoursPerDay).toBe(3)
    expect(geyser.enabled).toBe(true)
    expect(updated.selectedQuestionId).toBe('bill-q4') // Preserved
  })
})

describe('billingInputValidation — Drafts & Formatting', () => {
  it('formats numbers cleanly for Indian Rupee currency and kWh units', () => {
    expect(formatBillingRupees(288)).toBe('288.00')
    expect(formatBillingRupees(1500.5)).toBe('1,500.50')
    expect(formatBillingUnits(144)).toBe('144')
    expect(formatBillingUnits(2500, 1)).toBe('2,500')
  })

  it('validates days, tariff, and appliance hours edits', () => {
    const state = createInitialBillingState()
    const drafts = createBillingDrafts(state.household)

    // Valid days edit
    const resDays = applyBillingDaysEdit(state.household, drafts, '45')
    expect(resDays.error).toBeUndefined()
    expect(resDays.input.billingDays).toBe(45)

    // Out of range days
    const resDaysBad = applyBillingDaysEdit(state.household, drafts, '120')
    expect(resDaysBad.error).toBeDefined()
    expect(resDaysBad.input.billingDays).toBe(30) // Unchanged

    // Valid tariff edit
    const resTariff = applyTariffRateEdit(state.household, drafts, '7.5')
    expect(resTariff.error).toBeUndefined()
    expect(resTariff.input.tariffRateRupeesPerKWh).toBe(7.5)

    // Valid appliance hours edit
    const resHours = applyApplianceHoursEdit(state.household, drafts, 'geyser', '2.5')
    expect(resHours.error).toBeUndefined()
    const geyser = resHours.input.appliances.find((a) => a.id === 'geyser')!
    expect(geyser.hoursPerDay).toBe(2.5)
  })
})
